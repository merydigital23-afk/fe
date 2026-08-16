"use client";

import { useRouter } from "next/navigation";
import { usePublicar } from "../publicar-context";
import { PasoIndicator } from "../paso-indicator";

export default function PublicarPaso1() {
  const router = useRouter();
  const { estado, setEstado } = usePublicar();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!estado.tipo) return;
    router.push("/publicar/paso-2");
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col px-6 py-8">
      <PasoIndicator actual={1} />

      <form onSubmit={handleSubmit} className="flex flex-1 flex-col justify-center gap-6 py-6">
        <div>
          <h1 className="font-display text-3xl font-semibold text-earth">
            ¿Qué vas a publicar?
          </h1>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setEstado((e) => ({ ...e, tipo: "ofrezco" }))}
            className={`flex h-14 items-center justify-center rounded-lg border text-base font-semibold transition-colors ${
              estado.tipo === "ofrezco"
                ? "border-terracotta bg-terracotta text-cream"
                : "border-sand bg-beige text-earth hover:bg-sand/40"
            }`}
          >
            Ofrezco
          </button>
          <button
            type="button"
            onClick={() => setEstado((e) => ({ ...e, tipo: "necesito" }))}
            className={`flex h-14 items-center justify-center rounded-lg border text-base font-semibold transition-colors ${
              estado.tipo === "necesito"
                ? "border-terracotta bg-terracotta text-cream"
                : "border-sand bg-beige text-earth hover:bg-sand/40"
            }`}
          >
            Necesito
          </button>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="categoria" className="text-sm font-medium text-earth">
            Categoría
          </label>
          <input
            id="categoria"
            required
            value={estado.categoria}
            onChange={(e) => setEstado((s) => ({ ...s, categoria: e.target.value }))}
            placeholder="Ej: Herramientas, Ropa, Servicios, Huerta"
            className="h-12 rounded-lg border border-sand bg-beige px-4 text-base text-earth placeholder:text-earth/40 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
          />
        </div>

        <label className="flex cursor-pointer items-start gap-3 text-sm text-earth">
          <input
            type="checkbox"
            checked={estado.disponibilidadInmediata}
            onChange={(e) =>
              setEstado((s) => ({ ...s, disponibilidadInmediata: e.target.checked }))
            }
            className="mt-0.5 h-5 w-5 shrink-0 accent-terracotta"
          />
          <span>
            Disponibilidad inmediata
            <span className="block text-earth/50">Para excedentes de huerta, productos frescos listos para entregar ya.</span>
          </span>
        </label>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="titulo" className="text-sm font-medium text-earth">
            Título
          </label>
          <input
            id="titulo"
            required
            value={estado.titulo}
            onChange={(e) => setEstado((s) => ({ ...s, titulo: e.target.value }))}
            placeholder="Ej: Taladro eléctrico"
            className="h-12 rounded-lg border border-sand bg-beige px-4 text-base text-earth placeholder:text-earth/40 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="descripcion" className="text-sm font-medium text-earth">
            Descripción
          </label>
          <textarea
            id="descripcion"
            required
            rows={4}
            value={estado.descripcion}
            onChange={(e) => setEstado((s) => ({ ...s, descripcion: e.target.value }))}
            placeholder="Contá el estado, para qué sirve, cualquier detalle útil"
            className="resize-none rounded-lg border border-sand bg-beige px-4 py-3 text-base text-earth placeholder:text-earth/40 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
          />
        </div>

        <button
          type="submit"
          disabled={!estado.tipo}
          className="mt-2 flex h-12 w-full items-center justify-center rounded-full bg-terracotta text-base font-semibold text-cream transition-colors hover:bg-terracotta/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-cream disabled:opacity-60"
        >
          Siguiente
        </button>
      </form>
    </main>
  );
}
