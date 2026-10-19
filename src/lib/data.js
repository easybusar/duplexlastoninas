// ═══════════════════════════════════════════════════════════════════════════════
// CATÁLOGO DE UNIDADES (4 DÚPLEX Y 1 DEPARTAMENTO)
// ═══════════════════════════════════════════════════════════════════════════════

export const FORBIDDEN_AMENITY_PATTERNS = [
  /aire\s*acondicionado/i,
  /calefacci[oó]n/i,
  /cochera/i,
  /estacionamiento\s*cubierto/i,
  /estacionamiento\s*propio/i,
];

export function sanitizeAmenities(list, unitType = "duplex") {
  if (!Array.isArray(list)) return [];
  const cleaned = [];
  for (const raw of list) {
    const item = String(raw || "").trim();
    if (!item) continue;
    if (FORBIDDEN_AMENITY_PATTERNS.some((rx) => rx.test(item))) continue;
    if (/^estacionamiento$/i.test(item)) {
      if (unitType === "duplex" && !cleaned.includes("Espacio al frente")) {
        cleaned.push("Espacio al frente");
      }
      continue;
    }
    if (/^parrilla$/i.test(item) && unitType === "duplex") {
      if (!cleaned.includes("Parrilla Individual")) {
        cleaned.push("Parrilla Individual");
      }
      continue;
    }
    if (!cleaned.includes(item)) {
      cleaned.push(item);
    }
  }
  return cleaned;
}

