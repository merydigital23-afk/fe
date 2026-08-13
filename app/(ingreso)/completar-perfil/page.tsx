"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

function traducirErrorPerfil(mensaje: string): string {
  const m = mensaje.toLowerCase();
  if (m.includes("row-level security") || m.includes("policy")) {
    return "No tenés permiso para guardar este perfil. Iniciá sesión de nuevo e intentá otra vez.";
  }
  return "No pudimos guardar tu perfil. Probá de nuevo en un momento.";
}

export default function CompletarPerfilPage() {
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "guardando" | "guardado" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function handleFotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFotoFile(file);
    setFotoPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("guardando");

    const formData = new FormData(e.currentTarget);
    const nombre = String(formData.get("nombre") ?? "");
    const zona = String(formData.get("zona") ?? "");
    const bio = String(formData.get("bio") ?? "");

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setStatus("error");
      setErrorMsg("Tu sesión venció. Volvé a iniciar sesión e intentá de nuevo.");
      return;
    }

    let fotoUrl: string | null = null;
    if (fotoFile) {
      const extension = fotoFile.name.split(".").pop() || "jpg";
      const ruta = `${user.id}/foto.${extension}`;
      const { error: uploadError } = await supabase.storage
        .from("fotos-perfil")
        .upload(ruta, fotoFile, { upsert: true });

      if (uploadError) {
        setStatus("error");
        setErrorMsg(traducirErrorPerfil(uploadError.message));
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("fotos-perfil").getPublicUrl(ruta);
      fotoUrl = publicUrl;
    }

    const { error } = await supabase.from("usuarios").upsert(
      {
        id: user.id,
        nombre,
        zona,
        biografia: bio || null,
        foto_url: fotoUrl,
      },
      { onConflict: "id" },
    );

    if (error) {
      setStatus("error");
      setErrorMsg(traducirErrorPerfil(error.message));
      return;
    }

    setStatus("guardado");
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col px-6 py-8">
      <div className="flex flex-1 flex-col justify-center gap-6 py-6">
        {status === "guardado" ? (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-sand bg-beige px-5 py-8 text-center">
            {fotoPreview && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={fotoPreview}
                alt=""
                className="h-20 w-20 rounded-full object-cover"
              />
            )}
            <p className="font-display text-2xl font-semibold text-olive">
              ¡Perfil guardado!
            </p>
            <p className="text-sm text-earth/80">
              Ya quedaste registrado en CrespoTrueké. Las próximas pantallas
              (Inicio, Explorar) todavía no están construidas.
            </p>
          </div>
        ) : (
          <>
            <div>
              <h1 className="font-display text-3xl font-semibold text-earth">
                Completá tu perfil
              </h1>
              <p className="mt-2 text-sm text-earth/70">
                Así te van a reconocer los demás vecinos.
              </p>
            </div>

            <div className="flex gap-3 rounded-lg border border-sand bg-beige px-4 py-4">
              <div className="w-[3px] shrink-0 rounded-full bg-wood" />
              <p className="font-display text-base italic text-earth">
                El trueque no se basa en precios, sino en necesidades.
              </p>
            </div>

            {status === "error" && (
              <div className="rounded-lg border border-sand bg-beige px-4 py-3 text-sm font-medium text-earth">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <label
                htmlFor="foto"
                className="flex cursor-pointer flex-col items-center gap-3 self-center"
              >
                <span className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-sand bg-beige text-earth/40 transition-colors hover:bg-sand/40">
                  {fotoPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={fotoPreview}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M4 7h3l2-2h6l2 2h3a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z" />
                      <circle cx="12" cy="13" r="3.5" />
                    </svg>
                  )}
                </span>
                <span className="text-sm font-semibold text-terracotta">
                  {fotoPreview ? "Cambiar foto" : "Agregar foto"}
                </span>
              </label>
              <input
                id="foto"
                name="foto"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleFotoChange}
              />

              <div className="flex flex-col gap-1.5">
                <label htmlFor="nombre" className="text-sm font-medium text-earth">
                  Nombre
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  required
                  placeholder="Tu nombre"
                  className="h-12 rounded-lg border border-sand bg-beige px-4 text-base text-earth placeholder:text-earth/40 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="zona" className="text-sm font-medium text-earth">
                  Barrio / zona
                </label>
                <input
                  id="zona"
                  name="zona"
                  type="text"
                  required
                  placeholder="Tu barrio en Crespo"
                  className="h-12 rounded-lg border border-sand bg-beige px-4 text-base text-earth placeholder:text-earth/40 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="bio" className="text-sm font-medium text-earth">
                  Biografía{" "}
                  <span className="font-normal text-earth/50">(opcional)</span>
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={3}
                  placeholder="Contales a tus vecinos algo sobre vos"
                  className="resize-none rounded-lg border border-sand bg-beige px-4 py-3 text-base text-earth placeholder:text-earth/40 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
                />
              </div>

              <button
                type="submit"
                disabled={status === "guardando"}
                className="mt-2 flex h-12 w-full items-center justify-center rounded-full bg-terracotta text-base font-semibold text-cream transition-colors hover:bg-terracotta/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-cream disabled:opacity-60"
              >
                {status === "guardando" ? "Guardando…" : "Guardar y continuar"}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
