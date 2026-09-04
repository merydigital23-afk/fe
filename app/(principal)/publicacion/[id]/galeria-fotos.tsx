"use client";

import { useState } from "react";

export function GaleriaFotos({ fotos }: { fotos: string[] }) {
  const [fotoAmpliada, setFotoAmpliada] = useState<string | null>(null);

  if (fotos.length === 0) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-2xl border border-sand bg-beige text-earth/30">
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <circle cx="9" cy="10" r="1.5" />
          <path d="M21 16l-5.5-5.5a1 1 0 0 0-1.4 0L4 21" />
        </svg>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        {fotos.map((foto, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setFotoAmpliada(foto)}
            className={`overflow-hidden rounded-lg border border-sand ${
              i === 0 ? "col-span-2 aspect-video" : "aspect-square"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={foto} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>

      {fotoAmpliada && (
        <div
          onClick={() => setFotoAmpliada(null)}
          className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-earth/90 p-4"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={fotoAmpliada} alt="" className="max-h-full max-w-full object-contain" />
        </div>
      )}
    </>
  );
}
