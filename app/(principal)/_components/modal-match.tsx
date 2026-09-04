"use client";

import Link from "next/link";

export function ModalMatch({ titulo, onCerrar }: { titulo: string; onCerrar: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-earth/60 px-6">
      <div className="flex w-full max-w-sm flex-col items-center gap-4 rounded-2xl bg-cream px-6 py-8 text-center shadow-lg">
        <p className="font-display text-2xl font-semibold text-terracotta">¡Tenés un Match!</p>
        <p className="text-sm text-earth/80">
          A quien publicó <span className="font-semibold">&quot;{titulo}&quot;</span> también le
          interesó algo tuyo.
        </p>
        <div className="flex w-full flex-col gap-2">
          <Link
            href="/matches"
            className="flex h-11 w-full items-center justify-center rounded-full bg-terracotta text-sm font-semibold text-cream transition-colors hover:bg-terracotta/90"
          >
            Ver mis matches
          </Link>
          <button
            type="button"
            onClick={onCerrar}
            className="flex h-11 w-full items-center justify-center rounded-full border border-sand text-sm font-semibold text-earth transition-colors hover:bg-beige"
          >
            Seguir descubriendo
          </button>
        </div>
      </div>
    </div>
  );
}
