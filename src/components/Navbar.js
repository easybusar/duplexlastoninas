"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: "80px",
        transition: "all 0.3s ease",
        background: scrolled
          ? "rgba(255,255,255,0.95)"
          : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(0,0,0,0.07)" : "none",
        boxShadow: scrolled ? "var(--shadow-sm)" : "none",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "100%",
          padding: "0 24px",
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img
              src="/logo.png"
              alt="Dúplex Las Toninas"
              style={{
                width: 42,
                height: 42,
                objectFit: "contain",
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.15))",
              }}
            />
            <div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 17,
                  color: scrolled ? "var(--text-primary)" : "white",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                  transition: "color 0.3s ease",
                }}
              >
                Dúplex
              </div>
              <div
                style={{
                  fontWeight: 500,
                  fontSize: 11,
                  color: scrolled ? "var(--text-secondary)" : "rgba(255,255,255,0.7)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  transition: "color 0.3s ease",
                }}
              >
                Las Toninas
              </div>
            </div>
          </div>
        </Link>

        {/* Nav Links - Desktop */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: 32,
          }}
          className="nav-desktop"
        >
          {[
            { label: "Inicio", href: "/" },
            { label: "El Dúplex", href: "/#duplex" },
            { label: "Comodidades", href: "/#comodidades" },
            { label: "Galería", href: "/#galeria" },
            { label: "Contacto", href: "/#contacto" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 500,
                color: scrolled ? "var(--text-secondary)" : "rgba(255,255,255,0.85)",
                transition: "color 0.2s ease",
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link
            href="https://wa.me/5491134610085?text=Hola!%20Me%20gustar%C3%ADa%20consultar%20sobre%20disponibilidad"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              borderRadius: "var(--radius-full)",
              background: scrolled ? "rgba(37,211,102,0.1)" : "rgba(255,255,255,0.1)",
              border: scrolled ? "1.5px solid rgba(37,211,102,0.3)" : "1.5px solid rgba(255,255,255,0.3)",
              color: scrolled ? "#128C7E" : "white",
              fontSize: 13,
              fontWeight: 600,
              textDecoration: "none",
              transition: "all 0.2s ease",
              backdropFilter: "blur(8px)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            WhatsApp
          </Link>

          <Link href="/reservar" className="btn-primary" style={{ padding: "9px 22px", fontSize: 14 }}>
            Reservar Ahora
          </Link>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .nav-desktop {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
