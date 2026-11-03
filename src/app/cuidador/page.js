"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getBookings,
  recordPayment,
  updateBookingStatus,
  deleteBooking,
  getExpenses,
  createExpense,
  deleteExpense,
} from "@/lib/supabase";
import {
  mockBookings,
  formatDateDDMMAAAA,
  normalizeWhatsAppNumber,
  EXPENSE_CATEGORIES,
} from "@/lib/data";
import { siteContent } from "@/lib/content";
import BookingCalendar from "@/components/BookingCalendar";
import {
  LogIn,
  LogOut,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  Wallet,
  RefreshCw,
  Home,
  ArrowUpRight,
  ListFilter,
  MapPin,
  MessageCircle,
  Sparkles,
  Lock,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Flame,
  Wrench,
  Zap,
  Landmark,
  MoreHorizontal,
  ArrowLeft,
  X,
  FileText,
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

function GuestCard({ booking, onCheckin, onPayment, timingType }) {
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

  // Determinar texto y estilo del badge de sincronización
  const timingBadge = (() => {
    if (timingType === "arrival_today") {
      return { label: "Ingresa Hoy (14:00 hs)", bg: "bg-[#E7EEF5] text-[#1E293B]", icon: LogIn };
    }
    if (timingType === "departure_today") {
      return { label: "Se Retira Hoy (10:00 hs)", bg: "bg-amber-50 text-amber-900 border border-amber-200", icon: LogOut };
    }
    if (timingType === "arrival_tomorrow") {
      return { label: "Ingresa Mañana (14:00 hs)", bg: "bg-indigo-50 text-indigo-900 border border-indigo-200", icon: LogIn };
    }
    if (timingType === "departure_tomorrow") {
      return { label: "Se Retira Mañana (10:00 hs)", bg: "bg-orange-50 text-orange-900 border border-orange-200", icon: LogOut };
    }
    return { label: "Reserva Programada", bg: "bg-slate-100 text-slate-700", icon: Calendar };
  })();

  const TimingIcon = timingBadge.icon;

  return (
    <div className="rounded-[1.75rem] bg-white p-6 border border-[#D7E0EB] shadow-xs mb-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-5">
        <div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider mb-2 ${timingBadge.bg}`}
          >
            <TimingIcon className="size-3.5" />
            {timingBadge.label}
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
      <div className="grid grid-cols-2 gap-3 mb-4">
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
            <span>Ocupantes</span>
          </div>
          <div className="mt-1 text-sm font-bold text-[#1E293B]">
            {booking.guests || 1} personas
          </div>
        </div>
        <div className="rounded-2xl bg-[#EFEFEF]/70 p-3.5 border border-[#D7E0EB]/70">
          <div className="flex items-center gap-1.5 text-xs font-medium text-[#5A697D]">
            <Wallet className="size-3.5 text-[#1E293B]" />
            <span>Saldo a Cobrar</span>
          </div>
          <div
            className={`mt-1 text-sm font-bold tabular-nums ${
              remaining > 0 ? "text-amber-800" : "text-emerald-800"
            }`}
          >
            {remaining > 0 ? `$${remaining.toLocaleString("es-AR")}` : "Saldado ($0)"}
          </div>
        </div>
      </div>

      {/* Comentarios del Huésped / Notas Especiales */}
      {notes && notes.trim() !== "" && (
        <div className="mb-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 p-3.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-1">
            <FileText className="size-3.5 text-amber-700" />
            <span>Comentarios y Notas de la Reserva:</span>
          </div>
          <p className="text-xs text-amber-950 whitespace-pre-wrap leading-relaxed">
            {notes}
          </p>
        </div>
      )}

      {/* Balance Bar & Seña entregada */}
      <div className="rounded-2xl bg-[#EFEFEF]/50 p-3 border border-[#D7E0EB]/70 flex items-center justify-between text-xs mb-4">
        <div>
          <span className="text-[#5A697D]">Total Reserva: </span>
          <span className="font-bold text-[#1E293B] tabular-nums">
            ${totalAmount.toLocaleString("es-AR")}
          </span>
        </div>
        <div className="h-4 w-px bg-[#D7E0EB]" />
        <div>
          <span className="text-[#5A697D]">Seña Pagada: </span>
          <span className="font-bold text-emerald-700 tabular-nums">
            ${depositPaid.toLocaleString("es-AR")}
          </span>
        </div>
        <div className="h-4 w-px bg-[#D7E0EB]" />
        <div>
          <span className="text-[#5A697D]">Saldo Pendiente: </span>
          <span
            className={`font-bold tabular-nums ${
              remaining > 0 ? "text-amber-700" : "text-emerald-700"
            }`}
          >
            ${remaining.toLocaleString("es-AR")}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2.5">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 min-w-[150px] inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-4 text-xs sm:text-sm font-semibold transition-all shadow-2xs"
        >
          <MessageCircle className="size-4" />
          <span>Enviar WhatsApp</span>
        </a>

        {booking.status === "confirmed" && (
          <button
            type="button"
            onClick={() => onCheckin(booking.id)}
            className="flex-1 min-w-[150px] inline-flex items-center justify-center gap-2 rounded-full bg-[#1E293B] hover:bg-[#0F172A] text-white py-2.5 px-4 text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow-2xs"
          >
            <CheckCircle2 className="size-4" />
            <span>Confirmar Ingreso</span>
          </button>
        )}

        {remaining > 0 && !done && (
          <button
            type="button"
            onClick={() => setShowPayment(!showPayment)}
            className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[#D7E0EB] bg-white hover:bg-[#EFEFEF] text-[#1E293B] py-2.5 px-4 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            <Wallet className="size-4" />
            <span>{showPayment ? "Cancelar" : "Cobrar Saldo"}</span>
          </button>
        )}
      </div>

      {/* Payment Inline Form */}
      {showPayment && (
        <div className="mt-4 pt-4 border-t border-[#D7E0EB]">
          <div className="text-xs font-bold uppercase tracking-wider text-[#5A697D] mb-3">
            Registrar Cobro de Saldo
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs font-medium text-[#5A697D] mb-1">
                Monto ($ ARS)
              </label>
              <input
                type="number"
                placeholder={remaining.toString()}
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                className="w-full rounded-xl border border-[#D7E0EB] bg-[#EFEFEF]/50 px-3 py-2 text-sm font-bold text-[#1E293B] focus:outline-hidden focus:border-[#1E293B]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#5A697D] mb-1">
                Medio de Pago
              </label>
              <select
                value={payMethod}
                onChange={(e) => setPayMethod(e.target.value)}
                className="w-full rounded-xl border border-[#D7E0EB] bg-[#EFEFEF]/50 px-3 py-2 text-sm font-semibold text-[#1E293B] focus:outline-hidden focus:border-[#1E293B]"
              >
                <option value="cash">Efectivo en Recepción</option>
                <option value="transfer">Transferencia Bancaria</option>
                <option value="mercadopago">Mercado Pago / CVU</option>
              </select>
            </div>
          </div>
          <button
            type="button"
            onClick={handlePayment}
            disabled={saving || !payAmount}
            className="w-full rounded-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white py-2.5 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            {saving ? "Registrando cobro..." : `Confirmar Cobro de $${Number(payAmount || 0).toLocaleString("es-AR")}`}
          </button>
        </div>
      )}

      {done && (
        <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-semibold text-emerald-800 text-center">
          ✓ Pago registrado y actualizado en el sistema
        </div>
      )}
    </div>
  );
}

// ─── Modal para Cargar Gastos Operativos ─────────────────────────────────────
function ExpenseModal({ isOpen, onClose, onSave }) {
  const [concept, setConcept] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("mantenimiento");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!concept.trim() || !amount || Number(amount) <= 0) return;
    setSaving(true);
    try {
      await onSave({
        concept: concept.trim(),
        amount: Number(amount),
        category,
        date,
        notes: notes.trim(),
        registeredBy: "cuidador",
      });
      onClose();
      setConcept("");
      setAmount("");
      setNotes("");
    } finally {
      setSaving(false);
    }
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
            <span className="size-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-800">
              <Plus className="size-4" />
            </span>
            <h3 className="text-xl font-semibold text-[#1E293B]">
              Cargar Gasto Operativo
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-full bg-[#EFEFEF] flex items-center justify-center text-[#5A697D] hover:text-[#1E293B] cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        <p className="text-xs text-[#5A697D] mb-5">
          Registrá gastos de garrafas, mantenimiento, limpieza o compras para las unidades. Se reflejará automáticamente en la caja y en el panel de administración.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#1E293B] mb-1">
              Concepto / Detalle del Gasto *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Garrafa 10kg para Dúplex 3, Limpieza, Cloro pileta"
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              className="w-full rounded-xl border border-[#D7E0EB] bg-[#EFEFEF]/50 px-3.5 py-2.5 text-sm font-semibold text-[#1E293B] focus:outline-hidden focus:border-[#1E293B]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1E293B] mb-1">
                Monto ($ ARS) *
              </label>
              <input
                type="number"
                required
                min="1"
                placeholder="Ej: 18000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-xl border border-[#D7E0EB] bg-[#EFEFEF]/50 px-3.5 py-2.5 text-sm font-bold text-[#1E293B] focus:outline-hidden focus:border-[#1E293B]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1E293B] mb-1">
                Fecha del Gasto
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-[#D7E0EB] bg-[#EFEFEF]/50 px-3 py-2 text-xs font-semibold text-[#1E293B] focus:outline-hidden focus:border-[#1E293B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1E293B] mb-1">
              Categoría
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-[#D7E0EB] bg-[#EFEFEF]/50 px-3 py-2.5 text-sm font-semibold text-[#1E293B] focus:outline-hidden focus:border-[#1E293B]"
            >
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1E293B] mb-1">
              Notas adicionales (opcional)
            </label>
            <textarea
              rows={2}
              placeholder="Número de factura o ticket, proveedor, detalles..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-[#D7E0EB] bg-[#EFEFEF]/50 px-3.5 py-2 text-xs font-medium text-[#1E293B] focus:outline-hidden focus:border-[#1E293B]"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-full border border-[#D7E0EB] py-2.5 text-xs font-bold text-[#5A697D] hover:bg-[#EFEFEF] cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-full bg-[#1E293B] hover:bg-[#0F172A] disabled:opacity-50 text-white py-2.5 text-xs font-bold cursor-pointer transition-colors"
            >
              {saving ? "Guardando..." : "Guardar Gasto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Sección Privada de Finanzas y Gastos (Cuidador) ────────────────────────
function FinanzasCuidadorSection({
  bookings,
  expenses,
  onOpenExpenseModal,
  onDeleteExpense,
  onBack,
}) {
  const [showAmounts, setShowAmounts] = useState(true);

  const totalCollected = bookings.reduce(
    (s, b) => s + (b.depositPaid || b.deposit_paid || 0),
    0
  );
  const totalRevenue = bookings.reduce(
    (s, b) => s + (b.totalAmount || b.total_amount || 0),
    0
  );
  const totalPending = totalRevenue - totalCollected;
  const totalExpenses = expenses.reduce(
    (s, e) => s + (Number(e.amount) || 0),
    0
  );
  const netBalance = totalCollected - totalExpenses;

  const mask = (val) => (showAmounts ? `$${Number(val).toLocaleString("es-AR")}` : "••••••");

  const getCategoryInfo = (catId) => {
    return (
      EXPENSE_CATEGORIES.find((c) => c.id === catId) || {
        label: "General",
        color: "bg-slate-100 text-slate-800 border-slate-300",
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Finanzas */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-5 rounded-[2rem] border border-[#D7E0EB]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="size-10 rounded-full bg-[#EFEFEF] hover:bg-[#D7E0EB] flex items-center justify-center text-[#1E293B] cursor-pointer transition-colors"
            title="Volver a Recepción"
          >
            <ArrowLeft className="size-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                <Lock className="size-3" />
                Área Confidencial
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1E293B]">
              Caja y Finanzas Operativas
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAmounts(!showAmounts)}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#D7E0EB] bg-[#EFEFEF]/80 hover:bg-[#EFEFEF] px-3.5 py-2 text-xs font-semibold text-[#1E293B] cursor-pointer transition-colors"
            title={showAmounts ? "Ocultar montos sensibles" : "Mostrar montos"}
          >
            {showAmounts ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
            <span>{showAmounts ? "Ocultar montos" : "Mostrar montos"}</span>
          </button>

          <button
            type="button"
            onClick={onOpenExpenseModal}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#1E293B] hover:bg-[#0F172A] text-white px-4 py-2 text-xs sm:text-sm font-bold shadow-xs cursor-pointer transition-colors"
          >
            <Plus className="size-4" />
            <span>+ Cargar Gasto</span>
          </button>
        </div>
      </div>

      {/* Grid de Métricas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-[1.5rem] bg-white p-4 sm:p-5 border border-[#D7E0EB] shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#5A697D]">
            Total Cobrado / Señas
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-bold text-emerald-700 tabular-nums">
            {mask(totalCollected)}
          </div>
          <div className="text-[10px] text-[#5A697D] mt-1">Ingresos ya percibidos</div>
        </div>

        <div className="rounded-[1.5rem] bg-white p-4 sm:p-5 border border-[#D7E0EB] shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#5A697D]">
            Saldo a Cobrar
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-bold text-amber-700 tabular-nums">
            {mask(totalPending)}
          </div>
          <div className="text-[10px] text-[#5A697D] mt-1">Pendiente al Check-in</div>
        </div>

        <div className="rounded-[1.5rem] bg-white p-4 sm:p-5 border border-[#D7E0EB] shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#5A697D]">
            Gastos Registrados
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-bold text-rose-700 tabular-nums">
            {showAmounts ? `-${mask(totalExpenses)}` : "••••••"}
          </div>
          <div className="text-[10px] text-[#5A697D] mt-1">{expenses.length} gastos cargados</div>
        </div>

        <div className="rounded-[1.5rem] bg-gradient-to-br from-[#1E293B] to-[#0F172A] text-white p-4 sm:p-5 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-white/70">
            Balance en Mano / Caja
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-bold text-white tabular-nums">
            {mask(netBalance)}
          </div>
          <div className="text-[10px] text-white/70 mt-1">Cobrado − Gastos</div>
        </div>
      </div>

      {/* Lista de Gastos Registrados */}
      <div className="rounded-[2rem] bg-white p-5 sm:p-6 border border-[#D7E0EB] shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-[#1E293B]">
              Historial de Gastos Operativos
            </h3>
            <p className="text-xs text-[#5A697D]">
              Detalle de compras, cargas de gas e insumos realizados en sede
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenExpenseModal}
            className="text-xs font-bold text-[#1E293B] hover:underline cursor-pointer"
          >
            + Nuevo gasto
          </button>
        </div>

        {expenses.length === 0 ? (
          <div className="rounded-2xl bg-[#EFEFEF]/50 border border-dashed border-[#D7E0EB] p-8 text-center text-[#5A697D]">
            <Wallet className="size-8 mx-auto text-[#5A697D] mb-2 opacity-60" />
            <div className="text-sm font-semibold">Sin gastos operativos registrados aún</div>
            <p className="text-xs mt-1">
              Tocá en "+ Cargar Gasto" para asentar la compra de garrafas, artículos de limpieza o reparaciones.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#EFEFEF]">
            {expenses.map((exp) => {
              const catInfo = getCategoryInfo(exp.category);
              return (
                <div
                  key={exp.id}
                  className="py-3.5 flex items-center justify-between gap-3 hover:bg-[#EFEFEF]/30 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${catInfo.color}`}
                    >
                      {catInfo.label}
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-[#1E293B] truncate">
                        {exp.concept}
                      </div>
                      <div className="text-xs text-[#5A697D] flex items-center gap-2">
                        <span>{formatDateDDMMAAAA(exp.date)}</span>
                        <span>·</span>
                        <span className="capitalize">Por {exp.registeredBy || "cuidador"}</span>
                        {exp.notes && (
                          <>
                            <span>·</span>
                            <span className="italic truncate max-w-[200px]" title={exp.notes}>
                              {exp.notes}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm sm:text-base font-bold text-rose-700 tabular-nums">
                      {showAmounts ? `-$${Number(exp.amount).toLocaleString("es-AR")}` : "••••••"}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`¿Eliminar gasto "${exp.concept}"?`)) {
                          onDeleteExpense(exp.id);
                        }
                      }}
                      className="size-8 rounded-full bg-[#EFEFEF] hover:bg-rose-50 hover:text-rose-700 flex items-center justify-center text-[#5A697D] transition-colors cursor-pointer"
                      title="Eliminar gasto"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Componente Principal CuidadorDashboard ──────────────────────────────────
export default function CuidadorDashboard() {
  const router = useRouter();
  const [allBookings, setAllBookings] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("arrivals");
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  const today = new Date().toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const todayStr = new Date().toISOString().split("T")[0];

  // Fecha de Mañana
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  const loadData = useCallback(async () => {
    try {
      const [bookingsData, expensesData] = await Promise.all([
        getBookings(),
        getExpenses(),
      ]);

      if (Array.isArray(bookingsData)) {
        setAllBookings(bookingsData);
      } else {
        setAllBookings(mockBookings);
      }

      if (Array.isArray(expensesData)) {
        setExpenses(expensesData);
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
    loadData();

    const handleStorageChange = () => {
      loadData();
    };
    window.addEventListener("toninas_bookings_changed", handleStorageChange);
    window.addEventListener("toninas_expenses_changed", handleStorageChange);
    window.addEventListener("storage", handleStorageChange);

    const pollInterval = setInterval(() => {
      loadData();
    }, 15000);

    return () => {
      window.removeEventListener("toninas_bookings_changed", handleStorageChange);
      window.removeEventListener("toninas_expenses_changed", handleStorageChange);
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(pollInterval);
    };
  }, [router, loadData]);

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

  const handleSaveExpense = async (expenseData) => {
    const created = await createExpense(expenseData);
    setExpenses((prev) => [created, ...prev]);
  };

  const handleDeleteExpense = async (expenseId) => {
    await deleteExpense(expenseId);
    setExpenses((prev) => prev.filter((e) => e.id !== expenseId));
  };

  // Clasificaciones por fecha
  const arrivalsToday = allBookings.filter((b) => (b.checkIn || b.check_in) === todayStr);
  const departuresToday = allBookings.filter((b) => (b.checkOut || b.check_out) === todayStr);
  const arrivalsTomorrow = allBookings.filter((b) => (b.checkIn || b.check_in) === tomorrowStr);
  const departuresTomorrow = allBookings.filter((b) => (b.checkOut || b.check_out) === tomorrowStr);

  const getTimingType = (booking) => {
    const cIn = booking.checkIn || booking.check_in;
    const cOut = booking.checkOut || booking.check_out;
    if (cIn === todayStr) return "arrival_today";
    if (cOut === todayStr) return "departure_today";
    if (cIn === tomorrowStr) return "arrival_tomorrow";
    if (cOut === tomorrowStr) return "departure_tomorrow";
    return "scheduled";
  };

  const displayList = (() => {
    switch (tab) {
      case "arrivals":
        return arrivalsToday;
      case "departures":
        return departuresToday;
      case "arrivals_tomorrow":
        return arrivalsTomorrow;
      case "departures_tomorrow":
        return departuresTomorrow;
      case "all":
        return allBookings;
      default:
        return arrivalsToday;
    }
  })();

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
              onClick={loadData}
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

        {/* 3 Tarjetas Superiores */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Tarjeta 1: Ingresos Hoy */}
          <button
            type="button"
            onClick={() => setTab("arrivals")}
            className={`rounded-2xl p-4 text-center transition-all cursor-pointer text-left border ${
              tab === "arrivals"
                ? "bg-white/20 border-white shadow-md ring-2 ring-white/30"
                : "bg-white/10 border-white/15 hover:bg-white/15"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <LogIn className="size-4 text-white/80" />
              {tab === "arrivals" && (
                <span className="text-[10px] font-bold bg-white text-[#1E293B] px-2 py-0.5 rounded-full">
                  Activo
                </span>
              )}
            </div>
            <div className="text-3xl font-bold tabular-nums text-white">
              {arrivalsToday.length}
            </div>
            <div className="text-xs text-white/80 font-semibold mt-0.5">
              Ingresan Hoy (14:00 hs)
            </div>
            <div className="text-[10px] text-white/60 mt-1">
              Tocar para filtrar
            </div>
          </button>

          {/* Tarjeta 2: Salen Hoy */}
          <button
            type="button"
            onClick={() => setTab("departures")}
            className={`rounded-2xl p-4 text-center transition-all cursor-pointer text-left border ${
              tab === "departures"
                ? "bg-white/20 border-white shadow-md ring-2 ring-white/30"
                : "bg-white/10 border-white/15 hover:bg-white/15"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <LogOut className="size-4 text-white/80" />
              {tab === "departures" && (
                <span className="text-[10px] font-bold bg-white text-[#1E293B] px-2 py-0.5 rounded-full">
                  Activo
                </span>
              )}
            </div>
            <div className="text-3xl font-bold tabular-nums text-white">
              {departuresToday.length}
            </div>
            <div className="text-xs text-white/80 font-semibold mt-0.5">
              Salen Hoy (10:00 hs)
            </div>
            <div className="text-[10px] text-white/60 mt-1">
              Tocar para filtrar
            </div>
          </button>

          {/* Tarjeta 3: Caja & Gastos (Privado, sin datos expuestos) */}
          <button
            type="button"
            onClick={() => setTab("finances")}
            className={`rounded-2xl p-4 text-left transition-all cursor-pointer border ${
              tab === "finances"
                ? "bg-amber-500/30 border-amber-300 ring-2 ring-amber-300/50 shadow-md"
                : "bg-amber-500/15 border-amber-400/40 hover:bg-amber-500/25"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/20 border border-amber-400/40 px-2 py-0.5 text-[10px] font-bold text-amber-200">
                <Lock className="size-3" />
                Confidencial
              </span>
              <Wallet className="size-4 text-amber-300" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-amber-100 flex items-center gap-2">
              <span>Caja & Gastos</span>
            </div>
            <div className="text-xs text-amber-200/90 font-semibold mt-0.5">
              Métricas y Carga de Gastos
            </div>
            <div className="text-[10px] text-amber-300/75 mt-1 font-medium">
              🔒 Tocar para abrir pantalla privada
            </div>
          </button>
        </div>

        {/* Barra de Pastillas Inferiores */}
        <div className="mt-5 flex flex-wrap gap-2">
          {/* Ingresos Mañana */}
          <button
            type="button"
            onClick={() => setTab("arrivals_tomorrow")}
            className={`flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 rounded-full py-2.5 px-4 text-xs font-semibold transition-all cursor-pointer ${
              tab === "arrivals_tomorrow"
                ? "bg-white text-[#1E293B] shadow-xs"
                : "bg-white/10 text-white/80 hover:bg-white/20"
            }`}
          >
            <LogIn className="size-3.5" />
            <span>Ingresos Mañana</span>
            <span className="rounded-full bg-white/20 px-2 py-0.2 text-[10px] font-bold">
              {arrivalsTomorrow.length}
            </span>
          </button>

          {/* Egresos Mañana */}
          <button
            type="button"
            onClick={() => setTab("departures_tomorrow")}
            className={`flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 rounded-full py-2.5 px-4 text-xs font-semibold transition-all cursor-pointer ${
              tab === "departures_tomorrow"
                ? "bg-white text-[#1E293B] shadow-xs"
                : "bg-white/10 text-white/80 hover:bg-white/20"
            }`}
          >
            <LogOut className="size-3.5" />
            <span>Egresos Mañana</span>
            <span className="rounded-full bg-white/20 px-2 py-0.2 text-[10px] font-bold">
              {departuresTomorrow.length}
            </span>
          </button>

          {/* Calendario */}
          <button
            type="button"
            onClick={() => setTab("calendar")}
            className={`flex-1 min-w-[130px] inline-flex items-center justify-center gap-2 rounded-full py-2.5 px-4 text-xs font-semibold transition-all cursor-pointer ${
              tab === "calendar"
                ? "bg-white text-[#1E293B] shadow-xs"
                : "bg-white/10 text-white/80 hover:bg-white/20"
            }`}
          >
            <Calendar className="size-3.5" />
            <span>Calendario</span>
          </button>

          {/* Todas las Reservas */}
          <button
            type="button"
            onClick={() => setTab("all")}
            className={`flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 rounded-full py-2.5 px-4 text-xs font-semibold transition-all cursor-pointer ${
              tab === "all"
                ? "bg-white text-[#1E293B] shadow-xs"
                : "bg-white/10 text-white/80 hover:bg-white/20"
            }`}
          >
            <ListFilter className="size-3.5" />
            <span>Todas ({allBookings.length})</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main
        className={`mx-auto py-6 ${
          tab === "calendar" || tab === "finances" ? "max-w-[1280px]" : "max-w-2xl"
        }`}
      >
        {tab === "finances" ? (
          <FinanzasCuidadorSection
            bookings={allBookings}
            expenses={expenses}
            onOpenExpenseModal={() => setIsExpenseModalOpen(true)}
            onDeleteExpense={handleDeleteExpense}
            onBack={() => setTab("arrivals")}
          />
        ) : tab === "calendar" ? (
          <div className="rounded-[1.75rem] md:rounded-[2.5rem] bg-white p-5 sm:p-8 border border-[#D7E0EB]">
            <BookingCalendar
              bookings={allBookings}
              onDeleteBooking={handleDelete}
              onStatusUpdateBooking={handleStatusUpdate}
            />
          </div>
        ) : (
          <div>
            {/* Header del filtro seleccionado */}
            <div className="mb-4 flex items-center justify-between px-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#5A697D]">
                {tab === "arrivals" && `Ingresos de Hoy (${arrivalsToday.length})`}
                {tab === "departures" && `Egresos de Hoy (${departuresToday.length})`}
                {tab === "arrivals_tomorrow" && `Ingresos de Mañana (${arrivalsTomorrow.length})`}
                {tab === "departures_tomorrow" && `Egresos de Mañana (${departuresTomorrow.length})`}
                {tab === "all" && `Todas las Reservas (${allBookings.length})`}
              </h2>
              <span className="text-xs text-[#5A697D]">
                Actualizado: {lastUpdate.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>

            {displayList.length === 0 ? (
              <div className="rounded-[2rem] bg-white p-12 text-center border border-[#D7E0EB]">
                <CheckCircle2 className="size-12 mx-auto text-[#1E293B] mb-3 opacity-80" />
                <h3 className="text-xl font-semibold text-[#1E293B]">
                  {tab === "arrivals" && "Sin ingresos programados para hoy"}
                  {tab === "departures" && "Sin egresos programados para hoy"}
                  {tab === "arrivals_tomorrow" && "Sin ingresos programados para mañana"}
                  {tab === "departures_tomorrow" && "Sin egresos programados para mañana"}
                  {tab === "all" && "Sin reservas registradas"}
                </h3>
                <p className="mt-1 text-sm text-[#5A697D]">
                  Podés consultar el Calendario o todas las reservas para ver próximas fechas.
                </p>
              </div>
            ) : (
              displayList.map((booking) => (
                <GuestCard
                  key={booking.id}
                  booking={booking}
                  timingType={getTimingType(booking)}
                  onCheckin={handleCheckin}
                  onPayment={handlePayment}
                />
              ))
            )}
          </div>
        )}
      </main>

      {/* Modal Cargar Gasto */}
      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onSave={handleSaveExpense}
      />

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
