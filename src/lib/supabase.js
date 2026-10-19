import { createClient } from "@supabase/supabase-js";
import {
  getStoredBookings,
  saveStoredBookings,
  getStoredProperties,
  saveStoredProperties,
  updateStoredProperty,
  getStoredSiteSettings,
  saveStoredSiteSettings,
  sanitizeAmenities,
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
    const timeoutId = setTimeout(() => controller.abort(), 2500);
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

// ─── Contador de Visitas Persistente en Supabase ────────────────────────────
export async function registerSiteVisit() {
  if (typeof window === "undefined") return 1042;
  const STORAGE_KEY_VISIT = "toninas_session_visited_v1";
  try {
    const hasVisited = sessionStorage.getItem(STORAGE_KEY_VISIT);
    const { data: row } = await supabase
      .from("properties")
      .select("capacity")
      .eq("id", "site-visits")
      .maybeSingle();

    let current = Number(row?.capacity || 1042);

    if (!hasVisited) {
      sessionStorage.setItem(STORAGE_KEY_VISIT, "1");
      current += 1;
      await supabase.from("properties").upsert({
        id: "site-visits",
        name: "Contador de Visitas",
        type: "analytics",
        description: JSON.stringify({ visits: current }),
        capacity: current,
        price_per_night: 0,
        is_active: false,
        updated_at: new Date().toISOString(),
      });
    }
    return current;
  } catch (err) {
    return 1042;
  }
}

// ─── Properties con persistencia local garantizada y sync ──────────────────
export async function getProperties() {
  const localProps = getStoredProperties();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .order("id")
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

      const unitRows = data.filter(
        (r) =>
          r.id !== "site-settings" &&
          r.type !== "config" &&
          r.id !== "site-visits" &&
          r.type !== "analytics"
      );
      // Cruzar con seasonalRates locales y sincronizar comodidades (amenities) e imágenes desde Supabase
      const merged = localProps
        .filter(
          (lp) =>
            lp.id !== "site-settings" &&
            lp.type !== "config" &&
            lp.id !== "site-visits" &&
            lp.type !== "analytics"
        )
        .map((lp) => {
          const remote = unitRows.find((r) => r.id === lp.id);
          if (!remote) return lp;
          const unitType = remote.type || lp.type || "duplex";
          const remoteAmenities =
            Array.isArray(remote.amenities) && remote.amenities.length > 0
              ? sanitizeAmenities(remote.amenities, unitType)
              : sanitizeAmenities(lp.amenities || [], unitType);
          const hasValidRemoteImages =
            Array.isArray(remote.images) &&
            remote.images.length > 0 &&
            remote.images.every((img) => typeof img === "string" && !img.includes("unsplash.com"));
          return {
            ...lp,
            name: remote.name || lp.name,
            type: unitType,
            pricePerNight: Number(remote.price_per_night || lp.pricePerNight || 80000),
            price_per_night: Number(remote.price_per_night || lp.price_per_night || 80000),
            description: remote.description || lp.description,
            capacity: Number(remote.capacity || lp.capacity || 6),
            amenities: remoteAmenities,
            images: hasValidRemoteImages ? remote.images : lp.images,
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
  const sanitizedUpdates = { ...updates };
  if (sanitizedUpdates.amenities !== undefined) {
    sanitizedUpdates.amenities = sanitizeAmenities(
      sanitizedUpdates.amenities,
      sanitizedUpdates.type || (propertyId === "depto-1" ? "departamento" : "duplex")
    );
  }
  const updated = updateStoredProperty(propertyId, sanitizedUpdates);

  // 2. Sincronizar en la nube con Supabase (incluyendo amenities e images)
  try {
    const payload = {};
    if (sanitizedUpdates.name !== undefined) payload.name = sanitizedUpdates.name;
    if (sanitizedUpdates.price_per_night !== undefined || sanitizedUpdates.pricePerNight !== undefined) {
      payload.price_per_night = Number(sanitizedUpdates.price_per_night || sanitizedUpdates.pricePerNight);
    }
    if (sanitizedUpdates.capacity !== undefined) payload.capacity = Number(sanitizedUpdates.capacity);
    if (sanitizedUpdates.description !== undefined) payload.description = sanitizedUpdates.description;
    if (sanitizedUpdates.amenities !== undefined) payload.amenities = sanitizedUpdates.amenities;
    if (sanitizedUpdates.images !== undefined) payload.images = sanitizedUpdates.images;
    payload.updated_at = new Date().toISOString();

    await supabase.from("properties").update(payload).eq("id", propertyId);
  } catch (err) {
    console.warn("Supabase updateProperty warning:", err);
  }

  return updated;
}

export async function updateAllDuplexes(sharedUpdates) {
  const allProps = getStoredProperties();
  const cleanAmenities =
    sharedUpdates.amenities !== undefined
      ? sanitizeAmenities(sharedUpdates.amenities, "duplex")
      : undefined;

  const updatedList = allProps.map((p) => {
    if (p.type === "duplex") {
      return {
        ...p,
        ...(sharedUpdates.price_per_night !== undefined
          ? {
              price_per_night: Number(sharedUpdates.price_per_night),
              pricePerNight: Number(sharedUpdates.price_per_night),
            }
          : {}),
        ...(sharedUpdates.seasonalRates !== undefined
          ? { seasonalRates: sharedUpdates.seasonalRates }
          : {}),
        ...(cleanAmenities !== undefined ? { amenities: cleanAmenities } : {}),
      };
    }
    return p;
  });
  saveStoredProperties(updatedList);

  try {
    const payload = {
      updated_at: new Date().toISOString(),
    };
    if (sharedUpdates.price_per_night !== undefined) {
      payload.price_per_night = Number(sharedUpdates.price_per_night);
    }
    if (cleanAmenities !== undefined) {
      payload.amenities = cleanAmenities;
    }
    await supabase.from("properties").update(payload).eq("type", "duplex");
  } catch (err) {
    console.warn("Supabase updateAllDuplexes warning:", err);
  }

  return updatedList;
}

export async function updatePropertyPrice(propertyId, pricePerNight) {
  return updateProperty(propertyId, { price_per_night: pricePerNight });
}


// ─── Bookings con almacenamiento resiliente (Supabase + LocalStorage) ───────
export async function getBookings(filters = {}) {
  // 1. Intentamos leer de Supabase si responde
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

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

    if (!error && Array.isArray(data)) {
      // Normalizamos y guardamos copia local (incluso cuando está vacío)
      const normalized = data.map((b) => {
        const rawSource = String(b.source || "web");
        const [cleanSource, encodedMethod] = rawSource.includes("|")
          ? rawSource.split("|")
          : [rawSource, null];
        return {
          id: b.id,
          propertyId: b.property_id || b.propertyId,
          property: b.property || null,
          guestName: b.guest_name || b.guestName,
          guestPhone: b.guest_phone || b.guestPhone,
          guestResidence: b.guest_residence || b.guestResidence || b.guest_email || "Buenos Aires",
          checkIn: b.check_in || b.checkIn,
          checkOut: b.check_out || b.checkOut,
          guests: Number(b.guests || 1),
          totalAmount: Number(b.total_amount || b.totalAmount || 0),
          depositPaid: Number(b.deposit_paid || b.depositPaid || 0),
          status: b.status || "confirmed",
          paymentMethod: encodedMethod || b.payment_method || b.paymentMethod || "Transferencia",
          source: cleanSource || "web",
          notes: b.guest_notes || b.notes || "",
          createdAt: b.created_at || new Date().toISOString(),
        };
      });
      if (!filters.status && !filters.propertyId && !filters.fromDate && !filters.toDate) {
        saveStoredBookings(normalized);
      }
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

  // Sincronizamos con Supabase en la nube (codificando medio de pago en source por esquema de tabla)
  try {
    const { error } = await supabase.from("bookings").insert([{
      id: normalized.id,
      property_id: normalized.propertyId,
      guest_name: normalized.guestName,
      guest_phone: normalized.guestPhone,
      guest_email: normalized.guestResidence,
      check_in: normalized.checkIn,
      check_out: normalized.checkOut,
      guests: normalized.guests,
      total_amount: normalized.totalAmount,
      deposit_paid: normalized.depositPaid,
      status: normalized.status,
      guest_notes: normalized.notes,
      source: `${normalized.source}|${normalized.paymentMethod}`,
    }]);
    if (error) {
      console.warn("Supabase insert warning:", error.message);
    }
  } catch (e) {
    console.warn("Supabase insert warning:", e);
  }

  return normalized;
}

export async function updateBooking(bookingId, updatedData) {
  const current = getStoredBookings();
  const existing = current.find((b) => b.id === bookingId) || {};

  const totalVal = parseFloat(
    updatedData.totalAmount ?? updatedData.total_amount ?? existing.totalAmount ?? existing.total_amount ?? 0
  );
  const depositVal = parseFloat(
    updatedData.depositPaid ?? updatedData.deposit_paid ?? existing.depositPaid ?? existing.deposit_paid ?? 0
  );

  const merged = {
    ...existing,
    ...updatedData,
    id: bookingId,
    totalAmount: totalVal,
    total_amount: totalVal,
    depositPaid: depositVal,
    deposit_paid: depositVal,
    updatedAt: new Date().toISOString(),
  };

  const updated = current.map((b) => (b.id === bookingId ? merged : b));
  saveStoredBookings(updated);

  try {
    const supabasePayload = {
      property_id: merged.propertyId || merged.property_id,
      guest_name: merged.guestName || merged.guest_name,
      guest_phone: merged.guestPhone || merged.guest_phone,
      guest_email: merged.guestResidence || merged.guest_residence || merged.guest_email || "No especificado",
      check_in: merged.checkIn || merged.check_in,
      check_out: merged.checkOut || merged.check_out,
      guests: parseInt(merged.guests || 2, 10),
      total_amount: totalVal,
      deposit_paid: depositVal,
      status: merged.status || "confirmed",
      guest_notes: merged.notes || merged.guest_notes || "",
      source: `${(merged.source || "admin").split("|")[0]}|${merged.paymentMethod || merged.payment_method || "Transferencia"}`,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from("bookings").update(supabasePayload).eq("id", bookingId);
    if (error) {
      console.error("Error actualizando reserva en Supabase:", error);
    }
  } catch (err) {
    console.warn("Error actualizando reserva en Supabase:", err);
  }

  return merged;
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