export const properties = [
  {
    id: "duplex-1",
    name: "Dúplex 1",
    type: "duplex",
    capacity: 6,
    pricePerNight: 80000,
    price_per_night: 80000,
    seasonalRates: [
      {
        id: "rate-d1-ene",
        name: "Temporada Alta Enero",
        startDate: "2025-01-01",
        endDate: "2025-01-31",
        pricePerNight: 95000,
      },
      {
        id: "rate-d1-feb",
        name: "Temporada Alta Febrero",
        startDate: "2025-02-01",
        endDate: "2025-02-28",
        pricePerNight: 85000,
      },
    ],
    images: [
      "/fotos/FRENTE/DUPLEX1.jpg",
      "/fotos/DUPLEX/LT DUPLEX 13.jpg",
      "/fotos/DUPLEX/LT DUPLEX 14.jpg",
      "/fotos/DUPLEX/LT DUPLEX 8.jpg",
      "/fotos/DUPLEX/LT DUPLEX 4.jpg",
      "/fotos/DUPLEX/LT DUPLEX 2.jpg",
    ],
    amenities: ["WiFi", "Cocina Equipada", "Microondas", "Heladera con Freezer", "Smart TV", "Parrilla Individual", "Espacio al frente"],
    description: "Luminoso dúplex de dos plantas completamente equipado en Calle 12 Nº 495. Zona de parrilla individual, espacio para estacionar en la puerta al frente y a solo 400 metros de las playas amplias con escolleras.",
  },
  {
    id: "duplex-2",
    name: "Dúplex 2",
    type: "duplex",
    capacity: 6,
    pricePerNight: 80000,
    price_per_night: 80000,
    seasonalRates: [
      {
        id: "rate-d2-ene",
        name: "Temporada Alta Enero",
        startDate: "2025-01-01",
        endDate: "2025-01-31",
        pricePerNight: 95000,
      },
      {
        id: "rate-d2-feb",
        name: "Temporada Alta Febrero",
        startDate: "2025-02-01",
        endDate: "2025-02-28",
        pricePerNight: 85000,
      },
    ],
    images: [
      "/fotos/FRENTE/DUPLEX2.JPG",
      "/fotos/DUPLEX/LT DUPLEX 12.jpg",
      "/fotos/DUPLEX/LT DUPLEX 3.jpg",
      "/fotos/DUPLEX/LT DUPLEX 7.jpg",
      "/fotos/DUPLEX/100085073_892639904547016_3812533114496876544_n.jpg",
      "/fotos/DUPLEX/101459021_246880323393933_6864321130237263872_n.jpg",
    ],
    amenities: ["WiFi", "Cocina Equipada", "Microondas", "Heladera con Freezer", "Smart TV", "Parrilla Individual", "Espacio al frente"],
    description: "Dúplex ideal para familias a 400m de la playa. Ambientes amplios, cocina completa, patio propio con parrilla y espacio para estacionar en la puerta al frente.",
  },
  {
    id: "duplex-3",
    name: "Dúplex 3",
    type: "duplex",
    capacity: 6,
    pricePerNight: 80000,
    price_per_night: 80000,
    seasonalRates: [
      {
        id: "rate-d3-ene",
        name: "Temporada Alta Enero",
        startDate: "2025-01-01",
        endDate: "2025-01-31",
        pricePerNight: 95000,
      },
      {
        id: "rate-d3-feb",
        name: "Temporada Alta Febrero",
        startDate: "2025-02-01",
        endDate: "2025-02-28",
        pricePerNight: 85000,
      },
    ],
    images: [
      "/fotos/FRENTE/DUPLEX3.JPG",
      "/fotos/DUPLEX/LT DUPLEX 8.jpg",
      "/fotos/DUPLEX/101395951_1017869315281973_6020210364078096384_n.jpg",
      "/fotos/DUPLEX/101673128_1331273097069440_5941149795799269376_n.jpg",
      "/fotos/DUPLEX/100731088_248916043210969_6265887694614691840_n.jpg",
    ],
    amenities: ["WiFi", "Cocina Equipada", "Microondas", "Heladera con Freezer", "Smart TV", "Parrilla Individual", "Espacio al frente"],
    description: "Cómodo dúplex de dos plantas con dos dormitorios, baño completo, cocina equipada, living-comedor integrado, parrilla individual y espacio para estacionar al frente.",
  },
  {
    id: "duplex-4",
    name: "Dúplex 4",
    type: "duplex",
    capacity: 6,
    pricePerNight: 80000,
    price_per_night: 80000,
    seasonalRates: [
      {
        id: "rate-d4-ene",
        name: "Temporada Alta Enero",
        startDate: "2025-01-01",
        endDate: "2025-01-31",
        pricePerNight: 95000,
      },
      {
        id: "rate-d4-feb",
        name: "Temporada Alta Febrero",
        startDate: "2025-02-01",
        endDate: "2025-02-28",
        pricePerNight: 85000,
      },
    ],
    images: [
      "/fotos/FRENTE/DUPLEX4.jpg",
      "/fotos/DUPLEX/101181759_591098334851980_7757318008728453120_n.jpg",
      "/fotos/DUPLEX/101405420_923929474726045_4672883478419734528_n.jpg",
      "/fotos/DUPLEX/99424582_763869581020458_7135901223852441600_n.jpg",
      "/fotos/DUPLEX/99294744_3433262796693572_5767960118670917632_n.jpg",
    ],
    amenities: ["WiFi", "Cocina Equipada", "Microondas", "Heladera con Freezer", "Smart TV", "Parrilla Individual", "Espacio al frente"],
    description: "Espacioso dúplex con amplias habitaciones, living luminoso, zona de parrilla privada y espacio para estacionar en la puerta al frente. Ideal para descansar cerca del mar.",
  },
  {
    id: "depto-1",
    name: "Departamento",
    type: "departamento",
    capacity: 5,
    pricePerNight: 70000,
    price_per_night: 70000,
    seasonalRates: [
      {
        id: "rate-dep-ene",
        name: "Temporada Alta Enero",
        startDate: "2025-01-01",
        endDate: "2025-01-31",
        pricePerNight: 85000,
      },
      {
        id: "rate-dep-feb",
        name: "Temporada Alta Febrero",
        startDate: "2025-02-01",
        endDate: "2025-02-28",
        pricePerNight: 75000,
      },
    ],
    images: [
      "/fotos/FRENTE/DEPARTAMENTO.jpg",
      "/fotos/DEPARTAMENTO/LT DEPTO 1.jpg",
      "/fotos/DEPARTAMENTO/LT DEPTO 2.jpg",
      "/fotos/DEPARTAMENTO/LT DEPTO 3.jpg",
      "/fotos/DEPARTAMENTO/LT DEPTO 4.jpg",
      "/fotos/DEPARTAMENTO/LT DEPTO 12.jpg",
    ],
    amenities: ["WiFi", "Cocina Equipada", "Microondas", "Heladera con Freezer", "Smart TV"],
    description: "Departamento ubicado en primer piso con acceso por escalera en Calle 12 Nº 495. Cómodo y totalmente equipado para hasta 5 personas.",
    notes: "Acceso por escalera · Primer piso",
  },
];

// ─── Reservas iniciales (vacío para reflejar estado real de Supabase) ────────
export const mockBookings = [];

