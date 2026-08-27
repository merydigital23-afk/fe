"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function ConfirmarIntercambio({
  matchId,
  usuarioId,
  usuarioUno,
  confirmadoUnoInicial,
  confirmadoDosInicial,
}: {
  matchId: string;
  usuarioId: string;
  usuarioUno: string;
  confirmadoUnoInicial: boolean;
  confirmadoDosInicial: boolean;
}) {
  const [confirmadoUno, setConfirmadoUno] = useState(confirmadoUnoInicial);
  const [confirmadoDos, setConfirmadoDos] = useState(confirmadoDosInicial);
  const [enviando, setEnviando] = useState(false);

  const soyUno = usuarioId === usuarioUno;
  const miConfirmado = soyUno ? confirmadoUno : confirmadoDos;
  const suConfirmado = soyUno ? confirmadoDos : confirmadoUno;

  useEffect(() => {
    const supabase = createClient();
    const canal = supabase
      .channel(`match-${matchId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "matches",
          filter: `id=eq.${matchId}`,
        },
        (payload) => {
          const nuevo = payload.new as {
            confirmado_uno: boolean;
            confirmado_dos: boolean;
          };
          setConfirmadoUno(nuevo.confirmado_uno);
          setConfirmadoDos(nuevo.confirmado_dos);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(canal);
    };
  }, [matchId]);

  async function marcarCompletado() {
    if (enviando) return;
    setEnviando(true);

    const supabase = createClient();
    const campo = soyUno ? "confirmado_uno" : "confirmado_dos";
    const { error } = await supabase
      .from("matches")
      .update({ [campo]: true })
      .eq("id", matchId);

    if (!error) {
      if (soyUno) setConfirmadoUno(true);
      else setConfirmadoDos(true);
    }
    setEnviando(false);
  }

  if (confirmadoUno && confirmadoDos) {
    return (
      <div className="my-4 rounded-lg border border-olive/30 bg-olive/10 px-4 py-3 text-sm">
        <p className="font-semibold text-olive">¡Intercambio confirmado por los dos!</p>
        <p className="mt-0.5 text-earth/70">Pronto vas a poder calificar este trueque.</p>
      </div>
    );
  }

  if (miConfirmado) {
    return (
      <div className="my-4 rounded-lg border border-sand bg-beige px-4 py-3 text-sm text-earth">
        Marcaste el intercambio como completado. Esperando que la otra persona lo confirme.
      </div>
    );
  }

  if (suConfirmado) {
    return (
      <div className="my-4 flex flex-col gap-2 rounded-lg border border-sand bg-beige px-4 py-3 text-sm text-earth">
        <p>La otra persona marcó el intercambio como completado. ¿Confirmás que se completó?</p>
        <button
          type="button"
          onClick={marcarCompletado}
          disabled={enviando}
          className="self-start rounded-full bg-terracotta px-4 py-1.5 text-xs font-semibold text-cream transition-colors hover:bg-terracotta/90 disabled:opacity-60"
        >
          Confirmar
        </button>
      </div>
    );
  }

  return (
    <div className="my-4 flex justify-center">
      <button
        type="button"
        onClick={marcarCompletado}
        disabled={enviando}
        className="rounded-full border border-sand px-4 py-1.5 text-xs font-semibold text-earth transition-colors hover:bg-beige disabled:opacity-60"
      >
        Marcar intercambio como completado
      </button>
    </div>
  );
}
