"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const CATEGORIAS = [
  { clave: "puntualidad", etiqueta: "Puntualidad" },
  { clave: "comunicacion", etiqueta: "Comunicación" },
  { clave: "estado_producto", etiqueta: "Estado del producto" },
  { clave: "cumplimiento", etiqueta: "Cumplimiento" },
  { clave: "amabilidad", etiqueta: "Amabilidad" },
] as const;

type Clave = (typeof CATEGORIAS)[number]["clave"];

function SelectorEstrellas({
  etiqueta,
  valor,
  onChange,
}: {
  etiqueta: string;
  valor: number;
  onChange: (valor: number) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-earth">{etiqueta}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            aria-label={`${n} estrella${n > 1 ? "s" : ""}`}
            className="p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill={n <= valor ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
              className={n <= valor ? "text-terracotta" : "text-sand"}
              aria-hidden="true"
            >
              <path d="M12 2.5l2.9 6.3 6.9.7-5.2 4.7 1.5 6.8L12 17.6l-6.1 3.4 1.5-6.8-5.2-4.7 6.9-.7L12 2.5z" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}

export function FormularioCalificacion({
  matchId,
  usuarioId,
  calificadoId,
}: {
  matchId: string;
  usuarioId: string;
  calificadoId: string;
}) {
  const router = useRouter();
  const [puntajes, setPuntajes] = useState<Record<Clave, number>>({
    puntualidad: 0,
    comunicacion: 0,
    estado_producto: 0,
    cumplimiento: 0,
    amabilidad: 0,
  });
  const [comentario, setComentario] = useState("");
  const [status, setStatus] = useState<"idle" | "enviando" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const completo = CATEGORIAS.every((c) => puntajes[c.clave] > 0);

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!completo) return;
    setStatus("enviando");

    const supabase = createClient();
    const { error } = await supabase.from("calificaciones").insert({
      match_id: matchId,
      calificador_id: usuarioId,
      calificado_id: calificadoId,
      ...puntajes,
      comentario: comentario.trim() || null,
    });

    if (error) {
      setStatus("error");
      setErrorMsg("No pudimos guardar tu calificación. Probá de nuevo en un momento.");
      return;
    }

    router.refresh();
  }

  return (
    <form onSubmit={enviar} className="flex flex-col gap-6">
      {status === "error" && (
        <div className="rounded-lg border border-sand bg-beige px-4 py-3 text-sm font-medium text-earth">
          {errorMsg}
        </div>
      )}

      {CATEGORIAS.map((c) => (
        <SelectorEstrellas
          key={c.clave}
          etiqueta={c.etiqueta}
          valor={puntajes[c.clave]}
          onChange={(v) => setPuntajes((p) => ({ ...p, [c.clave]: v }))}
        />
      ))}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="comentario" className="text-sm font-medium text-earth">
          Comentario <span className="font-normal text-earth/50">(opcional)</span>
        </label>
        <textarea
          id="comentario"
          rows={3}
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Contá cómo fue el intercambio"
          className="resize-none rounded-lg border border-sand bg-beige px-4 py-3 text-base text-earth placeholder:text-earth/40 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
        />
      </div>

      <button
        type="submit"
        disabled={!completo || status === "enviando"}
        className="flex h-12 w-full items-center justify-center rounded-full bg-terracotta text-base font-semibold text-cream transition-colors hover:bg-terracotta/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-cream disabled:opacity-60"
      >
        {status === "enviando" ? "Enviando…" : "Enviar calificación"}
      </button>
    </form>
  );
}
