"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/lib/supabase";
import { siteContent } from "@/lib/content";
import { KeyRound, ArrowUpRight, ArrowLeft, ShieldAlert } from "lucide-react";

export default function CuidadorLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const CARETAKER_EMAIL = "cuidador@duplexlastoninas.com.ar";

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signIn(CARETAKER_EMAIL, password);
      router.push("/cuidador");
    } catch {
      if (password === "toninas2025") {
        localStorage.setItem("caretaker_session", "true");
        router.push("/cuidador");
      } else {
        setError("Contraseña incorrecta. Consultá al administrador.");
      }
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
            Recepción y Check-in
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1E293B]">
            Panel del Cuidador
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#5A697D]">
            {siteContent.brand.fullName} · {siteContent.brand.address}
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label
              htmlFor="caretaker-password"
              className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-2.5"
            >
              <KeyRound className="size-4" />
              <span>Contraseña de Acceso</span>
            </label>
            <input
              id="caretaker-password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full rounded-2xl bg-[#EFEFEF]/80 border border-[#D7E0EB] px-4 py-4 text-center text-xl font-bold tracking-widest text-[#1E293B] outline-none focus:border-[#1E293B] focus:bg-white transition-all"
            />
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-xl bg-red-50 border border-red-200 p-3.5 text-xs sm:text-sm font-semibold text-red-800 flex items-center justify-center gap-2"
            >
              <ShieldAlert className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 rounded-2xl bg-[#1E293B] hover:bg-[#0F172A] disabled:opacity-50 text-white text-base font-semibold flex items-center justify-center gap-2.5 transition-all cursor-pointer"
          >
            <span>{loading ? "Ingresando..." : "Ingresar al Panel"}</span>
            <span className="flex size-7 items-center justify-center rounded-full bg-white/20">
              <ArrowUpRight className="size-4" />
            </span>
          </button>

          <p className="text-center text-xs text-[#5A697D]">
            Acceso rápido demo: <strong className="text-[#1E293B]">toninas2025</strong>
          </p>
        </form>

        <div className="mt-6 pt-5 border-t border-[#D7E0EB] text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A697D] hover:text-[#1E293B]"
          >
            <ArrowLeft className="size-3.5" />
            <span>Volver al sitio principal</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
