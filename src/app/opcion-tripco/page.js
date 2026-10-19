"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { properties } from "@/lib/data";
import {
  MapPin,
  Calendar,
  Users,
  Star,
  Car,
  Wifi,
  Flame,
  Sparkles,
  Check,
  ArrowRight,
  Play,
  Pause,
  SlidersHorizontal,
  Tv,
  Utensils,
  Wind,
  ShieldCheck,
  Phone,
  ChevronLeft,
  ChevronRight,
  X,
  Menu,
  Compass,
} from "lucide-react";

// ─── 1. Floating Navbar (Tripco Style) ──────────────────────────────────────
function TripcoNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Inicio", href: "#inicio", active: true },
    { label: "Dúplex", href: "#unidades" },
    { label: "Departamento", href: "#catalogo" },
    { label: "Comodidades", href: "#confort" },
    { label: "Ubicación", href: "#entorno" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <img
            src="/logo.png"
            alt="Dúplex Las Toninas"
            width={40}
            height={40}
            className="w-10 h-10 object-contain transition-transform group-hover:scale-105"
          />
          <div>
            <span className="text-xl font-extrabold tracking-tight text-[#0284C7]">
              Las Toninas
            </span>
            <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 -mt-1">
              Dúplex & Depto
            </span>
          </div>
        </Link>

        {/* Center Nav Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`text-sm transition-colors ${
                item.active
                  ? "font-bold text-slate-900"
                  : "font-medium text-slate-500 hover:text-slate-900"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right Actions (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="https://wa.me/5491155551111?text=Hola!%20Quiero%20consultar%20disponibilidad%20en%20D%C3%BAplex%20Las%20Toninas"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 transition-colors"
          >
            WhatsApp
          </a>
          <Link
            href="/reservar"
            className="bg-[#0284C7] hover:bg-[#0369A1] text-white text-sm font-bold px-6 py-2.5 rounded-full shadow-md shadow-sky-500/20 transition-all hover:shadow-lg hover:shadow-sky-500/30 active:scale-95"
          >
            Reservar Online
          </Link>
        </div>

        {/* Mobile Menu Trigger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Abrir menú"
          className="md:hidden p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 px-4 pt-2 pb-6 space-y-3">
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-semibold text-slate-800 border-b border-slate-50"
            >
              {item.label}
            </a>
          ))}
          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              href="/reservar"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full bg-[#0284C7] text-white text-center font-bold py-3 rounded-full shadow-md"
            >
              Reservar Online
            </Link>
            <a
              href="https://wa.me/5491155551111"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full border border-slate-200 text-slate-700 text-center font-semibold py-2.5 rounded-full"
            >
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

// ─── 2. Curved Hero Banner + Floating Horizontal Search Bar ─────────────────
function HeroSection() {
  const router = useRouter();
  const [unitTab, setUnitTab] = useState("Todos");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(4);

  const today = new Date().toISOString().split("T")[0];

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (checkIn) params.append("checkIn", checkIn);
    if (checkOut) params.append("checkOut", checkOut);
    if (guests) params.append("guests", guests.toString());
    if (unitTab !== "Todos") params.append("unit", unitTab);
    router.push(`/reservar?${params.toString()}`);
  };

  return (
    <section id="inicio" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-16">
      {/* Rounded Hero Media Card */}
      <div className="relative h-[460px] sm:h-[520px] w-full rounded-[32px] sm:rounded-[36px] overflow-hidden shadow-[0_20px_50px_-15px_rgba(2,132,199,0.22)]">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/fotos/FRENTE/DUPLEX1.jpg"
          className="absolute inset-0 w-full h-full object-cover scale-[1.02]"
        >
          <source src="/videos/portada.mp4" type="video/mp4" />
        </video>

        {/* Coastal Sky/Slate Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-950/60 via-slate-900/45 to-slate-950/75" />

        {/* Subtle Decorative Dashed Path Lines (Tripco Aesthetic) */}
        <svg
          className="hidden lg:block absolute left-8 top-16 w-48 h-32 text-white/30 pointer-events-none"
          viewBox="0 0 200 120"
          fill="none"
        >
          <path
            d="M10 100 C 60 20, 140 20, 190 60"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="6 6"
          />
        </svg>
        <svg
          className="hidden lg:block absolute right-8 top-16 w-48 h-32 text-white/30 pointer-events-none"
          viewBox="0 0 200 120"
          fill="none"
        >
          <path
            d="M10 60 C 60 20, 140 20, 190 100"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="6 6"
          />
        </svg>

        {/* Hero Centered Copy */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 sm:px-8 pb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-bold uppercase tracking-wider mb-5">
            <MapPin className="w-3.5 h-3.5 text-sky-300" />
            Calle 12 Nº 495 · Las Toninas · Costa Argentina
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-extrabold text-white tracking-tight leading-[1.12] max-w-3xl">
            Viví la tranquilidad y el confort frente al mar
          </h1>

          <p className="mt-4 text-sm sm:text-lg text-white/90 font-medium max-w-xl leading-relaxed">
            4 Dúplex y 1 Departamento totalmente equipados a 400 metros de la playa en Las Toninas.
          </p>
        </div>
      </div>

      {/* Floating Search Bar (Overlapping Bottom Edge of Hero) */}
      <div className="relative z-20 -mt-24 sm:-mt-20 max-w-5xl mx-auto px-2 sm:px-6">
        <div className="bg-white rounded-[28px] p-5 sm:p-7 shadow-[0_20px_50px_-10px_rgba(15,23,42,0.12)] border border-slate-100">
          {/* Top Tabs Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-5">
            <div className="flex items-center gap-6 overflow-x-auto">
              {[
                { id: "Todos", label: "Todas las Unidades" },
                { id: "Dúplex", label: "4 Dúplex (Hasta 6 pers.)" },
                { id: "Departamento", label: "Departamento (Hasta 5 pers.)" },
              ].map((tab) => {
                const isActive = unitTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setUnitTab(tab.id)}
                    className={`relative pb-2 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors cursor-pointer ${
                      isActive
                        ? "text-slate-900"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    {tab.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0284C7] rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

            <Link
              href="/reservar"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-[#0284C7] transition-colors"
            >
              <span>Reserva directa sin comisión</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Search Inputs Row */}
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
            {/* Check-in */}
            <div className="lg:col-span-4">
              <label className="block text-xs font-bold text-slate-500 mb-2">
                Llegada (Check-in)
              </label>
              <div className="flex items-center gap-3 h-12 px-4 rounded-2xl border border-slate-200 bg-slate-50/60 focus-within:bg-white focus-within:border-[#0284C7] transition-all">
                <Calendar className="w-4 h-4 text-[#0284C7] shrink-0" />
                <input
                  type="date"
                  min={today}
                  value={checkIn}
                  onChange={(e) => {
                    setCheckIn(e.target.value);
                    if (checkOut && e.target.value >= checkOut) setCheckOut("");
                  }}
                  required
                  className="w-full bg-transparent text-sm font-semibold text-slate-800 outline-none cursor-pointer"
                />
              </div>
            </div>

            {/* Check-out */}
            <div className="lg:col-span-4">
              <label className="block text-xs font-bold text-slate-500 mb-2">
                Salida (Check-out)
              </label>
              <div className="flex items-center gap-3 h-12 px-4 rounded-2xl border border-slate-200 bg-slate-50/60 focus-within:bg-white focus-within:border-[#0284C7] transition-all">
                <Calendar className="w-4 h-4 text-[#0284C7] shrink-0" />
                <input
                  type="date"
                  min={checkIn || today}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  required
                  className="w-full bg-transparent text-sm font-semibold text-slate-800 outline-none cursor-pointer"
                />
              </div>
            </div>

            {/* Guests Counter */}
            <div className="sm:col-span-1 lg:col-span-2">
              <label className="block text-xs font-bold text-slate-500 mb-2">
                Huéspedes
              </label>
              <div className="flex items-center justify-between h-12 px-3.5 rounded-2xl border border-slate-200 bg-slate-50/60">
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#0284C7] shrink-0" />
                  <span className="text-sm font-bold text-slate-800">{guests}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                    disabled={guests <= 1}
                    aria-label="Menos huéspedes"
                    className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                  >
                    −
                  </button>
                  <button
                    type="button"
                    onClick={() => setGuests(Math.min(6, guests + 1))}
                    disabled={guests >= 6}
                    aria-label="Más huéspedes"
                    className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* CTA Search Button */}
            <div className="sm:col-span-1 lg:col-span-2">
              <button
                type="submit"
                className="w-full h-12 rounded-2xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-sm font-bold shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <span>Ver Disponibilidad</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

// ─── 3. Unidades Destacadas ("Popular Place" Section) ───────────────────────
function FeaturedUnitsSection({ onOpenGallery }) {
  const unitBadges = {
    "duplex-1": "Dúplex 1 · Frente",
    "duplex-2": "Dúplex 2 · Familiar",
    "duplex-3": "Dúplex 3 · Jardín",
    "duplex-4": "Dúplex 4 · Parrilla",
    "depto-1": "Depto · 1° Piso",
  };

  return (
    <section id="unidades" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Nuestras Unidades
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mt-1 font-medium">
            Disfrutá de tu estadía a solo 400 metros de la playa
          </p>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md leading-relaxed">
          Contamos con 4 dúplex idénticos para hasta 6 personas y 1 departamento en primer piso para hasta 5 personas, todos equipados y listos para tu familia.
        </p>
      </div>

      {/* 5-Unit Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {properties.map((prop, idx) => (
          <div
            key={prop.id}
            className="group bg-white rounded-[24px] p-3 border border-slate-100 shadow-[0_15px_35px_-10px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_40px_-12px_rgba(2,132,199,0.16)] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
          >
            <div>
              {/* Rounded Image with Top-Right Price Pill */}
              <div
                onClick={() => onOpenGallery(prop)}
                className="relative h-52 w-full rounded-[18px] overflow-hidden mb-3.5 cursor-pointer bg-slate-100"
              >
                <img
                  src={prop.images[0]}
                  alt={prop.name}
                  fetchPriority={idx === 0 ? "high" : undefined}
                  loading={idx === 0 ? undefined : "lazy"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-slate-900 text-[11px] font-extrabold px-3 py-1 rounded-full shadow-sm">
                  ${prop.pricePerNight.toLocaleString("es-AR")} / noche
                </div>
                <div className="absolute bottom-2.5 left-2.5 bg-slate-900/70 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                  {prop.images.length} fotos
                </div>
              </div>

              {/* Card Title & Location */}
              <div className="px-1">
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                  {unitBadges[prop.id] || prop.name}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
                  <span className="truncate">Calle 12 Nº 495 · A 400m del mar</span>
                </div>

                {/* Specs */}
                <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-100 text-[11px] font-semibold text-slate-600">
                  <span className="inline-flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-[#0284C7]" />
                    {prop.capacity} pers.
                  </span>
                  {prop.type === "duplex" ? (
                    <>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1">
                        <Car className="w-3.5 h-3.5 text-[#0284C7]" />
                        Espacio al frente
                      </span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-amber-500" />
                        Parrilla
                      </span>
                    </>
                  ) : (
                    <>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        1° Piso por escalera
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <Link
              href={`/reservar?property=${prop.id}`}
              className="mt-4 w-full py-2.5 rounded-xl bg-slate-50 hover:bg-[#0284C7] text-slate-700 hover:text-white text-xs font-bold text-center transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Reservar unidad</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── 4. Split Section "Confort Familiar" ("Travel to make sweet memories") ──
function FamilyComfortSection() {
  const features = [
    {
      num: "01",
      badgeClass: "bg-sky-100 text-[#0284C7]",
      title: "A 400 metros del mar",
      desc: "Bajada directa a playas amplias, tranquilas y familiares sin necesidad de mover el auto.",
    },
    {
      num: "02",
      badgeClass: "bg-indigo-100 text-indigo-600",
      title: "Equipamiento completo",
      desc: "Cocina equipada, vajilla completa, microondas, heladera con freezer, Smart TV y Wi-Fi de alta velocidad.",
    },
    {
      num: "03",
      badgeClass: "bg-emerald-100 text-emerald-600",
      title: "Parrilla individual y espacio al frente",
      desc: "Espacio para estacionar el vehículo en la puerta al frente y patio privado con parrilla propia en cada dúplex para tus asados.",
    },
  ];

  return (
    <section id="confort" className="py-16 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Estadías para crear recuerdos inolvidables
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mt-2 font-medium">
            Un entorno tranquilo pensado para el descanso de tu familia
          </p>
        </div>

        {/* Split Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: 3 Numbered Benefits */}
          <div className="lg:col-span-6 space-y-8">
            {features.map((item) => (
              <div key={item.num} className="max-w-md">
                <span
                  className={`inline-block px-3 py-1 rounded-lg text-xs font-extrabold mb-2.5 ${item.badgeClass}`}
                >
                  {item.num}
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed mt-1.5">
                  {item.desc}
                </p>
              </div>
            ))}

            <div className="pt-2">
              <Link
                href="/reservar"
                className="inline-flex items-center gap-2 bg-[#0284C7] hover:bg-[#0369A1] text-white text-sm font-bold px-7 py-3.5 rounded-full shadow-lg shadow-sky-500/25 transition-all hover:shadow-sky-500/40"
              >
                <span>Consultar fechas disponibles</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Vertical Showcase Photo + Floating Rating Chips */}
          <div className="lg:col-span-6 relative flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="h-[440px] sm:h-[480px] w-full rounded-[32px] overflow-hidden shadow-[0_25px_60px_-15px_rgba(15,23,42,0.18)] border-4 border-white">
                <img
                  src="/fotos/DUPLEX/LT DUPLEX 13.jpg"
                  alt="Interior Dúplex Las Toninas"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Chip 1 (Top-Left) */}
              <div className="absolute -left-3 sm:-left-8 top-10 bg-white/95 backdrop-blur-md rounded-2xl px-4 py-3 shadow-[0_15px_35px_-5px_rgba(0,0,0,0.12)] border border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-900">4.9 Excelente</p>
                  <p className="text-[11px] text-slate-500 font-medium">Calificación de huéspedes</p>
                </div>
              </div>

              {/* Floating Chip 2 (Middle-Right) */}
              <div className="absolute -right-3 sm:-right-8 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-md rounded-2xl px-4 py-3 shadow-[0_15px_35px_-5px_rgba(0,0,0,0.12)] border border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-[#0284C7] shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-900">+200 Familias Felices</p>
                  <p className="text-[11px] text-slate-500 font-medium">Trato directo con dueños</p>
                </div>
              </div>

              {/* Floating Chip 3 (Bottom-Left) */}
              <div className="absolute -left-2 sm:-left-6 bottom-10 bg-white/95 backdrop-blur-md rounded-2xl px-4 py-3 shadow-[0_15px_35px_-5px_rgba(0,0,0,0.12)] border border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                  <Check className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-900">Equipamiento Total</p>
                  <p className="text-[11px] text-slate-500 font-medium">Wi-Fi · Parrilla · Cocina Completa</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 5. Catálogo Completo y Servicios ("Explore more" Section) ──────────────
function ExploreCatalogSection({ onOpenGallery }) {
  const [activeFilter, setActiveFilter] = useState("todos");

  const filters = [
    { id: "todos", label: "Todas las unidades" },
    { id: "duplex", label: "Dúplex (Hasta 6 pers.)" },
    { id: "departamento", label: "Departamento (Hasta 5 pers.)" },
  ];

  const filteredProps =
    activeFilter === "todos"
      ? properties
      : properties.filter((p) => p.type === activeFilter);

  const amenitiesList = [
    { icon: Wifi, title: "Wi-Fi de Alta Velocidad", desc: "Conexión estable en todas las unidades" },
    { icon: Flame, title: "Parrilla Individual", desc: "Espacio de asado privado en cada unidad" },
    { icon: Car, title: "Espacio al Frente", desc: "Espacio para estacionar en la puerta de cada dúplex" },
    { icon: Utensils, title: "Cocina Equipada", desc: "Vajilla completa, anafe y horno" },
    { icon: Tv, title: "Smart TV & Streaming", desc: "Entretenimiento para toda la familia" },
    { icon: Sparkles, title: "Heladera & Microondas", desc: "Heladera con freezer y microondas" },
  ];

  return (
    <section id="catalogo" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Explorá cada unidad en detalle
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mt-1 font-medium">
            Fotos reales de frentes, interiores, habitaciones y parrillas
          </p>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md leading-relaxed">
          Seleccioná una unidad para ver su galería completa de fotos o iniciar tu reserva online con confirmación inmediata.
        </p>
      </div>

      {/* Filter Pills Bar (Tripco Style) */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
        <div className="flex flex-wrap items-center gap-2.5">
          {filters.map((f) => {
            const active = activeFilter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveFilter(f.id)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  active
                    ? "bg-slate-900 text-white shadow-md"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 text-xs font-bold text-slate-700">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#0284C7]" />
          <span>{filteredProps.length} unidades disponibles</span>
        </div>
      </div>

      {/* Detailed Cards Grid (3 Columns like Tripco Explore More) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
        {filteredProps.map((prop) => (
          <div
            key={prop.id}
            className="bg-white rounded-[28px] p-4 border border-slate-100 shadow-[0_15px_35px_-10px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_45px_-12px_rgba(2,132,199,0.16)] transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Image with Top-Right Star Rating Pill */}
              <div
                onClick={() => onOpenGallery(prop)}
                className="relative h-60 w-full rounded-[20px] overflow-hidden mb-4 cursor-pointer group bg-slate-100"
              >
                <img
                  src={prop.images[1] || prop.images[0]}
                  alt={prop.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-extrabold text-slate-900">4.9</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-white text-xs font-bold inline-flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    Clic para abrir galería ({prop.images.length} fotos)
                  </span>
                </div>
              </div>

              {/* Title, Location & Price Row */}
              <div className="flex items-start justify-between gap-2 px-1">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                    {prop.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
                    <span>Calle 12 Nº 495 · Hasta {prop.capacity} personas</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-lg font-extrabold text-slate-900">
                    ${prop.pricePerNight.toLocaleString("es-AR")}
                  </span>
                  <span className="block text-[11px] text-slate-400 font-semibold">
                    / noche
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-500 leading-relaxed mt-3 px-1">
                {prop.description}
              </p>

              {/* Amenity Pills */}
              <div className="flex flex-wrap gap-1.5 mt-4 px-1">
                {prop.amenities.slice(0, 5).map((am) => (
                  <span
                    key={am}
                    className="text-[11px] font-semibold bg-slate-50 text-slate-600 border border-slate-200/70 px-2.5 py-1 rounded-full"
                  >
                    {am}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2.5 mt-5 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => onOpenGallery(prop)}
                className="py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Ver {prop.images.length} Fotos
              </button>
              <Link
                href={`/reservar?property=${prop.id}`}
                className="py-2.5 px-4 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-xs font-bold text-white text-center shadow-sm transition-colors flex items-center justify-center gap-1"
              >
                <span>Reservar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Amenities Bar */}
      <div className="mt-16 pt-14 border-t border-slate-100">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Comodidades incluidas en tu estadía
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Todo pensado para que disfrutes desde el primer minuto
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {amenitiesList.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.title}
                className="bg-[#F8FAFC] rounded-2xl p-4 border border-slate-100 text-center hover:bg-white hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-[#0284C7] flex items-center justify-center mx-auto mb-3">
                  <IconComponent className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-extrabold text-slate-900">{item.title}</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── 6. Puntos de Interés ("Let's go on an adventure" Stamp Cards) ──────────
function SurroundingsSection() {
  const places = [
    {
      title: "PLAYA Y MÉDANOS",
      distance: "400 METROS",
      desc: "Playas amplias y tranquilas con bajada directa a solo 4 cuadras.",
      img: "/fotos/FRENTE/DUPLEX1.jpg",
    },
    {
      title: "LABERINTO LAS TONINAS",
      distance: "A 5 MINUTOS",
      desc: "Parque temático natural ideal para recorrer y disfrutar en familia.",
      img: "/fotos/DUPLEX/LT DUPLEX 14.jpg",
    },
    {
      title: "CENTRO COMERCIAL",
      distance: "A 3 MINUTOS",
      desc: "Calle 1 peatonal, restaurantes, heladerías, supermercados y ferias.",
      img: "/fotos/DUPLEX/LT DUPLEX 8.jpg",
    },
    {
      title: "MUELLE Y PESCA",
      distance: "CERCANO",
      desc: "Zona costera tradicional para pesca deportiva y caminatas al atardecer.",
      img: "/fotos/DEPARTAMENTO/LT DEPTO 1.jpg",
    },
  ];

  return (
    <section id="entorno" className="py-16 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Descubrí el entorno en Las Toninas
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mt-2 font-medium">
            Ubicación estratégica cerca del mar y de todos los servicios
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {places.map((place) => (
            <div
              key={place.title}
              className="relative bg-white rounded-[28px] p-4 border-2 border-dashed border-slate-200 hover:border-[#0284C7] transition-all shadow-sm"
            >
              {/* Floating Top-Left Cyan Badge (Tripco Stamp Style) */}
              <div className="absolute -top-3 -left-3 w-9 h-9 rounded-full bg-[#0284C7] text-white flex items-center justify-center shadow-md">
                <Compass className="w-4 h-4" />
              </div>

              <div className="h-44 w-full rounded-[20px] overflow-hidden mb-4 bg-slate-100">
                <img
                  src={place.img}
                  alt={place.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="text-center px-2 pb-1">
                <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest text-[#0284C7] bg-sky-50 px-2.5 py-0.5 rounded-full mb-1">
                  {place.distance}
                </span>
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
                  {place.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {place.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 7. Video Tour & Acción Directa ("Book tickets and go now!") ────────────
function VideoBannerSection() {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(true);

  const toggleVideo = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setPlaying(true);
    } else {
      videoRef.current.pause();
      setPlaying(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            ¡Asegurá tus fechas y vení a descansar!
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Congelá el valor con una seña del 30% por transferencia o MercadoPago
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://wa.me/5491155551111?text=Hola!%20Quiero%20consultar%20disponibilidad%20en%20Las%20Toninas"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-bold transition-all"
          >
            WhatsApp Directo
          </a>
          <Link
            href="/reservar"
            className="bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-full shadow-lg shadow-sky-500/25 transition-all"
          >
            Reservar Ahora
          </Link>
        </div>
      </div>

      {/* Wide Rounded Video Container */}
      <div className="relative h-[360px] sm:h-[440px] w-full rounded-[32px] overflow-hidden shadow-[0_20px_50px_-15px_rgba(15,23,42,0.2)]">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          poster="/fotos/FRENTE/DUPLEX1.jpg"
          className="w-full h-full object-cover"
        >
          <source src="/videos/portada.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-slate-950/35 flex flex-col items-center justify-center p-6 text-center">
          <button
            type="button"
            onClick={toggleVideo}
            aria-label={playing ? "Pausar video" : "Reproducir video"}
            className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-md border border-white/60 text-white flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shadow-xl"
          >
            {playing ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
          </button>
          <span className="mt-4 text-white text-xs sm:text-sm font-bold tracking-wide bg-slate-900/60 backdrop-blur-sm px-4 py-1.5 rounded-full">
            Recorrido en video · Calle 4 N° 1850, Las Toninas
          </span>
        </div>
      </div>
    </section>
  );
}

// ─── 8. Footer Moderno y Elegante (Tripco Style) ────────────────────────────
function TripcoFooter() {
  return (
    <footer className="bg-white border-t border-slate-100 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-100">
          {/* Col 1: Brand */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Dúplex Las Toninas"
                loading="lazy"
                width={38}
                height={38}
                className="w-9 h-9 object-contain"
              />
              <span className="text-xl font-extrabold tracking-tight text-[#0284C7]">
                Dúplex Las Toninas
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xs leading-relaxed">
              4 Dúplex y 1 Departamento equipados a 400 metros de la playa. Atención cálida y directa por sus dueños.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <MapPin className="w-4 h-4 text-[#0284C7]" />
              <span>Calle 4 N° 1850, Las Toninas, Buenos Aires</span>
            </div>
          </div>

          {/* Col 2: Unidades */}
          <div className="lg:col-span-2 space-y-2.5">
            <h4 className="text-sm font-extrabold text-slate-900">Unidades</h4>
            <ul className="space-y-2 text-xs font-medium text-slate-500">
              <li><a href="#unidades" className="hover:text-[#0284C7]">Dúplex 1 (6 pers.)</a></li>
              <li><a href="#unidades" className="hover:text-[#0284C7]">Dúplex 2 (6 pers.)</a></li>
              <li><a href="#unidades" className="hover:text-[#0284C7]">Dúplex 3 (6 pers.)</a></li>
              <li><a href="#unidades" className="hover:text-[#0284C7]">Dúplex 4 (6 pers.)</a></li>
              <li><a href="#catalogo" className="hover:text-[#0284C7]">Departamento (5 pers.)</a></li>
            </ul>
          </div>

          {/* Col 3: Accesos */}
          <div className="lg:col-span-2 space-y-2.5">
            <h4 className="text-sm font-extrabold text-slate-900">Navegación</h4>
            <ul className="space-y-2 text-xs font-medium text-slate-500">
              <li><Link href="/reservar" className="hover:text-[#0284C7]">Reservar Online</Link></li>
              <li><a href="#confort" className="hover:text-[#0284C7]">Comodidades</a></li>
              <li><a href="#entorno" className="hover:text-[#0284C7]">Ubicación y Playa</a></li>
              <li><Link href="/cuidador" className="hover:text-[#0284C7]">Panel Cuidador</Link></li>
              <li><Link href="/admin" className="hover:text-[#0284C7]">Administración</Link></li>
            </ul>
          </div>

          {/* Col 4: Direct Contact Pill Box */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-sm font-extrabold text-slate-900">Consulta Rápida</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              ¿Tenés dudas sobre fechas o estadías largas? Escribinos directamente o iniciá tu reserva online.
            </p>
            <div className="flex items-center justify-between p-1.5 pl-4 rounded-full border border-slate-200 bg-slate-50">
              <span className="text-xs font-medium text-slate-500 truncate">
                Atención inmediata por WhatsApp
              </span>
              <a
                href="https://wa.me/5491155551111?text=Hola!%20Quiero%20consultar%20disponibilidad"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contactar por WhatsApp"
                className="w-9 h-9 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white flex items-center justify-center shrink-0 transition-colors"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-medium">
          <p>© {new Date().getFullYear()} Dúplex Las Toninas. Todos los derechos reservados.</p>
          <p>Calle 4 N° 1850 · A 400 metros del mar · Costa Atlántica Argentina</p>
        </div>
      </div>
    </footer>
  );
}

// ─── Lightbox Modal for Real Property Photos ────────────────────────────────
function PhotoGalleryModal({ property, onClose }) {
  const [index, setIndex] = useState(0);
  if (!property) return null;

  const images = property.images || [];
  const prev = () => setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative bg-white rounded-[28px] max-w-3xl w-full overflow-hidden shadow-2xl">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">{property.name}</h3>
            <p className="text-xs text-slate-500">
              Foto {index + 1} de {images.length} · Hasta {property.capacity} personas
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Image */}
        <div className="relative h-[340px] sm:h-[440px] bg-slate-900 flex items-center justify-center">
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
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-md hover:bg-white cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-md hover:bg-white cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails & CTA */}
        <div className="p-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50">
          <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1">
            {images.map((img, i) => (
              <button
                key={img}
                type="button"
                onClick={() => setIndex(i)}
                className={`h-12 w-16 rounded-lg overflow-hidden border-2 shrink-0 cursor-pointer transition-all ${
                  i === index ? "border-[#0284C7] scale-105" : "border-transparent opacity-60"
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
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold text-center shrink-0 shadow-md"
          >
            Reservar {property.name}
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Main Landing Page ──────────────────────────────────────────────────────
export default function HomePage() {
  const [galleryProperty, setGalleryProperty] = useState(null);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <TripcoNavbar />
      <main>
        <HeroSection />
        <FeaturedUnitsSection onOpenGallery={(prop) => setGalleryProperty(prop)} />
        <FamilyComfortSection />
        <ExploreCatalogSection onOpenGallery={(prop) => setGalleryProperty(prop)} />
        <SurroundingsSection />
        <VideoBannerSection />
      </main>
      <TripcoFooter />

      {galleryProperty && (
        <PhotoGalleryModal
          property={galleryProperty}
          onClose={() => setGalleryProperty(null)}
        />
      )}
    </div>
  );
}
