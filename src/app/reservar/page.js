"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  properties,
  getStoredProperties,
  isDateRangeAvailable,
  calculateTotal,
  calculateStayPrice,
  formatDateDDMMAAAA,
} from "@/lib/data";
import { siteContent } from "@/lib/content";
import { createBooking } from "@/lib/supabase";
import {
  ArrowUpRight,
  ArrowLeft,
  Calendar,
  Users,
  Check,
  MapPin,
  Copy,
  CheckCircle2,
  Building2,
  CreditCard,
  Sparkles,
  Phone,
  ShieldCheck,
  Home,
  MapPinned,
} from "lucide-react";

function ReservarContent() {
  const searchParams = useSearchParams();
  const { brand } = siteContent;

  const [propertiesList, setPropertiesList] = useState(properties);

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

  const hasDates = Boolean(searchParams.get("checkIn") && searchParams.get("checkOut"));
  const [step, setStep] = useState(hasDates ? 2 : 1);
  const [selectedCheckIn, setSelectedCheckIn] = useState(searchParams.get("checkIn") || "");
  const [selectedCheckOut, setSelectedCheckOut] = useState(searchParams.get("checkOut") || "");
  const [selectedGuests, setSelectedGuests] = useState(parseInt(searchParams.get("guests") || "2", 10));
  const initialProp =
    searchParams.get("property") ||
    (searchParams.get("unit") === "Departamento" ? "depto-1" : null);
  const [selectedProperty, setSelectedProperty] = useState(initialProp);
  const [guestData, setGuestData] = useState({
    name: "",
    phone: "",
    residence: "",
    notes: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("transfer");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const availableProperties = propertiesList.filter(
    (p) =>
      p.capacity >= selectedGuests &&
      selectedCheckIn &&
      selectedCheckOut &&
      isDateRangeAvailable(p.id, selectedCheckIn, selectedCheckOut)
  );

  const selectedPropertyData = propertiesList.find((p) => p.id === selectedProperty);
  const pricing =
    selectedPropertyData && selectedCheckIn && selectedCheckOut
      ? calculateStayPrice(selectedPropertyData, selectedCheckIn, selectedCheckOut)
      : null;

  const handleStep1 = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleStep2 = () => {
    if (selectedProperty) setStep(3);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const total = pricing?.total || 0;
      await createBooking({
        property_id: selectedProperty,
        guest_name: guestData.name,
        guest_phone: guestData.phone,
        guest_residence: guestData.residence,
        guest_notes: guestData.notes,
        check_in: selectedCheckIn,
        check_out: selectedCheckOut,
        guests: selectedGuests,
        total_amount: total,
        deposit_paid: 0,
        status: "pending",
        source: "web",
      });
    } catch (err) {
      console.warn("Error creando reserva:", err);
    } finally {
      setLoading(false);
      setStep(4);
    }
  };

  const copyAlias = () => {
    navigator.clipboard.writeText(brand.paymentAlias);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    { n: 1, label: "1. Fechas y Personas" },
    { n: 2, label: "2. Elegí tu Unidad" },
    { n: 3, label: "3. Datos y Seña (30%)" },
    { n: 4, label: "4. Confirmación" },
  ];

  return (
    <div className="min-h-dvh bg-[#EFEFEF] text-[#1E293B] p-3 md:p-5 antialiased">
      {/* Top Rivr Canvas Header */}
      <div className="mx-auto max-w-[1536px] rounded-[1.5rem] md:rounded-[3rem] bg-[#1E293B] text-white overflow-hidden shadow-xs">
        <header className="flex items-center justify-between px-5 py-5 md:px-10 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2.5 text-white">
            <img
              src={brand.logo}
              alt={brand.fullName}
              width={32}
              height={32}
              className="size-8 object-contain"
            />
            <span className="text-base sm:text-lg font-bold tracking-tight">
              {brand.shortName}
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 px-4 py-2 text-xs sm:text-sm font-medium text-white transition-colors"
            >
              <ArrowLeft className="size-4" />
              <span>Volver a Portada</span>
            </Link>
          </div>
        </header>

        <div className="px-6 py-10 md:py-14 text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/90 mb-4">
            <Sparkles className="size-3.5" />
            Reserva Directa con Dueños · {brand.address}, {brand.city}
          </span>
          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight leading-[1.08]">
            Asegurá tu estadía frente al mar
          </h1>
          <p className="mt-3 text-sm sm:text-base text-white/80">
            Congelá la tarifa abonando el {brand.depositPercentage}% de seña y el saldo al ingresar.
          </p>

          {/* Rivr Step Indicator Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {steps.map((s) => {
              const isActive = step === s.n;
              const isCompleted = step > s.n;
              return (
                <button
                  key={s.n}
                  type="button"
                  disabled={!isCompleted}
                  onClick={() => {
                    if (isCompleted) setStep(s.n);
                  }}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-white text-[#1E293B] shadow-sm"
                      : isCompleted
                      ? "bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 cursor-pointer hover:bg-emerald-500/30"
                      : "bg-white/10 text-white/50 cursor-default"
                  }`}
                >
                  {isCompleted && <Check className="size-3.5" />}
                  <span>{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Step Content Area */}
      <main className="mx-auto max-w-[1280px] py-8 md:py-12">
        {/* STEP 1: FECHAS Y HUÉSPEDES */}
        {step === 1 && (
          <form
            onSubmit={handleStep1}
            className="mx-auto max-w-2xl rounded-[1.75rem] md:rounded-[2.5rem] bg-white p-6 sm:p-10 md:p-12 border border-[#D7E0EB] shadow-xs"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-[#5A697D]">
              Paso 1 de 4
            </span>
            <h2 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight text-[#1E293B]">
              ¿Cuándo querés viajar a Las Toninas?
            </h2>
            <p className="mt-2 text-sm text-[#5A697D]">
              Seleccioná tus fechas de llegada y salida (formato DD-MM-AAAA) para ver las unidades disponibles.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-[#EFEFEF]/70 p-4 border border-[#D7E0EB]">
                <label
                  htmlFor="res-checkin"
                  className="block text-xs font-bold uppercase tracking-wider text-[#5A697D] mb-2"
                >
                  Fecha de Llegada (Check-in)
                </label>
                <div className="flex items-center gap-2.5 bg-white rounded-xl px-3.5 py-3 border border-[#D7E0EB]">
                  <Calendar className="size-4 text-[#1E293B] shrink-0" />
                  <input
                    id="res-checkin"
                    name="checkIn"
                    type="date"
                    min={today}
                    value={selectedCheckIn}
                    onChange={(e) => {
                      setSelectedCheckIn(e.target.value);
                      if (selectedCheckOut && e.target.value >= selectedCheckOut) {
                        setSelectedCheckOut("");
                      }
                    }}
                    required
                    className="w-full bg-transparent text-sm font-semibold text-[#1E293B] outline-none cursor-pointer"
                  />
                </div>
              </div>

              <div className="rounded-2xl bg-[#EFEFEF]/70 p-4 border border-[#D7E0EB]">
                <label
                  htmlFor="res-checkout"
                  className="block text-xs font-bold uppercase tracking-wider text-[#5A697D] mb-2"
                >
                  Fecha de Salida (Check-out)
                </label>
                <div className="flex items-center gap-2.5 bg-white rounded-xl px-3.5 py-3 border border-[#D7E0EB]">
                  <Calendar className="size-4 text-[#1E293B] shrink-0" />
                  <input
                    id="res-checkout"
                    name="checkOut"
                    type="date"
                    min={selectedCheckIn || today}
                    value={selectedCheckOut}
                    onChange={(e) => setSelectedCheckOut(e.target.value)}
                    required
                    className="w-full bg-transparent text-sm font-semibold text-[#1E293B] outline-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-[#EFEFEF]/70 p-5 border border-[#D7E0EB] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-[#5A697D]">
                  Cantidad de Huéspedes
                </span>
                <p className="text-xs text-[#5A697D] mt-0.5">
                  Dúplex hasta 6 personas · Departamento hasta 5 personas
                </p>
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedGuests(Math.max(1, selectedGuests - 1))}
                  aria-label="Disminuir huéspedes"
                  className="size-11 rounded-xl bg-white border border-[#D7E0EB] text-[#1E293B] font-bold text-lg flex items-center justify-center hover:bg-[#E7EEF5] cursor-pointer"
                >
                  −
                </button>
                <span className="text-2xl font-bold text-[#1E293B] min-w-[2.5rem] text-center tabular-nums">
                  {selectedGuests}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedGuests(Math.min(6, selectedGuests + 1))}
                  aria-label="Aumentar huéspedes"
                  className="size-11 rounded-xl bg-white border border-[#D7E0EB] text-[#1E293B] font-bold text-lg flex items-center justify-center hover:bg-[#E7EEF5] cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="mt-8 w-full py-4 px-6 rounded-2xl bg-[#1E293B] hover:bg-[#0F172A] text-white text-sm sm:text-base font-semibold flex items-center justify-center gap-3 transition-all cursor-pointer shadow-sm"
            >
              <span>Buscar Unidades Disponibles</span>
              <span className="flex size-7 items-center justify-center rounded-full bg-white/20">
                <ArrowUpRight className="size-4" />
              </span>
            </button>
          </form>
        )}

        {/* STEP 2: SELECCIÓN DE UNIDAD (CON FECHAS DESTACADAS Y GRANDES) */}
        {step === 2 && (
          <div>
            {/* Tarjeta Prominente con Fechas en Formato DD-MM-AAAA y Letra Grande */}
            <div className="rounded-[2rem] md:rounded-[2.5rem] bg-white p-6 sm:p-8 border border-[#D7E0EB] shadow-xs mb-8 flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left w-full lg:w-auto">
                <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[#1E293B] text-white shadow-xs">
                  <Calendar className="size-7" />
                </span>
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#5A697D] block">
                    Fechas Seleccionadas (DD-MM-AAAA)
                  </span>
                  <div className="mt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1E293B] tracking-tight">
                    <span>{formatDateDDMMAAAA(selectedCheckIn)}</span>
                    <span className="text-lg sm:text-xl font-normal text-[#5A697D] px-1">al</span>
                    <span>{formatDateDDMMAAAA(selectedCheckOut)}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2.5">
                <span className="rounded-full bg-[#E7EEF5] px-4 py-2 text-xs sm:text-sm font-bold text-[#1E293B]">
                  {Math.max(
                    1,
                    Math.ceil(
                      (new Date(selectedCheckOut) - new Date(selectedCheckIn)) /
                        (1000 * 60 * 60 * 24)
                    )
                  )}{" "}
                  noches
                </span>
                <span className="rounded-full bg-[#E7EEF5] px-4 py-2 text-xs sm:text-sm font-bold text-[#1E293B] flex items-center gap-1.5">
                  <Users className="size-4" />
                  <span>{selectedGuests} personas</span>
                </span>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-2 rounded-full border border-[#D7E0EB] bg-[#EFEFEF] hover:bg-[#D7E0EB] px-4 py-2 text-xs sm:text-sm font-semibold text-[#1E293B] transition-colors cursor-pointer"
                >
                  <Calendar className="size-3.5" />
                  <span>Modificar</span>
                </button>
              </div>
            </div>

            {availableProperties.length === 0 ? (
              <div className="rounded-[2rem] bg-white p-12 text-center border border-[#D7E0EB] max-w-xl mx-auto">
                <h3 className="text-xl font-semibold text-[#1E293B]">
                  Sin disponibilidad para esas fechas
                </h3>
                <p className="mt-2 text-sm text-[#5A697D]">
                  Probá seleccionando otro rango de fechas o consultanos directo por WhatsApp.
                </p>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1E293B] text-white px-6 py-3 text-sm font-semibold cursor-pointer"
                >
                  <span>Modificar Fechas</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableProperties.map((prop) => {
                  const calc = calculateStayPrice(
                    prop,
                    selectedCheckIn,
                    selectedCheckOut
                  );
                  const isSelected = selectedProperty === prop.id;

                  return (
                    <div
                      key={prop.id}
                      onClick={() => setSelectedProperty(prop.id)}
                      className={`group rounded-[1.75rem] bg-white p-4 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? "border-[#1E293B] shadow-[0_15px_35px_rgb(0,0,0,0.08)]"
                          : "border-[#D7E0EB]/80 hover:border-[#1E293B]/40"
                      }`}
                    >
                      <div>
                        <div className="relative h-52 w-full rounded-[1.25rem] overflow-hidden mb-4 bg-slate-200">
                          <img
                            src={prop.images[0]}
                            alt={prop.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute top-3 right-3 rounded-full bg-white/95 backdrop-blur-md px-3.5 py-1 text-xs font-bold text-[#1E293B] shadow-xs">
                            {calc.hasSeasonalRate
                              ? `$${calc.avgPerNight.toLocaleString("es-AR")} / noche (prom.)`
                              : `$${Number(prop.pricePerNight).toLocaleString("es-AR")} / noche`}
                          </div>
                          {calc.hasSeasonalRate && (
                            <div className="absolute top-3 left-3 rounded-full bg-amber-500/95 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-white flex items-center gap-1 shadow-xs">
                              <Sparkles className="size-3" />
                              <span>Tarifa de Temporada</span>
                            </div>
                          )}
                          {isSelected && (
                            <div className="absolute inset-0 bg-[#1E293B]/35 backdrop-blur-[2px] flex items-center justify-center">
                              <span className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-bold text-[#1E293B] shadow-md">
                                <Check className="size-4" />
                                Seleccionado
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="px-1">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="text-xl font-semibold text-[#1E293B]">
                              {prop.name}
                            </h3>
                            <span className="rounded-full bg-[#E7EEF5] px-2.5 py-1 text-xs font-bold text-[#1E293B]">
                              Hasta {prop.capacity} pers.
                            </span>
                          </div>

                          <div className="mt-4 rounded-2xl bg-[#EFEFEF]/70 p-3.5 border border-[#D7E0EB] space-y-1.5 text-xs">
                            {calc.hasSeasonalRate && (
                              <div className="pb-1.5 mb-1.5 border-b border-[#D7E0EB] text-[11px] text-amber-800 font-semibold flex items-center gap-1">
                                <Sparkles className="size-3 text-amber-600" />
                                <span>Incluye tarifa especial por temporada alta</span>
                              </div>
                            )}
                            <div className="flex justify-between text-[#5A697D]">
                              <span>Estadía ({calc.days} noches)</span>
                              <strong className="text-[#1E293B]">
                                ${calc.total.toLocaleString("es-AR")}
                              </strong>
                            </div>
                            <div className="flex justify-between text-[#1E293B] font-bold pt-1 border-t border-[#D7E0EB]">
                              <span>Seña para reservar (30%)</span>
                              <span>${calc.deposit.toLocaleString("es-AR")}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProperty(prop.id);
                          setStep(3);
                        }}
                        className={`mt-5 w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#1E293B] text-white"
                            : "bg-[#E7EEF5] text-[#1E293B] hover:bg-[#1E293B] hover:text-white"
                        }`}
                      >
                        <span>Elegir {prop.name} y Continuar</span>
                        <ArrowUpRight className="size-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {selectedProperty && (
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={handleStep2}
                  className="inline-flex items-center gap-3 rounded-full bg-[#1E293B] hover:bg-[#0F172A] text-white px-8 py-4 text-sm sm:text-base font-semibold shadow-md cursor-pointer transition-all"
                >
                  <span>Continuar con {selectedPropertyData?.name}</span>
                  <span className="flex size-7 items-center justify-center rounded-full bg-white/20">
                    <ArrowUpRight className="size-4" />
                  </span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: DATOS DE CONTACTO (CON LUGAR DE RESIDENCIA) Y SEÑA 30% */}
        {step === 3 && (
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
          >
            {/* Left Column: Guest Details + Payment Choice */}
            <div className="lg:col-span-8 space-y-6">
              <div className="rounded-[1.75rem] md:rounded-[2.25rem] bg-white p-6 sm:p-9 border border-[#D7E0EB]">
                <span className="text-xs font-bold uppercase tracking-widest text-[#5A697D]">
                  Paso 3 de 4 · Titular de la Reserva
                </span>
                <h2 className="mt-1 text-2xl font-semibold text-[#1E293B]">
                  Tus datos de contacto
                </h2>
                <p className="mt-1 text-sm text-[#5A697D]">
                  Ingresá tus datos para registrar la reserva y coordinar tu llegada en {brand.address}.
                </p>

                <div className="mt-6 space-y-4">
                  <div>
                    <label
                      htmlFor="guest-name"
                      className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-1.5"
                    >
                      Nombre y Apellido completo *
                    </label>
                    <input
                      id="guest-name"
                      name="guestName"
                      type="text"
                      autoComplete="name"
                      required
                      value={guestData.name}
                      onChange={(e) => setGuestData({ ...guestData, name: e.target.value })}
                      placeholder="Ej: Juan Pérez"
                      className="w-full rounded-xl bg-[#EFEFEF]/60 border border-[#D7E0EB] px-4 py-3 text-sm font-medium text-[#1E293B] outline-none focus:border-[#1E293B] focus:bg-white transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="guest-phone"
                        className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-1.5"
                      >
                        Teléfono / WhatsApp *
                      </label>
                      <input
                        id="guest-phone"
                        name="guestPhone"
                        type="tel"
                        autoComplete="tel"
                        inputMode="tel"
                        required
                        value={guestData.phone}
                        onChange={(e) => setGuestData({ ...guestData, phone: e.target.value })}
                        placeholder="+54 9 11 ..."
                        className="w-full rounded-xl bg-[#EFEFEF]/60 border border-[#D7E0EB] px-4 py-3 text-sm font-medium text-[#1E293B] outline-none focus:border-[#1E293B] focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="guest-residence"
                        className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-1.5"
                      >
                        Lugar de Residencia (Ciudad / Provincia) *
                      </label>
                      <input
                        id="guest-residence"
                        name="guestResidence"
                        type="text"
                        required
                        value={guestData.residence}
                        onChange={(e) => setGuestData({ ...guestData, residence: e.target.value })}
                        placeholder="Ej: Rosario, Santa Fe / CABA"
                        className="w-full rounded-xl bg-[#EFEFEF]/60 border border-[#D7E0EB] px-4 py-3 text-sm font-medium text-[#1E293B] outline-none focus:border-[#1E293B] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="guest-notes"
                      className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-1.5"
                    >
                      Horario estimado de llegada o consulta (opcional)
                    </label>
                    <textarea
                      id="guest-notes"
                      name="guestNotes"
                      rows={2}
                      value={guestData.notes}
                      onChange={(e) => setGuestData({ ...guestData, notes: e.target.value })}
                      placeholder="Ej: Llegamos cerca de las 14:00 hs..."
                      className="w-full rounded-xl bg-[#EFEFEF]/60 border border-[#D7E0EB] px-4 py-3 text-sm font-medium text-[#1E293B] outline-none focus:border-[#1E293B] focus:bg-white transition-all resize-y"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Card */}
              <div className="rounded-[1.75rem] md:rounded-[2.25rem] bg-white p-6 sm:p-9 border border-[#D7E0EB]">
                <h2 className="text-2xl font-semibold text-[#1E293B]">
                  Método de pago de la seña ({brand.depositPercentage}%)
                </h2>
                <p className="mt-1 text-sm text-[#5A697D]">
                  Monto de seña a abonar:{" "}
                  <strong className="text-[#1E293B]">
                    ${pricing?.deposit.toLocaleString("es-AR")}
                  </strong>
                </p>

                <fieldset className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <legend className="sr-only">Seleccioná medio de pago</legend>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("transfer")}
                    className={`flex items-center gap-3 rounded-2xl p-4 border-2 text-left transition-all cursor-pointer ${
                      paymentMethod === "transfer"
                        ? "border-[#1E293B] bg-[#E7EEF5]/60 text-[#1E293B]"
                        : "border-[#D7E0EB] bg-white text-[#5A697D] hover:border-[#1E293B]/30"
                    }`}
                  >
                    <Building2 className="size-5 shrink-0 text-[#1E293B]" />
                    <div>
                      <div className="text-sm font-bold text-[#1E293B]">
                        Transferencia Bancaria
                      </div>
                      <div className="text-xs text-[#5A697D]">Alias directo sin recargo</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("mercadopago")}
                    className={`flex items-center gap-3 rounded-2xl p-4 border-2 text-left transition-all cursor-pointer ${
                      paymentMethod === "mercadopago"
                        ? "border-[#1E293B] bg-[#E7EEF5]/60 text-[#1E293B]"
                        : "border-[#D7E0EB] bg-white text-[#5A697D] hover:border-[#1E293B]/30"
                    }`}
                  >
                    <CreditCard className="size-5 shrink-0 text-[#1E293B]" />
                    <div>
                      <div className="text-sm font-bold text-[#1E293B]">
                        MercadoPago / Tarjetas
                      </div>
                      <div className="text-xs text-[#5A697D]">Dinero en cuenta o tarjeta</div>
                    </div>
                  </button>
                </fieldset>

                {paymentMethod === "transfer" && (
                  <div className="mt-5 rounded-2xl bg-[#EFEFEF]/80 p-5 border border-[#D7E0EB]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-xl p-4 border border-[#D7E0EB]">
                      <div>
                        <span className="block text-[11px] font-bold uppercase tracking-wider text-[#5A697D]">
                          Alias Oficial
                        </span>
                        <span className="text-lg font-bold text-[#1E293B] tracking-tight">
                          {brand.paymentAlias}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={copyAlias}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1E293B] text-white px-4 py-2.5 text-xs font-semibold hover:bg-[#0F172A] cursor-pointer"
                      >
                        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                        <span>{copied ? "Alias Copiado" : "Copiar Alias"}</span>
                      </button>
                    </div>
                    <p className="mt-3 text-xs text-[#5A697D] leading-relaxed">
                      Al confirmar tu solicitud podrás enviarnos el comprobante de transferencia directamente por WhatsApp para dejar congelada tu unidad.
                    </p>
                  </div>
                )}

                {paymentMethod === "mercadopago" && (
                  <div className="mt-5 rounded-2xl bg-[#E7EEF5]/70 p-5 border border-[#D7E0EB]">
                    <p className="text-xs sm:text-sm text-[#1E293B] font-medium leading-relaxed">
                      Al confirmar tu reserva te compartiremos el link oficial de MercadoPago por WhatsApp para abonar la seña del 30% con tarjeta o dinero en cuenta.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-6 w-full py-4 px-6 rounded-2xl bg-[#1E293B] hover:bg-[#0F172A] disabled:opacity-50 text-white text-sm sm:text-base font-semibold flex items-center justify-center gap-3 transition-all cursor-pointer shadow-sm"
                >
                  <span>{loading ? "Registrando Reserva..." : "Confirmar y Enviar Reserva"}</span>
                  <span className="flex size-7 items-center justify-center rounded-full bg-white/20">
                    <ArrowUpRight className="size-4" />
                  </span>
                </button>
              </div>
            </div>

            {/* Right Column: Sticky Reservation Summary */}
            {pricing && selectedPropertyData && (
              <div className="lg:col-span-4 rounded-[1.75rem] md:rounded-[2.25rem] bg-white p-6 sm:p-7 border border-[#D7E0EB] lg:sticky lg:top-6">
                <span className="text-xs font-bold uppercase tracking-widest text-[#5A697D]">
                  Resumen de Estadía
                </span>
                <div className="mt-3 relative h-40 w-full rounded-2xl overflow-hidden bg-slate-200">
                  <img
                    src={selectedPropertyData.images[0]}
                    alt={selectedPropertyData.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h3 className="mt-4 text-xl font-semibold text-[#1E293B]">
                  {selectedPropertyData.name}
                </h3>
                <p className="text-xs text-[#5A697D] flex items-center gap-1 mt-1">
                  <MapPin className="size-3.5 text-[#1E293B]" />
                  {brand.address}, {brand.city}
                </p>

                <div className="mt-5 pt-4 border-t border-[#D7E0EB] space-y-2.5 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#5A697D]">Check-in</span>
                    <strong className="text-[#1E293B]">
                      {formatDateDDMMAAAA(selectedCheckIn)}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5A697D]">Check-out</span>
                    <strong className="text-[#1E293B]">
                      {formatDateDDMMAAAA(selectedCheckOut)}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5A697D]">Duración</span>
                    <strong className="text-[#1E293B]">{pricing.days} noches</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5A697D]">Huéspedes</span>
                    <strong className="text-[#1E293B]">{selectedGuests} personas</strong>
                  </div>
                  {guestData.residence && (
                    <div className="flex justify-between">
                      <span className="text-[#5A697D]">Origen</span>
                      <strong className="text-[#1E293B]">{guestData.residence}</strong>
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-4 border-t border-[#D7E0EB] space-y-2">
                  {pricing.hasSeasonalRate && (
                    <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900 mb-2">
                      <div className="flex items-center gap-1.5 font-bold mb-1">
                        <Sparkles className="size-3.5 text-amber-600" />
                        <span>Tarifa Especial de Temporada Aplicada</span>
                      </div>
                      <div className="space-y-0.5 text-[11px] text-[#5A697D]">
                        {pricing.breakdown.map((b, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span>{b.name} ({b.nights} {b.nights === 1 ? "noche" : "noches"}):</span>
                            <span className="font-semibold text-[#1E293B]">
                              ${b.subtotal.toLocaleString("es-AR")}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-[#5A697D]">Total Estadía</span>
                    <strong className="text-[#1E293B]">
                      ${pricing.total.toLocaleString("es-AR")}
                    </strong>
                  </div>
                  <div className="flex justify-between text-base font-bold text-[#1E293B] pt-2 border-t border-[#D7E0EB]">
                    <span>Seña a abonar (30%)</span>
                    <span>${pricing.deposit.toLocaleString("es-AR")}</span>
                  </div>
                </div>

                <div className="mt-4 rounded-xl bg-[#E7EEF5] p-3 text-xs font-semibold text-[#1E293B] flex items-center gap-2">
                  <ShieldCheck className="size-4 shrink-0" />
                  <span>
                    Saldo al ingresar: ${(pricing.total - pricing.deposit).toLocaleString("es-AR")}
                  </span>
                </div>
              </div>
            )}
          </form>
        )}

        {/* STEP 4: CONFIRMACIÓN Y WHATSAPP */}
        {step === 4 && (
          <div className="mx-auto max-w-xl rounded-[2rem] md:rounded-[2.75rem] bg-white p-8 sm:p-12 text-center border border-[#D7E0EB] shadow-xs">
            <div className="mx-auto size-16 rounded-full bg-[#E7EEF5] text-[#1E293B] flex items-center justify-center mb-5">
              <CheckCircle2 className="size-8" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1E293B]">
              Solicitud registrada con éxito
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#5A697D] leading-relaxed">
              Gracias <strong>{guestData.name}</strong>
              {guestData.residence ? ` (${guestData.residence})` : ""}. Registramos tu reserva para{" "}
              <strong>{selectedPropertyData?.name}</strong> del{" "}
              <strong>{formatDateDDMMAAAA(selectedCheckIn)}</strong> al{" "}
              <strong>{formatDateDDMMAAAA(selectedCheckOut)}</strong>.
            </p>

            {pricing && (
              <div className="mt-6 rounded-2xl bg-[#EFEFEF]/80 p-5 border border-[#D7E0EB] text-left space-y-2 text-sm">
                <div className="flex justify-between font-bold text-[#1E293B]">
                  <span>Seña (30%) para congelar tarifa:</span>
                  <span>${pricing.deposit.toLocaleString("es-AR")}</span>
                </div>
                <div className="flex justify-between text-xs text-[#5A697D]">
                  <span>Alias MercadoPago:</span>
                  <strong className="text-[#1E293B]">{brand.paymentAlias}</strong>
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(
                  `Hola! Acabo de registrar una reserva a nombre de ${guestData.name}${
                    guestData.residence ? ` (${guestData.residence})` : ""
                  } para el ${selectedPropertyData?.name} (${formatDateDDMMAAAA(selectedCheckIn)} al ${formatDateDDMMAAAA(selectedCheckOut)}). Adjunto comprobante de la seña.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-[#1E293B] hover:bg-[#0F172A] text-white px-6 py-3.5 text-sm font-semibold transition-all shadow-sm"
              >
                <Phone className="size-4" />
                <span>Enviar Comprobante por WhatsApp</span>
                <ArrowUpRight className="size-4" />
              </a>

              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-[#D7E0EB] bg-white hover:bg-[#E7EEF5] text-[#1E293B] px-6 py-3.5 text-sm font-semibold transition-colors"
              >
                <span>Volver al Inicio</span>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function ReservarPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh bg-[#EFEFEF] flex items-center justify-center text-sm font-semibold text-[#1E293B]">
          Cargando sistema de reservas...
        </div>
      }
    >
      <ReservarContent />
    </Suspense>
  );
}