// ─── LocalStorage Persistence Layer ─────────────────────────────────────────
export const STORAGE_KEY_BOOKINGS = "toninas_bookings_persistent_v2";

export function getStoredBookings() {
  if (typeof window === "undefined") return mockBookings;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BOOKINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(mockBookings));
      return mockBookings;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : mockBookings;
  } catch (e) {
    console.warn("Error leyendo reservas locales:", e);
    return mockBookings;
  }
}

export function saveStoredBookings(bookings) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(bookings));
    window.dispatchEvent(new Event("toninas_bookings_changed"));
  } catch (e) {
    console.warn("Error guardando reservas locales:", e);
  }
}

// ─── Helpers de Formato DD-MM-AAAA ──────────────────────────────────────────
export function formatDateDDMMAAAA(dateStr) {
  if (!dateStr) return "—";
  // Si ya viene en formato DD-MM-AAAA
  if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) return dateStr;
  // Si viene en formato YYYY-MM-DD
  const match = String(dateStr).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    const [, yyyy, mm, dd] = match;
    return `${dd}-${mm}-${yyyy}`;
  }
  // Si es un Date object o parseable
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const dd = String(d.getUTCDate()).padStart(2, "0");
      const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
      const yyyy = d.getUTCFullYear();
      return `${dd}-${mm}-${yyyy}`;
    }
  } catch {}
  return String(dateStr);
}

// ─── LocalStorage Persistence Layer for Properties ─────────────────────────
export const STORAGE_KEY_PROPERTIES = "toninas_properties_persistent_v3";

export function getStoredProperties() {
  if (typeof window === "undefined") return properties;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROPERTIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_PROPERTIES, JSON.stringify(properties));
      return properties;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed
        .filter(
          (p) =>
            p.id !== "site-settings" &&
            p.type !== "config" &&
            p.id !== "site-visits" &&
            p.type !== "analytics"
        )
        .map((p) => {
        const baseFallback = properties.find((base) => base.id === p.id);
        const unitType = p.type || baseFallback?.type || "duplex";
        const rawAmenities =
          Array.isArray(p.amenities) && p.amenities.length > 0
            ? p.amenities
            : baseFallback?.amenities || [];
        return {
          ...baseFallback,
          ...p,
          amenities: sanitizeAmenities(rawAmenities, unitType),
          pricePerNight: Number(p.price_per_night || p.pricePerNight || baseFallback?.pricePerNight || 80000),
          price_per_night: Number(p.price_per_night || p.pricePerNight || baseFallback?.price_per_night || 80000),
          seasonalRates: Array.isArray(p.seasonalRates || p.seasonal_rates)
            ? (p.seasonalRates || p.seasonal_rates)
            : baseFallback?.seasonalRates || [],
        };
      });
    }
    return properties;
  } catch (e) {
    console.warn("Error leyendo propiedades locales:", e);
    return properties;
  }
}

export function saveStoredProperties(propsList) {
  if (typeof window === "undefined") return;
  try {
    const sanitized = (propsList || []).map((p) => ({
      ...p,
      amenities: sanitizeAmenities(p.amenities || [], p.type || "duplex"),
    }));
    localStorage.setItem(STORAGE_KEY_PROPERTIES, JSON.stringify(sanitized));
    window.dispatchEvent(new Event("toninas_properties_changed"));
  } catch (e) {
    console.warn("Error guardando propiedades locales:", e);
  }
}

export function updateStoredProperty(propertyId, updates) {
  const current = getStoredProperties();
  const next = current.map((p) => {
    if (p.id === propertyId) {
      const updated = { ...p, ...updates };
      if (updates.amenities !== undefined) {
        updated.amenities = sanitizeAmenities(updates.amenities, updated.type || "duplex");
      }
      if (updates.price_per_night !== undefined) {
        updated.pricePerNight = Number(updates.price_per_night);
        updated.price_per_night = Number(updates.price_per_night);
      } else if (updates.pricePerNight !== undefined) {
        updated.pricePerNight = Number(updates.pricePerNight);
        updated.price_per_night = Number(updates.pricePerNight);
      }
      if (updates.seasonalRates !== undefined) {
        updated.seasonalRates = updates.seasonalRates;
      }
      return updated;
    }
    return p;
  });
  saveStoredProperties(next);
  return next.find((p) => p.id === propertyId);
}

