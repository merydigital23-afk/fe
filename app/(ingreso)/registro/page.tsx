"use client";

import Link from "next/link";

export default function RegistroPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col px-6 py-8">
      <Link
        href="/onboarding"
        aria-label="Volver"
        className="flex h-9 w-9 items-center justify-center rounded-full text-earth transition-colors hover:bg-beige focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </Link>

      <div className="flex flex-1 flex-col justify-center gap-8 py-6">
        <div>
          <h1 className="font-display text-3xl font-semibold text-earth">
            Creá tu cuenta
          </h1>
          <p className="mt-2 text-sm text-earth/70">
            Con tu correo alcanza para empezar.
          </p>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-earth">
              Correo electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="vos@ejemplo.com"
              className="h-12 rounded-lg border border-sand bg-beige px-4 text-base text-earth placeholder:text-earth/40 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-earth">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="Mínimo 8 caracteres"
              className="h-12 rounded-lg border border-sand bg-beige px-4 text-base text-earth placeholder:text-earth/40 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
            />
          </div>

          <button
            type="submit"
            className="mt-2 flex h-12 w-full items-center justify-center rounded-full bg-terracotta text-base font-semibold text-cream transition-colors hover:bg-terracotta/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
          >
            Crear cuenta
          </button>
        </form>

        <p className="text-center text-sm text-earth/60">
          ¿Ya tenés cuenta?{" "}
          <Link
            href="/login"
            className="font-semibold text-terracotta focus-visible:outline-none focus-visible:underline"
          >
            Iniciar sesión
          </Link>
        </p>
      </div>
    </main>
  );
}
