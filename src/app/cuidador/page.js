"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getBookings, recordPayment, updateBookingStatus, deleteBooking } from "@/lib/supabase";
import { mockBookings, formatDateDDMMAAAA, normalizeWhatsAppNumber } from "@/lib/data";
import { siteContent } from "@/lib/content";
import BookingCalendar from "@/components/BookingCalendar";
import {
  LogIn,
  LogOut,
  Phone,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  Wallet,
  RefreshCw,
  Home,
  ArrowUpRight,
  ListFilter,
  Moon,
  MapPin,
  MessageCircle,
  Sparkles,
} from "lucide-react";

const STATUS_CONFIG = {
  pending: {
    label: "Pendiente",
    bg: "bg-amber-50 text-amber-800 border-amber-200",
  },
  confirmed: {
    label: "Confirmada",
    bg: "bg-emerald-50 text-emerald-800 border-emerald-200",
  },
  checked_in: {
    label: "En Estadía",
    bg: "bg-emerald-50 text-emerald-800 border-emerald-200",
  },
  checked_out: {
    label: "Retirado",
    bg: "bg-slate-100 text-slate-600 border-slate-200",
  },
  completed: {
    label: "Completada",
    bg: "bg-emerald-50 text-emerald-800 border-emerald-200",
  },
};

