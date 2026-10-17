"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { properties, getStoredProperties } from "@/lib/data";
import { siteContent } from "@/lib/content";
import {
  Sparkles,
  ArrowUpRight,
  ChevronRight,
  ChevronLeft,
  MapPin,
  Calendar,
  Users,
  Layers,
  Car,
  Flame,
  Wifi,
  Utensils,
  Tv,
  Wind,
  Waves,
  Compass,
  Phone,
  Camera,
  X,
  Menu,
} from "lucide-react";

// ─── Rivr Concentric Ring Icon ──────────────────────────────────────────────
function RivrRingLogo({ className = "size-6" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.4" opacity="0.3" />
      <circle cx="12" cy="12" r="5.6" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
    </svg>
  );
}

// ─── 1. HERO SECTION RIVR (Framed Canvas + Video + Cutout Corner Dock) ──────
function RivrHeroSection() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(4);

  const today = new Date().toISOString().split("T")[0];
  const { brand, hero } = siteContent;

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (checkIn) params.append("checkIn", checkIn);
    if (checkOut) params.append("checkOut", checkOut);
    if (guests) params.append("guests", guests.toString());
    router.push(`/reservar?${params.toString()}`);
  };

  return (
    <section
      id="home"
      data-slot="hero"
      className="flex min-h-dvh w-full items-stretch justify-center bg-[#EFEFEF] p-3 md:p-5"
    >
      <div className="group relative flex min-h-[680px] lg:min-h-[760px] w-full max-w-[1536px] flex-col items-center justify-between overflow-hidden rounded-[1.5rem] md:rounded-[3rem] shadow-xs">
        {/* Background Video */}
        <video
          className="absolute inset-0 z-0 h-full w-full object-cover"
          src={hero.videoUrl}
          poster={hero.posterImage}
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
        />

        {/* Rivr Atmosphere Gradient Overlay */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[1] bg-gradient-to-b from-[#EFEFEF]/85 via-[#1E293B]/25 to-[#0F172A]/75"
        />

        {/* Top Rivr In-Canvas Navbar */}
        <nav
          data-slot="rivr-nav"
          className="relative z-20 flex w-full items-center justify-between gap-4 px-5 py-5 md:px-9"
        >
          <Link
            href="#home"
            className="flex items-center gap-2.5 text-[#1E293B]"
            aria-label={`${brand.fullName} Inicio`}
          >
            <img
              src={brand.logo}
              alt={`Logo ${brand.fullName}`}
              width={32}
              height={32}
              className="size-8 object-contain"
            />
            <span className="text-base sm:text-lg font-bold tracking-tight text-[#1E293B]">
              {brand.shortName}
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <ul className="hidden items-center gap-8 text-sm font-medium text-[#1E293B]/85 lg:flex">
            <li>
              <a
                href="#escolleras"
                className="flex items-center gap-1 transition-colors hover:text-[#1E293B]"
              >
                Playas y Escolleras
              </a>
            </li>
            <li>
              <a
                href="#unidades"
                className="group/item flex items-center gap-1 transition-colors hover:text-[#1E293B]"
              >
                <span>Unidades (Dúplex y Depto)</span>
                <ChevronRight className="size-4 transition-transform group-hover/item:translate-x-0.5" />
              </a>
            </li>
            <li>
              <a
                href="#galeria"
                className="transition-colors hover:text-[#1E293B]"
              >
                Galería
              </a>
            </li>
            <li>
              <a
                href="#ubicacion"
                className="transition-colors hover:text-[#1E293B]"
              >
                {brand.address}
              </a>
            </li>
          </ul>

          {/* Right CTA Button with Rivr Circular Pill */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/reservar"
              className="inline-flex shrink-0 items-center justify-center gap-2.5 rounded-xl bg-[#1E293B] text-white hover:bg-[#0F172A] px-4 py-2 text-sm font-medium transition-all shadow-sm"
            >
              <span>Reservar Online</span>
              <span className="flex size-7 items-center justify-center rounded-full bg-white/20">
                <ArrowUpRight className="size-4" />
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Abrir menú"
              className="lg:hidden flex size-10 items-center justify-center rounded-xl bg-white/80 backdrop-blur-md text-[#1E293B]"
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="relative z-30 w-[92%] mx-auto rounded-2xl bg-white/95 backdrop-blur-xl p-5 shadow-xl border border-slate-200 lg:hidden space-y-3">
            <a
              href="#escolleras"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-[#1E293B] border-b border-slate-100"
            >
              Playas Amplias y Escolleras
            </a>
            <a
              href="#unidades"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-[#1E293B] border-b border-slate-100"
            >
              Nuestras Unidades (4 Dúplex y 1 Depto)
            </a>
            <a
              href="#galeria"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-[#1E293B] border-b border-slate-100"
            >
              Galería de Fotos
            </a>
            <a
              href="#ubicacion"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-[#1E293B]"
            >
              Ubicación: {brand.address}
            </a>
          </div>
        )}

        {/* Center Hero Headline & Badge */}
        <div className="relative z-10 my-auto flex flex-col items-center justify-center px-6 py-10 text-center max-w-4xl mx-auto">
          <div
            data-slot="hero-badge"
            className="mx-auto mb-5 flex w-fit items-center gap-2 rounded-full border border-white/40 bg-white/75 px-4 py-2 backdrop-blur-md shadow-xs"
          >
            <Sparkles className="size-4 text-[#1E293B]" />
            <span className="text-xs sm:text-sm font-semibold text-[#1E293B]">
              {hero.topBadge}
            </span>
          </div>

          <h1
            data-slot="hero-title"
            className="mb-4 text-4xl leading-[1.04] font-semibold tracking-[-0.03em] text-white drop-shadow-sm sm:text-5xl md:text-6xl lg:text-[74px]"
          >
            {hero.title}
          </h1>

          <p className="max-w-2xl text-base leading-relaxed text-white/95 font-medium sm:text-lg drop-shadow-xs">
            {hero.subtitle}
          </p>
        </div>

        {/* Bottom Area: Left Frosted Stat Card + Right Cutout Booking Dock */}
        <div className="relative z-20 w-full flex flex-col lg:flex-row items-stretch lg:items-end justify-between gap-4 p-4 md:p-0">
          {/* Bottom-Left Frosted Glass Stat Card (Rivr Signature) */}
          <div
            data-slot="hero-stat"
            className="flex w-full lg:w-fit min-w-[220px] flex-col gap-3 rounded-[1.5rem] border border-white/35 bg-white/25 p-5 backdrop-blur-xl lg:ms-8 lg:mb-8 lg:rounded-[2rem]"
          >
            <div className="flex flex-col">
              <span className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
                {hero.statCard.value}
              </span>
              <span className="text-[11px] font-semibold tracking-wider text-white/85 uppercase">
                {hero.statCard.label}
              </span>
            </div>
            <a
              href="#escolleras"
              className="flex w-fit items-center gap-2 self-start rounded-full bg-white py-1.5 ps-2 pe-4 text-[#1E293B] transition-colors hover:bg-white/90 shadow-xs"
            >
              <span className="flex items-center justify-center rounded-full bg-[#1E293B]/10 p-1">
                <ArrowUpRight className="size-4 text-[#1E293B]" />
              </span>
              <span className="text-xs sm:text-sm font-semibold">
                {hero.statCard.buttonText}
              </span>
            </a>
          </div>

          {/* Bottom-Right Cutout Dock with Interactive Booking Search */}
          <div
            data-slot="hero-docs"
            className="relative flex w-full lg:w-auto items-center rounded-[1.5rem] lg:rounded-none lg:rounded-ss-[3rem] bg-[#EFEFEF] p-4 sm:p-5 md:p-6 md:ps-10 md:pt-7"
          >
            {/* Rivr Inverted Corner Cutout SVG Masks (Desktop) */}
            <div className="hidden lg:block pointer-events-none absolute end-0 -top-[3rem] size-[3rem] text-[#EFEFEF]">
              <svg width="100%" height="100%" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M56 56V0C56 30.9279 30.9279 56 0 56H56Z" fill="currentColor" />
              </svg>
            </div>
            <div className="hidden lg:block pointer-events-none absolute -start-[3rem] bottom-0 size-[3rem] text-[#EFEFEF]">
              <svg width="100%" height="100%" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M56 56H0C30.9279 56 56 30.9279 56 0V56Z" fill="currentColor" />
              </svg>
            </div>

            {/* Interactive Booking Bar */}
            <form
              onSubmit={handleBookingSubmit}
              action="/reservar"
              method="GET"
              className="w-full grid grid-cols-1 sm:grid-cols-2 lg:flex lg:items-end gap-3"
            >
              {/* Llegada */}
              <div className="bg-white rounded-2xl px-3.5 py-2.5 border border-[#D7E0EB]">
                <label
                  htmlFor="hero-checkin"
                  className="block text-[10px] font-bold uppercase tracking-wider text-[#5A697D] mb-0.5"
                >
                  {hero.searchBar.checkInLabel}
                </label>
                <div className="flex items-center gap-2">
                  <Calendar className="size-4 text-[#1E293B] shrink-0" />
                  <input
                    id="hero-checkin"
                    name="checkIn"
                    type="date"
                    min={today}
                    value={checkIn}
                    onChange={(e) => {
                      setCheckIn(e.target.value);
                      if (checkOut && e.target.value >= checkOut) setCheckOut("");
                    }}
                    required
                    className="bg-transparent text-xs sm:text-sm font-semibold text-[#1E293B] outline-none cursor-pointer w-full"
                  />
                </div>
              </div>

              {/* Salida */}
              <div className="bg-white rounded-2xl px-3.5 py-2.5 border border-[#D7E0EB]">
                <label
                  htmlFor="hero-checkout"
                  className="block text-[10px] font-bold uppercase tracking-wider text-[#5A697D] mb-0.5"
                >
                  {hero.searchBar.checkOutLabel}
                </label>
                <div className="flex items-center gap-2">
                  <Calendar className="size-4 text-[#1E293B] shrink-0" />
                  <input
                    id="hero-checkout"
                    name="checkOut"
                    type="date"
                    min={checkIn || today}
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    required
                    className="bg-transparent text-xs sm:text-sm font-semibold text-[#1E293B] outline-none cursor-pointer w-full"
                  />
                </div>
              </div>

              {/* Huéspedes */}
              <div className="bg-white rounded-2xl px-3.5 py-2.5 border border-[#D7E0EB] flex items-center justify-between gap-3">
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-[#5A697D] mb-0.5">
                    {hero.searchBar.guestsLabel}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Users className="size-4 text-[#1E293B]" />
                    <span className="text-xs sm:text-sm font-bold text-[#1E293B]">
                      {guests} pers.
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                    disabled={guests <= 1}
                    aria-label="Menos personas"
                    className="size-6 rounded-lg bg-[#E7EEF5] text-[#1E293B] font-bold text-xs flex items-center justify-center hover:bg-[#D7E0EB] disabled:opacity-30 cursor-pointer"
                  >
                    −
                  </button>
                  <button
                    type="button"
                    onClick={() => setGuests(Math.min(6, guests + 1))}
                    disabled={guests >= 6}
                    aria-label="Más personas"
                    className="size-6 rounded-lg bg-[#E7EEF5] text-[#1E293B] font-bold text-xs flex items-center justify-center hover:bg-[#D7E0EB] disabled:opacity-30 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="h-[54px] px-5 rounded-2xl bg-[#1E293B] hover:bg-[#0F172A] text-white text-sm font-semibold flex items-center justify-center gap-2.5 transition-all cursor-pointer shrink-0 shadow-sm"
              >
                <span>{hero.searchBar.submitButton}</span>
                <span className="flex size-7 items-center justify-center rounded-full bg-white/20">
                  <ArrowUpRight className="size-4" />
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 2. BANDA DE MÉTRICAS RIVR ──────────────────────────────────────────────
function RivrMetricsSection() {
  const { metrics } = siteContent;

  return (
    <section
      data-slot="metrics"
      className="mx-auto w-full max-w-[1536px] px-3 py-6 md:px-5 md:py-10"
    >
      <div className="rounded-[1.5rem] border border-[#1E293B]/[0.07] bg-white/60 p-6 md:rounded-[3rem] md:p-14">
        <dl className="grid grid-cols-2 md:grid-cols-4">
          {metrics.map((stat, idx) => (
            <div
              key={stat.label}
              className={`flex flex-col gap-2 p-5 md:p-6 ${
                idx === 1 ? "border-s border-[#1E293B]/10" : ""
              } ${
                idx === 2
                  ? "border-t border-[#1E293B]/10 md:border-s md:border-t-0"
                  : ""
              } ${
                idx === 3
                  ? "border-s border-t border-[#1E293B]/10 md:border-t-0"
                  : ""
              }`}
            >
              <dt className="text-3xl font-semibold tracking-tight text-[#1E293B] tabular-nums sm:text-4xl md:text-5xl">
                {stat.value}
              </dt>
              <dd className="text-xs sm:text-sm font-medium text-[#5A697D]">
                {stat.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

// ─── 3. BENTO GRID DE CARACTERÍSTICAS Y PLAYAS CON ESCOLLERAS ───────────────
function RivrFeaturesBentoSection() {
  const { bento } = siteContent;
  const pillIcons = [Wifi, Wind, Tv, Utensils];

  return (
    <section
      id="escolleras"
      data-slot="features"
      className="mx-auto w-full max-w-[1536px] px-3 py-6 md:px-5 md:py-12"
    >
      {/* Section Header */}
      <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between md:mb-12">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#5A697D] mb-2">
            <MapPin className="size-3.5 text-[#1E293B]" />
            {bento.eyebrow}
          </span>
          <h2 className="max-w-2xl text-3xl leading-tight font-semibold tracking-tight text-[#1E293B] sm:text-4xl md:text-5xl">
            {bento.sectionTitle}
          </h2>
        </div>

        <Link
          href="/reservar"
          className="inline-flex items-center justify-center gap-2.5 rounded-xl border border-[#D7E0EB] bg-white px-4 py-2.5 text-sm font-semibold text-[#1E293B] shadow-2xs hover:bg-[#E7EEF5] transition-all shrink-0 w-fit"
        >
          <span>{bento.ctaButton}</span>
          <span className="flex size-7 items-center justify-center rounded-full bg-[#1E293B]/10">
            <ArrowUpRight className="size-4" />
          </span>
        </Link>
      </div>

      {/* Asymmetrical Rivr Bento Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-2 md:gap-5">
        {/* Card 1: Dominant Vertical (2 Rows) — Playas Amplias con Escolleras */}
        <div className="group relative overflow-hidden rounded-[1.5rem] bg-white p-7 transition-shadow hover:shadow-[0_12px_35px_rgb(0,0,0,0.06)] md:rounded-[2rem] flex min-h-[30rem] flex-col justify-between md:row-span-2 md:p-9">
          <Waves
            aria-hidden="true"
            className="pointer-events-none absolute -end-10 -bottom-10 size-72 text-[#1E293B] opacity-[0.03] transition-transform duration-500 group-hover:scale-110"
          />

          <div>
            <div className="flex items-center justify-between gap-2 mb-5">
              <span className="relative flex size-12 items-center justify-center rounded-2xl bg-[#E7EEF5] text-[#1E293B]">
                <Waves className="size-6" />
              </span>
              <span className="rounded-full bg-[#E7EEF5] px-3.5 py-1 text-xs font-bold text-[#1E293B]">
                {bento.beachCard.badge}
              </span>
            </div>

            {/* Real Aerial Image of the Escolleras & Wide Beach */}
            <div className="relative h-56 sm:h-64 w-full rounded-[1.25rem] overflow-hidden mb-6 border border-[#D7E0EB]/60">
              <img
                src={bento.beachCard.image}
                alt={bento.beachCard.title}
                fetchPriority="high"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute bottom-3 left-3 rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-[#1E293B] shadow-xs">
                {bento.beachCard.imageCaption}
              </div>
            </div>
          </div>

          <div className="relative">
            <h3 className="text-2xl leading-snug font-semibold text-[#1E293B] md:text-3xl">
              {bento.beachCard.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[#5A697D]">
              {bento.beachCard.description}
            </p>
          </div>
        </div>

        {/* Card 2: Wide Horizontal (2 Columns) — Equipamiento Completo */}
        <div
          id="comodidades"
          className="group relative overflow-hidden rounded-[1.5rem] bg-white p-7 transition-shadow hover:shadow-[0_12px_35px_rgb(0,0,0,0.06)] md:rounded-[2rem] flex min-h-[14rem] flex-col justify-between md:col-span-2 md:p-9"
        >
          <Layers
            aria-hidden="true"
            className="pointer-events-none absolute -end-6 -bottom-8 size-60 text-[#1E293B] opacity-[0.03] transition-transform duration-500 group-hover:scale-110"
          />

          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="relative flex size-12 items-center justify-center rounded-2xl bg-[#E7EEF5] text-[#1E293B]">
              <Layers className="size-6" />
            </span>

            <div className="flex flex-wrap gap-2">
              {bento.equipmentCard.pills.map((label, idx) => {
                const Icon = pillIcons[idx % pillIcons.length];
                return (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#E7EEF5]/80 px-3 py-1 text-xs font-semibold text-[#1E293B]"
                  >
                    <Icon className="size-3.5" />
                    {label}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="relative mt-6">
            <h3 className="text-xl font-semibold text-[#1E293B] md:text-2xl">
              {bento.equipmentCard.title}
            </h3>
            <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-[#5A697D]">
              {bento.equipmentCard.description}
            </p>
          </div>
        </div>

        {/* Card 3: Bottom Middle — Cochera y Parrilla Individual */}
        <div className="group relative overflow-hidden rounded-[1.5rem] bg-white p-7 transition-shadow hover:shadow-[0_12px_35px_rgb(0,0,0,0.06)] md:rounded-[2rem] flex flex-col justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-[#E7EEF5] text-[#1E293B]">
              <Car className="size-6" />
            </span>
            <span className="flex size-12 items-center justify-center rounded-2xl bg-[#E7EEF5] text-[#1E293B]">
              <Flame className="size-6" />
            </span>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold text-[#1E293B]">
              {bento.grillCard.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#5A697D]">
              {bento.grillCard.description}
            </p>
            <a
              href="#unidades"
              className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-[#D7E0EB] px-4 py-2 text-xs font-semibold text-[#1E293B] transition-colors hover:bg-[#E7EEF5]"
            >
              <span>{bento.grillCard.buttonText}</span>
              <ArrowUpRight className="size-4" />
            </a>
          </div>
        </div>

        {/* Card 4: Bottom Right Interactive Action Card */}
        <Link
          href="/reservar"
          className="group relative overflow-hidden rounded-[1.5rem] bg-white p-7 transition-shadow hover:shadow-[0_12px_35px_rgb(0,0,0,0.06)] md:rounded-[2rem] flex flex-col items-center justify-center gap-5 text-center"
        >
          <span className="flex size-16 items-center justify-center rounded-full bg-[#E7EEF5] text-[#1E293B] transition-transform duration-300 group-hover:scale-110">
            <ArrowUpRight className="size-7" />
          </span>
          <div>
            <h3 className="text-xl font-semibold text-[#1E293B]">
              {bento.bookingCard.title}
            </h3>
            <p className="mt-1.5 text-sm text-[#5A697D] max-w-xs">
              {bento.bookingCard.description}
            </p>
          </div>
        </Link>
      </div>
    </section>
  );
}

// ─── 4. CATÁLOGO DE UNIDADES (4 Dúplex y 1 Departamento) ────────────────────
function RivrUnitsCatalogSection({ onOpenGallery }) {
  const [filter, setFilter] = useState("todos");
  const [items, setItems] = useState(properties);
  const { brand, unitsSection } = siteContent;

  useEffect(() => {
    setItems(getStoredProperties());
    const handleSync = () => setItems(getStoredProperties());
    window.addEventListener("toninas_properties_changed", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("toninas_properties_changed", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const filtered =
    filter === "todos"
      ? items
      : items.filter((p) => p.type === filter);

  return (
    <section
      id="unidades"
      className="mx-auto w-full max-w-[1536px] px-3 py-6 md:px-5 md:py-12"
    >
      <div className="rounded-[1.5rem] md:rounded-[3rem] bg-white p-6 sm:p-8 md:p-14 border border-[#1E293B]/[0.06]">
        {/* Header & Filter Pills */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#5A697D]">
              {unitsSection.eyebrow}
            </span>
            <h2 className="mt-1 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#1E293B]">
              {unitsSection.title}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "todos", label: unitsSection.filters.all },
              { id: "duplex", label: unitsSection.filters.duplex },
              { id: "departamento", label: unitsSection.filters.depto },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  filter === tab.id
                    ? "bg-[#1E293B] text-white"
                    : "bg-[#E7EEF5] text-[#1E293B] hover:bg-[#D7E0EB]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Units Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((prop) => {
            const currentPrice = Number(prop.price_per_night || prop.pricePerNight || 45000);
            const hasSeasons = (prop.seasonalRates || prop.seasonal_rates || []).length > 0;
            return (
              <div
                key={prop.id}
                className="group rounded-[1.75rem] bg-[#EFEFEF]/60 p-4 border border-[#D7E0EB]/80 hover:bg-white hover:shadow-[0_12px_35px_rgb(0,0,0,0.06)] transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Image */}
                  <div
                    onClick={() => onOpenGallery(prop)}
                    className="relative h-60 w-full rounded-[1.25rem] overflow-hidden mb-4 cursor-pointer bg-slate-200"
                  >
                    <img
                      src={prop.images[0]}
                      alt={prop.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3 rounded-full bg-white/95 backdrop-blur-md px-3.5 py-1 text-xs font-bold text-[#1E293B] shadow-xs">
                      ${currentPrice.toLocaleString("es-AR")} / noche
                    </div>
                    {hasSeasons && (
                      <div className="absolute top-3 left-3 rounded-full bg-amber-500/90 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-white flex items-center gap-1 shadow-xs">
                        <Sparkles className="size-3" />
                        <span>Temporadas</span>
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3 rounded-full bg-[#1E293B]/80 backdrop-blur-md px-3 py-1 text-[11px] font-semibold text-white">
                      Ver {prop.images.length} fotos reales
                    </div>
                  </div>

                {/* Info */}
                <div className="px-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xl font-semibold text-[#1E293B]">
                      {prop.name}
                    </h3>
                    <span className="text-xs font-bold text-[#1E293B] bg-[#E7EEF5] px-2.5 py-1 rounded-full">
                      Hasta {prop.capacity} pers.
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-medium text-[#5A697D] mt-1.5">
                    <MapPin className="size-3.5 text-[#1E293B] shrink-0" />
                    <span>
                      {brand.address}, {brand.city} · A {brand.distanceToSea} del mar
                    </span>
                  </div>

                  <p className="mt-3 text-xs sm:text-sm text-[#5A697D] leading-relaxed">
                    {prop.description}
                  </p>

                  {/* Amenity Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {prop.amenities.map((am) => (
                      <span
                        key={am}
                        className="rounded-full bg-white border border-[#D7E0EB] px-2.5 py-0.5 text-[11px] font-medium text-[#1E293B]"
                      >
                        {am}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-6 pt-4 border-t border-[#D7E0EB]/80 flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => onOpenGallery(prop)}
                  className="flex-1 py-2.5 px-3 rounded-xl border border-[#D7E0EB] bg-white text-xs font-semibold text-[#1E293B] hover:bg-[#E7EEF5] transition-colors cursor-pointer"
                >
                  Galería ({prop.images.length})
                </button>
                <Link
                  href={`/reservar?property=${prop.id}`}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#1E293B] hover:bg-[#0F172A] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  <span>Reservar</span>
                  <span className="flex size-5 items-center justify-center rounded-full bg-white/20">
                    <ArrowUpRight className="size-3" />
                  </span>
                </Link>
              </div>
            </div>
          );
        })}
        </div>
      </div>
    </section>
  );
}

// ─── 5. GALERÍA DESTACADA EN PORTADA (Editable desde src/lib/content.js) ────
function RivrGallerySection() {
  const { gallerySection } = siteContent;
  if (!gallerySection?.images?.length) return null;

  return (
    <section
      id="galeria"
      className="mx-auto w-full max-w-[1536px] px-3 py-6 md:px-5 md:py-10"
    >
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#5A697D] mb-2">
            <Camera className="size-3.5 text-[#1E293B]" />
            {gallerySection.eyebrow}
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1E293B]">
            {gallerySection.title}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {gallerySection.images.map((item, idx) => (
          <div
            key={`${item.src}-${idx}`}
            className="group relative h-72 rounded-[1.75rem] overflow-hidden bg-white border border-[#D7E0EB]/80 shadow-xs"
          >
            <img
              src={item.src}
              alt={item.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/85 via-[#0F172A]/20 to-transparent flex flex-col justify-end p-5">
              <h3 className="text-base font-semibold text-white leading-snug">
                {item.title}
              </h3>
              {item.subtitle && (
                <p className="mt-1 text-xs text-white/80 leading-relaxed">
                  {item.subtitle}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── 6. SECCIÓN DE UBICACIÓN Y DISTANCIAS (Calle 12 Nº 495) ─────────────────
function RivrLocationSection() {
  const { brand, locationSection } = siteContent;

  return (
    <section
      id="ubicacion"
      className="mx-auto w-full max-w-[1536px] px-3 py-6 md:px-5 md:py-10"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Location Highlight Card */}
        <div className="lg:col-span-5 rounded-[1.5rem] md:rounded-[2.5rem] bg-[#1E293B] text-white p-8 md:p-10 flex flex-col justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1 text-xs font-semibold text-white/90 mb-4">
              <Compass className="size-3.5" />
              {locationSection.badge}
            </span>
            <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight leading-snug">
              {locationSection.title}
            </h3>
            <p className="mt-3 text-sm text-white/80 leading-relaxed">
              {locationSection.description}
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs text-white/60 uppercase tracking-wider">Región</p>
              <p className="text-sm font-semibold">{brand.region}</p>
            </div>
            <a
              href={brand.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white py-1.5 ps-4 pe-1.5 text-xs font-semibold text-[#1E293B] hover:bg-white/90 transition-colors"
            >
              <span>Abrir en Google Maps</span>
              <span className="flex size-6 items-center justify-center rounded-full bg-[#1E293B]/10">
                <ArrowUpRight className="size-3.5" />
              </span>
            </a>
          </div>
        </div>

        {/* 4 Distance Cards */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {locationSection.distances.map((item) => (
            <div
              key={item.place}
              className="rounded-[1.5rem] md:rounded-[2rem] bg-white p-6 border border-[#D7E0EB]/60 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5A697D]">
                  {item.place}
                </span>
                <span className="flex size-8 items-center justify-center rounded-full bg-[#E7EEF5] text-[#1E293B]">
                  <MapPin className="size-4" />
                </span>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-semibold text-[#1E293B]">{item.dist}</p>
                <p className="mt-1 text-xs text-[#5A697D] leading-relaxed">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 7. BANNER DE CIERRE CTA RIVR ───────────────────────────────────────────
function RivrCtaBannerSection() {
  const { brand, hero, bento, ctaBanner } = siteContent;
  const waUrl = `https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(
    brand.whatsappDefaultMessage
  )}`;

  return (
    <section
      data-slot="cta"
      className="flex w-full items-center justify-center bg-[#EFEFEF] p-3 md:p-5"
    >
      <div className="relative flex min-h-[520px] w-full max-w-[1536px] items-center justify-center overflow-hidden rounded-[1.5rem] p-8 md:min-h-[640px] md:rounded-[3rem]">
        <video
          className="absolute inset-0 z-0 h-full w-full object-cover"
          src={hero.videoUrl}
          poster={bento.beachCard.image}
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[1] bg-gradient-to-t from-[#1E293B]/85 via-[#1E293B]/55 to-[#1E293B]/65"
        />

        <div className="relative z-10 flex max-w-2xl flex-col items-center gap-7 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
            <Sparkles className="size-3.5" />
            {ctaBanner.badge}
          </span>

          <h2 className="text-4xl leading-[1.05] font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
            {ctaBanner.title}
          </h2>

          <p className="text-sm sm:text-base text-white/85 max-w-lg leading-relaxed">
            {ctaBanner.subtitle}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/reservar"
              className="group inline-flex items-center gap-2.5 rounded-full bg-white py-2 ps-5 pe-2 text-sm font-semibold text-[#1E293B] transition-colors hover:bg-white/90 shadow-md"
            >
              <span>{ctaBanner.primaryButton}</span>
              <span className="flex size-7 items-center justify-center rounded-full bg-[#1E293B]/10">
                <ArrowUpRight className="size-4" />
              </span>
            </Link>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-2.5 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-white/20"
            >
              <Phone className="size-4" />
              <span>{ctaBanner.secondaryButton}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 8. FOOTER RIVR ─────────────────────────────────────────────────────────
function RivrFooter() {
  const { brand } = siteContent;

  return (
    <footer
      data-slot="footer"
      className="border-t border-[#D7E0EB] bg-[#EFEFEF] text-[#1E293B]"
    >
      <div className="mx-auto w-full max-w-[1536px] px-6 py-14 md:px-10 md:py-18">
        <div className="flex flex-col gap-12 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <Link
              href="#home"
              className="flex w-fit items-center gap-2.5 text-[#1E293B]"
            >
              <RivrRingLogo className="size-6 text-[#1E293B]" />
              <span className="text-lg font-bold tracking-tight uppercase">
                {brand.fullName}
              </span>
            </Link>
            <p className="mt-4 text-sm text-[#5A697D] leading-relaxed">
              4 Dúplex y 1 Departamento equipados en {brand.address}, {brand.city}. A {brand.distanceToSea} de las mejores playas amplias con escolleras.
            </p>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:gap-16"
          >
            <div>
              <h3 className="text-sm font-semibold text-[#1E293B]">Unidades</h3>
              <ul className="mt-4 flex flex-col gap-3">
                <li>
                  <a href="#unidades" className="text-sm text-[#5A697D] hover:text-[#1E293B]">
                    Dúplex 1 al 4 (6 pers.)
                  </a>
                </li>
                <li>
                  <a href="#unidades" className="text-sm text-[#5A697D] hover:text-[#1E293B]">
                    Departamento 1° Piso (5 pers.)
                  </a>
                </li>
                <li>
                  <a href="#escolleras" className="text-sm text-[#5A697D] hover:text-[#1E293B]">
                    Playas y Escolleras
                  </a>
                </li>
                <li>
                  <a href="#galeria" className="text-sm text-[#5A697D] hover:text-[#1E293B]">
                    Galería de Fotos
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[#1E293B]">Plataforma</h3>
              <ul className="mt-4 flex flex-col gap-3">
                <li>
                  <Link href="/reservar" className="text-sm text-[#5A697D] hover:text-[#1E293B]">
                    Reservar Online
                  </Link>
                </li>
                <li>
                  <Link href="/cuidador" className="text-sm text-[#5A697D] hover:text-[#1E293B]">
                    Panel Cuidador
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="text-sm text-[#5A697D] hover:text-[#1E293B]">
                    Panel Administración
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[#1E293B]">Ubicación</h3>
              <ul className="mt-4 flex flex-col gap-3 text-sm text-[#5A697D]">
                <li>{brand.address}</li>
                <li>{brand.city}, Buenos Aires</li>
                <li>A {brand.distanceToSea} del mar</li>
                <li>
                  <a
                    href={`https://wa.me/${brand.whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1E293B] font-semibold hover:underline"
                  >
                    Contacto WhatsApp ↗
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="mt-12 border-t border-[#D7E0EB] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#5A697D]">
            © {new Date().getFullYear()} {brand.fullName} · {brand.address}, Costa Atlántica Argentina.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Lightbox Modal for Property Photos ─────────────────────────────────────
function PhotoGalleryModal({ property, onClose }) {
  const [index, setIndex] = useState(0);
  if (!property) return null;

  const images = property.images || [];
  const prev = () => setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A]/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative bg-white rounded-[2rem] max-w-3xl w-full overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-[#1E293B]">{property.name}</h3>
            <p className="text-xs text-[#5A697D]">
              Foto {index + 1} de {images.length} · {siteContent.brand.address}, {siteContent.brand.city}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar galería"
            className="p-2 rounded-full hover:bg-slate-100 text-[#5A697D] cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="relative h-[340px] sm:h-[440px] bg-slate-950 flex items-center justify-center">
          <img
            src={images[index]}
            alt={`${property.name} foto ${index + 1}`}
            fetchPriority="low"
            className="w-full h-full object-contain"
          />
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={prev}
                aria-label="Foto anterior"
                className="absolute left-3 top-1/2 -translate-y-1/2 size-10 rounded-full bg-white/90 text-[#1E293B] flex items-center justify-center shadow-md hover:bg-white cursor-pointer"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Foto siguiente"
                className="absolute right-3 top-1/2 -translate-y-1/2 size-10 rounded-full bg-white/90 text-[#1E293B] flex items-center justify-center shadow-md hover:bg-white cursor-pointer"
              >
                <ChevronRight className="size-5" />
              </button>
            </>
          )}
        </div>

        <div className="p-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#EFEFEF]">
          <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1">
            {images.map((img, i) => (
              <button
                key={img}
                type="button"
                onClick={() => setIndex(i)}
                className={`h-12 w-16 rounded-lg overflow-hidden border-2 shrink-0 cursor-pointer transition-all ${
                  i === index ? "border-[#1E293B] scale-105" : "border-transparent opacity-60"
                }`}
              >
                <img
                  src={img}
                  alt=""
                  fetchPriority="low"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          <Link
            href={`/reservar?property=${property.id}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#1E293B] hover:bg-[#0F172A] px-5 py-2.5 text-xs font-semibold text-white shrink-0"
          >
            <span>Reservar {property.name}</span>
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Main Rivr Landing Page ─────────────────────────────────────────────────
export default function HomePage() {
  const [galleryProperty, setGalleryProperty] = useState(null);

  return (
    <div className="rivr relative min-h-svh bg-[#EFEFEF] text-[#1E293B] antialiased">
      <RivrHeroSection />
      <RivrMetricsSection />
      <RivrFeaturesBentoSection />
      <RivrUnitsCatalogSection onOpenGallery={(prop) => setGalleryProperty(prop)} />
      <RivrGallerySection />
      <RivrLocationSection />
      <RivrCtaBannerSection />
      <RivrFooter />

      {galleryProperty && (
        <PhotoGalleryModal
          property={galleryProperty}
          onClose={() => setGalleryProperty(null)}
        />
      )}
    </div>
  );
}
