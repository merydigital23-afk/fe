"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function traducirErrorAuth(mensaje: string): string {
  const m = mensaje.toLowerCase();
  if (m.includes("rate limit")) {
    return "Ya pediste el reenvío hace poco. Esperá un minuto y probá de nuevo.";
  }
  return "No pudimos reenviar el correo. Probá de nuevo en un momento.";
}

export default function VerificacionContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const confirmError = searchParams.get("error") === "confirmacion";
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleResend() {
    if (!email) return;
    setStatus("sending");
    const supabase = createClient();
    const { error } = await supabase.auth.resend({ type: "signup", email });

    if (error) {
      setStatus("error");
      setErrorMsg(traducirErrorAuth(error.message));
      return;
    }
    setStatus("sent");
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col px-6 py-8">
      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-sand text-earth">
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M3 7l9 6 9-6" />
          </svg>
        </div>

        <div>
          <h1 className="font-display text-3xl font-semibold text-earth">
            Revisá tu correo
          </h1>
          <p className="mt-3 text-sm text-earth/70">
            {email ? (
              <>
                Te mandamos un enlace de confirmación a{" "}
                <strong className="text-earth">{email}</strong>. Abrilo para
                activar tu cuenta.
              </>
            ) : (
              "Te mandamos un enlace de confirmación a tu correo. Abrilo para activar tu cuenta."
            )}
          </p>
        </div>

        {confirmError && (
          <p className="rounded-lg border border-sand bg-beige px-4 py-3 text-sm font-medium text-earth">
            Ese enlace ya no es válido o venció. Pedí uno nuevo abajo.
          </p>
        )}

        {status === "sent" && (
          <p className="text-sm font-medium text-olive">
            Te lo reenviamos. Revisá tu bandeja de entrada.
          </p>
        )}
        {status === "error" && (
          <p className="rounded-lg border border-sand bg-beige px-4 py-3 text-sm font-medium text-earth">
            {errorMsg}
          </p>
        )}

        {email && (
          <button
            type="button"
            onClick={handleResend}
            disabled={status === "sending"}
            className="text-sm font-semibold text-terracotta focus-visible:outline-none focus-visible:underline disabled:opacity-60"
          >
            {status === "sending" ? "Reenviando…" : "¿No te llegó? Reenviar correo"}
          </button>
        )}

        <p className="mt-4 text-sm text-earth/60">
          ¿Ya confirmaste?{" "}
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
