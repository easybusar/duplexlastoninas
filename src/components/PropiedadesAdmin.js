"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getStoredProperties,
  saveStoredProperties,
  updateStoredProperty,
  formatDateDDMMAAAA,
  sanitizeAmenities,
} from "@/lib/data";
import { updateProperty, updateAllDuplexes, getProperties } from "@/lib/supabase";
import {
  Users,
  Pencil,
  Plus,
  X,
  Check,
  Save,
  Building2,
  ShieldAlert,
  Calendar,
  Sparkles,
  Trash2,
  CheckCircle2,
  Layers,
} from "lucide-react";

const AMENITY_OPTIONS = [
  "WiFi",
  "Cocina Equipada",
  "Microondas",
  "Heladera con Freezer",
  "Smart TV",
  "Parrilla Individual",
  "Espacio al frente",
  "Patio/Jardín",
  "Vajilla Completa",
  "Ventilador",
  "Ropa de Cama",
  "Toallas",
];

function ImageUrlRow({ url, index, onChange, onRemove }) {
  return (
    <div className="flex items-center gap-2.5 mb-2">
      <div className="w-16 h-11 rounded-xl overflow-hidden shrink-0 bg-[#EFEFEF] border border-[#D7E0EB]">
        {url && (
          <img
            src={url}
            alt=""
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        )}
      </div>
      <input
        type="text"
        name={`image-${index}`}
        value={url}
        onChange={(e) => onChange(index, e.target.value)}
        placeholder="/fotos/DUPLEX/... o https://..."
        className="flex-1 rounded-xl bg-[#EFEFEF]/60 border border-[#D7E0EB] px-3.5 py-2.5 text-xs sm:text-sm text-[#1E293B] outline-none focus:border-[#1E293B] focus:bg-white"
      />
      <button
        type="button"
        onClick={() => onRemove(index)}
        aria-label="Quitar imagen"
        className="size-10 rounded-xl border border-red-200 bg-red-50 text-red-700 flex items-center justify-center cursor-pointer hover:bg-red-100 transition-colors"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

function PropertyEditForm({ property, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: property.name || "",
    type: property.type || "duplex",
    description: property.description || "",
    notes: property.notes || "",
    capacity: property.capacity || 6,
    price_per_night: property.price_per_night || property.pricePerNight || 80000,
    images: property.images?.length ? [...property.images] : [""],
    amenities: sanitizeAmenities(property.amenities || [], property.type || "duplex"),
    seasonalRates: Array.isArray(property.seasonalRates || property.seasonal_rates)
      ? [...(property.seasonalRates || property.seasonal_rates)]
      : [],
  });

  const [customAmenity, setCustomAmenity] = useState("");

  useEffect(() => {
    setForm({
      name: property.name || "",
      type: property.type || "duplex",
      description: property.description || "",
      notes: property.notes || "",
      capacity: property.capacity || 6,
      price_per_night: property.price_per_night || property.pricePerNight || 80000,
      images: property.images?.length ? [...property.images] : [""],
      amenities: sanitizeAmenities(property.amenities || [], property.type || "duplex"),
      seasonalRates: Array.isArray(property.seasonalRates || property.seasonal_rates)
        ? [...(property.seasonalRates || property.seasonal_rates)]
        : [],
    });
    setError("");
    setSuccessMsg("");
  }, [property]);

  // Estado para cargar una nueva tarifa de temporada
  const [newSeason, setNewSeason] = useState({
    name: "",
    startDate: "",
    endDate: "",
    pricePerNight: "",
  });

  const [applyToAllDuplexes, setApplyToAllDuplexes] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleImageChange = (i, val) => {
    const imgs = [...form.images];
    imgs[i] = val;
    set("images", imgs);
  };
  const addImage = () => set("images", [...form.images, ""]);
  const removeImage = (i) =>
    set(
      "images",
      form.images.filter((_, idx) => idx !== i)
    );

  const toggleAmenity = (a) => {
    const cur = form.amenities;
    set(
      "amenities",
      cur.includes(a) ? cur.filter((x) => x !== a) : [...cur, a]
    );
  };

  const handleAddCustomAmenity = () => {
    const clean = sanitizeAmenities([customAmenity], form.type)[0];
    if (!clean) {
      setCustomAmenity("");
      return;
    }
    if (!form.amenities.includes(clean)) {
      set("amenities", [...form.amenities, clean]);
    }
    setCustomAmenity("");
  };

  // Manejadores de Tarifas por Temporada
  const handleAddSeason = () => {
    if (!newSeason.name.trim()) {
      alert("Por favor indicá el nombre de la temporada o feriado.");
      return;
    }
    if (!newSeason.startDate || !newSeason.endDate) {
      alert("Por favor seleccioná fecha de inicio y fin para la temporada.");
      return;
    }
    if (newSeason.endDate < newSeason.startDate) {
      alert("La fecha de fin debe ser igual o posterior a la de inicio.");
      return;
    }
    const priceNum = parseFloat(newSeason.pricePerNight);
    if (isNaN(priceNum) || priceNum <= 0) {
      alert("Por favor ingresá una tarifa válida por noche.");
      return;
    }

    const createdRate = {
      id: `rate-${Date.now()}`,
      name: newSeason.name.trim(),
      startDate: newSeason.startDate,
      endDate: newSeason.endDate,
      pricePerNight: priceNum,
    };

    set("seasonalRates", [...form.seasonalRates, createdRate]);
    setNewSeason({
      name: "",
      startDate: "",
      endDate: "",
      pricePerNight: "",
    });
  };

  const handleRemoveSeason = (rateId) => {
    set(
      "seasonalRates",
      form.seasonalRates.filter((r) => r.id !== rateId)
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccessMsg("");

    const basePriceNum = parseFloat(form.price_per_night);
    if (isNaN(basePriceNum) || basePriceNum <= 0) {
      setError("Por favor indicá un precio base por noche válido.");
      setSaving(false);
      return;
    }

    const cleanAmenities = sanitizeAmenities(form.amenities, form.type);

    const payload = {
      name: form.name,
      type: form.type,
      description: form.description,
      capacity: parseInt(form.capacity, 10),
      price_per_night: basePriceNum,
      pricePerNight: basePriceNum,
      images: form.images.filter(Boolean),
      amenities: cleanAmenities,
      seasonalRates: form.seasonalRates,
      updated_at: new Date().toISOString(),
    };

    try {
      // Guardar siempre la unidad actual en LocalStorage y Supabase
      await updateProperty(property.id, payload);

      // Si el usuario marcó aplicar tarifas y etiquetas a todos los dúplex
      if (applyToAllDuplexes && property.type === "duplex") {
        await updateAllDuplexes({
          price_per_night: basePriceNum,
          seasonalRates: form.seasonalRates,
          amenities: cleanAmenities,
        });
      }

      setSuccessMsg("¡Tarifas, etiquetas y datos guardados con éxito en Supabase y en la web!");
      setTimeout(() => {
        onSave({ ...property, ...payload });
      }, 600);
    } catch (err) {
      setError("Error al guardar: " + (err.message || "desconocido"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Información Básica */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label
            htmlFor="prop-name"
            className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-1.5"
          >
            Nombre de la Unidad
          </label>
          <input
            id="prop-name"
            name="name"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            required
            className="w-full rounded-xl bg-[#EFEFEF]/60 border border-[#D7E0EB] px-3.5 py-2.5 text-sm font-semibold text-[#1E293B]"
          />
        </div>
        <div>
          <label
            htmlFor="prop-type"
            className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-1.5"
          >
            Categoría
          </label>
          <select
            id="prop-type"
            name="type"
            value={form.type}
            onChange={(e) => set("type", e.target.value)}
            className="w-full rounded-xl bg-[#EFEFEF]/60 border border-[#D7E0EB] px-3.5 py-2.5 text-sm font-semibold text-[#1E293B]"
          >
            <option value="duplex">Dúplex</option>
            <option value="departamento">Departamento</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="prop-capacity"
            className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-1.5"
          >
            Capacidad Máxima
          </label>
          <input
            id="prop-capacity"
            name="capacity"
            type="number"
            min={1}
            max={20}
            value={form.capacity}
            onChange={(e) => set("capacity", e.target.value)}
            required
            className="w-full rounded-xl bg-[#EFEFEF]/60 border border-[#D7E0EB] px-3.5 py-2.5 text-sm font-semibold text-[#1E293B]"
          />
        </div>
      </div>

      {/* Precio Base */}
      <div className="p-4 rounded-2xl bg-[#EFEFEF]/60 border border-[#D7E0EB]">
        <label
          htmlFor="prop-price"
          className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-1.5"
        >
          Precio Base Estándar por Noche (ARS) *
        </label>
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-[#1E293B]">$</span>
          <input
            id="prop-price"
            name="price"
            type="number"
            min={0}
            step={500}
            value={form.price_per_night}
            onChange={(e) => set("price_per_night", e.target.value)}
            required
            className="w-full max-w-xs rounded-xl bg-white border border-[#D7E0EB] px-3.5 py-2 text-base font-bold text-[#1E293B]"
          />
          <span className="text-xs text-[#5A697D]">
            Tarifa normal cuando no aplica ninguna temporada alta
          </span>
        </div>
      </div>

      {/* SECCIÓN: Tarifas por Rango de Fechas / Temporadas de Alta Demanda */}
      <div className="p-5 sm:p-6 rounded-[2rem] bg-white border-2 border-[#1E293B]/10 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#EFEFEF]">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-[#1E293B] text-white">
              <Calendar className="size-4" />
            </span>
            <div>
              <h4 className="text-base font-bold text-[#1E293B]">
                Tarifas por Rango de Fechas (Alta Demanda / Temporadas)
              </h4>
              <p className="text-xs text-[#5A697D]">
                Aplicá precios especiales para Enero, Febrero, Carnaval o fines de semana largos. El sistema cobrará este valor automáticamente en las fechas seleccionadas por el huésped.
              </p>
            </div>
          </div>
          <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-[#E7EEF5] text-xs font-bold text-[#1E293B]">
            {form.seasonalRates.length} {form.seasonalRates.length === 1 ? "tarifa" : "tarifas"} activas
          </span>
        </div>

        {/* Lista de tarifas especiales configuradas */}
        {form.seasonalRates.length === 0 ? (
          <div className="py-6 text-center text-xs text-[#5A697D] rounded-xl bg-[#EFEFEF]/40 border border-dashed border-[#D7E0EB]">
            No hay tarifas especiales cargadas. Se usará el precio base estándar de ${Number(form.price_per_night).toLocaleString("es-AR")}/noche todo el año.
          </div>
        ) : (
          <div className="space-y-2.5">
            {form.seasonalRates.map((rate) => (
              <div
                key={rate.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[#EFEFEF]/60 border border-[#D7E0EB] hover:bg-[#EFEFEF] transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#1E293B]">
                      {rate.name}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#1E293B] text-white text-[10px] font-bold">
                      Alta Demanda
                    </span>
                  </div>
                  <div className="text-xs text-[#5A697D] flex items-center gap-2">
                    <Calendar className="size-3.5 text-[#1E293B]" />
                    <span>
                      Del <strong className="text-[#1E293B]">{formatDateDDMMAAAA(rate.startDate)}</strong> al <strong className="text-[#1E293B]">{formatDateDDMMAAAA(rate.endDate)}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="text-right">
                    <span className="text-sm sm:text-base font-extrabold text-[#1E293B]">
                      ${Number(rate.pricePerNight).toLocaleString("es-AR")}
                    </span>
                    <span className="text-[11px] text-[#5A697D] block">/ noche</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSeason(rate.id)}
                    aria-label="Eliminar tarifa especial"
                    className="size-8 rounded-lg border border-red-200 bg-red-50 text-red-700 flex items-center justify-center hover:bg-red-100 cursor-pointer transition-colors"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Mini formulario para sumar una nueva temporada */}
        <div className="pt-3 border-t border-[#EFEFEF] bg-[#E7EEF5]/40 p-4 rounded-xl">
          <span className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-2.5">
            + Agregar Rango de Fechas / Temporada Especial
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#5A697D] mb-1">
                Nombre / Evento
              </label>
              <input
                type="text"
                placeholder="Ej: Enero 1ra Quincena"
                value={newSeason.name}
                onChange={(e) =>
                  setNewSeason((s) => ({ ...s, name: e.target.value }))
                }
                className="w-full rounded-lg bg-white border border-[#D7E0EB] px-3 py-1.5 text-xs font-medium text-[#1E293B]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#5A697D] mb-1">
                Fecha Desde
              </label>
              <input
                type="date"
                value={newSeason.startDate}
                onChange={(e) =>
                  setNewSeason((s) => ({ ...s, startDate: e.target.value }))
                }
                className="w-full rounded-lg bg-white border border-[#D7E0EB] px-3 py-1.5 text-xs font-medium text-[#1E293B]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#5A697D] mb-1">
                Fecha Hasta
              </label>
              <input
                type="date"
                value={newSeason.endDate}
                onChange={(e) =>
                  setNewSeason((s) => ({ ...s, endDate: e.target.value }))
                }
                className="w-full rounded-lg bg-white border border-[#D7E0EB] px-3 py-1.5 text-xs font-medium text-[#1E293B]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#5A697D] mb-1">
                Precio x Noche (ARS)
              </label>
              <input
                type="number"
                placeholder="Ej: 75000"
                value={newSeason.pricePerNight}
                onChange={(e) =>
                  setNewSeason((s) => ({ ...s, pricePerNight: e.target.value }))
                }
                className="w-full rounded-lg bg-white border border-[#D7E0EB] px-3 py-1.5 text-xs font-bold text-[#1E293B]"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddSeason}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1E293B] text-white text-xs font-semibold hover:bg-[#0F172A] cursor-pointer transition-colors"
          >
            <Plus className="size-3.5" />
            <span>Sumar esta Tarifa Especial</span>
          </button>
        </div>

        {/* Opción para replicar a todos los dúplex */}
        {property.type === "duplex" && (
          <div className="pt-2 flex items-center gap-2.5">
            <input
              type="checkbox"
              id="apply-all-duplexes"
              checked={applyToAllDuplexes}
              onChange={(e) => setApplyToAllDuplexes(e.target.checked)}
              className="size-4 rounded accent-[#1E293B] cursor-pointer"
            />
            <label
              htmlFor="apply-all-duplexes"
              className="text-xs font-semibold text-[#1E293B] cursor-pointer select-none"
            >
              Aplicar este precio base y estas mismas tarifas de temporada a los 4 Dúplex
            </label>
          </div>
        )}
      </div>

      {/* Descripción */}
      <div>
        <label
          htmlFor="prop-desc"
          className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-1.5"
        >
          Descripción de la Unidad
        </label>
        <textarea
          id="prop-desc"
          name="description"
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          rows={3}
          className="w-full rounded-xl bg-[#EFEFEF]/60 border border-[#D7E0EB] px-3.5 py-2.5 text-sm text-[#1E293B] resize-y"
        />
      </div>

      {/* Fotos */}
      <div>
        <span className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-2">
          Fotos de la Unidad (Rutas locales `/fotos/...` o URLs)
        </span>
        {form.images.map((url, i) => (
          <ImageUrlRow
            key={i}
            url={url}
            index={i}
            onChange={handleImageChange}
            onRemove={removeImage}
          />
        ))}
        <button
          type="button"
          onClick={addImage}
          className="mt-1 inline-flex items-center gap-1.5 rounded-xl bg-[#E7EEF5] hover:bg-[#D7E0EB] text-[#1E293B] px-4 py-2 text-xs font-semibold cursor-pointer transition-colors"
        >
          <Plus className="size-3.5" />
          <span>Sumar otra foto</span>
        </button>
      </div>

      {/* Comodidades */}
      <div>
        <span className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-2">
          Etiquetas y Comodidades Incluidas (se reflejan en la portada)
        </span>
        <div className="flex flex-wrap gap-2">
          {Array.from(new Set([...AMENITY_OPTIONS, ...form.amenities])).map((a) => {
            const active = form.amenities.includes(a);
            return (
              <button
                key={a}
                type="button"
                onClick={() => toggleAmenity(a)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  active
                    ? "bg-[#1E293B] text-white"
                    : "bg-[#EFEFEF] text-[#5A697D] hover:text-[#1E293B]"
                }`}
              >
                {active && <Check className="size-3" />}
                <span>{a}</span>
              </button>
            );
          })}
        </div>

        {/* Agregar etiqueta personalizada */}
        <div className="mt-3 flex items-center gap-2 max-w-md">
          <input
            type="text"
            value={customAmenity}
            onChange={(e) => setCustomAmenity(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddCustomAmenity();
              }
            }}
            placeholder="Agregar otra etiqueta..."
            className="flex-1 rounded-xl bg-[#EFEFEF]/60 border border-[#D7E0EB] px-3 py-2 text-xs font-medium text-[#1E293B] outline-none focus:border-[#1E293B] focus:bg-white"
          />
          <button
            type="button"
            onClick={handleAddCustomAmenity}
            className="inline-flex items-center gap-1 rounded-xl bg-[#E7EEF5] hover:bg-[#D7E0EB] text-[#1E293B] px-3.5 py-2 text-xs font-bold cursor-pointer transition-colors"
          >
            <Plus className="size-3.5" />
            <span>Sumar</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs font-semibold text-red-800 flex items-center gap-2">
          <ShieldAlert className="size-4" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="size-4" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="flex justify-end gap-2.5 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-xl border border-[#D7E0EB] bg-white text-xs font-semibold text-[#5A697D] hover:bg-[#EFEFEF] cursor-pointer"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1E293B] hover:bg-[#0F172A] text-white text-xs font-semibold cursor-pointer shadow-sm transition-all"
        >
          <Save className="size-3.5" />
          <span>{saving ? "Guardando en el Sistema..." : "Guardar Cambios y Actualizar Web"}</span>
        </button>
      </div>
    </form>
  );
}

function PropertyCard({ property, onEdit }) {
  const price = property.price_per_night || property.pricePerNight || 0;
  const img = property.images?.[0];
  const seasonalList = property.seasonalRates || property.seasonal_rates || [];
  const amenitiesList = sanitizeAmenities(property.amenities || [], property.type || "duplex");

  return (
    <div className="rounded-[1.75rem] bg-white p-4 border border-[#D7E0EB] flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
      <div>
        <div className="relative h-48 rounded-[1.25rem] overflow-hidden bg-[#EFEFEF] mb-4">
          {img ? (
            <img
              src={img}
              alt={property.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="h-full flex items-center justify-center text-[#5A697D]">
              <Building2 className="size-10" />
            </div>
          )}
          <span className="absolute top-3 left-3 rounded-full bg-[#1E293B]/85 backdrop-blur-md px-3 py-1 text-[11px] font-bold uppercase text-white">
            {property.type}
          </span>
          {seasonalList.length > 0 && (
            <span className="absolute bottom-3 left-3 rounded-full bg-amber-500/90 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-white flex items-center gap-1">
              <Sparkles className="size-3" />
              <span>{seasonalList.length} {seasonalList.length === 1 ? "temporada" : "temporadas"}</span>
            </span>
          )}
        </div>

        <div className="px-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-bold text-[#1E293B]">
              {property.name}
            </h3>
            <div className="text-right">
              <div className="text-base font-extrabold text-[#1E293B]">
                ${Number(price).toLocaleString("es-AR")}
              </div>
              <div className="text-[11px] text-[#5A697D]">base / noche</div>
            </div>
          </div>

          <p className="mt-2 text-xs text-[#5A697D] leading-relaxed line-clamp-2">
            {property.description}
          </p>

          {/* Etiquetas activas */}
          {amenitiesList.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {amenitiesList.map((am) => (
                <span
                  key={am}
                  className="rounded-full bg-[#EFEFEF] border border-[#D7E0EB] px-2.5 py-0.5 text-[10px] font-semibold text-[#1E293B]"
                >
                  {am}
                </span>
              ))}
            </div>
          )}

          {/* Listado rápido de temporadas */}
          {seasonalList.length > 0 && (
            <div className="mt-3 pt-2.5 border-t border-[#EFEFEF] space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A697D] block">
                Tarifas de Alta Demanda:
              </span>
              {seasonalList.slice(0, 2).map((s) => (
                <div key={s.id} className="flex items-center justify-between text-[11px] text-[#1E293B]">
                  <span className="truncate">{s.name}:</span>
                  <strong className="shrink-0 font-bold">${Number(s.pricePerNight).toLocaleString("es-AR")}</strong>
                </div>
              ))}
              {seasonalList.length > 2 && (
                <span className="text-[10px] text-[#5A697D] italic">
                  +{seasonalList.length - 2} temporada(s) más
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-[#EFEFEF] flex items-center justify-between px-1">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A697D]">
          <Users className="size-3.5 text-[#1E293B]" />
          <span>{property.capacity} personas</span>
        </span>
        <button
          type="button"
          onClick={() => onEdit(property)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#E7EEF5] hover:bg-[#1E293B] text-[#1E293B] hover:text-white px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer"
        >
          <Pencil className="size-3.5" />
          <span>Editar Unidad y Tarifas</span>
        </button>
      </div>
    </div>
  );
}

export default function PropiedadesAdmin() {
  const [props, setProps] = useState([]);
  const [editing, setEditing] = useState(null);

  const reloadProperties = useCallback(async () => {
    const list = await getProperties();
    setProps(list || getStoredProperties());
  }, []);

  useEffect(() => {
    reloadProperties();

    const handleSync = () => {
      setProps(getStoredProperties());
    };

    window.addEventListener("toninas_properties_changed", handleSync);
    window.addEventListener("storage", handleSync);

    return () => {
      window.removeEventListener("toninas_properties_changed", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, [reloadProperties]);

  const handleSave = () => {
    setProps(getStoredProperties());
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#5A697D]">
            Catálogo, Etiquetas y Tarifas
          </span>
          <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-[#1E293B]">
            Unidades, Precios, Etiquetas y Temporadas
          </h2>
          <p className="text-xs sm:text-sm text-[#5A697D] mt-1">
            Modificá precios base, etiquetas de comodidades y tarifas por rango de fechas. Los cambios se sincronizan en Supabase y se reflejan de inmediato en la portada.
          </p>
        </div>
      </div>

      {editing && (
        <div className="rounded-[2rem] bg-white p-6 sm:p-8 border-2 border-[#1E293B] shadow-xl">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#EFEFEF]">
            <div>
              <span className="text-xs font-bold text-[#5A697D] uppercase">
                Panel de Configuración
              </span>
              <h3 className="text-xl font-bold text-[#1E293B]">
                Editando: {editing.name}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setEditing(null)}
              aria-label="Cerrar edición"
              className="size-8 rounded-full bg-[#EFEFEF] flex items-center justify-center text-[#5A697D] hover:text-[#1E293B] cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>
          <PropertyEditForm
            key={editing.id}
            property={editing}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {props.map((p) => (
          <PropertyCard key={p.id} property={p} onEdit={setEditing} />
        ))}
      </div>
    </div>
  );
}
