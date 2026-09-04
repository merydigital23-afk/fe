"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { registrarInteres } from "@/lib/intereses";
import { ModalMatch } from "../_components/modal-match";

type Publicacion = {
  id: string;
  tipo: string;
  categoria: string;
  titulo: string;
  descripcion: string;
  zona: string;
  fotos: string[] | null;
  acepta_a_cambio: string | null;
};

const UMBRAL_PX = 100;

export function PilaSwipe({
  publicacionesIniciales,
}: {
  publicacionesIniciales: Publicacion[];
}) {
  const [pila, setPila] = useState(publicacionesIniciales);
  const [arrastre, setArrastre] = useState({ x: 0, y: 0 });
  const [saliendo, setSaliendo] = useState<"izquierda" | "derecha" | null>(null);
  const [animarRegreso, setAnimarRegreso] = useState(false);
  const [matchPublicacion, setMatchPublicacion] = useState<Publicacion | null>(null);
  const arrastrandoRef = useRef(false);
  const inicioRef = useRef({ x: 0, y: 0 });

  const actual = pila[0];
  const siguiente = pila[1];

  function decidir(direccion: "izquierda" | "derecha") {
    if (!actual || saliendo) return;
    setSaliendo(direccion);
    const publicacionDecidida = actual;
    registrarInteres(publicacionDecidida.id, direccion === "derecha").then((huboMatch) => {
      if (huboMatch) setMatchPublicacion(publicacionDecidida);
    });
    setTimeout(() => {
      setPila((p) => p.slice(1));
      setSaliendo(null);
      setArrastre({ x: 0, y: 0 });
    }, 220);
  }

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (saliendo) return;
    setAnimarRegreso(false);
    arrastrandoRef.current = true;
    inicioRef.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!arrastrandoRef.current) return;
    setArrastre({
      x: e.clientX - inicioRef.current.x,
      y: e.clientY - inicioRef.current.y,
    });
  }

  function handlePointerUp() {
    if (!arrastrandoRef.current) return;
    arrastrandoRef.current = false;
    if (Math.abs(arrastre.x) > UMBRAL_PX) {
      decidir(arrastre.x > 0 ? "derecha" : "izquierda");
    } else {
      setAnimarRegreso(true);
      setArrastre({ x: 0, y: 0 });
    }
  }

  if (!actual) {
    return (
      <>
        <div className="flex flex-1 flex-col items-center justify-center gap-2 py-16 text-center">
          <p className="font-display text-xl font-semibold text-earth">
            Por ahora no hay más para descubrir
          </p>
          <p className="text-sm text-earth/60">
            Volvé más tarde, o mirá todo junto en Explorar.
          </p>
        </div>
        {matchPublicacion && (
          <ModalMatch titulo={matchPublicacion.titulo} onCerrar={() => setMatchPublicacion(null)} />
        )}
      </>
    );
  }

  const desplazamientoX = saliendo
    ? saliendo === "derecha"
      ? 600
      : -600
    : arrastre.x;
  const rotacion = desplazamientoX / 18;
  const transform = `translate(${desplazamientoX}px, ${arrastre.y}px) rotate(${rotacion}deg)`;
  const transition =
    saliendo || animarRegreso ? "transform 220ms ease-out" : "none";

  const opacidadInteresa = Math.min(Math.max(arrastre.x / UMBRAL_PX, 0), 1);
  const opacidadPaso = Math.min(Math.max(-arrastre.x / UMBRAL_PX, 0), 1);

  return (
    <>
    <div className="flex flex-1 flex-col items-center justify-center gap-6 py-6">
      <div className="relative h-[520px] w-full max-w-sm">
        {siguiente && (
          <div className="absolute inset-0 scale-[0.96] rounded-2xl border border-sand bg-beige opacity-60" />
        )}

        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{ transform, transition, touchAction: "pan-y" }}
          className="absolute inset-0 flex cursor-grab flex-col overflow-hidden rounded-2xl border border-sand bg-beige shadow-sm active:cursor-grabbing"
        >
          <div className="relative h-3/5 w-full bg-sand/40">
            {actual.fotos?.[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={actual.fotos[0]}
                alt=""
                draggable={false}
                className="h-full w-full select-none object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-earth/30">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <circle cx="9" cy="10" r="1.5" />
                  <path d="M21 16l-5.5-5.5a1 1 0 0 0-1.4 0L4 21" />
                </svg>
              </div>
            )}

            <span
              style={{ opacity: opacidadInteresa }}
              className="absolute right-4 top-4 rounded-full border-2 border-olive bg-cream/90 px-3 py-1 text-sm font-bold uppercase tracking-wide text-olive"
            >
              Me interesa
            </span>
            <span
              style={{ opacity: opacidadPaso }}
              className="absolute left-4 top-4 rounded-full border-2 border-earth/50 bg-cream/90 px-3 py-1 text-sm font-bold uppercase tracking-wide text-earth/60"
            >
              Paso
            </span>
          </div>

          <div className="flex flex-1 flex-col gap-1.5 overflow-y-auto p-4">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="rounded-full border border-sand bg-cream px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-earth/70">
                {actual.tipo === "ofrezco" ? "Ofrezco" : "Necesito"}
              </span>
            </div>
            <p className="font-display text-xl font-semibold text-earth">{actual.titulo}</p>
            <p className="text-xs text-earth/60">
              {actual.categoria} · {actual.zona}
            </p>
            <p className="mt-1 text-sm text-earth/80">{actual.descripcion}</p>
            {actual.acepta_a_cambio && (
              <p className="mt-1 text-sm text-earth/70">
                <span className="font-medium text-earth">Acepta a cambio:</span>{" "}
                {actual.acepta_a_cambio}
              </p>
            )}
            <Link
              href={`/publicacion/${actual.id}`}
              className="mt-1 self-start text-xs font-semibold text-terracotta focus-visible:outline-none focus-visible:underline"
            >
              Ver publicación completa
            </Link>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        <button
          type="button"
          onClick={() => decidir("izquierda")}
          aria-label="Pasar"
          className="flex h-14 w-14 items-center justify-center rounded-full border border-sand bg-beige text-earth transition-colors hover:bg-sand/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => decidir("derecha")}
          aria-label="Me interesa"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-terracotta text-cream transition-colors hover:bg-terracotta/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20.8 8.6c0 4.5-8.8 10.1-8.8 10.1S3.2 13.1 3.2 8.6a4.8 4.8 0 0 1 8.8-2.6 4.8 4.8 0 0 1 8.8 2.6z" />
          </svg>
        </button>
      </div>
    </div>
    {matchPublicacion && (
      <ModalMatch titulo={matchPublicacion.titulo} onCerrar={() => setMatchPublicacion(null)} />
    )}
    </>
  );
}
