"use client";

import { useState, useMemo, useEffect } from "react";
import { properties, getStoredProperties, formatDateDDMMAAAA } from "@/lib/data";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Phone,
  Trash2,
  Calendar,
  Home,
  MapPin,
  Clock,
  Sparkles,
  Edit3,
  MessageCircle,
} from "lucide-react";

const STATUS_THEME = {
  confirmed: { bg: "#1E293B", label: "Confirmada" },
  pending: { bg: "#D97706", label: "Pendiente" },
  checked_in: { bg: "#059669", label: "En Estadía" },
  completed: { bg: "#64748B", label: "Completada" },
  cancelled: { bg: "#DC2626", label: "Cancelada" },
};

// Paleta de colores altamente contrastantes para alternar en reservas correlativas
const CONTRAST_PALETTE = [
  { bg: "#D97706", text: "#FFFFFF", name: "Ámbar Cálido" },     // 0: Naranja / Ámbar
  { bg: "#1E293B", text: "#FFFFFF", name: "Azul Pizarra" },     // 1: Azul marino oscuro
  { bg: "#059669", text: "#FFFFFF", name: "Verde Esmeralda" },  // 2: Verde intenso
  { bg: "#4338CA", text: "#FFFFFF", name: "Índigo Profundo" },  // 3: Azul índigo
  { bg: "#BE123C", text: "#FFFFFF", name: "Rubí Carmesí" },     // 4: Rojo rubí
  { bg: "#0F766E", text: "#FFFFFF", name: "Verde Azulado" },    // 5: Teal oscuro
  { bg: "#7C3AED", text: "#FFFFFF", name: "Violeta" },          // 6: Púrpura / Violeta
  { bg: "#9A3412", text: "#FFFFFF", name: "Óxido Terracota" },  // 7: Terracota profundo
];