// ─── Helpers de Disponibilidad y Cálculos ───────────────────────────────────
export function getBookingsForProperty(propertyId) {
  const all = getStoredBookings();
  return all.filter((b) => (b.propertyId || b.property_id) === propertyId);
}

export function isDateRangeAvailable(propertyId, checkIn, checkOut, excludeBookingId = null) {
  const all = getStoredBookings();
  const bookings = all.filter((b) => {
    const pid = b.propertyId || b.property_id;
    if (pid !== propertyId) return false;
    if (excludeBookingId && b.id === excludeBookingId) return false;
    return b.status === "confirmed" || b.status === "pending" || b.status === "checked_in";
  });

  const startDate = new Date(checkIn);
  const endDate = new Date(checkOut);

  for (const booking of bookings) {
    const bStart = new Date(booking.checkIn || booking.check_in);
    const bEnd = new Date(booking.checkOut || booking.check_out);
    if (startDate < bEnd && endDate > bStart) return false;
  }
  return true;
}

/**
 * Calcula el monto de la estadía contemplando tarifas por temporada / rangos de alta demanda.
 * Acepta tanto un objeto property completo como un número de tarifa base.
 */
export function calculateStayPrice(propertyOrPrice, checkIn, checkOut, customDepositPct = null) {
  const prop = typeof propertyOrPrice === "object" && propertyOrPrice !== null ? propertyOrPrice : null;
  const basePrice = prop
    ? Number(prop.price_per_night || prop.pricePerNight || 45000)
    : Number(propertyOrPrice) || 45000;
  const seasonalRates = prop?.seasonalRates || prop?.seasonal_rates || [];

  const storedSettings = getStoredSiteSettings();
  const pct =
    customDepositPct !== null && customDepositPct !== undefined
      ? Number(customDepositPct)
      : Number(storedSettings?.depositPercentage || 50);
  const depositRatio = (pct > 0 ? pct : 50) / 100;

  if (!checkIn || !checkOut) {
    return {
      days: 1,
      total: basePrice,
      deposit: Math.round(basePrice * depositRatio),
      depositPercentage: pct,
      avgPerNight: basePrice,
      hasSeasonalRate: false,
      breakdown: [
        {
          name: "Tarifa Estándar",
          pricePerNight: basePrice,
          nights: 1,
          subtotal: basePrice,
        },
      ],
    };
  }

  const startDate = new Date(checkIn + "T12:00:00");
  const endDate = new Date(checkOut + "T12:00:00");
  const diffTime = endDate.getTime() - startDate.getTime();
  const totalNights = Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)));

  let totalAmount = 0;
  let hasSeasonalRate = false;
  const ratesMap = {};

  const cur = new Date(startDate);
  for (let i = 0; i < totalNights; i++) {
    const yyyy = cur.getFullYear();
    const mm = String(cur.getMonth() + 1).padStart(2, "0");
    const dd = String(cur.getDate()).padStart(2, "0");
    const nightStr = `${yyyy}-${mm}-${dd}`;

    // Buscar si alguna tarifa de temporada aplica a esta noche
    const matchedSeason = seasonalRates.find((s) => {
      const sStart = s.startDate || s.start_date;
      const sEnd = s.endDate || s.end_date;
      return nightStr >= sStart && nightStr <= sEnd;
    });

    if (matchedSeason) {
      hasSeasonalRate = true;
      const ratePrice = Number(matchedSeason.pricePerNight || matchedSeason.price_per_night || basePrice);
      totalAmount += ratePrice;
      const key = matchedSeason.id || matchedSeason.name || "season";
      if (!ratesMap[key]) {
        ratesMap[key] = {
          name: matchedSeason.name || "Temporada Alta",
          pricePerNight: ratePrice,
          nights: 0,
          subtotal: 0,
        };
      }
      ratesMap[key].nights += 1;
      ratesMap[key].subtotal += ratePrice;
    } else {
      totalAmount += basePrice;
      if (!ratesMap["base"]) {
        ratesMap["base"] = {
          name: "Tarifa Estándar",
          pricePerNight: basePrice,
          nights: 0,
          subtotal: 0,
        };
      }
      ratesMap["base"].nights += 1;
      ratesMap["base"].subtotal += basePrice;
    }

    cur.setDate(cur.getDate() + 1);
  }

  const breakdown = Object.values(ratesMap);
  const deposit = Math.round(totalAmount * depositRatio);
  const avgPerNight = Math.round(totalAmount / totalNights);

  return {
    days: totalNights,
    total: totalAmount,
    deposit,
    depositPercentage: pct,
    avgPerNight,
    hasSeasonalRate,
    breakdown,
  };
}

