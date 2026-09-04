import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { TarjetaPublicacion } from "../explorar/tarjeta-publicacion";
import { CerrarSesion } from "./cerrar-sesion";

export const metadata: Metadata = {
  title: "Mi perfil · CrespoTrueké",
};

export default async function PerfilPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-6 py-8 text-center">
        <p className="rounded-lg border border-sand bg-beige px-4 py-3 text-sm font-medium text-earth">
          Tu sesión venció. Volvé a iniciar sesión para ver tu perfil.
        </p>
      </main>
    );
  }

  const { data: usuario } = await supabase
    .from("usuarios")
    .select("nombre, zona, biografia, foto_url")
    .eq("id", user.id)
    .maybeSingle();

  const { data: publicaciones, error } = await supabase
    .from("publicaciones")
    .select("id, tipo, categoria, titulo, zona, fotos, disponibilidad_inmediata")
    .eq("usuario_id", user.id)
    .eq("estado", "activa")
    .order("creado_en", { ascending: false });

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col px-6 py-8">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-sand bg-beige">
          {usuario?.foto_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={usuario.foto_url} alt="" className="h-full w-full object-cover" />
          ) : (
            <svg
              width="32"
              height="32"
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

        <div>
          <h1 className="font-display text-2xl font-semibold text-earth">
            {usuario?.nombre ?? "Vecino/a"}
          </h1>
          {usuario?.zona && <p className="text-sm text-earth/60">{usuario.zona}</p>}
        </div>

        {usuario?.biografia && (
          <p className="max-w-xs text-sm text-earth/80">{usuario.biografia}</p>
        )}

        <div className="flex items-center gap-4">
          <Link
            href="/completar-perfil"
            className="text-sm font-semibold text-terracotta focus-visible:outline-none focus-visible:underline"
          >
            Editar perfil
          </Link>
          <CerrarSesion />
        </div>
      </div>

      <div className="mt-10">
        <h2 className="font-display text-xl font-semibold text-earth">Mis publicaciones activas</h2>

        {error && (
          <p className="mt-4 rounded-lg border border-sand bg-beige px-4 py-3 text-center text-sm text-earth">
            No pudimos cargar tus publicaciones. Probá de nuevo en un momento.
          </p>
        )}

        {!error && (publicaciones ?? []).length === 0 && (
          <p className="mt-4 text-center text-sm text-earth/60">
            Todavía no tenés publicaciones activas.
          </p>
        )}

        {!error && publicaciones && publicaciones.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-4">
            {publicaciones.map((p) => (
              <TarjetaPublicacion key={p.id} publicacion={p} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