const MONTHS_ES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];
const DAYS_ES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function dateStr(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function BookingModal({ booking, onClose, onDelete, onStatusUpdate, onEditBooking, bookingColor }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!booking) return null;

  const prop = properties.find(
    (p) => p.id === (booking.propertyId || booking.property_id)
  );
  const status = STATUS_THEME[booking.status] || STATUS_THEME.pending;
  const guestName = booking.guestName || booking.guest_name;
  const guestPhone = booking.guestPhone || booking.guest_phone;
  const guestResidence =
    booking.guestResidence || booking.guest_residence || "No especificado";
  const checkIn = booking.checkIn || booking.check_in;
  const checkOut = booking.checkOut || booking.check_out;
  const totalAmount = booking.totalAmount || booking.total_amount || 0;
  const depositPaid = booking.depositPaid || booking.deposit_paid || 0;
  const pendingAmount = totalAmount - depositPaid;
  const notes = booking.notes || booking.guest_notes || booking.guestNotes || "";

  const handleDelete = async () => {
    setLoading(true);
    if (onDelete) await onDelete(booking.id);
    setLoading(false);
    onClose();
  };

  const handleStatusChange = async (newStatus) => {
    setLoading(true);
    if (onStatusUpdate) await onStatusUpdate(booking.id, newStatus);
    setLoading(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#0F172A]/75 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-[2rem] p-6 sm:p-8 max-w-md w-full border border-[#D7E0EB] shadow-2xl"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {booking.status === "confirmed" ? (
              <span className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/90 shadow-2xs">
                <span className="relative flex size-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full size-2 bg-emerald-500" />
                </span>
                <span>Confirmada</span>
              </span>
            ) : (
              <span
                style={{ backgroundColor: status.bg }}
                className="rounded-full px-3.5 py-1 text-xs font-bold text-white shadow-2xs"
              >
                {status.label}
              </span>
            )}
            {bookingColor && (
              <span
                style={{ backgroundColor: bookingColor.bg }}
                className="size-3.5 rounded-full inline-block border border-white shadow-2xs"
                title={`Color asignado en calendario: ${bookingColor.name}`}
              />
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar detalle"
            className="size-8 rounded-full bg-[#EFEFEF] flex items-center justify-center text-[#5A697D] hover:text-[#1E293B] cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        <h2 className="text-2xl font-semibold text-[#1E293B]">{guestName}</h2>
        <p className="text-xs sm:text-sm text-[#5A697D] flex items-center gap-1.5 mt-1 mb-5">
          <Home className="size-4 text-[#1E293B]" />
          <span>
            {prop?.name || booking.propertyId} · {booking.guests || 1} personas
          </span>
        </p>

        <div className="grid grid-cols-2 gap-3 mb-5 text-xs">
          <div className="rounded-xl bg-[#EFEFEF]/70 p-3 border border-[#D7E0EB]">
            <span className="text-[#5A697D] block font-medium">Check-in (14:00 hs)</span>
            <strong className="text-[#1E293B] text-sm block mt-0.5">
              {formatDateDDMMAAAA(checkIn)}
            </strong>
          </div>
          <div className="rounded-xl bg-[#EFEFEF]/70 p-3 border border-[#D7E0EB]">
            <span className="text-[#5A697D] block font-medium">Check-out (10:00 hs)</span>
            <strong className="text-[#1E293B] text-sm block mt-0.5">
              {formatDateDDMMAAAA(checkOut)}
            </strong>
          </div>
          <div className="rounded-xl bg-[#EFEFEF]/70 p-3 border border-[#D7E0EB]">
            <span className="text-[#5A697D] block font-medium">Teléfono</span>
            <strong className="text-[#1E293B] block mt-0.5">{guestPhone || "—"}</strong>
          </div>
          <div className="rounded-xl bg-[#EFEFEF]/70 p-3 border border-[#D7E0EB] overflow-hidden">
            <span className="text-[#5A697D] block font-medium">Residencia</span>
            <strong className="text-[#1E293B] truncate block mt-0.5" title={guestResidence}>
              {guestResidence}
            </strong>
          </div>
        </div>

        {/* Desglose de Pagos: Total, Seña Abonada y Saldo */}
        <div className="rounded-2xl bg-[#E7EEF5]/70 p-4 border border-[#D7E0EB] grid grid-cols-3 gap-2 items-center mb-5">
          <div>
            <span className="text-[11px] text-[#5A697D] block font-medium">Total Estadía</span>
            <strong className="text-base sm:text-lg font-bold text-[#1E293B] block mt-0.5">
              ${totalAmount.toLocaleString("es-AR")}
            </strong>
          </div>
          <div>
            <span className="text-[11px] text-[#5A697D] block font-medium">Seña Abonada</span>
            <strong className="text-base sm:text-lg font-bold text-emerald-700 block mt-0.5">
              ${depositPaid.toLocaleString("es-AR")}
            </strong>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-[#5A697D] block font-medium">Saldo Pendiente</span>
            <strong
              className={`text-base sm:text-lg font-bold block mt-0.5 ${
                pendingAmount > 0 ? "text-amber-700" : "text-emerald-700"
              }`}
            >
              {pendingAmount > 0
                ? `$${pendingAmount.toLocaleString("es-AR")}`
                : "Pagado ✓"}
            </strong>
          </div>
        </div>

        {/* Observaciones / Comentarios Internos */}
        {notes && (
          <div className="rounded-2xl bg-amber-50/90 border border-amber-200/90 p-3.5 mb-5 text-xs">
            <span className="font-bold text-amber-900 block uppercase tracking-wider text-[11px] mb-1 flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-amber-700" />
              Observaciones / Comentarios:
            </span>
            <p className="text-amber-950 font-medium whitespace-pre-wrap">{notes}</p>
          </div>
        )}

        {/* Status switcher */}
        <div className="mb-5">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-[#5A697D] mb-2">
            Actualizar Estado
          </span>
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: "pending", label: "Pendiente" },
              { id: "confirmed", label: "Confirmada" },
              { id: "checked_in", label: "En Estadía" },
              { id: "completed", label: "Completada" },
              { id: "cancelled", label: "Cancelada" },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => handleStatusChange(st.id)}
                disabled={loading}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  booking.status === st.id
                    ? "bg-[#1E293B] text-white shadow-2xs"
                    : "bg-[#EFEFEF] text-[#5A697D] hover:text-[#1E293B]"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2.5">
          {guestPhone && (
            <a
              href={`https://wa.me/${guestPhone.replace(/\D/g, "")}?text=${encodeURIComponent(
                `¡Hola ${(guestName || "").trim()}! Te escribo desde Dúplex Las Toninas por tu reserva en ${prop?.name || "el complejo"}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <MessageCircle className="size-4" />
              <span>Contactar por WhatsApp</span>
            </a>
          )}

          {onEditBooking && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onEditBooking(booking);
              }}
              className="w-full py-2.5 rounded-xl border border-[#D7E0EB] bg-[#F8FAFC] hover:bg-[#E7EEF5] text-[#1E293B] text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-2xs transition-colors"
            >
              <Edit3 className="size-4 text-[#1E293B]" />
              <span>Editar Reserva</span>
            </button>
          )}

          {!confirmDelete ? (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="w-full py-2.5 rounded-xl border border-red-200 bg-red-50 text-red-700 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="size-3.5" />
              <span>Eliminar Reserva</span>
            </button>
          ) : (
            <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-center">
              <p className="text-xs font-bold text-red-800 mb-2">
                ¿Confirmás eliminar esta reserva?
              </p>
              <div className="flex justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-[#D7E0EB] text-xs font-semibold cursor-pointer"
                >
                  Volver
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={loading}
                  className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold cursor-pointer"
                >
                  {loading ? "Eliminando..." : "Sí, eliminar"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BookingCalendar({
  bookings = [],
  onDeleteBooking,
  onStatusUpdateBooking,
  onEditBooking,
}) {
  const [propertiesList, setPropertiesList] = useState(getStoredProperties);

  useEffect(() => {
    setPropertiesList(getStoredProperties());
    const handleSync = () => setPropertiesList(getStoredProperties());
    window.addEventListener("toninas_properties_changed", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("toninas_properties_changed", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedBooking, setSelectedBooking] = useState(null);

  const daysInMonth = useMemo(() => getDaysInMonth(year, month), [year, month]);
  const todayStr = now.toISOString().split("T")[0];

  const prevMonth = () => {
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else setMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else setMonth((m) => m + 1);
  };

  // Asignación de colores contrastantes por reserva correlativa dentro de cada unidad
  // - Offset por propiedad para que columnas adyacentes no compartan color
  // - Salto de 2 posiciones para alternancia extrema entre reservas correlativas
  const bookingColorMap = useMemo(() => {
    const map = {};
    propertiesList.forEach((prop, propIdx) => {
      const propBookings = (bookings || [])
        .filter((b) => {
          const pid = b.propertyId || b.property_id;
          return pid === prop.id && b.status !== "cancelled";
        })
        .sort((a, b) => {
          const aIn = a.checkIn || a.check_in || "";
          const bIn = b.checkIn || b.check_in || "";
          return aIn.localeCompare(bIn);
        });

      const propOffset = (propIdx * 3) % CONTRAST_PALETTE.length;

      propBookings.forEach((b, idx) => {
        if (b.color && typeof b.color === "object" && b.color.bg) {
          map[b.id] = b.color;
        } else {
          const paletteIndex = (propOffset + idx * 2) % CONTRAST_PALETTE.length;
          map[b.id] = CONTRAST_PALETTE[paletteIndex];
        }
      });
    });
    return map;
  }, [bookings, propertiesList]);

  // Asignación de día para mostrar el nombre: EXACTAMENTE UNA VEZ por cinta continua
  // Ubicado preferentemente en el centro de los días de estadía completa del mes
  const bookingNameDayMap = useMemo(() => {
    const map = {};
    const activeBookings = (bookings || []).filter((b) => b.status !== "cancelled");

    activeBookings.forEach((b) => {
      const inDate = b.checkIn || b.check_in || "";
      const outDate = b.checkOut || b.check_out || "";
      if (!inDate || !outDate) return;

      const daysInCurrentMonth = [];
      for (let d = 1; d <= daysInMonth; d++) {
        const cur = dateStr(year, month, d);
        if (cur >= inDate && cur <= outDate) {
          daysInCurrentMonth.push(d);
        }
      }

      if (daysInCurrentMonth.length === 0) return;

      const stayingDays = daysInCurrentMonth.filter((d) => {
        const cur = dateStr(year, month, d);
        return cur > inDate && cur < outDate;
      });

      if (stayingDays.length > 0) {
        const midIndex = Math.floor(stayingDays.length / 2);
        map[b.id] = stayingDays[midIndex];
      } else {
        const arrDay = daysInCurrentMonth.find((d) => dateStr(year, month, d) === inDate);
        map[b.id] = arrDay || daysInCurrentMonth[0];
      }
    });

    return map;
  }, [bookings, year, month, daysInMonth]);

  // Cuadrícula que gestiona check-in (14:00), check-out (10:00) y superposiciones 50/50
  const cellGrid = useMemo(() => {
    const grid = {};
    propertiesList.forEach((prop) => {
      const propBookings = (bookings || []).filter((b) => {
        const pid = b.propertyId || b.property_id;
        return pid === prop.id && b.status !== "cancelled";
      });

      for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = dateStr(year, month, day);

        // Huésped que sale hoy a las 10:00 hs
        const departing = propBookings.find((b) => {
          const checkOut = b.checkOut || b.check_out;
          return checkOut === currentDate;
        });

        // Huésped que entra hoy a las 14:00 hs
        const arriving = propBookings.find((b) => {
          const checkIn = b.checkIn || b.check_in;
          return checkIn === currentDate;
        });

        // Huésped que permanece todo el día (checkIn < currentDate < checkOut)
        const staying = propBookings.find((b) => {
          const checkIn = b.checkIn || b.check_in;
          const checkOut = b.checkOut || b.check_out;
          return checkIn < currentDate && currentDate < checkOut;
        });

        if (departing && arriving) {
          // SUPERPOSICIÓN: Toto sale 10:00 hs y Tito entra 14:00 hs el mismo día (50/50)
          grid[`${prop.id}-${day}`] = {
            type: "overlap",
            departing,
            arriving,
          };
        } else if (departing) {
          // Solo egreso a las 10:00 hs (tarde libre)
          grid[`${prop.id}-${day}`] = {
            type: "departure_only",
            departing,
          };
        } else if (arriving) {
          // Solo ingreso a las 14:00 hs (mañana libre)
          grid[`${prop.id}-${day}`] = {
            type: "arrival_only",
            arriving,
          };
        } else if (staying) {
          // Estadía de día completo
          grid[`${prop.id}-${day}`] = {
            type: "staying",
            booking: staying,
          };
        } else {
          grid[`${prop.id}-${day}`] = null;
        }
      }
    });
    return grid;
  }, [bookings, propertiesList, year, month, daysInMonth]);

  return (
    <div>
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
        <div>
          <h3 className="text-xl font-semibold text-[#1E293B]">
            Calendario de Ocupación
          </h3>
          <p className="text-xs text-[#5A697D]">
            Días correlativos divididos 50/50: Salida 10:00 hs (mitad superior) · Entrada 14:00 hs (mitad inferior)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prevMonth}
            aria-label="Mes anterior"
            className="size-9 rounded-xl border border-[#D7E0EB] bg-white flex items-center justify-center text-[#1E293B] hover:bg-[#E7EEF5] cursor-pointer"
          >
            <ChevronLeft className="size-4" />
          </button>
          <div className="min-w-[140px] text-center text-sm font-bold text-[#1E293B]">
            {MONTHS_ES[month]} {year}
          </div>
          <button
            type="button"
            onClick={nextMonth}
            aria-label="Mes siguiente"
            className="size-9 rounded-xl border border-[#D7E0EB] bg-white flex items-center justify-center text-[#1E293B] hover:bg-[#E7EEF5] cursor-pointer"
          >
            <ChevronRight className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setYear(now.getFullYear());
              setMonth(now.getMonth());
            }}
            className="px-3.5 py-2 rounded-xl bg-[#1E293B] text-white text-xs font-semibold cursor-pointer"
          >
            Hoy
          </button>
        </div>
      </div>

      {/* Legend & Policy Indicators */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 p-3.5 rounded-2xl bg-[#EFEFEF]/80 border border-[#D7E0EB] text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-[#1E293B]">
            <Clock className="size-3.5 text-[#1E293B]" />
            <span>Turnos de Estadía:</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#5A697D]">
            <span className="inline-block size-3 rounded-xs bg-[#1E293B]" />
            <span>Mitad Sup: <strong>Sale 10:00 hs</strong></span>
          </div>
          <div className="flex items-center gap-1.5 text-[#5A697D]">
            <span className="inline-block size-3 rounded-xs bg-[#D97706]" />
            <span>Mitad Inf: <strong>Entra 14:00 hs</strong></span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#5A697D]">
            Colores Alternados:
          </span>
          <div className="flex items-center gap-1">
            {CONTRAST_PALETTE.slice(0, 5).map((c, i) => (
              <span
                key={i}
                style={{ backgroundColor: c.bg }}
                className="size-3 rounded-full inline-block border border-white shadow-2xs"
                title={c.name}
              />
            ))}
            <span className="text-[11px] text-[#5A697D] ml-1">Distinción inmediata</span>
          </div>
        </div>
      </div>

      {/* Calendar Table Wrapper */}
      <div className="overflow-auto max-h-[70vh] rounded-2xl border border-[#D7E0EB] bg-white shadow-2xs">
        <table className="w-full border-separate border-spacing-0 table-fixed">
          <thead>
            <tr>
              <th className="w-20 sticky top-0 left-0 z-30 bg-[#1E293B] text-white/90 text-xs font-bold uppercase py-3.5 px-2 text-center border-r border-white/10">
                {MONTHS_ES[month].substring(0, 3)}
              </th>
              {propertiesList.map((prop) => (
                <th
                  key={prop.id}
                  className="w-44 sticky top-0 z-20 bg-[#1E293B] text-white py-3 px-2 text-center border-l border-white/10"
                >
                  <div className="text-xs sm:text-sm font-bold truncate">{prop.name}</div>
                  <div className="text-[11px] font-normal text-white/70">
                    Hasta {prop.capacity} pers. · ${(Number(prop.pricePerNight || prop.price_per_night || 0) / 1000).toFixed(0)}k
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
              const cellDateStr = dateStr(year, month, day);
              const dow = new Date(year, month, day).getDay();
              const isWeekend = dow === 0 || dow === 6;
              const isToday = cellDateStr === todayStr;

              return (
                <tr key={day} className="h-12">
                  <th
                    scope="row"
                    className={`sticky left-0 z-10 border-r border-b border-[#D7E0EB] text-center p-0 ${
                      isToday
                        ? "bg-[#1E293B] text-white"
                        : isWeekend
                        ? "bg-[#EFEFEF] text-[#1E293B]"
                        : "bg-white text-[#5A697D]"
                    }`}
                  >
                    <div className="text-sm font-bold leading-none">{day}</div>
                    <div className="text-[10px] opacity-75 mt-0.5">{DAYS_ES[dow]}</div>
                  </th>

                  {propertiesList.map((prop) => {
                    const info = cellGrid[`${prop.id}-${day}`];

                    // 1. Día completamente libre
                    if (!info) {
                      return (
                        <td
                          key={prop.id}
                          className="border-l border-b border-[#EFEFEF] p-0"
                        />
                      );
                    }

                    // 2. SUPERPOSICIÓN: Turnaround día 50/50 (Toto sale 10h y Tito entra 14h)
                    if (info.type === "overlap") {
                      const colDep = bookingColorMap[info.departing.id] || CONTRAST_PALETTE[0];
                      const colArr = bookingColorMap[info.arriving.id] || CONTRAST_PALETTE[1];
                      const isDepNameDay = bookingNameDayMap[info.departing.id] === day;
                      const isArrNameDay = bookingNameDayMap[info.arriving.id] === day;
                      const nameDep = (info.departing.guestName || info.departing.guest_name || "").trim().split(" ")[0];
                      const nameArr = (info.arriving.guestName || info.arriving.guest_name || "").trim().split(" ")[0];
                      const continuesToTomorrow = day < daysInMonth;

                      return (
                        <td
                          key={prop.id}
                          className="border-l border-[#EFEFEF] p-0 h-12 align-top"
                          style={{ borderBottom: continuesToTomorrow ? "none" : "1px solid #EFEFEF" }}
                        >
                          <div className="h-full w-[calc(100%-8px)] mx-auto flex flex-col justify-between pt-[1px] pb-0">
                            {/* Mitad Superior: Huésped saliente hasta 10:00 hs (Termina redondeado) */}
                            <div
                              onClick={() => setSelectedBooking(info.departing)}
                              style={{ backgroundColor: colDep.bg }}
                              className="h-[21px] w-full cursor-pointer flex items-center justify-between px-2 rounded-t-none rounded-b-lg hover:brightness-110 transition-all text-white font-bold text-[11px] shadow-2xs select-none"
                              title={`${info.departing.guestName || info.departing.guest_name} - Sale hoy a las 10:00 hs`}
                            >
                              {isDepNameDay ? (
                                <>
                                  <span className="truncate text-xs font-black uppercase tracking-wide">{nameDep}</span>
                                  <span className="text-[9px] font-semibold opacity-95 shrink-0 ml-1 bg-black/30 px-1 py-0.2 rounded">
                                    Sale 10h
                                  </span>
                                </>
                              ) : (
                                <span className="text-[9px] font-bold text-white/95 uppercase mx-auto">
                                  Sale 10:00 hs
                                </span>
                              )}
                            </div>

                            {/* Mitad Inferior: Huésped entrante desde 14:00 hs (Empieza redondeado y conecta abajo) */}
                            <div
                              onClick={() => setSelectedBooking(info.arriving)}
                              style={{ backgroundColor: colArr.bg }}
                              className="h-[23px] w-full cursor-pointer flex items-center justify-between px-2 rounded-t-lg rounded-b-none hover:brightness-110 transition-all text-white font-bold text-[11px] shadow-2xs select-none"
                              title={`${info.arriving.guestName || info.arriving.guest_name} - Entra hoy a las 14:00 hs`}
                            >
                              {isArrNameDay ? (
                                <>
                                  <span className="truncate text-xs font-black uppercase tracking-wide">{nameArr}</span>
                                  <span className="text-[9px] font-semibold opacity-95 shrink-0 ml-1 bg-black/30 px-1 py-0.2 rounded">
                                    Entra 14h
                                  </span>
                                </>
                              ) : (
                                <span className="text-[9px] font-bold text-white/95 uppercase mx-auto">
                                  Entra 14:00 hs
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                      );
                    }

                    // 3. SOLO EGRESO: Huésped sale a las 10:00 hs, tarde disponible
                    if (info.type === "departure_only") {
                      const colDep = bookingColorMap[info.departing.id] || CONTRAST_PALETTE[0];
                      const isDepNameDay = bookingNameDayMap[info.departing.id] === day;
                      const nameDep = (info.departing.guestName || info.departing.guest_name || "").trim().split(" ")[0];

                      return (
                        <td
                          key={prop.id}
                          className="border-l border-b border-[#EFEFEF] p-0 h-12 align-top"
                        >
                          <div className="h-full w-[calc(100%-8px)] mx-auto flex flex-col justify-between pt-[1px] pb-[2px] gap-[2px]">
                            {/* Mitad Superior: Huésped saliente hasta 10:00 hs (Termina redondeado) */}
                            <div
                              onClick={() => setSelectedBooking(info.departing)}
                              style={{ backgroundColor: colDep.bg }}
                              className="h-[21px] w-full cursor-pointer flex items-center justify-between px-2 rounded-t-none rounded-b-lg hover:brightness-110 transition-all text-white font-bold text-[11px] shadow-2xs select-none"
                              title={`${info.departing.guestName || info.departing.guest_name} - Sale hoy a las 10:00 hs`}
                            >
                              {isDepNameDay ? (
                                <>
                                  <span className="truncate text-xs font-black uppercase tracking-wide">{nameDep}</span>
                                  <span className="text-[9px] font-semibold opacity-95 shrink-0 ml-1 bg-black/30 px-1 py-0.2 rounded">
                                    Sale 10h
                                  </span>
                                </>
                              ) : (
                                <span className="text-[9px] font-bold text-white/95 uppercase mx-auto">
                                  Sale 10:00 hs
                                </span>
                              )}
                            </div>

                            <div className="h-[20px] w-full flex items-center justify-center px-1 text-[9px] font-medium text-emerald-800/80 bg-emerald-50/60 border border-dashed border-emerald-200/80 rounded-md select-none">
                              Libre desde 10h
                            </div>
                          </div>
                        </td>
                      );
                    }

                    // 4. SOLO INGRESO: Huésped entra a las 14:00 hs, mañana disponible
                    if (info.type === "arrival_only") {
                      const colArr = bookingColorMap[info.arriving.id] || CONTRAST_PALETTE[0];
                      const isArrNameDay = bookingNameDayMap[info.arriving.id] === day;
                      const nameArr = (info.arriving.guestName || info.arriving.guest_name || "").trim().split(" ")[0];
                      const continuesToTomorrow = day < daysInMonth;

                      return (
                        <td
                          key={prop.id}
                          className="border-l border-[#EFEFEF] p-0 h-12 align-top"
                          style={{ borderBottom: continuesToTomorrow ? "none" : "1px solid #EFEFEF" }}
                        >
                          <div className="h-full w-[calc(100%-8px)] mx-auto flex flex-col justify-between pt-[2px] pb-0">
                            <div className="h-[20px] w-full flex items-center justify-center px-1 text-[9px] font-medium text-emerald-800/80 bg-emerald-50/60 border border-dashed border-emerald-200/80 rounded-md select-none mb-[2px]">
                              Libre hasta 14h
                            </div>

                            {/* Mitad Inferior: Huésped entrante desde 14:00 hs (Empieza redondeado y conecta abajo) */}
                            <div
                              onClick={() => setSelectedBooking(info.arriving)}
                              style={{ backgroundColor: colArr.bg }}
                              className="h-[24px] w-full cursor-pointer flex items-center justify-between px-2 rounded-t-lg rounded-b-none hover:brightness-110 transition-all text-white font-bold text-[11px] shadow-2xs select-none"
                              title={`${info.arriving.guestName || info.arriving.guest_name} - Entra hoy a las 14:00 hs`}
                            >
                              {isArrNameDay ? (
                                <>
                                  <span className="truncate text-xs font-black uppercase tracking-wide">{nameArr}</span>
                                  <span className="text-[9px] font-semibold opacity-95 shrink-0 ml-1 bg-black/30 px-1 py-0.2 rounded">
                                    Entra 14h
                                  </span>
                                </>
                              ) : (
                                <span className="text-[9px] font-bold text-white/95 uppercase mx-auto">
                                  Entra 14:00 hs
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                      );
                    }

                    // 5. ESTADÍA COMPLETA: Bloque continuo de día completo sin cortes
                    if (info.type === "staying") {
                      const color = bookingColorMap[info.booking.id] || CONTRAST_PALETTE[0];
                      const isNameDay = bookingNameDayMap[info.booking.id] === day;
                      const guestName = (info.booking.guestName || info.booking.guest_name || "").trim().split(" ")[0];
                      const continuesToTomorrow = day < daysInMonth;
                      const continuesFromYesterday = day > 1;

                      return (
                        <td
                          key={prop.id}
                          className="border-l border-[#EFEFEF] p-0 h-12 align-middle"
                          style={{ borderBottom: continuesToTomorrow ? "none" : "1px solid #EFEFEF" }}
                        >
                          <div
                            onClick={() => setSelectedBooking(info.booking)}
                            style={{ backgroundColor: color.bg }}
                            className={`h-full w-[calc(100%-8px)] mx-auto cursor-pointer flex items-center justify-center px-2 hover:brightness-110 transition-all text-white font-bold select-none ${
                              !continuesFromYesterday ? "rounded-t-lg" : "rounded-t-none"
                            } ${
                              !continuesToTomorrow ? "rounded-b-lg" : "rounded-b-none"
                            }`}
                            title={`${info.booking.guestName || info.booking.guest_name} - En estadía (${formatDateDDMMAAAA(info.booking.checkIn || info.booking.check_in)} al ${formatDateDDMMAAAA(info.booking.checkOut || info.booking.check_out)})`}
                          >
                            {isNameDay && (
                              <span className="text-sm sm:text-base font-black tracking-wider uppercase text-white drop-shadow-md select-none truncate px-1">
                                {guestName}
                              </span>
                            )}
                          </div>
                        </td>
                      );
                    }

                    return (
                      <td
                        key={prop.id}
                        className="border-l border-b border-[#EFEFEF] p-0"
                      />
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedBooking && (
        <BookingModal
          booking={selectedBooking}
          bookingColor={bookingColorMap[selectedBooking.id]}
          onClose={() => setSelectedBooking(null)}
          onDelete={onDeleteBooking}
          onStatusUpdate={onStatusUpdateBooking}
          onEditBooking={onEditBooking}
        />
      )}
    </div>
  );
}
