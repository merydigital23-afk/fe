import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Onboarding · CrespoTrueké",
};

const pasos = [
  { numero: "1", texto: "Publicá lo que ofrecés o lo que necesitás" },
  { numero: "2", texto: "Encontrá con quién intercambiar" },
  { numero: "3", texto: "Coordiná el encuentro por chat" },
];

export default function OnboardingPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col px-6 py-10">
      <p className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-earth/50">
        CrespoTrueké
      </p>

      <div className="flex flex-1 flex-col justify-center gap-10 py-10">
        <div className="text-center">
          <h1 className="text-balance font-display text-3xl font-semibold text-earth sm:text-4xl">
            Ofrecé lo que tenés. Encontrá lo que necesitás.
          </h1>
          <p className="mt-4 text-base text-earth/70">
            Objetos, servicios, tiempo o conocimiento — entre vecinos de Crespo.
          </p>
        </div>

        <ol className="flex flex-col gap-4">
          {pasos.map((paso) => (
            <li key={paso.numero} className="flex items-center gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-sand text-sm font-semibold text-earth">
                {paso.numero}
              </span>
              <span className="text-sm text-earth/80">{paso.texto}</span>
            </li>
          ))}
        </ol>

        <div className="flex gap-3 rounded-lg border border-sand bg-beige px-4 py-4">
          <div className="w-[3px] shrink-0 rounded-full bg-wood" />
          <p className="font-display text-base italic text-earth">
            El trueque no se basa en precios, sino en necesidades.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 pb-4">
        <Link
          href="/registro"
          className="flex h-12 w-full items-center justify-center rounded-full bg-terracotta text-base font-semibold text-cream transition-colors hover:bg-terracotta/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
        >
          Empezar
        </Link>
        <p className="text-sm text-earth/60">
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
