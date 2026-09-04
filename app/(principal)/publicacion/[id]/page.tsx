import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GaleriaFotos } from "./galeria-fotos";
import { AccionesPublicacion } from "./acciones-publicacion";

export const metadata: Metadata = {
  title: "Publicación · CrespoTrueké",
};

export default async function DetallePublicacionPage(props: PageProps<"/publicacion/[id]">) {
  const { id } = await props.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-6 py-8 text-center">
        <p className="rounded-lg border border-sand bg-beige px-4 py-3 text-sm font-medium text-earth">
          Tu sesión venció. Volvé a iniciar sesión para ver esta publicación.
        </p>
      </main>
    );
  }

  const { data: publicacion } = await supabase
    .from("publicaciones")
    .select(
      "id, tipo, categoria, titulo, descripcion, zona, fotos, acepta_a_cambio, usuario_id, disponibilidad_inmediata",
    )
    .eq("id", id)
    .maybeSingle();

  if (!publicacion) {
    notFound();
  }

  const { data: autor } = await supabase
    .from("usuarios")
    .select("nombre, zona, foto_url")
    .eq("id", publicacion.usuario_id)
    .maybeSingle();

  const esMia = publicacion.usuario_id === user.id;

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col px-6 py-8">
      <GaleriaFotos fotos={publicacion.fotos ?? []} />

      <div className="mt-5 flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="rounded-full border border-sand bg-cream px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-earth/70">
            {publicacion.tipo === "ofrezco" ? "Ofrezco" : "Necesito"}
          </span>
          {publicacion.disponibilidad_inmediata && (
            <span className="rounded-full bg-olive/15 px-2 py-0.5 text-[11px] font-semibold text-olive">
              Disponible ya
            </span>
          )}
        </div>

        <h1 className="font-display text-2xl font-semibold text-earth">{publicacion.titulo}</h1>
        <p className="text-sm text-earth/60">
          {publicacion.categoria} · {publicacion.zona}
        </p>

        <p className="mt-2 whitespace-pre-wrap text-sm text-earth/80">
          {publicacion.descripcion}
        </p>

        {publicacion.acepta_a_cambio && (
          <p className="mt-2 text-sm text-earth/70">
            <span className="font-medium text-earth">Acepta a cambio:</span>{" "}
            {publicacion.acepta_a_cambio}
          </p>
        )}
      </div>

      <div className="mt-6 flex items-center gap-3 rounded-2xl border border-sand bg-beige p-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-sand bg-cream">
          {autor?.foto_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={autor.foto_url} alt="" className="h-full w-full object-cover" />
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-earth/30"
              aria-hidden="true"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.5-7 8-7s8 3 8 7" />
            </svg>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-earth">{autor?.nombre ?? "Vecino/a"}</p>
          {autor?.zona && <p className="truncate text-xs text-earth/60">{autor.zona}</p>}
        </div>
        {!esMia && (
          <Link
            href={`/perfil/${publicacion.usuario_id}`}
            className="shrink-0 rounded-full border border-sand px-3 py-1.5 text-xs font-semibold text-earth transition-colors hover:bg-sand/40"
          >
            Ver perfil
          </Link>
        )}
      </div>

      {esMia ? (
        <p className="mt-6 text-center text-sm text-earth/50">Esta es tu publicación.</p>
      ) : (
        <AccionesPublicacion publicacionId={publicacion.id} titulo={publicacion.titulo} />
      )}
    </main>
  );
}
