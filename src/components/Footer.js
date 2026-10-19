"use client";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "var(--bg-dark)",
        color: "var(--text-on-dark)",
        paddingTop: 64,
        paddingBottom: 32,
      }}
    >
      <div className="container" style={{ padding: "0 24px" }}>
        {/* Main grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 48,
            marginBottom: 48,
          }}
        >
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: "var(--gradient-brand)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                }}
              >
                🏠
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-0.02em" }}>Dúplex Las Toninas</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", letterSpacing: "0.05em" }}>
                  Costa Bonaerense, Argentina
                </div>
              </div>
            </div>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: 20 }}>
              Dúplex completamente equipados a solo 400 metros del mar. Tu lugar de descanso ideal en la costa bonaerense.
            </p>
            {/* Social Links */}
            <div style={{ display: "flex", gap: 12 }}>
              {[
                { icon: "📘", label: "Facebook", href: "#" },
                { icon: "📸", label: "Instagram", href: "#" },
                { icon: "💬", label: "WhatsApp", href: "https://wa.me/5491134610085" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.label}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    textDecoration: "none",
                    transition: "all 0.2s ease",
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 style={{ fontWeight: 700, fontSize: 14, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 20 }}>
              Navegación
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "Inicio", href: "/" },
                { label: "El Dúplex", href: "/#duplex" },
                { label: "Galería de Fotos", href: "/#galeria" },
                { label: "Comodidades", href: "/#comodidades" },
                { label: "Cómo Llegar", href: "/#ubicacion" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    style={{
                      textDecoration: "none",
                      fontSize: 14,
                      color: "rgba(255,255,255,0.6)",
                      transition: "color 0.2s ease",
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Reservas */}
          <div>
            <h4 style={{ fontWeight: 700, fontSize: 14, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 20 }}>
              Reservas
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "Reservar Online", href: "/reservar" },
                { label: "Ver Disponibilidad", href: "/reservar#calendario" },
                { label: "Políticas de Cancelación", href: "/politicas" },
                { label: "Preguntas Frecuentes", href: "/#faq" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    style={{
                      textDecoration: "none",
                      fontSize: 14,
                      color: "rgba(255,255,255,0.6)",
                      transition: "color 0.2s ease",
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 style={{ fontWeight: 700, fontSize: 14, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 20 }}>
              Contacto
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { icon: "📍", text: "Las Toninas, Partido de La Costa, Buenos Aires" },
                { icon: "📱", text: "+54 9 11 1234-5678" },
                { icon: "✉️", text: "info@duplexlastoninas.com.ar" },
                { icon: "🕐", text: "Atención: Lun–Dom 9 a 22hs" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 15, flexShrink: 0 }}>{item.icon}</span>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: 24,
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>
            © {currentYear} Dúplex Las Toninas. Todos los derechos reservados.
          </p>
          <div style={{ display: "flex", gap: 20 }}>
            {["Privacidad", "Términos", "Cookies"].map((item) => (
              <a
                key={item}
                href="#"
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.35)",
                  textDecoration: "none",
                }}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
