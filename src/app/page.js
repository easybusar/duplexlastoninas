"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  properties,
  getStoredProperties,
  getStoredSiteSettings,
  buildWhatsAppUrl,
  trackAdsConversion,
  sanitizeAmenities,
} from "@/lib/data";
import { getProperties, getSiteSettings } from "@/lib/supabase";
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
  Refrigerator,
  Handshake,
  Waves,
  Compass,
  Phone,
  Camera,
  X,
  Menu,
  ShieldCheck,
  Play,
} from "lucide-react";

// ─── Official WhatsApp Logo SVG ─────────────────────────────────────────────
function WhatsAppIcon({ className = "size-6" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12.031 2c-5.516 0-9.999 4.486-9.999 10.003 0 1.766.461 3.49 1.337 5.01L2 22l5.118-1.341c1.474.805 3.136 1.23 4.913 1.23h.004c5.515 0 9.998-4.486 9.998-10.002 0-2.672-1.04-5.185-2.928-7.074C17.216 3.041 14.703 2 12.031 2zm5.829 14.294c-.246.693-1.432 1.326-1.997 1.411-.513.076-1.183.109-1.91-.121-.441-.14-1.007-.327-1.732-.641-3.047-1.316-5.037-4.387-5.189-4.59-.152-.203-1.24-1.649-1.24-3.146 0-1.497.784-2.232 1.063-2.537.279-.305.608-.381.811-.381.203 0 .406.002.583.011.187.009.438-.071.685.523.254.609.863 2.106.939 2.258.076.152.127.33.025.533-.101.203-.152.33-.305.507-.152.178-.32.398-.457.533-.152.152-.311.317-.133.622.178.305.789 1.302 1.694 2.109 1.164 1.038 2.145 1.36 2.45 1.512.305.152.482.127.66-.076.178-.203.761-.888.964-1.193.203-.305.406-.254.685-.152.279.101 1.777.838 2.081.99.305.152.508.228.584.355.076.127.076.736-.17 1.429z" />
    </svg>
  );
}

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
function RivrHeroSection({ heroRef }) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(4);

  const today = new Date().toISOString().split("T")[0];
  const { brand, navigation, hero } = siteContent;

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    trackAdsConversion("search_availability", {
      check_in: checkIn,
      check_out: checkOut,
      guests,
    });
    const params = new URLSearchParams();
    if (checkIn) params.append("checkIn", checkIn);
    if (checkOut) params.append("checkOut", checkOut);
    if (guests) params.append("guests", guests.toString());
    router.push(`/reservar?${params.toString()}`);
  };

  return (
    <section
      id="home"
      ref={heroRef}
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
          className="absolute inset-0 z-[1] bg-gradient-to-b from-[#EFEFEF]/85 via-[#0F172A]/40 to-[#0F172A]/80"
        />

        {/* Top Rivr In-Canvas Navbar */}
        <nav
          data-slot="rivr-nav"
          aria-label="Navegación Principal"
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
            <span className="text-base sm:text-lg font-extrabold tracking-tight text-[#1E293B]">
              {brand.shortName}
            </span>
          </Link>

          {/* Desktop Navigation Links: Lugar | Alojamiento | Galería | Ubicación */}
          <ul className="hidden items-center gap-9 text-sm font-bold text-[#1E293B]/90 lg:flex">
            <li>
              <a
                href="#escolleras"
                className="flex items-center gap-1 transition-colors hover:text-[#0F172A]"
              >
                {navigation?.lugar || "Lugar"}
              </a>
            </li>
            <li>
              <a
                href="#unidades"
                className="group/item flex items-center gap-1 transition-colors hover:text-[#0F172A]"
              >
                <span>{navigation?.alojamiento || "Alojamiento"}</span>
                <ChevronRight className="size-4 transition-transform group-hover/item:translate-x-0.5" />
              </a>
            </li>
            <li>
              <a
                href="#galeria"
                className="transition-colors hover:text-[#0F172A]"
              >
                {navigation?.galeria || "Galería"}
              </a>
            </li>
            <li>
              <a
                href="#ubicacion"
                className="transition-colors hover:text-[#0F172A]"
              >
                {navigation?.ubicacion || "Ubicación"}
              </a>
            </li>
          </ul>

          {/* Right CTA Button with Rivr Circular Pill */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/reservar"
              onClick={() => trackAdsConversion("click_reservar_nav")}
              className="inline-flex shrink-0 items-center justify-center gap-2.5 rounded-xl bg-[#1E293B] text-white hover:bg-[#0F172A] px-4 py-2 text-sm font-semibold transition-all shadow-sm"
            >
              <span>{navigation?.ctaButton || "Reservar Online"}</span>
              <span className="flex size-7 items-center justify-center rounded-full bg-white/20">
                <ArrowUpRight className="size-4" />
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Abrir menú"
              className="lg:hidden flex size-10 items-center justify-center rounded-xl bg-white/85 backdrop-blur-md text-[#1E293B]"
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
              className="block py-2 text-sm font-bold text-[#1E293B] border-b border-slate-100"
            >
              {navigation?.lugar || "Lugar"}
            </a>
            <a
              href="#unidades"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-bold text-[#1E293B] border-b border-slate-100"
            >
              {navigation?.alojamiento || "Alojamiento"}
            </a>
            <a
              href="#galeria"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-bold text-[#1E293B] border-b border-slate-100"
            >
              {navigation?.galeria || "Galería"}
            </a>
            <a
              href="#ubicacion"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-bold text-[#1E293B]"
            >
              {navigation?.ubicacion || "Ubicación"}
            </a>
          </div>
        )}

        {/* Center Hero Headline & Persuasive SEO Description (No top pill) */}
        <div className="relative z-10 my-auto flex flex-col items-center justify-center px-5 py-10 text-center max-w-5xl mx-auto">
          <h1
            data-slot="hero-title"
            className="mb-5 text-[clamp(2.35rem,1.35rem+4.5vw,5.25rem)] leading-[1.03] font-extrabold tracking-[-0.035em] text-white text-balance drop-shadow-[0_4px_24px_rgba(15,23,42,0.5)]"
          >
            {hero.title}
          </h1>

          <p className="max-w-[64ch] text-[clamp(1rem,0.92rem+0.45vw,1.25rem)] leading-[1.58] text-white/95 font-semibold text-pretty drop-shadow-[0_2px_12px_rgba(15,23,42,0.45)]">
            Tu mejor opción de <strong className="font-extrabold text-white underline decoration-white/40 underline-offset-4">alquiler de temporada</strong> a 400 metros del mar.{" "}
            <strong className="font-extrabold text-white">Alquiler de dúplex</strong> y departamento totalmente equipados, parrilla propia y espacio para estacionar al frente en la mejor zona de playas amplias. Reservá directo con sus dueños, con total confianza y sin intermediarios ni comisiones.
          </p>
        </div>

        {/* Bottom Area: Left Frosted Stat Card (Desktop Only) + Right Cutout Booking Dock */}
        <div className="relative z-20 w-full flex flex-col lg:flex-row items-stretch lg:items-end justify-end lg:justify-between gap-4 p-4 md:p-0">
          {/* Bottom-Left Frosted Glass Stat Card (Hidden on Mobile, Visible on Web/Desktop) */}
          <div
            data-slot="hero-stat"
            className="hidden lg:flex w-fit min-w-[230px] flex-col gap-3 rounded-[2rem] border border-white/35 bg-white/25 p-5 backdrop-blur-xl lg:ms-8 lg:mb-8 shadow-sm"
          >
            <div className="flex flex-col">
              <span className="text-4xl font-extrabold tracking-tight text-white">
                {hero.statCard.value}
              </span>
              <span className="text-[11px] font-bold tracking-wider text-white/90 uppercase mt-0.5">
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
              <span className="text-xs sm:text-sm font-bold">
                {hero.statCard.buttonText}
              </span>
            </a>
          </div>

          {/* Bottom-Right Cutout Dock with Interactive Booking Search */}
          <div
            data-slot="hero-docs"
            className="relative flex w-full lg:w-auto lg:ms-auto items-center rounded-[1.5rem] lg:rounded-none lg:rounded-ss-[3rem] bg-[#EFEFEF] p-4 sm:p-5 md:p-6 md:ps-10 md:pt-7"
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
              <dt className="text-3xl font-extrabold tracking-tight text-[#1E293B] tabular-nums sm:text-4xl md:text-5xl">
                {stat.value}
              </dt>
              <dd className="text-xs sm:text-sm font-bold text-[#5A697D]">
                {stat.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

// ─── 3. BENTO GRID DE LUGAR Y COMODIDADES ───────────────────────────────────
function RivrFeaturesBentoSection() {
  const { bento } = siteContent;
  const pillIcons = [Wifi, Refrigerator, Tv, Utensils];

  return (
    <section
      id="escolleras"
      data-slot="features"
      className="mx-auto w-full max-w-[1536px] px-3 py-6 md:px-5 md:py-12"
    >
      {/* Section Header */}
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between md:mb-12">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#5A697D] mb-2">
            <MapPin className="size-4 text-[#1E293B]" />
            {bento.eyebrow}
          </span>
          <h2 className="text-[clamp(1.85rem,1.2rem+2.5vw,3.45rem)] leading-[1.08] font-extrabold tracking-tight text-[#1E293B] text-balance lg:whitespace-nowrap">
            {bento.sectionTitle}
          </h2>
        </div>

        <Link
          href="/reservar"
          className="inline-flex items-center justify-center gap-2.5 rounded-xl border border-[#D7E0EB] bg-white px-4 py-2.5 text-sm font-bold text-[#1E293B] shadow-2xs hover:bg-[#E7EEF5] transition-all shrink-0 w-fit"
        >
          <span>{bento.ctaButton}</span>
          <span className="flex size-7 items-center justify-center rounded-full bg-[#1E293B]/10">
            <ArrowUpRight className="size-4" />
          </span>
        </Link>
      </div>

      {/* Asymmetrical Rivr Bento Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-[auto_1fr] md:gap-5">
        {/* Card 1: Dominant Vertical (2 Rows) — Playas Amplias con Escolleras */}
        <div className="group relative overflow-hidden rounded-[1.5rem] bg-white p-6 sm:p-7 transition-shadow hover:shadow-[0_12px_35px_rgb(0,0,0,0.06)] md:rounded-[2rem] flex min-h-[28rem] flex-col justify-between md:row-span-2 md:p-9">
          <Waves
            aria-hidden="true"
            className="pointer-events-none absolute -end-10 -bottom-10 size-72 text-[#1E293B] opacity-[0.03] transition-transform duration-500 group-hover:scale-110"
          />

          <div className="flex flex-col flex-1">
            <div className="flex items-center justify-between gap-2 mb-5">
              <span className="relative flex size-12 items-center justify-center rounded-2xl bg-[#E7EEF5] text-[#1E293B]">
                <Waves className="size-6" />
              </span>
              <span className="rounded-full bg-[#E7EEF5] px-3.5 py-1 text-xs font-extrabold text-[#1E293B]">
                {bento.beachCard.badge}
              </span>
            </div>

            {/* Real Aerial Image of the Escolleras & Wide Beach */}
            <div className="relative h-60 sm:h-72 md:flex-1 md:min-h-[16rem] w-full rounded-[1.25rem] overflow-hidden mb-6 border border-[#D7E0EB]/60">
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
            <h3 className="text-2xl leading-snug font-extrabold tracking-tight text-[#1E293B] md:text-3xl text-balance">
              {bento.beachCard.title}
            </h3>
            <p className="mt-3 text-sm sm:text-base font-medium leading-relaxed text-[#5A697D] text-pretty">
              {bento.beachCard.description}
            </p>
          </div>
        </div>

        {/* Card 2: Wide Horizontal (2 Columns) — Equipamiento Completo (Sin Foto) */}
        <div
          id="comodidades"
          className="group relative overflow-hidden rounded-[1.5rem] bg-white p-6 sm:p-7 transition-shadow hover:shadow-[0_12px_35px_rgb(0,0,0,0.06)] md:rounded-[2rem] flex flex-col justify-between gap-5 md:col-span-2 md:p-8"
        >
          <Layers
            aria-hidden="true"
            className="pointer-events-none absolute -end-6 -bottom-8 size-60 text-[#1E293B] opacity-[0.03] transition-transform duration-500 group-hover:scale-110"
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="relative flex size-12 items-center justify-center rounded-2xl bg-[#E7EEF5] text-[#1E293B]">
                <Layers className="size-6" />
              </span>
              <span className="rounded-full bg-[#E7EEF5] px-3.5 py-1 text-xs font-extrabold text-[#1E293B]">
                {bento.equipmentCard.badge}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {bento.equipmentCard.pills.map((label, idx) => {
                const Icon = pillIcons[idx % pillIcons.length];
                return (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#E7EEF5]/80 px-3 py-1 text-xs font-bold text-[#1E293B]"
                  >
                    <Icon className="size-3.5" />
                    {label}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="relative">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-[#1E293B] text-balance">
              {bento.equipmentCard.title}
            </h3>
            <p className="mt-2.5 text-sm sm:text-base font-medium leading-relaxed text-[#5A697D] text-pretty max-w-3xl">
              {bento.equipmentCard.description}
            </p>
          </div>
        </div>

        {/* Card 3: Bottom Middle — Parrilla Individual y Espacio al Frente con img2 */}
        <div className="group relative overflow-hidden rounded-[1.5rem] bg-white p-6 sm:p-7 transition-shadow hover:shadow-[0_12px_35px_rgb(0,0,0,0.06)] md:rounded-[2rem] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-[#E7EEF5] text-[#1E293B]">
                <Flame className="size-6" />
              </span>
              <span className="rounded-full bg-[#E7EEF5] px-3.5 py-1 text-xs font-extrabold text-[#1E293B]">
                {bento.grillCard.badge}
              </span>
            </div>

            {/* Real Asado / Parrilla Image (img2) adapted to beach card style */}
            <div className="relative h-44 sm:h-48 w-full rounded-[1.25rem] overflow-hidden mb-4 border border-[#D7E0EB]/60">
              <img
                src={bento.grillCard.image}
                alt={bento.grillCard.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute bottom-3 left-3 rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-[#1E293B] shadow-xs">
                {bento.grillCard.imageCaption}
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#1E293B]">
              {bento.grillCard.title}
            </h3>
            <p className="mt-2 text-sm font-medium leading-relaxed text-[#5A697D] text-pretty">
              {bento.grillCard.description}
            </p>
          </div>

          <a
            href="#unidades"
            className="mt-5 inline-flex items-center justify-between gap-2 rounded-full border border-[#D7E0EB] px-4 py-2 text-xs font-bold text-[#1E293B] transition-colors hover:bg-[#E7EEF5] w-fit"
          >
            <span>{bento.grillCard.buttonText}</span>
            <ArrowUpRight className="size-4" />
          </a>
        </div>

        {/* Card 4: Bottom Right — Reserva Directa con img3 */}
        <Link
          href="/reservar"
          className="group relative overflow-hidden rounded-[1.5rem] bg-white p-6 sm:p-7 transition-shadow hover:shadow-[0_12px_35px_rgb(0,0,0,0.06)] md:rounded-[2rem] flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-[#E7EEF5] text-[#1E293B]">
                <Handshake className="size-6" />
              </span>
              <span className="rounded-full bg-[#E7EEF5] px-3.5 py-1 text-xs font-extrabold text-[#1E293B]">
                {bento.bookingCard.badge}
              </span>
            </div>

            {/* Real Handshake / Direct with Owner Image (img3) adapted to beach card style */}
            <div className="relative h-44 sm:h-48 w-full rounded-[1.25rem] overflow-hidden mb-4 border border-[#D7E0EB]/60">
              <img
                src={bento.bookingCard.image}
                alt={bento.bookingCard.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute bottom-3 left-3 rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-[#1E293B] shadow-xs">
                {bento.bookingCard.imageCaption}
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#1E293B]">
              {bento.bookingCard.title}
            </h3>
            <p className="mt-2 text-sm font-medium leading-relaxed text-[#5A697D] text-pretty">
              {bento.bookingCard.description}
            </p>
          </div>

          <div className="mt-5 inline-flex items-center justify-between gap-2 rounded-full bg-[#1E293B] text-white px-4 py-2 text-xs font-bold transition-colors group-hover:bg-[#0F172A] w-fit shadow-xs">
            <span>{bento.bookingCard.buttonText}</span>
            <ArrowUpRight className="size-4" />
          </div>
        </Link>
      </div>
    </section>
  );
}

// ─── Videos de Recorrido de Alojamientos ────────────────────────────────────
const UNIT_VIDEOS = [
  {
    id: "video-duplex",
    unitType: "duplex",
    title: "Video Recorrido · Dúplex",
    badge: "Hasta 6 pers.",
    subtitle: "Recorrido real por dentro de los dúplex de 2 plantas con cocina equipada y parrilla propia.",
    videoUrl: "/videos/DUPLEX.mp4",
    poster: "/fotos/FRENTE/DUPLEX1.jpg",
    reserveHref: "/reservar?property=duplex-1",
    whatsappText:
      "Hola! Acabo de ver el video recorrido de los Dúplex (hasta 6 personas) en la web de Dúplex Las Toninas y quiero consultar disponibilidad y tarifas.",
  },
  {
    id: "video-departamento",
    unitType: "departamento",
    title: "Video Recorrido · Departamento",
    badge: "Hasta 5 pers.",
    subtitle: "Conocé por dentro el departamento en 1° piso totalmente equipado a 400m del mar.",
    videoUrl: "/videos/DEPARTAMENTO.mp4",
    poster: "/fotos/FRENTE/DEPARTAMENTO.jpg",
    reserveHref: "/reservar?property=depto-1",
    whatsappText:
      "Hola! Acabo de ver el video recorrido del Departamento (hasta 5 personas) en la web de Dúplex Las Toninas y quiero consultar disponibilidad y tarifas.",
  },
];

// ─── 4. CATÁLOGO DE ALOJAMIENTO (4 Dúplex, 1 Departamento y 2 Tarjetas de Video) ──
function RivrUnitsCatalogSection({ onOpenGallery, onOpenVideo, whatsappNumber }) {
  const [filter, setFilter] = useState("todos");
  const [items, setItems] = useState(properties);
  const { brand, unitsSection } = siteContent;

  useEffect(() => {
    setItems(getStoredProperties());
    getProperties()
      .then((res) => {
        if (res && res.length > 0) setItems(res);
      })
      .catch(() => {});

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

  const visibleVideos =
    filter === "todos"
      ? UNIT_VIDEOS
      : UNIT_VIDEOS.filter((v) => v.unitType === filter);

  return (
    <section
      id="unidades"
      className="mx-auto w-full max-w-[1536px] px-3 py-6 md:px-5 md:py-12"
    >
      <div className="rounded-[1.5rem] md:rounded-[3rem] bg-white p-6 sm:p-8 md:p-14 border border-[#1E293B]/[0.06]">
        {/* Header & Filter Pills */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#5A697D]">
              {unitsSection.eyebrow}
            </span>
            <h2 className="mt-1 text-[clamp(1.85rem,1.2rem+2.4vw,3.35rem)] leading-[1.08] font-extrabold tracking-tight text-[#1E293B] text-balance">
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
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {filtered.map((prop) => {
            const currentPrice = Number(prop.price_per_night || prop.pricePerNight || 80000);
            const hasSeasons = (prop.seasonalRates || prop.seasonal_rates || []).length > 0;
            const cleanAmenities = sanitizeAmenities(prop.amenities || [], prop.type || "duplex");
            const unitWaUrl = buildWhatsAppUrl(
              whatsappNumber,
              `Hola! Estoy viendo la web de Dúplex Las Toninas y quiero consultar disponibilidad y precio por el ${prop.name} (hasta ${prop.capacity} personas).`
            );

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
                      alt={`${prop.name} - Alquiler en Las Toninas`}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3 rounded-full bg-white/95 backdrop-blur-md px-3.5 py-1 text-xs font-extrabold text-[#1E293B] shadow-xs">
                      ${currentPrice.toLocaleString("es-AR")} / noche
                    </div>
                    {hasSeasons && (
                      <div className="absolute top-3 left-3 rounded-full bg-amber-500/90 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-white flex items-center gap-1 shadow-xs">
                        <Sparkles className="size-3" />
                        <span>Temporadas</span>
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3 rounded-full bg-[#1E293B]/80 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-white">
                      Ver {prop.images.length} fotos reales
                    </div>
                  </div>

                  {/* Info */}
                  <div className="px-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#1E293B]">
                        {prop.name}
                      </h3>
                      <span className="text-xs font-extrabold text-[#1E293B] bg-[#E7EEF5] px-2.5 py-1 rounded-full shrink-0">
                        Hasta {prop.capacity} pers.
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#5A697D] mt-1.5">
                      <MapPin className="size-3.5 text-[#1E293B] shrink-0" />
                      <span>
                        {brand.address}, {brand.city} · A {brand.distanceToSea} del mar
                      </span>
                    </div>

                    <p className="mt-3 text-xs sm:text-sm font-medium text-[#5A697D] leading-relaxed text-pretty">
                      {prop.description}
                    </p>

                    {/* Amenity Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {cleanAmenities.map((am) => (
                        <span
                          key={am}
                          className="rounded-full bg-white border border-[#D7E0EB] px-2.5 py-0.5 text-[11px] font-bold text-[#1E293B]"
                        >
                          {am}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="mt-6 pt-4 border-t border-[#D7E0EB]/80 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenGallery(prop)}
                    className="py-2.5 px-3 rounded-xl border border-[#D7E0EB] bg-white text-xs font-bold text-[#1E293B] hover:bg-[#E7EEF5] transition-colors cursor-pointer"
                  >
                    Fotos ({prop.images.length})
                  </button>
                  <a
                    href={unitWaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      trackAdsConversion("whatsapp_click", {
                        source: "unit_card",
                        unit: prop.name,
                      })
                    }
                    aria-label={`Consultar por WhatsApp sobre ${prop.name}`}
                    className="py-2.5 px-3 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <WhatsAppIcon className="size-3.5 text-emerald-600 shrink-0" />
                    <span>WhatsApp</span>
                  </a>
                  <Link
                    href={`/reservar?property=${prop.id}`}
                    onClick={() =>
                      trackAdsConversion("begin_checkout", { unit: prop.name })
                    }
                    className="flex-1 py-2 px-3 rounded-xl bg-[#1E293B] hover:bg-[#0F172A] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
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

          {/* 6th Grid Slot (next to Departamento): 2 Stacked Video Preview Cards */}
          {visibleVideos.length > 0 && (
            <div className="flex flex-col justify-between gap-4 h-full">
              {visibleVideos.map((vid) => (
                <div
                  key={vid.id}
                  onClick={() => onOpenVideo(vid)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onOpenVideo(vid);
                    }
                  }}
                  className="group flex-1 rounded-[1.75rem] bg-[#EFEFEF]/60 p-4 border border-[#D7E0EB]/80 hover:bg-white hover:shadow-[0_12px_35px_rgb(0,0,0,0.06)] transition-all flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    {/* Autoplaying Muted Video Preview */}
                    <div className="relative h-36 sm:h-40 w-full rounded-[1.25rem] overflow-hidden mb-3 bg-slate-900 border border-[#D7E0EB]/60">
                      <video
                        src={vid.videoUrl}
                        poster={vid.poster}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="metadata"
                        className="block w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/70 via-transparent to-[#0F172A]/25 pointer-events-none" />
                      <div className="absolute top-2.5 right-2.5 rounded-full bg-white/95 backdrop-blur-md px-3 py-1 text-[11px] font-extrabold text-[#1E293B] shadow-xs">
                        {vid.badge}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="flex size-11 items-center justify-center rounded-full bg-white/90 text-[#1E293B] shadow-lg transition-transform duration-300 group-hover:scale-110">
                          <Play className="size-5 fill-[#1E293B] ms-0.5" />
                        </span>
                      </div>
                      <div className="absolute bottom-2.5 left-2.5 rounded-full bg-[#1E293B]/85 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-white flex items-center gap-1.5">
                        <Play className="size-3 fill-white" />
                        <span>Clic para ver video en grande</span>
                      </div>
                    </div>

                    <div className="px-1">
                      <h3 className="text-base sm:text-lg font-extrabold tracking-tight text-[#1E293B]">
                        {vid.title}
                      </h3>
                      <p className="mt-1 text-xs font-medium text-[#5A697D] leading-relaxed line-clamp-2">
                        {vid.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-[#D7E0EB]/80 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenVideo(vid);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-[#D7E0EB] hover:bg-[#E7EEF5] px-3 py-1.5 text-xs font-bold text-[#1E293B] transition-colors cursor-pointer"
                    >
                      <Play className="size-3.5 fill-[#1E293B]" />
                      <span>Ampliar Video</span>
                    </button>

                    <Link
                      href={vid.reserveHref}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#1E293B] hover:bg-[#0F172A] text-white px-3.5 py-1.5 text-xs font-bold transition-all"
                    >
                      <span>Reservar</span>
                      <ArrowUpRight className="size-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── 5. GALERÍA DESTACADA EN PORTADA ────────────────────────────────────────
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
          <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#5A697D] mb-2">
            <Camera className="size-4 text-[#1E293B]" />
            {gallerySection.eyebrow}
          </span>
          <h2 className="text-[clamp(1.85rem,1.2rem+2.4vw,3.25rem)] leading-[1.08] font-extrabold tracking-tight text-[#1E293B]">
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
              <h3 className="text-base sm:text-lg font-extrabold text-white leading-snug">
                {item.title}
              </h3>
              {item.subtitle && (
                <p className="mt-1 text-xs font-medium text-white/85 leading-relaxed">
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
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1 text-xs font-extrabold text-white/95 mb-4">
              <Compass className="size-3.5" />
              {locationSection.badge}
            </span>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-snug">
              {locationSection.title}
            </h3>
            <p className="mt-3 text-sm sm:text-base font-medium text-white/85 leading-relaxed text-pretty">
              {locationSection.description}
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs text-white/60 uppercase tracking-wider font-bold">Región</p>
              <p className="text-sm font-bold">{brand.region}</p>
            </div>
            <a
              href={brand.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white py-1.5 ps-4 pe-1.5 text-xs font-bold text-[#1E293B] hover:bg-white/90 transition-colors"
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
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#5A697D]">
                  {item.place}
                </span>
                <span className="flex size-8 items-center justify-center rounded-full bg-[#E7EEF5] text-[#1E293B]">
                  <MapPin className="size-4" />
                </span>
              </div>
              <div className="mt-4">
                <p className="text-2xl sm:text-3xl font-extrabold text-[#1E293B]">{item.dist}</p>
                <p className="mt-1 text-xs sm:text-sm font-medium text-[#5A697D] leading-relaxed">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 7. BANNER DE CIERRE CTA RIVR ───────────────────────────────────────────
function RivrCtaBannerSection({ whatsappNumber }) {
  const { hero, bento, ctaBanner } = siteContent;
  const waUrl = buildWhatsAppUrl(
    whatsappNumber,
    "Hola! Vi la web de Dúplex Las Toninas (Calle 12 Nº 495) y quiero consultar disponibilidad para alquiler de temporada directo con dueño."
  );

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
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-1.5 text-xs font-extrabold text-white backdrop-blur-md">
            <Sparkles className="size-3.5" />
            {ctaBanner.badge}
          </span>

          <h2 className="text-3xl leading-[1.05] font-extrabold tracking-tight text-white text-balance sm:text-5xl md:text-6xl">
            {ctaBanner.title}
          </h2>

          <p className="text-sm sm:text-base font-medium text-white/90 max-w-lg leading-relaxed text-pretty">
            {ctaBanner.subtitle}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/reservar"
              onClick={() => trackAdsConversion("click_reservar_cta_banner")}
              className="group inline-flex items-center gap-2.5 rounded-full bg-white py-2.5 ps-5 pe-2 text-sm font-bold text-[#1E293B] transition-colors hover:bg-white/90 shadow-md"
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
              onClick={() =>
                trackAdsConversion("whatsapp_click", { source: "cta_banner" })
              }
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-[#25D366] hover:bg-[#1ebe5d] px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all"
            >
              <WhatsAppIcon className="size-4" />
              <span>{ctaBanner.secondaryButton}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 8. FOOTER RIVR ─────────────────────────────────────────────────────────
function RivrFooter({ whatsappNumber }) {
  const { brand, navigation } = siteContent;
  const footerWaUrl = buildWhatsAppUrl(
    whatsappNumber,
    "Hola! Me comunico desde el sitio web de Dúplex Las Toninas para hacer una consulta sobre el alojamiento."
  );

  return (
    <footer
      data-slot="footer"
      className="border-t border-[#D7E0EB] bg-[#EFEFEF] text-[#1E293B] pb-24"
    >
      <div className="mx-auto w-full max-w-[1536px] px-6 py-14 md:px-10 md:py-18">
        <div className="flex flex-col gap-12 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <Link
              href="#home"
              className="flex w-fit items-center gap-2.5 text-[#1E293B]"
            >
              <RivrRingLogo className="size-6 text-[#1E293B]" />
              <span className="text-lg font-extrabold tracking-tight uppercase">
                {brand.fullName}
              </span>
            </Link>
            <p className="mt-4 text-sm font-medium text-[#5A697D] leading-relaxed text-pretty">
              Alquiler de Dúplex y Departamento de temporada en {brand.address}, {brand.city}. A {brand.distanceToSea} de las mejores playas amplias con escolleras.
            </p>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:gap-16"
          >
            <div>
              <h3 className="text-sm font-extrabold text-[#1E293B]">
                {navigation?.alojamiento || "Alojamiento"}
              </h3>
              <ul className="mt-4 flex flex-col gap-3">
                <li>
                  <a href="#unidades" className="text-sm font-medium text-[#5A697D] hover:text-[#1E293B]">
                    Dúplex 1 al 4 (6 pers.)
                  </a>
                </li>
                <li>
                  <a href="#unidades" className="text-sm font-medium text-[#5A697D] hover:text-[#1E293B]">
                    Departamento 1° Piso (5 pers.)
                  </a>
                </li>
                <li>
                  <a href="#escolleras" className="text-sm font-medium text-[#5A697D] hover:text-[#1E293B]">
                    {navigation?.lugar || "Lugar"}
                  </a>
                </li>
                <li>
                  <a href="#galeria" className="text-sm font-medium text-[#5A697D] hover:text-[#1E293B]">
                    {navigation?.galeria || "Galería"}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-extrabold text-[#1E293B]">Plataforma</h3>
              <ul className="mt-4 flex flex-col gap-3">
                <li>
                  <Link href="/reservar" className="text-sm font-medium text-[#5A697D] hover:text-[#1E293B]">
                    Reservar Online
                  </Link>
                </li>
                <li>
                  <Link href="/cuidador" className="text-sm font-medium text-[#5A697D] hover:text-[#1E293B]">
                    Panel Cuidador
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="text-sm font-medium text-[#5A697D] hover:text-[#1E293B]">
                    Panel Administración
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-extrabold text-[#1E293B]">
                {navigation?.ubicacion || "Ubicación"}
              </h3>
              <ul className="mt-4 flex flex-col gap-3 text-sm font-medium text-[#5A697D]">
                <li>{brand.address}</li>
                <li>{brand.city}, Buenos Aires</li>
                <li>A {brand.distanceToSea} del mar</li>
                <li>
                  <a
                    href={footerWaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      trackAdsConversion("whatsapp_click", { source: "footer" })
                    }
                    className="inline-flex items-center gap-1.5 text-[#1E293B] font-bold hover:underline"
                  >
                    <WhatsAppIcon className="size-4 text-[#25D366]" />
                    <span>Contacto WhatsApp ↗</span>
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="mt-12 border-t border-[#D7E0EB] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm font-medium text-[#5A697D]">
            © {new Date().getFullYear()} {brand.fullName} · {brand.address}, Costa Atlántica Argentina.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Lightbox Modal for Property Photos ─────────────────────────────────────
function PhotoGalleryModal({ property, onClose, whatsappNumber }) {
  const [index, setIndex] = useState(0);
  if (!property) return null;

  const images = property.images || [];
  const prev = () => setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  const modalWaUrl = buildWhatsAppUrl(
    whatsappNumber,
    `Hola! Estuve viendo las fotos del ${property.name} en la web de Dúplex Las Toninas y quiero consultar disponibilidad y precio.`
  );

  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A]/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative bg-white rounded-[2rem] max-w-3xl w-full overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-extrabold text-[#1E293B]">{property.name}</h3>
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

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <a
              href={modalWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackAdsConversion("whatsapp_click", {
                  source: "gallery_modal",
                  unit: property.name,
                })
              }
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] px-4 py-2.5 text-xs font-bold text-white"
            >
              <WhatsAppIcon className="size-4" />
              <span>Consultar</span>
            </a>
            <Link
              href={`/reservar?property=${property.id}`}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-full bg-[#1E293B] hover:bg-[#0F172A] px-5 py-2.5 text-xs font-bold text-white"
            >
              <span>Reservar {property.name}</span>
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Native <dialog> Modal for Unit Video Tour ──────────────────────────────
function VideoPreviewModal({ videoItem, onClose, whatsappNumber }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialogNode = dialogRef.current;
    if (!dialogNode) return;
    if (videoItem && !dialogNode.open) {
      dialogNode.showModal();
    }
    const handleCancel = (e) => {
      e.preventDefault();
      onClose();
    };
    dialogNode.addEventListener("cancel", handleCancel);
    return () => dialogNode.removeEventListener("cancel", handleCancel);
  }, [videoItem, onClose]);

  if (!videoItem) return null;

  const videoWaUrl = buildWhatsAppUrl(whatsappNumber, videoItem.whatsappText);

  return (
    <dialog
      ref={dialogRef}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
      className="m-auto w-full max-w-3xl rounded-[2rem] bg-white p-0 text-[#1E293B] shadow-2xl backdrop:bg-[#0F172A]/85 backdrop:backdrop-blur-md open:flex open:flex-col overflow-hidden border border-[#D7E0EB]"
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#5A697D] block">
            Recorrido en Video · {videoItem.badge}
          </span>
          <h3 className="text-lg font-extrabold text-[#1E293B]">{videoItem.title}</h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar video"
          className="p-2 rounded-full hover:bg-slate-100 text-[#5A697D] cursor-pointer"
        >
          <X className="size-5" />
        </button>
      </div>

      <div className="relative bg-slate-950 flex items-center justify-center max-h-[70dvh]">
        <video
          key={videoItem.videoUrl}
          src={videoItem.videoUrl}
          poster={videoItem.poster}
          controls
          autoPlay
          playsInline
          className="block w-full max-h-[68dvh] object-contain"
        />
      </div>

      <div className="p-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#EFEFEF]">
        <p className="text-xs sm:text-sm font-medium text-[#5A697D]">
          {videoItem.subtitle}
        </p>
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <a
            href={videoWaUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackAdsConversion("whatsapp_click", {
                source: "video_modal",
                unit: videoItem.title,
              })
            }
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] px-4 py-2.5 text-xs font-bold text-white"
          >
            <WhatsAppIcon className="size-4" />
            <span>Consultar por WhatsApp</span>
          </a>
          <Link
            href={videoItem.reserveHref}
            onClick={onClose}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-full bg-[#1E293B] hover:bg-[#0F172A] px-5 py-2.5 text-xs font-bold text-white"
          >
            <span>Reservar Ahora</span>
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </dialog>
  );
}

// ─── Floating WhatsApp Button (Slow Smooth Transition on Scroll) ────────────
function FloatingWhatsAppButton({ isVisible, whatsappNumber, defaultMessage }) {
  const waUrl = buildWhatsAppUrl(
    whatsappNumber,
    defaultMessage ||
      "Hola! Estoy visitando la web de Dúplex Las Toninas y quiero consultar disponibilidad y tarifas de alquiler de temporada."
  );

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Consultar disponibilidad por WhatsApp"
      onClick={() =>
        trackAdsConversion("whatsapp_click", { source: "floating_button" })
      }
      className={`whatsapp-float-btn ${
        isVisible ? "is-visible" : ""
      } fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-40 group flex items-center gap-3 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] text-white p-3.5 sm:py-3.5 sm:ps-4 sm:pe-5 shadow-[0_12px_32px_rgba(37,211,102,0.42)] hover:shadow-[0_16px_40px_rgba(37,211,102,0.55)] hover:scale-105 border-2 border-white/90`}
    >
      <span className="relative flex size-7 sm:size-8 items-center justify-center rounded-full bg-white text-[#25D366] shrink-0">
        <WhatsAppIcon className="size-5 sm:size-6" />
      </span>
      <span className="hidden sm:flex flex-col text-left leading-tight">
        <span className="text-[10px] font-bold uppercase tracking-wider text-white/90">
          Dueño Directo
        </span>
        <span className="text-sm font-extrabold text-white">
          Consultar por WhatsApp
        </span>
      </span>
    </a>
  );
}

// ─── Main Rivr Landing Page ─────────────────────────────────────────────────
export default function HomePage() {
  const [galleryProperty, setGalleryProperty] = useState(null);
  const [activeVideoModal, setActiveVideoModal] = useState(null);
  const [siteSettings, setSiteSettings] = useState(getStoredSiteSettings);
  const [showFloatingWa, setShowFloatingWa] = useState(false);
  const heroRef = useRef(null);

  // Cargar teléfono de WhatsApp y configuración general desde Supabase y LocalStorage
  useEffect(() => {
    setSiteSettings(getStoredSiteSettings());
    getSiteSettings()
      .then((s) => {
        if (s) setSiteSettings(s);
      })
      .catch(() => {});

    const handleSettingsSync = () => {
      setSiteSettings(getStoredSiteSettings());
    };
    window.addEventListener("toninas_settings_changed", handleSettingsSync);
    window.addEventListener("storage", handleSettingsSync);
    return () => {
      window.removeEventListener("toninas_settings_changed", handleSettingsSync);
      window.removeEventListener("storage", handleSettingsSync);
    };
  }, []);

  // Activar logo flotante de WhatsApp con transición suave cuando el usuario hace scroll y avanza la portada
  useEffect(() => {
    const handleScroll = () => {
      const threshold = Math.min(window.innerHeight * 0.35, 280);
      setShowFloatingWa(window.scrollY > threshold);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const activePhone =
    siteSettings?.whatsappNumber || siteContent.brand.whatsappNumber;
  const activeMessage =
    siteSettings?.whatsappDefaultMessage ||
    siteContent.brand.whatsappDefaultMessage;

  return (
    <div
      className={`rivr rivr-scroll-root ${
        showFloatingWa ? "scrolled" : ""
      } relative min-h-svh bg-[#EFEFEF] text-[#1E293B] antialiased`}
    >
      <div className="scroll-sentinel" aria-hidden="true" />
      <RivrHeroSection heroRef={heroRef} />
      <RivrMetricsSection />
      <RivrFeaturesBentoSection />
      <RivrUnitsCatalogSection
        onOpenGallery={(prop) => setGalleryProperty(prop)}
        onOpenVideo={(vid) => setActiveVideoModal(vid)}
        whatsappNumber={activePhone}
      />
      <RivrGallerySection />
      <RivrLocationSection />
      <RivrCtaBannerSection whatsappNumber={activePhone} />
      <RivrFooter whatsappNumber={activePhone} />

      <FloatingWhatsAppButton
        isVisible={showFloatingWa}
        whatsappNumber={activePhone}
        defaultMessage={activeMessage}
      />

      {galleryProperty && (
        <PhotoGalleryModal
          property={galleryProperty}
          onClose={() => setGalleryProperty(null)}
          whatsappNumber={activePhone}
        />
      )}

      {activeVideoModal && (
        <VideoPreviewModal
          videoItem={activeVideoModal}
          onClose={() => setActiveVideoModal(null)}
          whatsappNumber={activePhone}
        />
      )}
    </div>
  );
}
