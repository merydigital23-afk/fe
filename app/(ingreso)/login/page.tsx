"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function traducirErrorLogin(mensaje: string): string {
  const m = mensaje.toLowerCase();
  if (m.includes("invalid") && m.includes("credentials")) {
    return "Correo o contraseña incorrectos.";
  }
  if (m.includes("rate limit")) {
    return "Hiciste muchos intentos seguidos. Esperá un minuto y probá de nuevo.";
  }
  return "No pudimos iniciar sesión. Probá de nuevo en un momento.";
}

export default function LoginPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "adentro">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      if (error.message.toLowerCase().includes("not confirmed")) {
        router.push(`/verificacion?email=${encodeURIComponent(email)}`);
        return;
      }
      setStatus("error");
      setErrorMsg(traducirErrorLogin(error.message));
      return;
    }

    const { data: perfil } = await supabase
      .from("usuarios")
      .select("id")
      .eq("id", data.user.id)
      .maybeSingle();

    if (!perfil) {
      router.push("/completar-perfil");
      return;
    }

    setStatus("adentro");
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
        {status === "adentro" ? (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-sand bg-beige px-5 py-8 text-center">
            <p className="font-display text-2xl font-semibold text-olive">
              ¡Iniciaste sesión!
            </p>
            <p className="text-sm text-earth/80">
              Tu cuenta y tu perfil ya están listos. Las próximas pantallas
              (Inicio, Explorar) todavía no están construidas.
            </p>
          </div>
        ) : (
          <>
            <div>
              <h1 className="font-display text-3xl font-semibold text-earth">
                Iniciá sesión
              </h1>
              <p className="mt-2 text-sm text-earth/70">
                Entrá con tu correo y contraseña.
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
                  autoComplete="current-password"
                  placeholder="Tu contraseña"
                  className="h-12 rounded-lg border border-sand bg-beige px-4 text-base text-earth placeholder:text-earth/40 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="mt-2 flex h-12 w-full items-center justify-center rounded-full bg-terracotta text-base font-semibold text-cream transition-colors hover:bg-terracotta/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-cream disabled:opacity-60"
              >
                {status === "loading" ? "Ingresando…" : "Iniciar sesión"}
              </button>
            </form>

            <p className="text-center text-sm text-earth/60">
              ¿No tenés cuenta?{" "}
              <Link
                href="/registro"
                className="font-semibold text-terracotta focus-visible:outline-none focus-visible:underline"
              >
                Crear cuenta
              </Link>
            </p>
          </>
        )}
      </div>
    </main>
  );
}
