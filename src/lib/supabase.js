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
  getStoredExpenses,
  saveStoredExpenses,
  getCleanNotes,
  packNotesWithPayments,
  normalizeBookingPayments,
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
          r.type !== "analytics" &&
          r.type !== "expense"
      );
      // Cruzar con seasonalRates locales y sincronizar comodidades (amenities) e imágenes desde Supabase
      const merged = localProps
        .filter(
          (lp) =>
            lp.id !== "site-settings" &&
            lp.type !== "config" &&
            lp.id !== "site-visits" &&
            lp.type !== "analytics" &&
            lp.type !== "expense"
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
        const rawNotes = b.guest_notes || b.notes || "";
        const payments = normalizeBookingPayments({ ...b, notes: rawNotes });
        const cleanNotes = getCleanNotes(rawNotes);
        const totalPaid = payments.length > 0
          ? payments.reduce((acc, p) => acc + (parseFloat(p.amount) || 0), 0)
          : Number(b.deposit_paid || b.depositPaid || 0);

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
          depositPaid: totalPaid,
          status: b.status || "confirmed",
          paymentMethod: encodedMethod || b.payment_method || b.paymentMethod || "Transferencia",
          source: cleanSource || "web",
          notes: cleanNotes,
          payments,
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
  let local = getStoredBookings().map((b) => {
    const rawNotes = b.notes || b.guest_notes || "";
    const payments = normalizeBookingPayments(b);
    const cleanNotes = getCleanNotes(rawNotes);
    const totalPaid = payments.length > 0
      ? payments.reduce((acc, p) => acc + (parseFloat(p.amount) || 0), 0)
      : Number(b.depositPaid || b.deposit_paid || 0);
    return {
      ...b,
      notes: cleanNotes,
      payments,
      depositPaid: totalPaid,
    };
  });
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

  const rawNotes = bookingData.guest_notes || bookingData.notes || "";
  const cleanNotes = getCleanNotes(rawNotes);
  const initialDeposit = parseFloat(bookingData.deposit_paid || bookingData.depositPaid || 0);
  const payments = Array.isArray(bookingData.payments) && bookingData.payments.length > 0
    ? bookingData.payments
    : initialDeposit > 0
    ? [
        {
          id: `pay-${Date.now()}-init`,
          amount: initialDeposit,
          date: (bookingData.check_in || bookingData.checkIn || new Date().toISOString()).split("T")[0],
          method: bookingData.payment_method || bookingData.paymentMethod || "Transferencia",
          notes: "Seña inicial registrada",
        },
      ]
    : [];

  const totalDeposit = payments.length > 0
    ? payments.reduce((acc, p) => acc + (parseFloat(p.amount) || 0), 0)
    : initialDeposit;

  const packedNotes = packNotesWithPayments(cleanNotes, payments);

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
    depositPaid: totalDeposit,
    status: bookingData.status || "pending",
    paymentMethod: bookingData.payment_method || bookingData.paymentMethod || "Transferencia",
    notes: cleanNotes,
    payments,
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
      guest_notes: packedNotes,
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

  const existingPayments = normalizeBookingPayments(existing);
  const newPayments = Array.isArray(updatedData.payments)
    ? updatedData.payments
    : existingPayments;

  const totalVal = parseFloat(
    updatedData.totalAmount ?? updatedData.total_amount ?? existing.totalAmount ?? existing.total_amount ?? 0
  );
  const depositVal = newPayments.length > 0
    ? newPayments.reduce((acc, p) => acc + (parseFloat(p.amount) || 0), 0)
    : parseFloat(
        updatedData.depositPaid ?? updatedData.deposit_paid ?? existing.depositPaid ?? existing.deposit_paid ?? 0
      );

  const rawNotes = updatedData.notes ?? updatedData.guest_notes ?? existing.notes ?? "";
  const cleanNotes = getCleanNotes(rawNotes);
  const packedNotes = packNotesWithPayments(cleanNotes, newPayments);

  const merged = {
    ...existing,
    ...updatedData,
    id: bookingId,
    totalAmount: totalVal,
    total_amount: totalVal,
    depositPaid: depositVal,
    deposit_paid: depositVal,
    notes: cleanNotes,
    payments: newPayments,
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
      guest_notes: packedNotes,
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
  const method = paymentData.method || "Transferencia";
  const notes = paymentData.notes || "Cobro de saldo";
  const date = paymentData.date || new Date().toISOString().split("T")[0];

  const current = getStoredBookings();
  let updatedBooking = null;

  const updated = current.map((b) => {
    if (b.id === bookingId) {
      const existingPayments = normalizeBookingPayments(b);
      const newPayment = {
        id: `pay-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        amount,
        date,
        method: method === "cash" ? "Efectivo" : method === "transfer" ? "Transferencia" : method === "mercadopago" ? "MercadoPago" : method,
        notes,
      };
      const updatedPayments = [...existingPayments, newPayment];
      const newPaid = updatedPayments.reduce((s, p) => s + (parseFloat(p.amount) || 0), 0);
      const cleanNotes = getCleanNotes(b.notes || b.guest_notes || "");
      const packedNotes = packNotesWithPayments(cleanNotes, updatedPayments);

      updatedBooking = {
        ...b,
        depositPaid: newPaid,
        deposit_paid: newPaid,
        payments: updatedPayments,
        notes: cleanNotes,
        guest_notes: packedNotes,
      };
      return updatedBooking;
    }
    return b;
  });
  saveStoredBookings(updated);

  try {
    await supabase.from("payments").insert([paymentData]);
  } catch {}

  try {
    if (updatedBooking) {
      await supabase
        .from("bookings")
        .update({
          deposit_paid: updatedBooking.depositPaid,
          guest_notes: updatedBooking.guest_notes,
          updated_at: new Date().toISOString(),
        })
        .eq("id", bookingId);
    }
  } catch {}

  return { success: true, booking: updatedBooking };
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

// ─── Gestión de Gastos Operativos (Cuidador & Admin) ────────────────────────
export async function getExpenses() {
  const local = getStoredExpenses();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("type", "expense")
      .order("created_at", { ascending: false })
      .abortSignal(controller.signal);
    clearTimeout(timeoutId);

    if (!error && Array.isArray(data)) {
      const parsed = data.map((row) => {
        let meta = {};
        try {
          meta = JSON.parse(row.description || "{}");
        } catch {}
        return {
          id: row.id,
          concept: row.name,
          amount: Number(row.price_per_night || meta.amount || 0),
          category: meta.category || "mantenimiento",
          date: meta.date || row.created_at?.split("T")[0] || new Date().toISOString().split("T")[0],
          notes: meta.notes || "",
          registeredBy: meta.registeredBy || "cuidador",
          createdAt: row.created_at,
        };
      });
      saveStoredExpenses(parsed);
      return parsed;
    }
  } catch (err) {
    console.warn("Error fetching expenses:", err);
  }
  return local;
}

export async function createExpense(expenseData) {
  const id = `exp-${Date.now()}`;
  const amount = Number(expenseData.amount) || 0;
  const newExpense = {
    id,
    concept: expenseData.concept?.trim() || "Gasto operativo",
    amount,
    category: expenseData.category || "mantenimiento",
    date: expenseData.date || new Date().toISOString().split("T")[0],
    notes: expenseData.notes?.trim() || "",
    registeredBy: expenseData.registeredBy || "cuidador",
    createdAt: new Date().toISOString(),
  };

  const current = getStoredExpenses();
  const updated = [newExpense, ...current];
  saveStoredExpenses(updated);

  try {
    await supabase.from("properties").insert({
      id,
      name: newExpense.concept,
      type: "expense",
      description: JSON.stringify({
        category: newExpense.category,
        amount: newExpense.amount,
        date: newExpense.date,
        notes: newExpense.notes,
        registeredBy: newExpense.registeredBy,
      }),
      capacity: 1,
      price_per_night: amount,
      is_active: true,
      created_at: newExpense.createdAt,
      updated_at: newExpense.createdAt,
    });
  } catch (err) {
    console.warn("Error creating expense in Supabase:", err);
  }

  return newExpense;
}

export async function deleteExpense(expenseId) {
  const current = getStoredExpenses();
  const updated = current.filter((e) => e.id !== expenseId);
  saveStoredExpenses(updated);

  try {
    await supabase.from("properties").delete().eq("id", expenseId);
  } catch (err) {
    console.warn("Error deleting expense in Supabase:", err);
  }

  return updated;
}
