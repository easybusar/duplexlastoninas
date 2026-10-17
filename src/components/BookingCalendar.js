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
} from "lucide-react";

const STATUS_THEME = {
  confirmed: { bg: "#1E293B", label: "Confirmada" },
  pending: { bg: "#D97706", label: "Pendiente" },
  checked_in: { bg: "#059669", label: "En Estadía" },
  completed: { bg: "#64748B", label: "Completada" },
  cancelled: { bg: "#DC2626", label: "Cancelada" },
};

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

function BookingModal({ booking, onClose, onDelete, onStatusUpdate }) {
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
          <span
            style={{ backgroundColor: status.bg }}
            className="rounded-full px-3.5 py-1 text-xs font-bold text-white"
          >
            {status.label}
          </span>
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
            <span className="text-[#5A697D] block">Check-in</span>
            <strong className="text-[#1E293B] text-sm">
              {formatDateDDMMAAAA(checkIn)}
            </strong>
          </div>
          <div className="rounded-xl bg-[#EFEFEF]/70 p-3 border border-[#D7E0EB]">
            <span className="text-[#5A697D] block">Check-out</span>
            <strong className="text-[#1E293B] text-sm">
              {formatDateDDMMAAAA(checkOut)}
            </strong>
          </div>
          <div className="rounded-xl bg-[#EFEFEF]/70 p-3 border border-[#D7E0EB]">
            <span className="text-[#5A697D] block">Teléfono</span>
            <strong className="text-[#1E293B]">{guestPhone || "—"}</strong>
          </div>
          <div className="rounded-xl bg-[#EFEFEF]/70 p-3 border border-[#D7E0EB] overflow-hidden">
            <span className="text-[#5A697D] block">Residencia</span>
            <strong className="text-[#1E293B] truncate block" title={guestResidence}>
              {guestResidence}
            </strong>
          </div>
        </div>

        <div className="rounded-2xl bg-[#E7EEF5]/70 p-4 border border-[#D7E0EB] flex items-center justify-between mb-5">
          <div>
            <span className="text-xs text-[#5A697D] block">Total Estadía</span>
            <strong className="text-lg font-bold text-[#1E293B]">
              ${totalAmount.toLocaleString("es-AR")}
            </strong>
          </div>
          <div className="text-right">
            <span className="text-xs text-[#5A697D] block">Saldo Pendiente</span>
            <strong
              className={`text-lg font-bold ${
                pendingAmount > 0 ? "text-amber-700" : "text-emerald-700"
              }`}
            >
              {pendingAmount > 0
                ? `$${pendingAmount.toLocaleString("es-AR")}`
                : "Pagado"}
            </strong>
          </div>
        </div>

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
                    ? "bg-[#1E293B] text-white"
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
              href={`https://wa.me/${guestPhone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-[#1E293B] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2"
            >
              <Phone className="size-4" />
              <span>Contactar por WhatsApp</span>
            </a>
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

  const cellGrid = useMemo(() => {
    const grid = {};
    propertiesList.forEach((prop) => {
      for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = dateStr(year, month, day);
        const active = bookings.find((b) => {
          const pid = b.propertyId || b.property_id;
          if (pid !== prop.id) return false;
          if (b.status === "cancelled") return false;
          const checkIn = b.checkIn || b.check_in;
          const checkOut = b.checkOut || b.check_out;
          return currentDate >= checkIn && currentDate < checkOut;
        });

        if (active) {
          const prevDate = dateStr(year, month, day - 1);
          const nextDate = dateStr(year, month, day + 1);
          const checkIn = active.checkIn || active.check_in;
          const checkOut = active.checkOut || active.check_out;

          const isPrevInSame = currentDate > checkIn && prevDate >= checkIn;
          const isNextInSame = nextDate < checkOut;

          grid[`${prop.id}-${day}`] = {
            booking: active,
            isStart: currentDate === checkIn,
            isEnd: isNextInSame === false,
            isPrevInSame,
            isNextInSame,
          };
        } else {
          grid[`${prop.id}-${day}`] = null;
        }
      }
    });
    return grid;
  }, [bookings, year, month, daysInMonth]);

  return (
    <div>
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
        <div>
          <h3 className="text-xl font-semibold text-[#1E293B]">
            Calendario de Ocupación
          </h3>
          <p className="text-xs text-[#5A697D]">
            Tocá cualquier barra para ver o editar la reserva
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

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-4">
        {Object.entries(STATUS_THEME).map(([key, val]) => (
          <div
            key={key}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#5A697D]"
          >
            <span
              style={{ backgroundColor: val.bg }}
              className="size-3 rounded-xs inline-block"
            />
            <span>{val.label}</span>
          </div>
        ))}
      </div>

      {/* Calendar Table Wrapper */}
      <div className="overflow-auto max-h-[70vh] rounded-2xl border border-[#D7E0EB] bg-white">
        <table className="w-full border-separate border-spacing-0 table-fixed">
          <thead>
            <tr>
              <th className="w-20 sticky top-0 left-0 z-30 bg-[#1E293B] text-white/80 text-xs font-bold uppercase py-3.5 px-2 text-center border-r border-white/10">
                {MONTHS_ES[month].substring(0, 3)}
              </th>
              {propertiesList.map((prop) => (
                <th
                  key={prop.id}
                  className="w-40 sticky top-0 z-20 bg-[#1E293B] text-white py-3 px-2 text-center border-l border-white/10"
                >
                  <div className="text-xs sm:text-sm font-bold">{prop.name}</div>
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
                <tr key={day} className="h-11">
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
                    if (!info) {
                      return (
                        <td
                          key={prop.id}
                          className="border-l border-b border-[#EFEFEF] p-0"
                        />
                      );
                    }

                    const { booking, isStart, isPrevInSame, isNextInSame } = info;
                    const theme =
                      STATUS_THEME[booking.status] || STATUS_THEME.confirmed;
                    const borderRadius = `${!isPrevInSame ? "12px 12px" : "0 0"} ${
                      !isNextInSame ? "12px 12px" : "0 0"
                    }`;

                    return (
                      <td
                        key={prop.id}
                        className="border-l border-[#EFEFEF] p-0 h-11 align-top"
                        style={{
                          borderBottom: isNextInSame ? "none" : "1px solid #EFEFEF",
                        }}
                      >
                        <div
                          onClick={() => setSelectedBooking(booking)}
                          style={{
                            backgroundColor: theme.bg,
                            borderRadius,
                          }}
                          className="h-full w-[calc(100%-10px)] mx-auto cursor-pointer flex items-center justify-center px-2 hover:opacity-90 transition-opacity"
                        >
                          {isStart && (
                            <span className="text-white text-xs font-bold truncate">
                              {(booking.guestName || booking.guest_name || "").split(" ")[0]}
                            </span>
                          )}
                        </div>
                      </td>
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
          onClose={() => setSelectedBooking(null)}
          onDelete={onDeleteBooking}
          onStatusUpdate={onStatusUpdateBooking}
        />
      )}
    </div>
  );
}
