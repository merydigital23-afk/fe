import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { PilaSwipe } from "./pila-swipe";

export const metadata: Metadata = {
  title: "Descubrir · CrespoTrueké",
};

export default async function DescubrirPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-6 py-8 text-center">
        <p className="rounded-lg border border-sand bg-beige px-4 py-3 text-sm font-medium text-earth">
          Tu sesión venció. Volvé a iniciar sesión para descubrir publicaciones.
        </p>
      </main>
    );
  }

  const { data: yaDecididas } = await supabase
    .from("intereses")
    .select("publicacion_id")
    .eq("usuario_id", user.id);

  const idsExcluir = (yaDecididas ?? []).map((i) => i.publicacion_id);

  let query = supabase
    .from("publicaciones")
    .select("*")
    .eq("estado", "activa")
    .neq("usuario_id", user.id)
    .order("creado_en", { ascending: false });

  if (idsExcluir.length > 0) {
    query = query.not("id", "in", `(${idsExcluir.join(",")})`);
  }

  const { data: publicaciones, error } = await query;

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col px-6 py-8">
      <div className="text-center">
        <h1 className="font-display text-3xl font-semibold text-earth">Descubrir</h1>
        <p className="mt-1 text-sm text-earth/70">
          Deslizá a la derecha si te interesa, a la izquierda si no.
        </p>
      </div>

      {error ? (
        <p className="mt-8 rounded-lg border border-sand bg-beige px-4 py-3 text-center text-sm text-earth">
          No pudimos cargar publicaciones. Probá de nuevo en un momento.
        </p>
      ) : (
        <PilaSwipe publicacionesIniciales={publicaciones ?? []} />
      )}
    </main>
  );
}
