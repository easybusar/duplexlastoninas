"use client";

import * as React from "react";
import { useState } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { CalendarDays, Users2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export interface BookingFormProps extends Omit<HTMLMotionProps<"div">, "onSearch"> {
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialGuests?: number;
  onSearch?: (data: { checkIn: string; checkOut: string; guests: number }) => void;
}

export const BookingForm = React.forwardRef<HTMLDivElement, BookingFormProps>(
  (
    {
      className,
      initialCheckIn = "",
      initialCheckOut = "",
      initialGuests = 2,
      onSearch,
      ...props
    },
    ref
  ) => {
    const router = useRouter();

    const [checkIn, setCheckIn] = useState(initialCheckIn);
    const [checkOut, setCheckOut] = useState(initialCheckOut);
    const [guests, setGuests] = useState(initialGuests);

    const today = new Date().toISOString().split("T")[0];

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (onSearch) {
        onSearch({ checkIn, checkOut, guests });
        return;
      }
      const params = new URLSearchParams();
      if (checkIn) params.append("checkIn", checkIn);
      if (checkOut) params.append("checkOut", checkOut);
      if (guests) params.append("guests", guests.toString());

      router.push(`/reservar?${params.toString()}`);
    };

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className={cn(
          "w-full max-w-md sm:max-w-[420px] rounded-3xl bg-white p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.22),0_4px_12px_rgba(0,0,0,0.06)] border border-gray-100 text-gray-900",
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="mb-5 flex items-baseline justify-between border-b border-gray-100 pb-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">
              Reserva Directa
            </span>
            <h3 className="text-xl font-black text-gray-900 tracking-tight">
              Consultá tus Fechas
            </h3>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-gray-600">Dúplex & Depto</span>
            <p className="text-[11px] text-gray-400">A 400m del mar</p>
          </div>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* Grid de Fechas: Llegada y Salida */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-3 transition-all focus-within:border-gray-900 focus-within:bg-white">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                Llegada
              </label>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-gray-400 shrink-0" />
                <input
                  type="date"
                  min={today}
                  value={checkIn}
                  onChange={(e) => {
                    setCheckIn(e.target.value);
                    if (checkOut && e.target.value >= checkOut) {
                      setCheckOut("");
                    }
                  }}
                  required
                  className="w-full bg-transparent text-sm font-semibold text-gray-900 outline-none cursor-pointer"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-3 transition-all focus-within:border-gray-900 focus-within:bg-white">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                Salida
              </label>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-gray-400 shrink-0" />
                <input
                  type="date"
                  min={checkIn || today}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  required
                  className="w-full bg-transparent text-sm font-semibold text-gray-900 outline-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Huéspedes: Selector de Personas con +/- directo */}
          <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-3.5 flex items-center justify-between">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500">
                Cantidad de personas
              </label>
              <div className="flex items-center gap-2 mt-0.5">
                <Users2 className="h-4 w-4 text-gray-400 shrink-0" />
                <span className="text-sm font-bold text-gray-900">
                  {guests} {guests === 1 ? "persona" : "personas"}
                </span>
                <span className="text-xs text-gray-400">(máx. 6)</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setGuests(Math.max(1, guests - 1))}
                disabled={guests <= 1}
                aria-label="Disminuir personas"
                className="h-9 w-9 rounded-xl border border-gray-300 bg-white flex items-center justify-center text-lg font-bold text-gray-700 hover:bg-gray-100 disabled:opacity-30 transition-all active:scale-95 cursor-pointer shadow-sm"
              >
                −
              </button>
              <span className="w-6 text-center text-base font-black text-gray-900">
                {guests}
              </span>
              <button
                type="button"
                onClick={() => setGuests(Math.min(6, guests + 1))}
                disabled={guests >= 6}
                aria-label="Aumentar personas"
                className="h-9 w-9 rounded-xl border border-gray-300 bg-white flex items-center justify-center text-lg font-bold text-gray-700 hover:bg-gray-100 disabled:opacity-30 transition-all active:scale-95 cursor-pointer shadow-sm"
              >
                +
              </button>
            </div>
          </div>

          {/* Botón CTA Principal */}
          <div className="pt-1">
            <button
              type="submit"
              className="w-full h-12 rounded-2xl bg-[#18181b] hover:bg-black text-white text-[15px] font-bold shadow-lg transition-all duration-150 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Ver Disponibilidad</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>

        <p className="mt-3.5 text-center text-[12px] text-gray-500 font-medium">
          ✓ Alquiler directo sin comisiones intermedias
        </p>
      </motion.div>
    );
  }
);
BookingForm.displayName = "BookingForm";
