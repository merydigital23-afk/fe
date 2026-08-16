"use client";

import { useRouter } from "next/navigation";
import { usePublicar } from "../publicar-context";
import { PasoIndicator } from "../paso-indicator";

const MAX_FOTOS = 8;

export default function PublicarPaso2() {
  const router = useRouter();
  const { estado, setEstado } = usePublicar();

  function handleAgregarFotos(e: React.ChangeEvent<HTMLInputElement>) {
    const archivos = Array.from(e.target.files ?? []);
    if (archivos.length === 0) return;
    setEstado((s) => {
      const espacioDisponible = MAX_FOTOS - s.fotos.length;
      const nuevas = archivos.slice(0, espacioDisponible).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      return { ...s, fotos: [...s.fotos, ...nuevas] };
    });
    e.target.value = "";
  }

  function quitarFoto(index: number) {
    setEstado((s) => ({ ...s, fotos: s.fotos.filter((_, i) => i !== index) }));
  }

  function handleSiguiente() {
    if (estado.fotos.length === 0) return;
    router.push("/publicar/paso-3");
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col px-6 py-8">
      <PasoIndicator actual={2} />

      <div className="flex flex-1 flex-col justify-center gap-6 py-6">
        <div>
          <h1 className="font-display text-3xl font-semibold text-earth">Sumá fotos</h1>
          <p className="mt-2 text-sm text-earth/70">
            Hasta {MAX_FOTOS} fotos. Cuantas más, más fácil que alguien se interese.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {estado.fotos.map((foto, i) => (
            <div key={i} className="relative aspect-square overflow-hidden rounded-lg border border-sand">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={foto.preview} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => quitarFoto(i)}
                aria-label="Quitar foto"
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-earth/80 text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
          ))}

          {estado.fotos.length < MAX_FOTOS && (
            <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-sand bg-beige text-earth/50 transition-colors hover:bg-sand/40">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 5v14M5 12h14" />
              </svg>
              <span className="text-xs font-medium">Agregar</span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={handleAgregarFotos}
              />
            </label>
          )}
        </div>

        <p className="text-center text-sm text-earth/50">
          {estado.fotos.length}/{MAX_FOTOS} fotos
        </p>

        <div className="mt-2 flex gap-3">
          <button
            type="button"
            onClick={() => router.push("/publicar/paso-1")}
            className="flex h-12 flex-1 items-center justify-center rounded-full border border-sand text-base font-semibold text-earth transition-colors hover:bg-beige focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
          >
            Atrás
          </button>
          <button
            type="button"
            onClick={handleSiguiente}
            disabled={estado.fotos.length === 0}
            className="flex h-12 flex-1 items-center justify-center rounded-full bg-terracotta text-base font-semibold text-cream transition-colors hover:bg-terracotta/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-cream disabled:opacity-60"
          >
            Siguiente
          </button>
        </div>
      </div>
    </main>
  );
}
