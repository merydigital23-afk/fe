"use client";

import { useState } from "react";

export default function CompletarPerfilPage() {
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);

  function handleFotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFotoPreview(URL.createObjectURL(file));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Todavía no guarda: falta crear la tabla de usuarios en la base de datos.
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col px-6 py-8">
      <div className="flex flex-1 flex-col justify-center gap-6 py-6">
        <div>
          <h1 className="font-display text-3xl font-semibold text-earth">
            Completá tu perfil
          </h1>
          <p className="mt-2 text-sm text-earth/70">
            Así te van a reconocer los demás vecinos.
          </p>
        </div>

        <div className="flex gap-3 rounded-lg border border-sand bg-beige px-4 py-4">
          <div className="w-[3px] shrink-0 rounded-full bg-wood" />
          <p className="font-display text-base italic text-earth">
            El trueque no se basa en precios, sino en necesidades.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <label
            htmlFor="foto"
            className="flex cursor-pointer flex-col items-center gap-3 self-center"
          >
            <span className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-sand bg-beige text-earth/40 transition-colors hover:bg-sand/40">
              {fotoPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={fotoPreview}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M4 7h3l2-2h6l2 2h3a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z" />
                  <circle cx="12" cy="13" r="3.5" />
                </svg>
              )}
            </span>
            <span className="text-sm font-semibold text-terracotta">
              {fotoPreview ? "Cambiar foto" : "Agregar foto"}
            </span>
          </label>
          <input
            id="foto"
            name="foto"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleFotoChange}
          />

          <div className="flex flex-col gap-1.5">
            <label htmlFor="nombre" className="text-sm font-medium text-earth">
              Nombre
            </label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              required
              placeholder="Tu nombre"
              className="h-12 rounded-lg border border-sand bg-beige px-4 text-base text-earth placeholder:text-earth/40 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="zona" className="text-sm font-medium text-earth">
              Barrio / zona
            </label>
            <input
              id="zona"
              name="zona"
              type="text"
              required
              placeholder="Tu barrio en Crespo"
              className="h-12 rounded-lg border border-sand bg-beige px-4 text-base text-earth placeholder:text-earth/40 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="bio" className="text-sm font-medium text-earth">
              Biografía{" "}
              <span className="font-normal text-earth/50">(opcional)</span>
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={3}
              placeholder="Contales a tus vecinos algo sobre vos"
              className="resize-none rounded-lg border border-sand bg-beige px-4 py-3 text-base text-earth placeholder:text-earth/40 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
            />
          </div>

          <button
            type="submit"
            className="mt-2 flex h-12 w-full items-center justify-center rounded-full bg-terracotta text-base font-semibold text-cream transition-colors hover:bg-terracotta/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
          >
            Guardar y continuar
          </button>
        </form>
      </div>
    </main>
  );
}
