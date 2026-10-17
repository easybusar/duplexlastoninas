"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { siteContent } from "@/lib/content";
import { ArrowUpRight, ArrowLeft, ShieldAlert, Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 600));
    if (email === "admin@duplexlastoninas.com.ar" && password === "admin123") {
      localStorage.setItem("admin_session", "true");
      router.push("/admin");
    } else {
      setError("Credenciales inválidas. Verificá tu email y contraseña.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-dvh bg-[#EFEFEF] text-[#1E293B] p-4 flex items-center justify-center antialiased">
      <div className="w-full max-w-md rounded-[2rem] md:rounded-[2.75rem] bg-white p-8 sm:p-10 border border-[#D7E0EB] shadow-xs">
        <div className="text-center mb-8">
          <img
            src={siteContent.brand.logo}
            alt={siteContent.brand.fullName}
            className="size-16 object-contain mx-auto mb-4"
          />
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E7EEF5] px-3.5 py-1 text-xs font-bold text-[#1E293B] mb-2">
            <Lock className="size-3.5" />
            <span>Gestión de Propiedades</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1E293B]">
            Panel de Administración
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#5A697D]">
            {siteContent.brand.fullName} · {siteContent.brand.address}
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="admin-email"
              className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-1.5"
            >
              Email de Administrador
            </label>
            <input
              id="admin-email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              placeholder="admin@duplexlastoninas.com.ar"
              className="w-full rounded-xl bg-[#EFEFEF]/70 border border-[#D7E0EB] px-4 py-3 text-sm font-medium text-[#1E293B] outline-none focus:border-[#1E293B] focus:bg-white transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-1.5"
            >
              Contraseña
            </label>
            <input
              id="admin-password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full rounded-xl bg-[#EFEFEF]/70 border border-[#D7E0EB] px-4 py-3 text-sm font-medium text-[#1E293B] outline-none focus:border-[#1E293B] focus:bg-white transition-all"
            />
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-xl bg-red-50 border border-red-200 p-3.5 text-xs sm:text-sm font-semibold text-red-800 flex items-center gap-2"
            >
              <ShieldAlert className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#1E293B] hover:bg-[#0F172A] disabled:opacity-50 text-white text-sm sm:text-base font-semibold flex items-center justify-center gap-2.5 transition-all cursor-pointer mt-2"
          >
            <span>{loading ? "Accediendo..." : "Ingresar al Panel"}</span>
            <span className="flex size-7 items-center justify-center rounded-full bg-white/20">
              <ArrowUpRight className="size-4" />
            </span>
          </button>

          <p className="text-center text-[11px] text-[#5A697D] pt-2">
            Demo: <strong className="text-[#1E293B]">admin@duplexlastoninas.com.ar</strong> ·{" "}
            <strong className="text-[#1E293B]">admin123</strong>
          </p>
        </form>

        <div className="mt-6 pt-5 border-t border-[#D7E0EB] text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A697D] hover:text-[#1E293B]"
          >
            <ArrowLeft className="size-3.5" />
            <span>Volver al sitio público</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
