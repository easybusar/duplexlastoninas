import { createClient } from "@supabase/supabase-js";
import {
  getStoredBookings,
  saveStoredBookings,
  getStoredProperties,
  saveStoredProperties,
  updateStoredProperty,
  getStoredSiteSettings,
  saveStoredSiteSettings,
} from "./data";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder"
);

// ─── Auth helpers ──────────────────────────────────────────────────────────
export async function signIn(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  } catch (err) {
    throw err;
  }
}

export async function signOut() {
  try {
    await supabase.auth.signOut();
  } catch {}
}

export async function getSession() {
  try {
    const { data } = await supabase.auth.getSession();
    return data?.session || null;
  } catch {
    return null;
  }
}

// ─── Site Settings (Teléfono WhatsApp, Alias, Google Ads) ──────────────────
export async function getSiteSettings() {
  const localSettings = getStoredSiteSettings();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("id", "site-settings")
      .single()
      .abortSignal(controller.signal);
    clearTimeout(timeoutId);

    if (!error && data && data.description) {
      const parsed = JSON.parse(data.description);
      return saveStoredSiteSettings(parsed);
    }
  } catch {}
  return localSettings;
}

export async function updateSiteSettings(newSettings) {
  const savedLocal = saveStoredSiteSettings(newSettings);
  try {
    await supabase.from("properties").upsert({
      id: "site-settings",
      name: "Configuración General",
      type: "config",
      description: JSON.stringify(savedLocal),
      capacity: 1,
      price_per_night: 0,
      is_active: false,
      updated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.warn("Supabase site-settings warning:", err);
  }
  return savedLocal;
}

// ─── Properties con persistencia local garantizada y sync ──────────────────
export async function getProperties() {
  const localProps = getStoredProperties();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .order("name")
      .abortSignal(controller.signal);
    clearTimeout(timeoutId);

    if (!error && Array.isArray(data) && data.length > 0) {
      // Sincronizar configuración general si viene en la consulta
      const configRow = data.find((r) => r.id === "site-settings" || r.type === "config");
      if (configRow && configRow.description) {
        try {
          saveStoredSiteSettings(JSON.parse(configRow.description));
        } catch {}
      }

      const unitRows = data.filter((r) => r.id !== "site-settings" && r.type !== "config");
      // Cruzar con seasonalRates locales
      const merged = localProps
        .filter((lp) => lp.id !== "site-settings" && lp.type !== "config")
        .map((lp) => {
          const remote = unitRows.find((r) => r.id === lp.id);
          if (!remote) return lp;
          return {
            ...lp,
            name: remote.name || lp.name,
            pricePerNight: remote.price_per_night || lp.pricePerNight,
            price_per_night: remote.price_per_night || lp.price_per_night,
            description: remote.description || lp.description,
            capacity: remote.capacity || lp.capacity,
          };
        });
      saveStoredProperties(merged);
      return merged;
    }
  } catch {}
  return localProps.filter((lp) => lp.id !== "site-settings" && lp.type !== "config");
}

export async function updateProperty(propertyId, updates) {
  // 1. Guardar localmente de inmediato (persistencia garantizada)
  const updated = updateStoredProperty(propertyId, updates);

  // 2. Intentar en segundo plano con Supabase
  try {
    const payload = {};
    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.price_per_night !== undefined || updates.pricePerNight !== undefined) {
      payload.price_per_night = updates.price_per_night || updates.pricePerNight;
    }
    if (updates.capacity !== undefined) payload.capacity = updates.capacity;
    if (updates.description !== undefined) payload.description = updates.description;
    payload.updated_at = new Date().toISOString();

    await supabase.from("properties").update(payload).eq("id", propertyId);
  } catch {}

  return updated;
}

export async function updatePropertyPrice(propertyId, pricePerNight) {
  return updateProperty(propertyId, { price_per_night: pricePerNight });
}


// ─── Bookings con almacenamiento resiliente (Supabase + LocalStorage) ───────
export async function getBookings(filters = {}) {
  // 1. Intentamos leer de Supabase si responde
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    let query = supabase
      .from("bookings")
      .select(`
        *,
        property:properties(id, name, type)
      `)
      .order("check_in", { ascending: true })
      .abortSignal(controller.signal);

    if (filters.status) query = query.eq("status", filters.status);
    if (filters.propertyId) query = query.eq("property_id", filters.propertyId);
    if (filters.fromDate) query = query.gte("check_in", filters.fromDate);
    if (filters.toDate) query = query.lte("check_in", filters.toDate);

    const { data, error } = await query;
    clearTimeout(timeoutId);

    if (!error && Array.isArray(data) && data.length > 0) {
      // Normalizamos y guardamos copia local
      const normalized = data.map((b) => ({
        id: b.id,
        propertyId: b.property_id || b.propertyId,
        guestName: b.guest_name || b.guestName,
        guestPhone: b.guest_phone || b.guestPhone,
        guestResidence: b.guest_residence || b.guestResidence || b.guest_email || "Las Toninas",
        checkIn: b.check_in || b.checkIn,
        checkOut: b.check_out || b.checkOut,
        guests: b.guests || 1,
        totalAmount: b.total_amount || b.totalAmount || 0,
        depositPaid: b.deposit_paid || b.depositPaid || 0,
        status: b.status || "confirmed",
        paymentMethod: b.payment_method || b.paymentMethod || "Transferencia",
        notes: b.guest_notes || b.notes || "",
        createdAt: b.created_at || new Date().toISOString(),
      }));
      saveStoredBookings(normalized);
      return normalized;
    }
  } catch {
    // Si Supabase está offline o no configurado, pasamos a almacenamiento local
  }

  // 2. Almacenamiento local persistente
  let local = getStoredBookings();
  if (filters.status) {
    local = local.filter((b) => b.status === filters.status);
  }
  if (filters.propertyId) {
    local = local.filter((b) => (b.propertyId || b.property_id) === filters.propertyId);
  }
  if (filters.fromDate) {
    local = local.filter((b) => (b.checkIn || b.check_in) >= filters.fromDate);
  }
  if (filters.toDate) {
    local = local.filter((b) => (b.checkIn || b.check_in) <= filters.toDate);
  }
  return local;
}

