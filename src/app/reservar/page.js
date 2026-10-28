"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  properties,
  getStoredProperties,
  getStoredSiteSettings,
  buildWhatsAppUrl,
  trackAdsConversion,
  isDateRangeAvailable,
  calculateTotal,
  calculateStayPrice,
  formatDateDDMMAAAA,
} from "@/lib/data";
import { siteContent } from "@/lib/content";
import { createBooking, getBookings, getProperties, getSiteSettings } from "@/lib/supabase";
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
  const [siteSettings, setSiteSettings] = useState(getStoredSiteSettings);
  const [, setBookingsVersion] = useState(0);

  useEffect(() => {
    setPropertiesList(getStoredProperties());
    setSiteSettings(getStoredSiteSettings());

    getProperties()
      .then((res) => {
        if (res && res.length > 0) setPropertiesList(res);
      })
      .catch(() => {});
    getSiteSettings()
      .then((s) => {
        if (s) setSiteSettings(s);
      })
      .catch(() => {});
    getBookings()
      .then(() => {
        setBookingsVersion((v) => v + 1);
      })
      .catch(() => {});

    const handleSync = () => {
      setPropertiesList(getStoredProperties());
      setSiteSettings(getStoredSiteSettings());
      setBookingsVersion((v) => v + 1);
    };
    window.addEventListener("toninas_properties_changed", handleSync);
    window.addEventListener("toninas_settings_changed", handleSync);
    window.addEventListener("toninas_bookings_changed", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("toninas_properties_changed", handleSync);
      window.removeEventListener("toninas_settings_changed", handleSync);
      window.removeEventListener("toninas_bookings_changed", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const activeWhatsappNumber =
    siteSettings?.whatsappNumber || brand.whatsappNumber;
  const activePaymentAlias =
    siteSettings?.paymentAlias || brand.paymentAlias || "RENE.LASTONINAS";
  const activePaymentCvu =
    siteSettings?.paymentCvu || brand.paymentCvu || "0000003100082748753031";
  const activePaymentHolder =
    siteSettings?.paymentHolder || brand.paymentHolder || "Gregorio Rene Flores Barriga";
  const activeDepositPercentage =
    Number(siteSettings?.depositPercentage) ||
    Number(brand?.depositPercentage) ||
    50;

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
  const [copiedAlias, setCopiedAlias] = useState(false);
  const [copiedCvu, setCopiedCvu] = useState(false);
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
      ? calculateStayPrice(selectedPropertyData, selectedCheckIn, selectedCheckOut, activeDepositPercentage)
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
        payment_method: "Transferencia",
        source: "web",
      });
      trackAdsConversion("purchase_reservation", {
        value: total,
        currency: "ARS",
        unit: selectedPropertyData?.name || selectedProperty,
      });
    } catch (err) {
      console.warn("Error creando reserva:", err);
    } finally {
      setLoading(false);
      setStep(4);
    }
  };

  const copyAlias = () => {
    navigator.clipboard.writeText(activePaymentAlias);
    setCopiedAlias(true);
    setTimeout(() => setCopiedAlias(false), 2000);
  };

  const copyCvu = () => {
    navigator.clipboard.writeText(activePaymentCvu);
    setCopiedCvu(true);
    setTimeout(() => setCopiedCvu(false), 2000);
  };


  const steps = [
    { n: 1, label: "1. Fechas y Personas" },
    { n: 2, label: "2. Elegí tu Unidad" },
    { n: 3, label: `3. Datos y Seña (${activeDepositPercentage}%)` },
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
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.04]">
            Duplex Las Toninas
          </h1>
          <p className="mt-3 text-sm sm:text-base text-white/80">
            Congelá la tarifa abonando el {activeDepositPercentage}% de seña y el saldo al ingresar.
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
                  Fecha de Llegada (Check-in 14:00 hs)
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
                  Fecha de Salida (Check-out 10:00 hs)
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

            {/* Banner Destacado de Horarios de Check-in y Check-out */}
            <div className="rounded-[1.5rem] bg-[#1E293B] text-white p-4 sm:p-5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm border border-slate-700">
              <div className="flex items-center gap-3.5">
                <span className="size-11 rounded-2xl bg-white/10 flex items-center justify-center text-amber-300 shrink-0">
                  <Sparkles className="size-5" />
                </span>
                <div>
                  <span className="text-[11px] uppercase tracking-wider font-bold text-white/70 block">
                    Horarios Oficiales de Estadía
                  </span>
                  <p className="text-sm sm:text-base font-extrabold text-white mt-0.5">
                    Check-in: a partir de las 14:00 hs &nbsp;·&nbsp; Check-out: hasta las 10:00 hs
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 bg-emerald-950/70 border border-emerald-500/30 px-4 py-2 rounded-full">
                <Check className="size-3.5" />
                <span>Horarios confirmados</span>
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
                    selectedCheckOut,
                    activeDepositPercentage
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
                              <span>Seña para reservar ({calc.depositPercentage || activeDepositPercentage}%)</span>
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

        {/* STEP 3: DATOS DE CONTACTO (CON LUGAR DE RESIDENCIA) Y SEÑA */}
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
                  Método de pago de la seña ({activeDepositPercentage}%)
                </h2>
                <p className="mt-1 text-sm text-[#5A697D]">
                  Monto de seña a abonar:{" "}
                  <strong className="text-[#1E293B]">
                    ${pricing?.deposit.toLocaleString("es-AR")}
                  </strong>
                </p>

                {/* Método de pago único: Transferencia Bancaria Directa */}
                <div className="mt-5 flex items-center gap-3.5 rounded-2xl p-4 border border-[#D7E0EB] bg-[#E7EEF5]/70 text-[#1E293B]">
                  <div className="size-11 rounded-xl bg-white border border-[#D7E0EB] flex items-center justify-center shrink-0 text-[#1E293B] shadow-2xs">
                    <Building2 className="size-5.5 text-[#1E293B]" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#1E293B]">
                      Transferencia Bancaria
                    </div>
                    <div className="text-xs text-[#5A697D]">
                      Transferencia directa con Alias o CVU sin recargo
                    </div>
                  </div>
                </div>

                {/* Tarjeta de Datos de Transferencia e Identificación */}
                <div className="mt-4 rounded-2xl bg-[#EFEFEF]/80 p-5 sm:p-6 border border-[#D7E0EB] space-y-3">
                  {/* Titular */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white rounded-xl p-4 border border-[#D7E0EB]">
                    <div>
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-[#5A697D]">
                        Titular de la cuenta
                      </span>
                      <span className="text-base sm:text-lg font-bold text-[#1E293B] tracking-tight">
                        {activePaymentHolder}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#E7EEF5] text-[#1E293B] w-fit">
                      Cuenta Oficial
                    </span>
                  </div>

                  {/* Alias Oficial */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-xl p-4 border border-[#D7E0EB]">
                    <div>
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-[#5A697D]">
                        Alias Oficial
                      </span>
                      <span className="text-lg sm:text-xl font-bold font-mono text-[#1E293B] tracking-tight select-all">
                        {activePaymentAlias}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={copyAlias}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1E293B] hover:bg-[#0F172A] text-white px-4 py-2.5 text-xs font-semibold cursor-pointer transition-colors shadow-2xs"
                    >
                      {copiedAlias ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
                      <span>{copiedAlias ? "Alias Copiado" : "Copiar Alias"}</span>
                    </button>
                  </div>

                  {/* CVU Oficial */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-xl p-4 border border-[#D7E0EB]">
                    <div>
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-[#5A697D]">
                        CVU Oficial
                      </span>
                      <span className="text-sm sm:text-base font-bold font-mono text-[#1E293B] tracking-tight select-all">
                        {activePaymentCvu}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={copyCvu}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1E293B] hover:bg-[#0F172A] text-white px-4 py-2.5 text-xs font-semibold cursor-pointer transition-colors shadow-2xs"
                    >
                      {copiedCvu ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
                      <span>{copiedCvu ? "CVU Copiado" : "Copiar CVU"}</span>
                    </button>
                  </div>

                  <p className="pt-1 text-xs text-[#5A697D] leading-relaxed">
                    Al confirmar tu solicitud podrás enviarnos el comprobante de transferencia directamente por WhatsApp para dejar congelada tu unidad.
                  </p>
                </div>

                {/* Cartel de Aviso Destacado de Confirmación y 24hs */}
                <div className="mt-6 rounded-2xl bg-amber-50/90 border-2 border-amber-300 p-4 sm:p-5 text-amber-950 shadow-xs">
                  <div className="flex items-start gap-3">
                    <div className="size-8 rounded-xl bg-amber-200/90 flex items-center justify-center shrink-0 text-amber-900 mt-0.5">
                      <Sparkles className="size-4.5" />
                    </div>
                    <div className="text-xs sm:text-sm leading-relaxed">
                      <strong className="block font-bold text-amber-950 text-sm sm:text-base mb-1">
                        Aviso Importante sobre la Confirmación de tu Reserva:
                      </strong>
                      <p className="text-amber-900">
                        La reserva quedará <strong>definitivamente confirmada</strong> una vez recibido el comprobante de pago de la seña ({activeDepositPercentage}%).
                        Disponés de un plazo de <strong>24 horas</strong> para enviar el comprobante; cumplido ese tiempo sin acreditarse el pago, las fechas se liberarán y volverán a quedar <strong>disponibles automáticamente</strong> para otros huéspedes.
                      </p>
                    </div>
                  </div>
                </div>

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
                    <span>Seña a abonar ({pricing.depositPercentage || activeDepositPercentage}%)</span>
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
              <div className="mt-6 rounded-2xl bg-[#EFEFEF]/80 p-5 border border-[#D7E0EB] text-left space-y-2.5 text-sm">
                <div className="flex justify-between font-bold text-[#1E293B] pb-2 border-b border-[#D7E0EB]">
                  <span>Seña ({pricing.depositPercentage || activeDepositPercentage}%) para congelar tarifa:</span>
                  <span className="text-base">${pricing.deposit.toLocaleString("es-AR")}</span>
                </div>
                <div className="flex justify-between text-xs text-[#5A697D]">
                  <span>Titular de la cuenta:</span>
                  <strong className="text-[#1E293B]">{activePaymentHolder}</strong>
                </div>
                <div className="flex justify-between text-xs text-[#5A697D]">
                  <span>Alias Oficial de Pago:</span>
                  <strong className="text-[#1E293B] font-mono">{activePaymentAlias}</strong>
                </div>
                <div className="flex justify-between text-xs text-[#5A697D]">
                  <span>CVU Oficial:</span>
                  <strong className="text-[#1E293B] font-mono">{activePaymentCvu}</strong>
                </div>
              </div>
            )}

            {/* Resumen de Condiciones de Reserva */}
            <div className="mt-6 rounded-2xl bg-[#EFEFEF]/70 p-5 sm:p-6 border border-[#D7E0EB] text-left">
              <div className="flex items-center gap-2 mb-4 text-[#1E293B]">
                <ShieldCheck className="size-5 text-[#1E293B]" />
                <h3 className="text-base font-bold text-[#1E293B]">
                  Resumen de Condiciones de Reserva
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs leading-relaxed text-[#5A697D]">
                <div className="p-3 bg-white rounded-xl border border-[#D7E0EB]/70">
                  <strong className="block text-[#1E293B] font-bold mb-1">
                    🕒 Horarios Oficiales
                  </strong>
                  Check-in a partir de las <strong>14:00 hs</strong>. Check-out hasta las <strong>10:00 hs</strong> para permitir la preparación del complejo.
                </div>

                <div className="p-3 bg-white rounded-xl border border-[#D7E0EB]/70">
                  <strong className="block text-[#1E293B] font-bold mb-1">
                    ⏳ Confirmación y Plazo 24hs
                  </strong>
                  La reserva se confirma al enviar el comprobante de la seña ({pricing?.depositPercentage || activeDepositPercentage}%). Disponés de <strong>24 horas</strong> antes de que las fechas vuelvan a estar disponibles.
                </div>

                <div className="p-3 bg-white rounded-xl border border-[#D7E0EB]/70">
                  <strong className="block text-[#1E293B] font-bold mb-1">
                    💵 Saldo al Ingresar
                  </strong>
                  El saldo restante ({100 - (pricing?.depositPercentage || activeDepositPercentage)}%) se abona al momento del check-in al recibir la unidad.
                </div>

                <div className="p-3 bg-white rounded-xl border border-[#D7E0EB]/70">
                  <strong className="block text-[#1E293B] font-bold mb-1">
                    🚗 Estacionamiento
                  </strong>
                  Espacio para estacionar al frente en la puerta de cada dúplex (descubierto).
                </div>

                <div className="p-3 bg-white rounded-xl border border-[#D7E0EB]/70">
                  <strong className="block text-[#1E293B] font-bold mb-1">
                    🧺 Ropa Blanca y Servicios
                  </strong>
                  Cada huésped debe traer sus propias sábanas y toallas. Gas 1º Garrafa, Wi-Fi Incluidos.
                </div>

                <div className="p-3 bg-white rounded-xl border border-[#D7E0EB]/70">
                  <strong className="block text-[#1E293B] font-bold mb-1">
                    👨‍👩‍👧 Ambiente Familiar
                  </strong>
                  Complejo de descanso. Rogamos respetar las normas de convivencia y el silencio nocturno para disfrutar de unas vacaciones en paz.
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={buildWhatsAppUrl(
                  activeWhatsappNumber,
                  `Hola! Acabo de registrar una reserva desde la web a nombre de ${guestData.name}${
                    guestData.residence ? ` (de ${guestData.residence})` : ""
                  } para el ${selectedPropertyData?.name} del ${formatDateDDMMAAAA(
                    selectedCheckIn
                  )} al ${formatDateDDMMAAAA(selectedCheckOut)} (${selectedGuests} personas). Adjunto el comprobante de la seña.`
                )}
                onClick={() =>
                  trackAdsConversion("whatsapp_click", {
                    placement: "booking_step4_receipt",
                    property_id: selectedPropertyData?.id,
                  })
                }
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] text-white px-6 py-3.5 text-sm font-semibold transition-all shadow-sm"
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
