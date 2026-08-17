"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Mensaje = {
  id: string;
  usuario_id: string;
  texto: string;
  creado_en: string;
};

export function Chat({
  matchId,
  usuarioId,
  mensajesIniciales,
}: {
  matchId: string;
  usuarioId: string;
  mensajesIniciales: Mensaje[];
}) {
  const [mensajes, setMensajes] = useState(mensajesIniciales);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    const canal = supabase
      .channel(`mensajes-${matchId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "mensajes",
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          const nuevo = payload.new as Mensaje;
          setMensajes((prev) =>
            prev.some((m) => m.id === nuevo.id) ? prev : [...prev, nuevo],
          );
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(canal);
    };
  }, [matchId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes.length]);

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const valor = texto.trim();
    if (!valor || enviando) return;
    setEnviando(true);

    const supabase = createClient();
    const { data, error } = await supabase
      .from("mensajes")
      .insert({ match_id: matchId, usuario_id: usuarioId, texto: valor })
      .select()
      .single();

    if (!error && data) {
      setMensajes((prev) => (prev.some((m) => m.id === data.id) ? prev : [...prev, data]));
      setTexto("");
    }
    setEnviando(false);
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto py-4">
        {mensajes.length === 0 && (
          <p className="mt-8 text-center text-sm text-earth/50">
            Todavía no hay mensajes. Escribí para arrancar la conversación.
          </p>
        )}

        <div className="flex flex-col gap-2">
          {mensajes.map((m) => {
            const esMio = m.usuario_id === usuarioId;
            return (
              <div
                key={m.id}
                className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                  esMio
                    ? "self-end bg-terracotta text-cream"
                    : "self-start border border-sand bg-beige text-earth"
                }`}
              >
                {m.texto}
              </div>
            );
          })}
        </div>
        <div ref={bottomRef} />
      </div>

      <form onSubmit={enviar} className="flex gap-2 border-t border-sand pt-4">
        <input
          type="text"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escribí un mensaje…"
          className="h-12 flex-1 rounded-full border border-sand bg-beige px-4 text-base text-earth placeholder:text-earth/40 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
        />
        <button
          type="submit"
          disabled={!texto.trim() || enviando}
          aria-label="Enviar"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-terracotta text-cream transition-colors hover:bg-terracotta/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-cream disabled:opacity-60"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" />
          </svg>
        </button>
      </form>
    </div>
  );
}
