"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  mockBookings,
  getStoredBookings,
  properties as staticProperties,
  getStoredProperties,
  getStoredSiteSettings,
  normalizeWhatsAppNumber,
  buildWhatsAppUrl,
  getStatusLabel,
  formatDateDDMMAAAA,
  calculateTotal,
  calculateStayPrice,
  isDateRangeAvailable,
} from "@/lib/data";
import { siteContent } from "@/lib/content";
import BookingCalendar from "@/components/BookingCalendar";
import PropiedadesAdmin from "@/components/PropiedadesAdmin";
import {
  getBookings,
  getProperties,
  getSiteSettings,
  updateSiteSettings,
  updateBookingStatus,
  deleteBooking,
  createBooking,
} from "@/lib/supabase";
import {
  LayoutDashboard,
  ClipboardList,
  Calendar,
  Wallet,
  Building2,
  Settings,
  MessageCircle,
  ArrowUpRight,
  LogOut,
  CheckCircle2,
  Clock,
  TrendingUp,
  Trash2,
  Phone,
  Check,
  CreditCard,
  Plus,
  X,
  MapPin,
  AlertCircle,
  Save,
} from "lucide-react";

const NAV_ITEMS = [
  { id: "dashboard", icon: LayoutDashboard, label: "Resumen" },
  { id: "reservas", icon: ClipboardList, label: "Reservas" },
  { id: "calendario", icon: Calendar, label: "Calendario" },
  { id: "pagos", icon: Wallet, label: "Pagos y Señas" },
  { id: "propiedades", icon: Building2, label: "Unidades" },
  { id: "configuracion", icon: Settings, label: "WhatsApp y Config" },
];