function GuestCard({ booking, onCheckin, onPayment, isArrival }) {
  const [showPayment, setShowPayment] = useState(false);
  const [payAmount, setPayAmount] = useState("");
  const [payMethod, setPayMethod] = useState("cash");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const totalAmount = booking.totalAmount || booking.total_amount || 0;
  const depositPaid = booking.depositPaid || booking.deposit_paid || 0;
  const remaining = totalAmount - depositPaid;
  const status = STATUS_CONFIG[booking.status] || STATUS_CONFIG.confirmed;
  const guestName = booking.guestName || booking.guest_name;
  const guestPhone = booking.guestPhone || booking.guest_phone;
  const guestResidence =
    booking.guestResidence || booking.guest_residence || booking.guestEmail || "Las Toninas";
  const checkIn = booking.checkIn || booking.check_in;
  const checkOut = booking.checkOut || booking.check_out;
  const notes = booking.notes || booking.guest_notes || booking.guestNotes || "";
  const propName = booking.property?.name || booking.propertyId || "Dúplex";
  const cleanPhone = normalizeWhatsAppNumber(guestPhone);
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `¡Hola ${(guestName || "").trim()}! Te escribo desde Dúplex Las Toninas por tu reserva en ${propName}.`
  )}`;

  const handlePayment = async () => {
    if (!payAmount || parseFloat(payAmount) <= 0) return;
    setSaving(true);
    try {
      await onPayment(booking.id, parseFloat(payAmount), payMethod);
      setDone(true);
      setShowPayment(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-[1.75rem] bg-white p-6 border border-[#D7E0EB] shadow-xs mb-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-5">
        <div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider mb-2 ${
              isArrival
                ? "bg-[#E7EEF5] text-[#1E293B]"
                : "bg-amber-50 text-amber-800"
            }`}
          >
            {isArrival ? <LogIn className="size-3.5" /> : <LogOut className="size-3.5" />}
            {isArrival ? "Ingresa Hoy" : "Se Retira Hoy"}
          </span>
          <h2 className="text-2xl font-semibold tracking-tight text-[#1E293B]">
            {guestName}
          </h2>
          <div className="flex flex-wrap items-center gap-3 mt-1 text-sm font-semibold text-[#5A697D]">
            <span className="flex items-center gap-1.5">
              <Home className="size-4 text-[#1E293B]" />
              <span>{booking.property?.name || booking.propertyId}</span>
            </span>
            <span className="flex items-center gap-1.5 text-xs text-[#5A697D]">
              <MapPin className="size-3.5 text-[#1E293B]" />
              <span>{guestResidence}</span>
            </span>
          </div>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-xs font-bold whitespace-nowrap transition-colors shadow-2xs ${status.bg}`}
        >
          {booking.status === "confirmed" && (
            <span className="relative flex size-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full size-2 bg-emerald-500" />
            </span>
          )}
          <span>{status.label}</span>
        </span>
      </div>

      {/* Info Grid con DD-MM-AAAA */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="rounded-2xl bg-[#EFEFEF]/70 p-3.5 border border-[#D7E0EB]/70">
          <div className="flex items-center gap-1.5 text-xs font-medium text-[#5A697D]">
            <Calendar className="size-3.5 text-[#1E293B]" />
            <span>Llegada (Check-in 14:00 hs)</span>
          </div>
          <div className="mt-1 text-sm font-bold text-[#1E293B]">
            {formatDateDDMMAAAA(checkIn)}
          </div>
        </div>
        <div className="rounded-2xl bg-[#EFEFEF]/70 p-3.5 border border-[#D7E0EB]/70">
          <div className="flex items-center gap-1.5 text-xs font-medium text-[#5A697D]">
            <Calendar className="size-3.5 text-[#1E293B]" />
            <span>Salida (Check-out 10:00 hs)</span>
          </div>
          <div className="mt-1 text-sm font-bold text-[#1E293B]">
            {formatDateDDMMAAAA(checkOut)}
          </div>
        </div>
        <div className="rounded-2xl bg-[#EFEFEF]/70 p-3.5 border border-[#D7E0EB]/70">
          <div className="flex items-center gap-1.5 text-xs font-medium text-[#5A697D]">
            <Users className="size-3.5 text-[#1E293B]" />
            <span>Huéspedes</span>
          </div>
          <div className="mt-1 text-sm font-bold text-[#1E293B]">
            {booking.guests || booking.guest_count || 1} personas
          </div>
        </div>
        <div className="rounded-2xl bg-[#EFEFEF]/70 p-3.5 border border-[#D7E0EB]/70">
          <div className="flex items-center gap-1.5 text-xs font-medium text-[#5A697D]">
            <Moon className="size-3.5 text-[#1E293B]" />
            <span>Estadía</span>
          </div>
          <div className="mt-1 text-sm font-bold text-[#1E293B]">
            {booking.nights ||
              Math.max(
                1,
                Math.ceil(
                  (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
                )
              )}{" "}
            noches
          </div>
        </div>
      </div>

      {/* Observaciones / Comentarios Internos */}
      {notes && (
        <div className="rounded-2xl bg-amber-50/90 border border-amber-200/90 p-4 mb-4 text-xs">
          <span className="font-bold text-amber-900 block uppercase tracking-wider text-[11px] mb-1.5 flex items-center gap-1.5">
            <Sparkles className="size-4 text-amber-700" />
            Observaciones / Comentarios:
          </span>
          <p className="text-amber-950 font-semibold text-sm whitespace-pre-wrap">{notes}</p>
        </div>
      )}

      {/* Botones de Comunicación: WhatsApp Rápido y Llamada */}
      {guestPhone && (
        <div className="flex flex-col sm:flex-row gap-2.5 mb-4">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-base transition-all shadow-xs cursor-pointer"
          >
            <MessageCircle className="size-5" />
            <span>Enviar WhatsApp Rápido</span>
          </a>

          <a
            href={`tel:${guestPhone}`}
            className="flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-[#E7EEF5] hover:bg-[#D7E0EB] text-[#1E293B] font-bold text-sm transition-colors"
            title="Llamada telefónica directa"
          >
            <Phone className="size-4" />
            <span>Llamar</span>
          </a>
        </div>
      )}

      {/* Balance Box */}
      <div
        className={`rounded-2xl p-4 border mb-5 grid grid-cols-2 sm:grid-cols-3 gap-3 items-center ${
          remaining > 0
            ? "bg-amber-50/80 border-amber-200"
            : "bg-emerald-50/80 border-emerald-200"
        }`}
      >
        <div>
          <span className="block text-xs font-medium text-[#5A697D]">
            Total Reserva
          </span>
          <span className="text-lg font-bold text-[#1E293B]">
            ${totalAmount.toLocaleString("es-AR")}
          </span>
        </div>
        <div>
          <span className="block text-xs font-medium text-[#5A697D]">
            Seña / Abonado
          </span>
          <span className="text-lg font-bold text-emerald-700">
            ${depositPaid.toLocaleString("es-AR")}
          </span>
        </div>
        <div className="col-span-2 sm:col-span-1 sm:text-right">
          <span className="block text-xs font-medium text-[#5A697D]">
            {remaining > 0 ? "Saldo a Cobrar" : "Estado de Pago"}
          </span>
          <span
            className={`text-xl font-bold ${
              remaining > 0 ? "text-amber-800" : "text-emerald-700"
            }`}
          >
            {remaining > 0 ? `$${remaining.toLocaleString("es-AR")}` : "Completo ✓"}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        {isArrival && booking.status === "confirmed" && (
          <button
            type="button"
            onClick={() => onCheckin(booking.id)}
            className="w-full py-4 px-5 rounded-2xl bg-[#1E293B] hover:bg-[#0F172A] text-white font-semibold text-base flex items-center justify-center gap-2.5 transition-all cursor-pointer"
          >
            <CheckCircle2 className="size-5" />
            <span>Registrar Llegada (Check-in)</span>
          </button>
        )}

        {remaining > 0 && !showPayment && (
          <button
            type="button"
            onClick={() => {
              setPayAmount(remaining.toString());
              setShowPayment(true);
            }}
            className="w-full py-4 px-5 rounded-2xl border-2 border-[#1E293B] bg-white hover:bg-[#E7EEF5] text-[#1E293B] font-semibold text-base flex items-center justify-center gap-2.5 transition-all cursor-pointer"
          >
            <Wallet className="size-5" />
            <span>Registrar Cobro de Saldo</span>
          </button>
        )}

        {showPayment && (
          <div className="rounded-2xl bg-[#EFEFEF] p-5 border border-[#D7E0EB]">
            <label
              htmlFor={`pay-amount-${booking.id}`}
              className="block text-sm font-bold text-[#1E293B] mb-2"
            >
              Monto cobrado al huésped (ARS)
            </label>
            <input
              id={`pay-amount-${booking.id}`}
              name="payAmount"
              type="text"
              inputMode="numeric"
              value={payAmount}
              onChange={(e) => setPayAmount(e.target.value)}
              className="w-full rounded-xl bg-white border border-[#D7E0EB] p-3.5 text-center text-2xl font-bold text-[#1E293B] mb-4 outline-none focus:border-[#1E293B]"
            />
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[
                { value: "cash", label: "Efectivo" },
                { value: "transfer", label: "Transferencia" },
                { value: "mercadopago", label: "MercadoPago" },
                { value: "card", label: "Tarjeta" },
              ].map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setPayMethod(m.value)}
                  className={`py-3 px-3 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                    payMethod === m.value
                      ? "bg-[#1E293B] text-white border-[#1E293B]"
                      : "bg-white text-[#5A697D] border-[#D7E0EB]"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setShowPayment(false)}
                className="py-3 rounded-xl bg-white border border-[#D7E0EB] text-xs sm:text-sm font-semibold text-[#5A697D] cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handlePayment}
                disabled={saving}
                className="py-3 rounded-xl bg-[#1E293B] text-white text-xs sm:text-sm font-semibold cursor-pointer"
              >
                {saving ? "Guardando..." : "Confirmar Cobro"}
              </button>
            </div>
          </div>
        )}

        {done && (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 text-center text-sm font-bold text-emerald-800">
            Cobro registrado correctamente
          </div>
        )}
      </div>
    </div>
  );
}

