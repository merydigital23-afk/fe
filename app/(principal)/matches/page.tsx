import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Mis matches · CrespoTrueké",
};

type PublicacionResumen = {
  id: string;
  titulo: string;
  fotos: string[] | null;
};

export default async function MatchesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-6 py-8 text-center">
        <p className="rounded-lg border border-sand bg-beige px-4 py-3 text-sm font-medium text-earth">
          Tu sesión venció. Volvé a iniciar sesión para ver tus matches.
        </p>
      </main>
    );
  }

  const { data: matches, error } = await supabase
    .from("matches")
    .select("id, creado_en, usuario_uno, usuario_dos, publicacion_uno, publicacion_dos")
    .or(`usuario_uno.eq.${user.id},usuario_dos.eq.${user.id}`)
    .order("creado_en", { ascending: false });

  const idsPublicaciones = Array.from(
    new Set((matches ?? []).flatMap((m) => [m.publicacion_uno, m.publicacion_dos])),
  );

  const { data: publicaciones } = idsPublicaciones.length
    ? await supabase
        .from("publicaciones")
        .select("id, titulo, fotos")
        .in("id", idsPublicaciones)
    : { data: [] as PublicacionResumen[] };

  const publicacionesPorId = new Map(
    (publicaciones ?? []).map((p) => [p.id, p as PublicacionResumen]),
  );

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col px-6 py-8">
      <div className="text-center">
        <h1 className="font-display text-3xl font-semibold text-earth">Mis matches</h1>
        <p className="mt-1 text-sm text-earth/70">
          Cuando vos y otro vecino se interesan mutuamente, aparece acá.
        </p>
      </div>

      {error && (
        <p className="mt-8 rounded-lg border border-sand bg-beige px-4 py-3 text-center text-sm text-earth">
          No pudimos cargar tus matches. Probá de nuevo en un momento.
        </p>
      )}

      {!error && (matches ?? []).length === 0 && (
        <p className="mt-16 text-center text-sm text-earth/60">
          Todavía no tenés matches. Seguí descubriendo publicaciones.
        </p>
      )}

      {!error && matches && matches.length > 0 && (
        <div className="mt-8 flex flex-col gap-4">
          {matches.map((m) => {
            const soyUno = m.usuario_uno === user.id;
            const miPublicacion = publicacionesPorId.get(
              soyUno ? m.publicacion_uno : m.publicacion_dos,
            );
            const suPublicacion = publicacionesPorId.get(
              soyUno ? m.publicacion_dos : m.publicacion_uno,
            );

            return (
              <div key={m.id} className="rounded-2xl border border-sand bg-beige p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-terracotta">
                  ¡Match!
                </p>
                <p className="mt-1 text-sm text-earth">
                  Tu publicación{" "}
                  <span className="font-semibold">&quot;{miPublicacion?.titulo}&quot;</span> hizo
                  match con <span className="font-semibold">&quot;{suPublicacion?.titulo}&quot;</span>
                </p>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
