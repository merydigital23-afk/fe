"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { estadoInicial, usePublicar } from "../publicar-context";
import { PasoIndicator } from "../paso-indicator";

function traducirErrorPublicacion(mensaje: string): string {
  const m = mensaje.toLowerCase();
  if (m.includes("row-level security") || m.includes("policy")) {
    return "No tenés permiso para publicar. Iniciá sesión de nuevo e intentá otra vez.";
  }
  return "No pudimos publicar. Probá de nuevo en un momento.";
}

export default function PublicarPaso3() {
  const router = useRouter();
  const { estado, setEstado } = usePublicar();
  const [status, setStatus] = useState<"idle" | "publicando" | "publicado" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!estado.tipo || !estado.titulo || estado.fotos.length === 0) {
      router.replace("/publicar/paso-1");
    }
  }, [estado.tipo, estado.titulo, estado.fotos.length, router]);

  async function handlePublicar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("publicando");

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setStatus("error");
      setErrorMsg("Tu sesión venció. Volvé a iniciar sesión e intentá de nuevo.");
      return;
    }

    const urlsFotos: string[] = [];
    for (let i = 0; i < estado.fotos.length; i++) {
      const { file } = estado.fotos[i];
      const extension = file.name.split(".").pop() || "jpg";
      const ruta = `${user.id}/${Date.now()}-${i}.${extension}`;
      const { error: uploadError } = await supabase.storage
        .from("fotos-publicaciones")
        .upload(ruta, file);

      if (uploadError) {
        setStatus("error");
        setErrorMsg(traducirErrorPublicacion(uploadError.message));
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("fotos-publicaciones").getPublicUrl(ruta);
      urlsFotos.push(publicUrl);
    }

    const { error } = await supabase.from("publicaciones").insert({
      usuario_id: user.id,
      tipo: estado.tipo,
      categoria: estado.categoria,
      titulo: estado.titulo,
      descripcion: estado.descripcion,
      zona: estado.zona,
      acepta_a_cambio: estado.aceptaACambio || null,
      fotos: urlsFotos,
      disponibilidad_inmediata: estado.disponibilidadInmediata,
    });

    if (error) {
      setStatus("error");
      setErrorMsg(traducirErrorPublicacion(error.message));
      return;
    }

    setStatus("publicado");
  }

  function publicarOtra() {
    setEstado(estadoInicial);
    router.push("/publicar/paso-1");
  }

  if (status === "publicado") {
    return (
      <main className="mx-auto flex min-h-dvh max-w-md flex-col px-6 py-8">
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <div className="flex flex-col items-center gap-3 rounded-lg border border-sand bg-beige px-5 py-8">
            <p className="font-display text-2xl font-semibold text-olive">¡Publicado!</p>
            <p className="text-sm text-earth/80">
              Tu publicación &ldquo;{estado.titulo}&rdquo; ya está cargada. Explorar
              todavía no está construido para mostrarla, pero ya vive en la base de
              datos.
            </p>
          </div>
          <button
            type="button"
            onClick={publicarOtra}
            className="flex h-12 items-center justify-center rounded-full bg-terracotta px-6 text-base font-semibold text-cream transition-colors hover:bg-terracotta/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
          >
            Publicar otra
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col px-6 py-8">
      <PasoIndicator actual={3} />

      <form onSubmit={handlePublicar} className="flex flex-1 flex-col justify-center gap-6 py-6">
        <div>
          <h1 className="font-display text-3xl font-semibold text-earth">Últimos detalles</h1>
        </div>

        {status === "error" && (
          <div className="rounded-lg border border-sand bg-beige px-4 py-3 text-sm font-medium text-earth">
            {errorMsg}
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label htmlFor="zona" className="text-sm font-medium text-earth">
            Barrio / zona
          </label>
          <input
            id="zona"
            required
            value={estado.zona}
            onChange={(e) => setEstado((s) => ({ ...s, zona: e.target.value }))}
            placeholder="Tu barrio en Crespo"
            className="h-12 rounded-lg border border-sand bg-beige px-4 text-base text-earth placeholder:text-earth/40 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="aceptaACambio" className="text-sm font-medium text-earth">
            ¿Qué aceptás a cambio?{" "}
            <span className="font-normal text-earth/50">(opcional)</span>
          </label>
          <textarea
            id="aceptaACambio"
            rows={3}
            value={estado.aceptaACambio}
            onChange={(e) => setEstado((s) => ({ ...s, aceptaACambio: e.target.value }))}
            placeholder="Ej: otra herramienta, clases de algo, o dejalo abierto a propuestas"
            className="resize-none rounded-lg border border-sand bg-beige px-4 py-3 text-base text-earth placeholder:text-earth/40 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
          />
        </div>

        <div className="mt-2 flex gap-3">
          <button
            type="button"
            onClick={() => router.push("/publicar/paso-2")}
            disabled={status === "publicando"}
            className="flex h-12 flex-1 items-center justify-center rounded-full border border-sand text-base font-semibold text-earth transition-colors hover:bg-beige focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta disabled:opacity-60"
          >
            Atrás
          </button>
          <button
            type="submit"
            disabled={status === "publicando"}
            className="flex h-12 flex-1 items-center justify-center rounded-full bg-terracotta text-base font-semibold text-cream transition-colors hover:bg-terracotta/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-cream disabled:opacity-60"
          >
            {status === "publicando" ? "Publicando…" : "Publicar"}
          </button>
        </div>
      </form>
    </main>
  );
}