export default function CuidadorPage() {
  const router = useRouter();
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("arrivals");
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const today = new Date().toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const todayStr = new Date().toISOString().split("T")[0];

  const loadBookings = useCallback(async () => {
    try {
      const data = await getBookings();
      if (Array.isArray(data)) {
        setAllBookings(data);
      } else {
        setAllBookings(mockBookings);
      }
    } catch {
      setAllBookings(mockBookings);
    } finally {
      setLoading(false);
      setLastUpdate(new Date());
    }
  }, []);

  useEffect(() => {
    const session =
      typeof window !== "undefined" ? localStorage.getItem("caretaker_session") : null;
    if (!session) {
      router.push("/cuidador/login");
      return;
    }
    loadBookings();

    const handleStorageChange = () => {
      loadBookings();
    };
    window.addEventListener("toninas_bookings_changed", handleStorageChange);
    window.addEventListener("storage", handleStorageChange);

    // Sincronización automática periódica (15s) para reflejar cambios hechos desde otros dispositivos
    const pollInterval = setInterval(() => {
      loadBookings();
    }, 15000);

    return () => {
      window.removeEventListener("toninas_bookings_changed", handleStorageChange);
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(pollInterval);
    };
  }, [router, loadBookings]);

  const handleCheckin = async (bookingId) => {
    try {
      await updateBookingStatus(bookingId, "checked_in");
    } catch {}
    setAllBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: "checked_in" } : b))
    );
  };

  const handlePayment = async (bookingId, amount, method) => {
    try {
      await recordPayment({
        booking_id: bookingId,
        amount,
        method,
        type: "balance",
        registered_by: "caretaker",
      });
    } catch {}
    setAllBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              depositPaid: (b.depositPaid || b.deposit_paid || 0) + amount,
              deposit_paid: (b.deposit_paid || 0) + amount,
            }
          : b
      )
    );
  };

  const handleDelete = async (bookingId) => {
    try {
      await deleteBooking(bookingId);
    } catch {}
    setAllBookings((prev) => prev.filter((b) => b.id !== bookingId));
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
    } catch {}
    setAllBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
    );
  };

  const arrivals = allBookings.filter((b) => (b.checkIn || b.check_in) === todayStr);
  const departures = allBookings.filter((b) => (b.checkOut || b.check_out) === todayStr);
  const displayList =
    tab === "arrivals" ? arrivals : tab === "departures" ? departures : allBookings;

  if (loading) {
    return (
      <div className="min-h-dvh bg-[#EFEFEF] flex flex-col items-center justify-center gap-3 text-[#1E293B]">
        <Clock className="size-10 animate-pulse" />
        <p className="text-lg font-semibold">Cargando recepción...</p>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[#EFEFEF] text-[#1E293B] p-3 md:p-5 antialiased">
      {/* Top Rivr Canvas Header */}
      <div className="mx-auto max-w-[1280px] rounded-[1.5rem] md:rounded-[2.5rem] bg-[#1E293B] text-white p-5 sm:p-8 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={siteContent.brand.logo}
              alt="Logo"
              className="size-10 object-contain"
            />
            <div>
              <div className="text-xs text-white/70 capitalize font-medium">
                {today} · {siteContent.brand.address}
              </div>
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
                Panel del Cuidador · {siteContent.brand.shortName}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadBookings}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 px-4 py-2 text-xs sm:text-sm font-semibold text-white transition-colors cursor-pointer"
            >
              <RefreshCw className="size-4" />
              <span>Actualizar</span>
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full bg-white text-[#1E293B] px-4 py-2 text-xs sm:text-sm font-semibold"
            >
              <span>Web</span>
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        </div>

        {/* Today Stats */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            {
              icon: LogIn,
              value: arrivals.length,
              label: "Ingresan Hoy",
            },
            {
              icon: LogOut,
              value: departures.length,
              label: "Salen Hoy",
            },
            {
              icon: Home,
              value: allBookings.filter((b) => b.status === "checked_in").length,
              label: "En Estadía",
            },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-2xl bg-white/10 border border-white/15 p-3.5 sm:p-4 text-center backdrop-blur-md"
              >
                <Icon className="size-4 mx-auto text-white/80 mb-1" />
                <div className="text-2xl sm:text-3xl font-semibold tabular-nums">
                  {stat.value}
                </div>
                <div className="text-[11px] sm:text-xs text-white/75 font-medium mt-0.5">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Pill Bar */}
        <div className="mt-6 flex flex-wrap gap-2">
          {[
            { key: "arrivals", label: "Ingresos Hoy (14hs)", icon: LogIn },
            { key: "departures", label: "Egresos Hoy (10hs)", icon: LogOut },
            { key: "calendar", label: "Calendario", icon: Calendar },
            { key: "all", label: "Todas las Reservas", icon: ListFilter },
          ].map((t) => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={`flex-1 min-w-[130px] inline-flex items-center justify-center gap-2 rounded-full py-2.5 px-4 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  active
                    ? "bg-white text-[#1E293B] shadow-xs"
                    : "bg-white/10 text-white/80 hover:bg-white/20"
                }`}
              >
                <Icon className="size-4" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <main
        className={`mx-auto py-6 ${
          tab === "calendar" ? "max-w-[1280px]" : "max-w-2xl"
        }`}
      >
        {tab === "calendar" ? (
          <div className="rounded-[1.75rem] md:rounded-[2.5rem] bg-white p-5 sm:p-8 border border-[#D7E0EB]">
            <BookingCalendar
              bookings={allBookings}
              onDeleteBooking={handleDelete}
              onStatusUpdateBooking={handleStatusUpdate}
            />
          </div>
        ) : displayList.length === 0 ? (
          <div className="rounded-[2rem] bg-white p-12 text-center border border-[#D7E0EB]">
            <CheckCircle2 className="size-12 mx-auto text-[#1E293B] mb-3 opacity-80" />
            <h2 className="text-xl font-semibold text-[#1E293B]">
              {tab === "arrivals"
                ? "Sin ingresos programados para hoy"
                : tab === "departures"
                ? "Sin egresos programados para hoy"
                : "Sin reservas registradas"}
            </h2>
            <p className="mt-1 text-sm text-[#5A697D]">
              Última actualización: {lastUpdate.toLocaleTimeString("es-AR")}
            </p>
          </div>
        ) : (
          displayList.map((booking) => (
            <GuestCard
              key={booking.id}
              booking={booking}
              isArrival={(booking.checkIn || booking.check_in) === todayStr}
              onCheckin={handleCheckin}
              onPayment={handlePayment}
            />
          ))
        )}
      </main>

      {/* Footer Logout */}
      <footer className="py-6 text-center">
        <button
          type="button"
          onClick={() => {
            localStorage.removeItem("caretaker_session");
            router.push("/cuidador/login");
          }}
          className="inline-flex items-center gap-2 rounded-full bg-white border border-[#D7E0EB] px-5 py-2 text-xs font-semibold text-[#5A697D] hover:text-[#1E293B] cursor-pointer"
        >
          <LogOut className="size-3.5" />
          <span>Cerrar sesión de Cuidador</span>
        </button>
      </footer>
    </div>
  );
}