// ─── Modal para Cargar Reserva Manual ───────────────────────────────────────
function ManualBookingModal({ isOpen, onClose, onSave, propertiesList }) {
  const [propertyId, setPropertyId] = useState(propertiesList[0]?.id || "duplex-1");
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestResidence, setGuestResidence] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(4);
  const [totalAmount, setTotalAmount] = useState("");
  const [depositPaid, setDepositPaid] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Transferencia");
  const [status, setStatus] = useState("confirmed");
  const [notes, setNotes] = useState("");
  const [seasonalDetails, setSeasonalDetails] = useState(null);
  const [saving, setSaving] = useState(false);
  const [collisionWarning, setCollisionWarning] = useState(false);

  const selectedProp = propertiesList.find((p) => p.id === propertyId);

  // Recalcular montos automáticamente cuando cambian fechas o propiedad
  useEffect(() => {
    if (checkIn && checkOut && selectedProp) {
      const calc = calculateStayPrice(
        selectedProp,
        checkIn,
        checkOut
      );
      setTotalAmount(calc.total.toString());
      setDepositPaid(calc.deposit.toString());
      setSeasonalDetails(calc.hasSeasonalRate ? calc : null);

      // Verificar si hay colisión de fechas
      const available = isDateRangeAvailable(propertyId, checkIn, checkOut);
      setCollisionWarning(!available);
    }
  }, [checkIn, checkOut, propertyId, selectedProp]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!checkIn || !checkOut || checkOut <= checkIn) {
      alert("La fecha de salida debe ser posterior a la de llegada.");
      return;
    }
    setSaving(true);
    try {
      const created = await createBooking({
        property_id: propertyId,
        guest_name: guestName,
        guest_phone: guestPhone,
        guest_residence: guestResidence || "Las Toninas",
        check_in: checkIn,
        check_out: checkOut,
        guests: parseInt(guests, 10),
        total_amount: parseFloat(totalAmount || 0),
        deposit_paid: parseFloat(depositPaid || 0),
        payment_method: paymentMethod,
        status,
        guest_notes: notes,
        source: "admin_manual",
      });
      onSave(created);
      onClose();
    } catch (err) {
      alert("Error al guardar reserva: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A]/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-[2rem] p-6 sm:p-8 max-w-2xl w-full border border-[#D7E0EB] shadow-2xl my-8">
        <div className="flex items-center justify-between pb-4 border-b border-[#EFEFEF] mb-5">
          <div className="flex items-center gap-2.5">
            <span className="flex size-10 items-center justify-center rounded-xl bg-[#1E293B] text-white">
              <Plus className="size-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-[#1E293B]">
                Cargar Reserva Manual
              </h2>
              <p className="text-xs text-[#5A697D]">
                Registrá una reserva directa de WhatsApp, llamada o mostrador
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="size-8 rounded-full bg-[#EFEFEF] flex items-center justify-center text-[#5A697D] hover:text-[#1E293B] cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="manual-property"
                className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-1"
              >
                Unidad *
              </label>
              <select
                id="manual-property"
                value={propertyId}
                onChange={(e) => setPropertyId(e.target.value)}
                required
                className="w-full rounded-xl bg-[#EFEFEF]/70 border border-[#D7E0EB] px-3.5 py-2.5 text-sm font-semibold text-[#1E293B]"
              >
                {propertiesList.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Hasta {p.capacity} pers.) — ${(p.price_per_night || p.pricePerNight).toLocaleString("es-AR")}/noche
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="manual-guests"
                className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-1"
              >
                Cantidad de Personas *
              </label>
              <input
                id="manual-guests"
                type="number"
                min={1}
                max={selectedProp?.capacity || 6}
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                required
                className="w-full rounded-xl bg-[#EFEFEF]/70 border border-[#D7E0EB] px-3.5 py-2.5 text-sm font-semibold text-[#1E293B]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="manual-name"
                className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-1"
              >
                Nombre Huésped *
              </label>
              <input
                id="manual-name"
                type="text"
                placeholder="Ej: Juan Pérez"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                required
                className="w-full rounded-xl bg-[#EFEFEF]/70 border border-[#D7E0EB] px-3.5 py-2.5 text-sm font-medium text-[#1E293B]"
              />
            </div>

            <div>
              <label
                htmlFor="manual-phone"
                className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-1"
              >
                Teléfono / WhatsApp *
              </label>
              <input
                id="manual-phone"
                type="tel"
                placeholder="+54 9 11 ..."
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                required
                className="w-full rounded-xl bg-[#EFEFEF]/70 border border-[#D7E0EB] px-3.5 py-2.5 text-sm font-medium text-[#1E293B]"
              />
            </div>

            <div>
              <label
                htmlFor="manual-residence"
                className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-1"
              >
                Lugar de Residencia *
              </label>
              <input
                id="manual-residence"
                type="text"
                placeholder="Ej: Rosario, Santa Fe"
                value={guestResidence}
                onChange={(e) => setGuestResidence(e.target.value)}
                required
                className="w-full rounded-xl bg-[#EFEFEF]/70 border border-[#D7E0EB] px-3.5 py-2.5 text-sm font-medium text-[#1E293B]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="manual-checkin"
                className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-1"
              >
                Llegada (Check-in) *
              </label>
              <input
                id="manual-checkin"
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                required
                className="w-full rounded-xl bg-[#EFEFEF]/70 border border-[#D7E0EB] px-3.5 py-2.5 text-sm font-semibold text-[#1E293B]"
              />
            </div>

            <div>
              <label
                htmlFor="manual-checkout"
                className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-1"
              >
                Salida (Check-out) *
              </label>
              <input
                id="manual-checkout"
                type="date"
                min={checkIn}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                required
                className="w-full rounded-xl bg-[#EFEFEF]/70 border border-[#D7E0EB] px-3.5 py-2.5 text-sm font-semibold text-[#1E293B]"
              />
            </div>
          </div>

          {collisionWarning && (
            <div className="rounded-xl bg-amber-50 border border-amber-300 p-3 text-xs font-semibold text-amber-900 flex items-center gap-2">
              <AlertCircle className="size-4 shrink-0 text-amber-700" />
              <span>
                Atención: Ya existe otra reserva activa para esas fechas en esta unidad. Podés continuar si se trata de un ajuste administrativo o cambio de unidad.
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label
                htmlFor="manual-total"
                className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-1"
              >
                Monto Total (ARS) *
              </label>
              <input
                id="manual-total"
                type="number"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                required
                className="w-full rounded-xl bg-[#EFEFEF]/70 border border-[#D7E0EB] px-3.5 py-2.5 text-sm font-bold text-[#1E293B]"
              />
              {seasonalDetails && (
                <span className="block mt-1 text-[11px] font-bold text-amber-800">
                  ⭐ Incluye temporada alta (${seasonalDetails.avgPerNight.toLocaleString("es-AR")}/noche prom.)
                </span>
              )}
            </div>

            <div>
              <label
                htmlFor="manual-deposit"
                className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-1"
              >
                Seña Cobrada (ARS)
              </label>
              <input
                id="manual-deposit"
                type="number"
                value={depositPaid}
                onChange={(e) => setDepositPaid(e.target.value)}
                className="w-full rounded-xl bg-[#EFEFEF]/70 border border-[#D7E0EB] px-3.5 py-2.5 text-sm font-bold text-emerald-700"
              />
            </div>

            <div>
              <label
                htmlFor="manual-method"
                className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-1"
              >
                Medio de Pago
              </label>
              <select
                id="manual-method"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full rounded-xl bg-[#EFEFEF]/70 border border-[#D7E0EB] px-3.5 py-2.5 text-sm font-semibold text-[#1E293B]"
              >
                <option value="Transferencia">Transferencia</option>
                <option value="MercadoPago">MercadoPago</option>
                <option value="Efectivo">Efectivo</option>
                <option value="Tarjeta">Tarjeta</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="manual-status"
                className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-1"
              >
                Estado
              </label>
              <select
                id="manual-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-xl bg-[#EFEFEF]/70 border border-[#D7E0EB] px-3.5 py-2.5 text-sm font-semibold text-[#1E293B]"
              >
                <option value="confirmed">Confirmada</option>
                <option value="pending">Pendiente de seña</option>
                <option value="checked_in">En Estadía</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="manual-notes"
              className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-1"
            >
              Observaciones internas
            </label>
            <input
              id="manual-notes"
              type="text"
              placeholder="Ej: Viene con auto mediano, solicitó cuna para bebé..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl bg-[#EFEFEF]/70 border border-[#D7E0EB] px-3.5 py-2 text-sm text-[#1E293B]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-[#EFEFEF]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#D7E0EB] bg-white text-xs font-semibold text-[#5A697D] cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1E293B] hover:bg-[#0F172A] text-white text-xs font-semibold cursor-pointer shadow-sm"
            >
              <Save className="size-4" />
              <span>{saving ? "Guardando..." : "Guardar Reserva"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Rivr Sidebar (Desktop) & Top Pill Nav (Mobile) ─────────────────────────
function Sidebar({ activeSection, setActiveSection, onOpenManualModal }) {
  const { brand } = siteContent;

  return (
    <>
      {/* Desktop Rivr Canvas Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col justify-between rounded-[2.25rem] bg-[#1E293B] text-white p-6 sticky top-5 h-[calc(100dvh-2.5rem)]">
        <div>
          <div className="flex items-center gap-3 pb-6 border-b border-white/10 mb-6">
            <img
              src={brand.logo}
              alt={brand.fullName}
              className="size-10 object-contain"
            />
            <div>
              <div className="text-sm font-bold tracking-tight">{brand.shortName}</div>
              <div className="text-xs text-white/60">Administración</div>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenManualModal}
            className="w-full mb-6 py-3 px-4 rounded-2xl bg-white text-[#1E293B] hover:bg-[#E7EEF5] text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            <Plus className="size-4" />
            <span>+ Reserva Manual</span>
          </button>

          <nav className="space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                    active
                      ? "bg-white text-[#1E293B] shadow-xs"
                      : "text-white/75 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="size-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-white/10 space-y-2">
          <Link
            href="/"
            className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors"
          >
            <span>Ver Sitio Público</span>
            <ArrowUpRight className="size-4" />
          </Link>
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem("admin_session");
              window.location.href = "/admin/login";
            }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-red-300 hover:bg-red-500/15 transition-colors cursor-pointer"
          >
            <LogOut className="size-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Header & Pill Nav */}
      <div className="lg:hidden rounded-[1.5rem] bg-[#1E293B] text-white p-5 mb-4">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <img src={brand.logo} alt={brand.fullName} className="size-8 object-contain" />
            <div>
              <div className="text-sm font-bold">{brand.shortName}</div>
              <div className="text-[11px] text-white/65">Panel Admin</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenManualModal}
              className="rounded-full bg-white text-[#1E293B] px-3 py-1.5 text-xs font-bold flex items-center gap-1 shadow-xs"
            >
              <Plus className="size-3.5" />
              <span>Reserva</span>
            </button>
            <Link
              href="/"
              className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white"
            >
              Sitio ↗
            </Link>
          </div>
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveSection(item.id)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold whitespace-nowrap cursor-pointer ${
                  active
                    ? "bg-white text-[#1E293B]"
                    : "bg-white/10 text-white/80"
                }`}
              >
                <Icon className="size-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

// ─── Dashboard Overview (Rivr Layout) ───────────────────────────────────────
function DashboardSection({
  bookings,
  propertiesList,
  siteSettings,
  onSaveSiteSettings,
  onOpenManualModal,
  onGoToConfig,
}) {
  const [quickPhone, setQuickPhone] = useState(siteSettings?.whatsappNumber || "5491134610085");
  const [savingPhone, setSavingPhone] = useState(false);
  const [savedPhoneOk, setSavedPhoneOk] = useState(false);

  useEffect(() => {
    if (siteSettings?.whatsappNumber) {
      setQuickPhone(siteSettings.whatsappNumber);
    }
  }, [siteSettings?.whatsappNumber]);

  const handleQuickPhoneSave = async (e) => {
    e.preventDefault();
    setSavingPhone(true);
    setSavedPhoneOk(false);
    try {
      const normalized = normalizeWhatsAppNumber(quickPhone);
      await onSaveSiteSettings({
        ...siteSettings,
        whatsappNumber: normalized,
      });
      setQuickPhone(normalized);
      setSavedPhoneOk(true);
      setTimeout(() => setSavedPhoneOk(false), 3500);
    } finally {
      setSavingPhone(false);
    }
  };

  const totalRevenue = bookings
    .filter((b) => b.status !== "cancelled")
    .reduce((s, b) => s + (b.totalAmount || b.total_amount || 0), 0);
  const totalDeposits = bookings
    .filter((b) => (b.depositPaid || b.deposit_paid || 0) > 0)
    .reduce((s, b) => s + (b.depositPaid || b.deposit_paid || 0), 0);
  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  const confirmedCount = bookings.filter(
    (b) => b.status === "confirmed" || b.status === "checked_in"
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#5A697D]">
            {siteContent.brand.address} · {siteContent.brand.city}
          </span>
          <h1 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight text-[#1E293B]">
            Resumen General de Temporada
          </h1>
        </div>
        <button
          type="button"
          onClick={onOpenManualModal}
          className="inline-flex items-center gap-2 rounded-full bg-[#1E293B] hover:bg-[#0F172A] text-white px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-xs w-fit"
        >
          <Plus className="size-4" />
          <span>Cargar Reserva Manual</span>
        </button>
      </div>

      {/* Top Banner Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Hero Balance Card */}
        <div className="xl:col-span-5 rounded-[1.75rem] md:rounded-[2.25rem] bg-[#1E293B] text-white p-7 sm:p-8 flex flex-col justify-between min-h-[210px]">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-white/70">
              Ingresos Totales Proyectados
            </span>
            <div className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight tabular-nums">
              ${totalRevenue.toLocaleString("es-AR")}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
              <TrendingUp className="size-3.5" />
              <span>Temporada Activa</span>
            </span>
            <span className="text-xs sm:text-sm text-white/85 font-medium">
              Señas cobradas: <strong>${totalDeposits.toLocaleString("es-AR")}</strong>
            </span>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="xl:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              icon: CheckCircle2,
              value: confirmedCount,
              label: "Confirmadas",
              sub: "Con seña",
            },
            {
              icon: Clock,
              value: pendingCount,
              label: "Pendientes",
              sub: "A confirmar",
            },
            {
              icon: Building2,
              value: propertiesList.length,
              label: "Unidades",
              sub: "4 Dúplex + 1 Depto",
            },
            {
              icon: CreditCard,
              value: "30%",
              label: "Seña Base",
              sub: "Reserva directa",
            },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-[1.5rem] bg-white p-5 border border-[#D7E0EB] flex flex-col justify-between"
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-[#E7EEF5] text-[#1E293B]">
                  <Icon className="size-5" />
                </span>
                <div className="mt-4">
                  <div className="text-2xl sm:text-3xl font-semibold text-[#1E293B] tabular-nums">
                    {stat.value}
                  </div>
                  <div className="text-xs font-bold text-[#1E293B] mt-1">
                    {stat.label}
                  </div>
                  <div className="text-[11px] text-[#5A697D]">{stat.sub}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick WhatsApp Phone Configuration Card */}
      <form
        onSubmit={handleQuickPhoneSave}
        className="rounded-[1.75rem] bg-white p-5 sm:p-6 border border-[#D7E0EB] flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-2xs"
      >
        <div className="flex items-start sm:items-center gap-3.5">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#25D366]/15 text-[#15803d]">
            <MessageCircle className="size-6" />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-bold text-[#1E293B]">
                Teléfono de WhatsApp para recibir consultas y reservas
              </h3>
              <span className="rounded-full bg-[#E7EEF5] px-2.5 py-0.5 text-[11px] font-bold text-[#1E293B]">
                Activo en toda la web
              </span>
            </div>
            <p className="text-xs text-[#5A697D] mt-0.5">
              Todos los botones de WhatsApp y el botón flotante enviarán las consultas con mensaje identificatorio a este número.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative">
            <input
              type="tel"
              value={quickPhone}
              onChange={(e) => setQuickPhone(e.target.value)}
              placeholder="Ej: 5491123456789"
              aria-label="Número de WhatsApp para atención"
              className="w-full sm:w-56 rounded-xl bg-[#EFEFEF]/80 border border-[#D7E0EB] px-3.5 py-2.5 text-sm font-bold text-[#1E293B]"
            />
          </div>
          <button
            type="submit"
            disabled={savingPhone}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1E293B] hover:bg-[#0F172A] disabled:opacity-50 text-white px-4 py-2.5 text-xs font-semibold cursor-pointer transition-all"
          >
            {savedPhoneOk ? <Check className="size-4 text-emerald-400" /> : <Save className="size-4" />}
            <span>{savingPhone ? "Guardando..." : savedPhoneOk ? "¡Número Guardado!" : "Guardar Teléfono"}</span>
          </button>
          <button
            type="button"
            onClick={onGoToConfig}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#D7E0EB] bg-white hover:bg-[#E7EEF5] text-[#1E293B] px-3.5 py-2.5 text-xs font-semibold cursor-pointer"
          >
            <Settings className="size-3.5" />
            <span>Más opciones</span>
          </button>
        </div>
      </form>

      {/* Revenue Curve Chart */}
      <div className="rounded-[1.75rem] md:rounded-[2.25rem] bg-white p-6 sm:p-8 border border-[#D7E0EB]">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-[#1E293B]">
              Curva de Ocupación e Ingresos
            </h3>
            <p className="text-xs text-[#5A697D]">
              Evolución mensual de las 5 unidades en Calle 12 Nº 495
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold text-[#5A697D]">
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-[#1E293B]" />
              Ingresos
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-[#94A3B8]" />
              Capacidad Máxima
            </span>
          </div>
        </div>

        <div className="w-full h-44 relative">
          <svg
            viewBox="0 0 500 120"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            {[20, 50, 80, 110].map((y) => (
              <line
                key={y}
                x1="0"
                y1={y}
                x2="500"
                y2={y}
                stroke="#EFEFEF"
                strokeWidth="1"
              />
            ))}
            <path
              d="M 10 100 C 90 80, 140 30, 220 25 C 300 20, 380 50, 490 15"
              fill="none"
              stroke="#1E293B"
              strokeWidth="3"
            />
            <path
              d="M 10 30 C 120 30, 250 30, 490 30"
              fill="none"
              stroke="#94A3B8"
              strokeWidth="1.5"
              strokeDasharray="6 4"
            />
            {[
              [10, 100],
              [130, 48],
              [220, 25],
              [360, 45],
              [490, 15],
            ].map(([x, y], idx) => (
              <circle
                key={idx}
                cx={x}
                cy={y}
                r="4.5"
                fill="#1E293B"
                stroke="white"
                strokeWidth="2"
              />
            ))}
          </svg>
        </div>
        <div className="flex justify-between text-xs font-semibold text-[#5A697D] mt-3">
          <span>Nov</span>
          <span>Dic</span>
          <span>Ene</span>
          <span>Feb</span>
          <span>Mar</span>
        </div>
      </div>

      {/* Recent Bookings Table con DD-MM-AAAA y Residencia */}
      <div className="rounded-[1.75rem] md:rounded-[2.25rem] bg-white p-6 sm:p-8 border border-[#D7E0EB]">
        <h3 className="text-lg font-semibold text-[#1E293B] mb-4">
          Últimas Reservas Registradas
        </h3>
        <div className="overflow-x-auto max-w-full">
          <table className="w-full border-separate border-spacing-0 text-left text-sm">
            <thead>
              <tr>
                {["Huésped", "Residencia", "Unidad", "Fechas (DD-MM-AAAA)", "Total", "Estado"].map((h) => (
                  <th
                    key={h}
                    className="sticky top-0 z-10 bg-white border-b border-[#D7E0EB] py-3 px-4 text-xs font-bold uppercase tracking-wider text-[#5A697D]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.slice(0, 5).map((b) => {
                const propId = b.propertyId || b.property_id;
                const prop =
                  propertiesList.find((p) => p.id === propId) || b.property;
                const { label, color, bg } = getStatusLabel(b.status);
                const guestName = b.guestName || b.guest_name;
                const guestResidence =
                  b.guestResidence || b.guest_residence || b.guestEmail || "Las Toninas";
                const checkIn = b.checkIn || b.check_in;
                const checkOut = b.checkOut || b.check_out;
                const totalAmount = b.totalAmount || b.total_amount || 0;

                return (
                  <tr key={b.id} className="hover:bg-[#EFEFEF]/40">
                    <th
                      scope="row"
                      className="sticky left-0 bg-white border-b border-[#EFEFEF] py-3.5 px-4 font-semibold text-[#1E293B]"
                    >
                      <div>{guestName}</div>
                      <div className="text-xs font-normal text-[#5A697D]">
                        {b.guestPhone || b.guest_phone || ""}
                      </div>
                    </th>
                    <td className="border-b border-[#EFEFEF] py-3.5 px-4 text-xs font-medium text-[#5A697D]">
                      {guestResidence}
                    </td>
                    <td className="border-b border-[#EFEFEF] py-3.5 px-4 font-medium text-[#1E293B]">
                      {prop?.name || propId}
                    </td>
                    <td className="border-b border-[#EFEFEF] py-3.5 px-4 text-xs text-[#1E293B] font-semibold whitespace-nowrap">
                      {formatDateDDMMAAAA(checkIn)} → {formatDateDDMMAAAA(checkOut)}
                    </td>
                    <td className="border-b border-[#EFEFEF] py-3.5 px-4 font-bold text-[#1E293B] tabular-nums">
                      ${totalAmount.toLocaleString("es-AR")}
                    </td>
                    <td className="border-b border-[#EFEFEF] py-3.5 px-4">
                      <span
                        style={{ backgroundColor: bg, color }}
                        className="inline-flex rounded-full px-3 py-1 text-xs font-bold"
                      >
                        {label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Reservas Section ──────────────────────────────────────────────────────
function ReservasSection({
  bookings,
  propertiesList,
  onStatusChange,
  onDelete,
  onOpenManualModal,
}) {
  const [filterStatus, setFilterStatus] = useState("all");
  const filtered =
    filterStatus === "all"
      ? bookings
      : bookings.filter((b) => b.status === filterStatus);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#5A697D]">
            Administración de Estadías
          </span>
          <h2 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight text-[#1E293B]">
            Gestión de Reservas
          </h2>
        </div>
        <button
          type="button"
          onClick={onOpenManualModal}
          className="inline-flex items-center gap-2 rounded-full bg-[#1E293B] hover:bg-[#0F172A] text-white px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-xs w-fit"
        >
          <Plus className="size-4" />
          <span>+ Cargar Reserva Manual</span>
        </button>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {[
          { value: "all", label: "Todas" },
          { value: "pending", label: "Pendientes" },
          { value: "confirmed", label: "Confirmadas" },
          { value: "checked_in", label: "En Estadía" },
          { value: "completed", label: "Completadas" },
          { value: "cancelled", label: "Canceladas" },
        ].map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilterStatus(f.value)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              filterStatus === f.value
                ? "bg-[#1E293B] text-white"
                : "bg-white border border-[#D7E0EB] text-[#5A697D] hover:text-[#1E293B]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Cards List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-[2rem] bg-white p-12 text-center border border-[#D7E0EB]">
            <p className="text-sm font-semibold text-[#5A697D]">
              No hay reservas para el filtro seleccionado.
            </p>
          </div>
        ) : (
          filtered.map((b) => {
            const propId = b.propertyId || b.property_id;
            const prop =
              propertiesList.find((p) => p.id === propId) || b.property;
            const { label, color, bg } = getStatusLabel(b.status);
            const guestName = b.guestName || b.guest_name;
            const guestPhone = b.guestPhone || b.guest_phone;
            const guestResidence =
              b.guestResidence || b.guest_residence || b.guestEmail || "Las Toninas";
            const checkIn = b.checkIn || b.check_in;
            const checkOut = b.checkOut || b.check_out;
            const totalAmount = b.totalAmount || b.total_amount || 0;
            const depositPaid = b.depositPaid || b.deposit_paid || 0;
            const pending = totalAmount - depositPaid;

            return (
              <div
                key={b.id}
                className="rounded-[1.5rem] bg-white p-5 sm:p-6 border border-[#D7E0EB] flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-2xs"
              >
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#5A697D]">
                      Huésped
                    </div>
                    <div className="font-semibold text-sm sm:text-base text-[#1E293B] mt-0.5">
                      {guestName}
                    </div>
                    <div className="text-xs text-[#5A697D] flex items-center gap-1 mt-0.5">
                      <MapPin className="size-3 text-[#1E293B]" />
                      <span>{guestResidence}</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#5A697D]">
                      Unidad
                    </div>
                    <div className="font-semibold text-sm text-[#1E293B] mt-0.5">
                      {prop?.name || propId}
                    </div>
                    <div className="text-xs text-[#5A697D]">
                      {b.guests || 1} personas · {guestPhone}
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#5A697D]">
                      Fechas (DD-MM-AAAA)
                    </div>
                    <div className="font-semibold text-xs sm:text-sm text-[#1E293B] mt-0.5">
                      {formatDateDDMMAAAA(checkIn)}
                    </div>
                    <div className="text-xs text-[#5A697D]">
                      → {formatDateDDMMAAAA(checkOut)}
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#5A697D]">
                      Total Estadía
                    </div>
                    <div className="font-bold text-base text-[#1E293B] mt-0.5 tabular-nums">
                      ${totalAmount.toLocaleString("es-AR")}
                    </div>
                    <div
                      className={`text-xs font-semibold ${
                        pending > 0 ? "text-amber-700" : "text-emerald-700"
                      }`}
                    >
                      {pending > 0
                        ? `Saldo: $${pending.toLocaleString("es-AR")}`
                        : "Cobro Completo"}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#EFEFEF]">
                  <span
                    style={{ backgroundColor: bg, color }}
                    className="rounded-full px-3 py-1 text-xs font-bold"
                  >
                    {label}
                  </span>

                  {b.status === "pending" && (
                    <button
                      type="button"
                      onClick={() => onStatusChange(b.id, "confirmed")}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#1E293B] hover:bg-[#0F172A] text-white px-3.5 py-2 text-xs font-semibold cursor-pointer"
                    >
                      <Check className="size-3.5" />
                      <span>Confirmar</span>
                    </button>
                  )}

                  {guestPhone && (
                    <a
                      href={`https://wa.me/${guestPhone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#E7EEF5] hover:bg-[#D7E0EB] text-[#1E293B] px-3.5 py-2 text-xs font-semibold"
                    >
                      <Phone className="size-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`¿Eliminar definitivamente la reserva de ${guestName}?`)) {
                        onDelete(b.id);
                      }
                    }}
                    aria-label="Eliminar reserva"
                    className="inline-flex items-center gap-1 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 text-xs font-semibold cursor-pointer"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ─── Pagos Section ─────────────────────────────────────────────────────────
function PagosSection({ bookings }) {
  const totalRevenue = bookings.reduce(
    (s, b) => s + (b.totalAmount || b.total_amount || 0),
    0
  );
  const totalCollected = bookings.reduce(
    (s, b) => s + (b.depositPaid || b.deposit_paid || 0),
    0
  );
  const totalPending = totalRevenue - totalCollected;

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#5A697D]">
          Finanzas y Señas (30%)
        </span>
        <h2 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight text-[#1E293B]">
          Control de Pagos y Saldos
        </h2>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-[1.5rem] bg-white p-6 border border-[#D7E0EB]">
          <div className="text-xs font-bold uppercase tracking-wider text-[#5A697D]">
            Facturación Total
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-semibold text-[#1E293B] tabular-nums">
            ${totalRevenue.toLocaleString("es-AR")}
          </div>
        </div>
        <div className="rounded-[1.5rem] bg-white p-6 border border-[#D7E0EB]">
          <div className="text-xs font-bold uppercase tracking-wider text-[#5A697D]">
            Señas y Cobros Recibidos
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-semibold text-emerald-700 tabular-nums">
            ${totalCollected.toLocaleString("es-AR")}
          </div>
        </div>
        <div className="rounded-[1.5rem] bg-white p-6 border border-[#D7E0EB]">
          <div className="text-xs font-bold uppercase tracking-wider text-[#5A697D]">
            Saldo Pendiente al Check-in
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-semibold text-amber-700 tabular-nums">
            ${totalPending.toLocaleString("es-AR")}
          </div>
        </div>
      </div>

      {/* Table con Residencia y DD-MM-AAAA */}
      <div className="rounded-[1.75rem] bg-white p-6 border border-[#D7E0EB] overflow-x-auto">
        <table className="w-full border-separate border-spacing-0 text-left text-sm">
          <thead>
            <tr>
              {["Huésped", "Residencia", "Total", "Cobrado", "Saldo", "Medio"].map((h) => (
                <th
                  key={h}
                  className="sticky top-0 z-10 bg-white border-b border-[#D7E0EB] py-3 px-4 text-xs font-bold uppercase tracking-wider text-[#5A697D]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => {
              const guestName = b.guestName || b.guest_name;
              const guestResidence =
                b.guestResidence || b.guest_residence || b.guestEmail || "Las Toninas";
              const totalAmount = b.totalAmount || b.total_amount || 0;
              const depositPaid = b.depositPaid || b.deposit_paid || 0;
              const pending = totalAmount - depositPaid;
              const method = b.paymentMethod || b.payment_method || "A confirmar";

              return (
                <tr key={b.id} className="hover:bg-[#EFEFEF]/40">
                  <th
                    scope="row"
                    className="sticky left-0 bg-white border-b border-[#EFEFEF] py-3.5 px-4 font-semibold text-[#1E293B]"
                  >
                    {guestName}
                  </th>
                  <td className="border-b border-[#EFEFEF] py-3.5 px-4 text-xs text-[#5A697D]">
                    {guestResidence}
                  </td>
                  <td className="border-b border-[#EFEFEF] py-3.5 px-4 font-bold text-[#1E293B] tabular-nums">
                    ${totalAmount.toLocaleString("es-AR")}
                  </td>
                  <td className="border-b border-[#EFEFEF] py-3.5 px-4 font-semibold text-emerald-700 tabular-nums">
                    ${depositPaid.toLocaleString("es-AR")}
                  </td>
                  <td className="border-b border-[#EFEFEF] py-3.5 px-4 font-semibold tabular-nums">
                    <span className={pending > 0 ? "text-amber-700" : "text-emerald-700"}>
                      {pending > 0 ? `$${pending.toLocaleString("es-AR")}` : "Completo"}
                    </span>
                  </td>
                  <td className="border-b border-[#EFEFEF] py-3.5 px-4">
                    <span className="rounded-full bg-[#E7EEF5] px-3 py-1 text-xs font-semibold text-[#1E293B]">
                      {method}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Configuración General (WhatsApp, Alias, Google Ads) ──────────────────
function ConfiguracionSection({ siteSettings, onSave }) {
  const [whatsappNumber, setWhatsappNumber] = useState(
    siteSettings?.whatsappNumber || "5491134610085"
  );
  const [whatsappDefaultMessage, setWhatsappDefaultMessage] = useState(
    siteSettings?.whatsappDefaultMessage ||
      "Hola! Vengo desde la web de Dúplex Las Toninas y quiero consultar disponibilidad."
  );
  const [paymentAlias, setPaymentAlias] = useState(
    siteSettings?.paymentAlias || "DUPLEX.TONINAS.MP"
  );
  const [googleAdsId, setGoogleAdsId] = useState(siteSettings?.googleAdsId || "");
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (siteSettings) {
      setWhatsappNumber(siteSettings.whatsappNumber || "5491134610085");
      setWhatsappDefaultMessage(
        siteSettings.whatsappDefaultMessage ||
          "Hola! Vengo desde la web de Dúplex Las Toninas y quiero consultar disponibilidad."
      );
      setPaymentAlias(siteSettings.paymentAlias || "DUPLEX.TONINAS.MP");
      setGoogleAdsId(siteSettings.googleAdsId || "");
    }
  }, [siteSettings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    try {
      const normalized = normalizeWhatsAppNumber(whatsappNumber);
      setWhatsappNumber(normalized);
      await onSave({
        whatsappNumber: normalized,
        whatsappDefaultMessage: whatsappDefaultMessage.trim(),
        paymentAlias: paymentAlias.trim(),
        googleAdsId: googleAdsId.trim(),
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } finally {
      setSaving(false);
    }
  };

  const previewCleanPhone = normalizeWhatsAppNumber(whatsappNumber);

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#5A697D]">
          Atención al Cliente, Pagos y Marketing
        </span>
        <h2 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight text-[#1E293B]">
          Configuración de WhatsApp y Sitio Web
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-[#5A697D]">
          Cambiá el teléfono receptor de WhatsApp cuando quieras. El cambio impacta en vivo en el botón flotante, tarjetas de unidades, pie de página y envío de comprobantes.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-[1.75rem] md:rounded-[2.25rem] bg-white p-6 sm:p-8 border border-[#D7E0EB] space-y-6 max-w-3xl"
      >
        {/* Número de WhatsApp */}
        <div className="rounded-2xl bg-[#EFEFEF]/60 p-5 border border-[#D7E0EB] space-y-4">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-[#25D366] text-white">
              <MessageCircle className="size-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-[#1E293B]">
                Teléfono de WhatsApp para Contestar Consultas
              </h3>
              <p className="text-xs text-[#5A697D]">
                Podés ingresar tu número con código de área (ej: 1123456789 o 5491123456789). El sistema lo formatea automáticamente para WhatsApp Internacional.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
            <div className="sm:col-span-8">
              <label
                htmlFor="config-whatsapp-number"
                className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-1.5"
              >
                Número de Teléfono (WhatsApp) *
              </label>
              <input
                id="config-whatsapp-number"
                type="tel"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="Ej: 5491123456789"
                required
                className="w-full rounded-xl bg-white border border-[#D7E0EB] px-4 py-3 text-base font-bold text-[#1E293B]"
              />
            </div>
            <div className="sm:col-span-4">
              <a
                href={buildWhatsAppUrl(previewCleanPhone, whatsappDefaultMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] text-white px-4 py-3 text-xs font-bold transition-all shadow-2xs"
              >
                <Phone className="size-4" />
                <span>Probar WhatsApp</span>
                <ArrowUpRight className="size-3.5" />
              </a>
            </div>
          </div>

          <div className="text-xs text-[#5A697D] flex items-center justify-between bg-white rounded-xl px-3.5 py-2 border border-[#D7E0EB]">
            <span>Enlace activo que verán los clientes:</span>
            <strong className="text-[#1E293B] font-mono">
              wa.me/{previewCleanPhone}
            </strong>
          </div>
        </div>

        {/* Mensaje predeterminado */}
        <div>
          <label
            htmlFor="config-whatsapp-msg"
            className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-1.5"
          >
            Mensaje predeterminado del Botón Flotante de WhatsApp
          </label>
          <textarea
            id="config-whatsapp-msg"
            rows={3}
            value={whatsappDefaultMessage}
            onChange={(e) => setWhatsappDefaultMessage(e.target.value)}
            className="w-full rounded-xl bg-[#EFEFEF]/60 border border-[#D7E0EB] px-4 py-3 text-sm font-medium text-[#1E293B]"
          />
          <p className="mt-1.5 text-xs text-[#5A697D]">
            Además de este mensaje general, cada unidad (Dúplex 1 al 4 y Depto) envía automáticamente su propio nombre y capacidad en el texto para que sepas exactamente por cuál te escriben.
          </p>
        </div>

        {/* Alias de Pago y Google Ads */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#EFEFEF]">
          <div>
            <label
              htmlFor="config-payment-alias"
              className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-1.5"
            >
              Alias Oficial (Transferencia / MercadoPago)
            </label>
            <input
              id="config-payment-alias"
              type="text"
              value={paymentAlias}
              onChange={(e) => setPaymentAlias(e.target.value)}
              placeholder="complejo.toninas.mp"
              className="w-full rounded-xl bg-[#EFEFEF]/60 border border-[#D7E0EB] px-4 py-2.5 text-sm font-bold text-[#1E293B]"
            />
          </div>

          <div>
            <label
              htmlFor="config-google-ads"
              className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-1.5"
            >
              ID de Google Ads (Opcional)
            </label>
            <input
              id="config-google-ads"
              type="text"
              value={googleAdsId}
              onChange={(e) => setGoogleAdsId(e.target.value)}
              placeholder="Ej: AW-123456789"
              className="w-full rounded-xl bg-[#EFEFEF]/60 border border-[#D7E0EB] px-4 py-2.5 text-sm font-semibold text-[#1E293B]"
            />
          </div>
        </div>

        {savedSuccess && (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 text-xs font-bold text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
            <span>
              ¡Configuración guardada y sincronizada! Todos los enlaces de WhatsApp del sitio ya dirigen al número {previewCleanPhone}.
            </span>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-[#1E293B] hover:bg-[#0F172A] disabled:opacity-50 text-white px-6 py-3 text-sm font-semibold cursor-pointer transition-all shadow-xs"
          >
            <Save className="size-4" />
            <span>{saving ? "Guardando cambios..." : "Guardar Configuración"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Main Admin Page ───────────────────────────────────────────────────────
export default function AdminPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [bookingsList, setBookingsList] = useState(getStoredBookings);
  const [propertiesList, setPropertiesList] = useState(getStoredProperties);
  const [siteSettings, setSiteSettings] = useState(getStoredSiteSettings);
  const [manualModalOpen, setManualModalOpen] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [bData, pData, sData] = await Promise.all([
        getBookings().catch(() => null),
        getProperties().catch(() => null),
        getSiteSettings().catch(() => null),
      ]);

      if (Array.isArray(bData)) {
        setBookingsList(bData);
      }

      if (sData) {
        setSiteSettings(sData);
      }

      const currentProps = pData && pData.length > 0 ? pData : getStoredProperties();
      setPropertiesList(
        currentProps.map((p) => ({
          ...p,
          pricePerNight: p.price_per_night || p.pricePerNight,
        }))
      );
    } catch {
      // fallback
    }
  }, []);

  useEffect(() => {
    const session = localStorage.getItem("admin_session");
    if (!session) router.push("/admin/login");
    loadData();

    // Escuchar cambios de reservas, propiedades y ajustes entre pestañas
    const handleStorageChange = () => {
      loadData();
    };
    window.addEventListener("toninas_bookings_changed", handleStorageChange);
    window.addEventListener("toninas_properties_changed", handleStorageChange);
    window.addEventListener("toninas_settings_changed", handleStorageChange);
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("toninas_bookings_changed", handleStorageChange);
      window.removeEventListener("toninas_properties_changed", handleStorageChange);
      window.removeEventListener("toninas_settings_changed", handleStorageChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [router, loadData]);

  const handleSaveSiteSettings = async (newSettings) => {
    const updated = await updateSiteSettings(newSettings);
    setSiteSettings(updated);
    return updated;
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
    } catch {}
    setBookingsList((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
    );
  };

  const handleDeleteBooking = async (bookingId) => {
    try {
      await deleteBooking(bookingId);
    } catch {}
    setBookingsList((prev) => prev.filter((b) => b.id !== bookingId));
  };

  const handleManualBookingSaved = (newBooking) => {
    setBookingsList((prev) => [newBooking, ...prev.filter((b) => b.id !== newBooking.id)]);
  };

  return (
    <div className="min-h-dvh bg-[#EFEFEF] text-[#1E293B] p-3 md:p-5 antialiased">
      <div className="mx-auto max-w-[1536px] flex flex-col lg:flex-row gap-6">
        <Sidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          onOpenManualModal={() => setManualModalOpen(true)}
        />

        <main className="flex-1 min-w-0 py-2 lg:py-4">
          {activeSection === "dashboard" && (
            <DashboardSection
              bookings={bookingsList}
              propertiesList={propertiesList}
              siteSettings={siteSettings}
              onSaveSiteSettings={handleSaveSiteSettings}
              onOpenManualModal={() => setManualModalOpen(true)}
              onGoToConfig={() => setActiveSection("configuracion")}
            />
          )}
          {activeSection === "reservas" && (
            <ReservasSection
              bookings={bookingsList}
              propertiesList={propertiesList}
              onStatusChange={handleStatusChange}
              onDelete={handleDeleteBooking}
              onOpenManualModal={() => setManualModalOpen(true)}
            />
          )}
          {activeSection === "pagos" && <PagosSection bookings={bookingsList} />}
          {activeSection === "calendario" && (
            <div className="rounded-[1.75rem] md:rounded-[2.25rem] bg-white p-5 sm:p-8 border border-[#D7E0EB]">
              <BookingCalendar
                bookings={bookingsList}
                onDeleteBooking={handleDeleteBooking}
                onStatusUpdateBooking={handleStatusChange}
              />
            </div>
          )}
          {activeSection === "propiedades" && <PropiedadesAdmin />}
          {activeSection === "configuracion" && (
            <ConfiguracionSection
              siteSettings={siteSettings}
              onSave={handleSaveSiteSettings}
            />
          )}
        </main>
      </div>

      {manualModalOpen && (
        <ManualBookingModal
          isOpen={manualModalOpen}
          onClose={() => setManualModalOpen(false)}
          onSave={handleManualBookingSaved}
          propertiesList={propertiesList}
        />
      )}
    </div>
  );
}
