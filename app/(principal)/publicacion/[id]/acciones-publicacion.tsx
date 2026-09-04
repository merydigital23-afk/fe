"use client";

import { useState } from "react";
import { registrarInteres } from "@/lib/intereses";
import { ModalMatch } from "../../_components/modal-match";

export function AccionesPublicacion({
  publicacionId,
  titulo,
}: {
  publicacionId: string;
  titulo: string;
}) {
  const [estado, setEstado] = useState<"idle" | "enviando" | "enviado">("idle");
  const [huboMatch, setHuboMatch] = useState(false);

  async function marcarInteres() {
    if (estado !== "idle") return;
    setEstado("enviando");
    const match = await registrarInteres(publicacionId, true);
    setEstado("enviado");
    if (match) setHuboMatch(true);
  }

  return (
    <>
      <button
        type="button"
        onClick={marcarInteres}
        disabled={estado !== "idle"}
        className="mt-6 flex h-12 w-full items-center justify-center rounded-full bg-terracotta text-base font-semibold text-cream transition-colors hover:bg-terracotta/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-cream disabled:opacity-60"
      >
        {estado === "enviado" ? "¡Ya marcaste que te interesa!" : "Me interesa"}
      </button>

      {huboMatch && <ModalMatch titulo={titulo} onCerrar={() => setHuboMatch(false)} />}
    </>
  );
}