export async function createBooking(bookingData) {
  let newId = bookingData.id;
  if (!newId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(newId)) {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      newId = crypto.randomUUID();
    } else {
      newId = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    }
  }

  const normalized = {
    id: newId,
    propertyId: bookingData.property_id || bookingData.propertyId,
    guestName: bookingData.guest_name || bookingData.guestName,
    guestPhone: bookingData.guest_phone || bookingData.guestPhone,
    guestResidence:
      bookingData.guest_residence ||
      bookingData.guestResidence ||
      bookingData.residence ||
      "Buenos Aires",
    checkIn: bookingData.check_in || bookingData.checkIn,
    checkOut: bookingData.check_out || bookingData.checkOut,
    guests: parseInt(bookingData.guests || 2, 10),
    totalAmount: parseFloat(bookingData.total_amount || bookingData.totalAmount || 0),
    depositPaid: parseFloat(bookingData.deposit_paid || bookingData.depositPaid || 0),
    status: bookingData.status || "pending",
    paymentMethod: bookingData.payment_method || bookingData.paymentMethod || "Transferencia",
    notes: bookingData.guest_notes || bookingData.notes || "",
    source: bookingData.source || "web",
    createdAt: new Date().toISOString(),
  };

  // Guardamos en LocalStorage inmediatamente para que persista al recargar
  const current = getStoredBookings();
  const updated = [normalized, ...current.filter((b) => b.id !== newId)];
  saveStoredBookings(updated);

  // Sincronizamos con Supabase en la nube
  try {
    await supabase.from("bookings").insert([{
      id: normalized.id,
      property_id: normalized.propertyId,
      guest_name: normalized.guestName,
      guest_phone: normalized.guestPhone,
      guest_email: normalized.guestResidence, // almacena residencia
      check_in: normalized.checkIn,
      check_out: normalized.checkOut,
      guests: normalized.guests,
      total_amount: normalized.totalAmount,
      deposit_paid: normalized.depositPaid,
      status: normalized.status,
      payment_method: normalized.paymentMethod,
      guest_notes: normalized.notes,
      source: normalized.source,
    }]);
  } catch (e) {
    console.warn("Supabase insert warning:", e);
  }

  return normalized;
}

export async function updateBookingStatus(bookingId, status) {
  const current = getStoredBookings();
  const updated = current.map((b) => (b.id === bookingId ? { ...b, status } : b));
  saveStoredBookings(updated);

  try {
    await supabase
      .from("bookings")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", bookingId);
  } catch {}
}

export async function deleteBooking(bookingId) {
  // Eliminamos de LocalStorage para que NUNCA vuelva a aparecer al recargar
  const current = getStoredBookings();
  const updated = current.filter((b) => b.id !== bookingId);
  saveStoredBookings(updated);

  try {
    await supabase
      .from("bookings")
      .delete()
      .eq("id", bookingId);
  } catch {}
}

// ─── Pagos ─────────────────────────────────────────────────────────────────
export async function recordPayment(paymentData) {
  const bookingId = paymentData.booking_id || paymentData.bookingId;
  const amount = parseFloat(paymentData.amount || 0);

  const current = getStoredBookings();
  const updated = current.map((b) => {
    if (b.id === bookingId) {
      const currentPaid = b.depositPaid || b.deposit_paid || 0;
      return { ...b, depositPaid: currentPaid + amount, deposit_paid: currentPaid + amount };
    }
    return b;
  });
  saveStoredBookings(updated);

  try {
    await supabase.from("payments").insert([paymentData]);
    const { data: payments } = await supabase
      .from("payments")
      .select("amount")
      .eq("booking_id", bookingId);

    const totalPaid = payments?.reduce((s, p) => s + p.amount, 0) || amount;
    await supabase
      .from("bookings")
      .update({ deposit_paid: totalPaid })
      .eq("id", bookingId);
  } catch {}

  return { success: true };
}

export async function getPayments(bookingId) {
  try {
    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .eq("booking_id", bookingId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  } catch {
    return [];
  }
}
