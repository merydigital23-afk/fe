import type { Metadata } from "next";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { FiltrosExplorar } from "./filtros-explorar";
import { TarjetaPublicacion } from "./tarjeta-publicacion";

export const metadata: Metadata = {
  title: "Explorar · CrespoTrueké",
};

function comoTexto(valor: string | string[] | undefined): string {
  if (Array.isArray(valor)) return valor[0] ?? "";
  return valor ?? "";
}

export default async function ExplorarPage(props: PageProps<"/explorar">) {
  const params = await props.searchParams;
  const q = comoTexto(params.q);
  const categoria = comoTexto(params.categoria);
  const zona = comoTexto(params.zona);

  const supabase = await createClient();

  let query = supabase
    .from("publicaciones")
    .select("*")
    .eq("estado", "activa")
    .order("creado_en", { ascending: false });

  if (categoria) query = query.eq("categoria", categoria);
  if (zona) query = query.eq("zona", zona);
  if (q) query = query.or(`titulo.ilike.%${q}%,descripcion.ilike.%${q}%`);

  const { data: publicaciones, error } = await query;

  const { data: filas } = await supabase.from("publicaciones").select("categoria, zona");
  const categorias = Array.from(new Set((filas ?? []).map((f) => f.categoria))).sort();
  const zonas = Array.from(new Set((filas ?? []).map((f) => f.zona))).sort();

  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      <h1 className="font-display text-3xl font-semibold text-earth">Explorar</h1>
      <p className="mt-1 text-sm text-earth/70">Lo que ofrecen y necesitan tus vecinos.</p>

      <Suspense fallback={null}>
        <FiltrosExplorar categorias={categorias} zonas={zonas} />
      </Suspense>

      {error && (
        <p className="mt-8 rounded-lg border border-sand bg-beige px-4 py-3 text-sm text-earth">
          No pudimos cargar las publicaciones. Probá de nuevo en un momento.
        </p>
      )}

      {!error && publicaciones && publicaciones.length === 0 && (
        <p className="mt-16 text-center text-sm text-earth/60">
          No encontramos publicaciones con esos filtros.
        </p>
      )}

      {!error && publicaciones && publicaciones.length > 0 && (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {publicaciones.map((p) => (
            <TarjetaPublicacion key={p.id} publicacion={p} />
          ))}
        </div>
      )}
    </main>
  );
}
