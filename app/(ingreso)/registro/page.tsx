"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function traducirErrorAuth(mensaje: string): string {
  const m = mensaje.toLowerCase();
  if (m.includes("already") || m.includes("registered")) {
    return "Ya existe una cuenta con este correo. Probá iniciar sesión.";
  }
  if (m.includes("rate limit")) {
    return "Hiciste muchos intentos seguidos. Esperá un minuto y probá de nuevo.";
  }
  if (m.includes("password")) {
    return "La contraseña tiene que tener al menos 8 caracteres.";
  }
  if (m.includes("email")) {
    return "Ese correo no parece válido. Revisalo y probá de nuevo.";
  }
  return "Algo salió mal al crear la cuenta. Probá de nuevo en un momento.";
}

export default function RegistroPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const formData = new FormData(e.currentTarget);
    const emailValue = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({ email: emailValue, password });

    if (error) {
      setStatus("error");
      setErrorMsg(traducirErrorAuth(error.message));
      return;
    }

    router.push(`/verificacion?email=${encodeURIComponent(emailValue)}`);
  }

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

        {status === "error" && (
          <div className="rounded-lg border border-sand bg-beige px-4 py-3 text-sm font-medium text-earth">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
            disabled={status === "loading"}
            className="mt-2 flex h-12 w-full items-center justify-center rounded-full bg-terracotta text-base font-semibold text-cream transition-colors hover:bg-terracotta/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-cream disabled:opacity-60"
          >
            {status === "loading" ? "Creando cuenta…" : "Crear cuenta"}
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