export function calculateTotal(pricePerNightOrProp, checkIn, checkOut) {
  return calculateStayPrice(pricePerNightOrProp, checkIn, checkOut);
}

export function getStatusLabel(status) {
  const map = {
    confirmed:   { label: "Confirmada",  color: "#065f46", bg: "#d1fae5" },
    pending:     { label: "Pendiente",   color: "#92400e", bg: "#fef3c7" },
    checked_in:  { label: "En Estadía",  color: "#1e40af", bg: "#dbeafe" },
    checked_out: { label: "Check-out",   color: "#374151", bg: "#f3f4f6" },
    completed:   { label: "Completada",  color: "#1E293B", bg: "#E7EEF5" },
    cancelled:   { label: "Cancelada",   color: "#991b1b", bg: "#fee2e2" },
  };
  return map[status] || map.pending;
}

// ─── Configuración General del Sitio (WhatsApp, Alias, Google Ads) ──────────
export const STORAGE_KEY_SETTINGS = "toninas_site_settings_v1";

export const defaultSiteSettings = {
  whatsappNumber: "5491134610085",
  whatsappDefaultMessage:
    "Hola! Vengo desde la web de Dúplex Las Toninas y quiero consultar disponibilidad.",
  paymentAlias: "DUPLEX.TONINAS.MP",
  googleAdsId: "",
  googleAdsConversionLabel: "",
  depositPercentage: 50,
};

export function normalizeWhatsAppNumber(rawPhone) {
  if (!rawPhone) return defaultSiteSettings.whatsappNumber;
  let digits = String(rawPhone).replace(/\D/g, "");
  if (!digits) return defaultSiteSettings.whatsappNumber;
  // Si el usuario ingresa 10 dígitos de Argentina (ej. 1123456789 o 2246123456), agregamos 549
  if (digits.length === 10) {
    digits = "549" + digits;
  } else if (digits.length === 11 && digits.startsWith("0")) {
    digits = "549" + digits.slice(1);
  } else if (digits.length === 12 && digits.startsWith("54") && !digits.startsWith("549")) {
    digits = "549" + digits.slice(2);
  }
  return digits;
}

export function getStoredSiteSettings() {
  if (typeof window === "undefined") return defaultSiteSettings;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (!raw) return defaultSiteSettings;
    const parsed = JSON.parse(raw);
    // Si en localStorage había quedado un número viejo de prueba o default, reemplazarlo
    if (
      parsed.whatsappNumber === "5491155551111" ||
      parsed.whatsappNumber === "5491100000000" ||
      parsed.whatsappNumber === "5491112345678"
    ) {
      parsed.whatsappNumber = defaultSiteSettings.whatsappNumber;
    }
    return {
      ...defaultSiteSettings,
      ...parsed,
      whatsappNumber: normalizeWhatsAppNumber(parsed.whatsappNumber || defaultSiteSettings.whatsappNumber),
    };
  } catch {
    return defaultSiteSettings;
  }
}

export function saveStoredSiteSettings(newSettings) {
  if (typeof window === "undefined") return defaultSiteSettings;
  try {
    const current = getStoredSiteSettings();
    const merged = {
      ...current,
      ...newSettings,
      whatsappNumber: normalizeWhatsAppNumber(
        newSettings.whatsappNumber !== undefined ? newSettings.whatsappNumber : current.whatsappNumber
      ),
    };
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(merged));
    window.dispatchEvent(new Event("toninas_settings_changed"));
    return merged;
  } catch {
    return defaultSiteSettings;
  }
}

export function buildWhatsAppUrl(phoneNumber, customMessage) {
  const cleanPhone = normalizeWhatsAppNumber(phoneNumber);
  const message =
    customMessage ||
    defaultSiteSettings.whatsappDefaultMessage;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

// ─── Google Ads & GTM Conversion Tracking Helper ────────────────────────────
export function trackAdsConversion(eventName, eventParams = {}) {
  if (typeof window === "undefined") return;
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventName,
      ...eventParams,
      timestamp: new Date().toISOString(),
    });
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, eventParams);
    }
  } catch {}
}

