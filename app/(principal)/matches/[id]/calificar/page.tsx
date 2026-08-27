import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FormularioCalificacion } from "./formulario-calificacion";

export const metadata: Metadata = {
  title: "Calificar · CrespoTrueké",
};

export default async function CalificarPage(props: PageProps<"/matches/[id]/calificar">) {
  const { id } = await props.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-6 py-8 text-center">
        <p className="rounded-lg border border-sand bg-beige px-4 py-3 text-sm font-medium text-earth">
          Tu sesión venció. Volvé a iniciar sesión para calificar.
        </p>
      </main>
    );
  }

  const { data: match } = await supabase
    .from("matches")
    .select(
      "id, usuario_uno, usuario_dos, publicacion_uno, publicacion_dos, confirmado_uno, confirmado_dos",
    )
    .eq("id", id)
    .maybeSingle();

  if (!match || (match.usuario_uno !== user.id && match.usuario_dos !== user.id)) {
    notFound();
  }

  if (!(match.confirmado_uno && match.confirmado_dos)) {
    redirect(`/matches/${id}`);
  }

  const soyUno = match.usuario_uno === user.id;
  const calificadoId = soyUno ? match.usuario_dos : match.usuario_uno;
  const suPublicacionId = soyUno ? match.publicacion_dos : match.publicacion_uno;

  const { data: suPublicacion } = await supabase
    .from("publicaciones")
    .select("titulo")
    .eq("id", suPublicacionId)
    .maybeSingle();

  const { data: yaCalifique } = await supabase
    .from("calificaciones")
    .select("id")
    .eq("match_id", id)
    .eq("calificador_id", user.id)
    .maybeSingle();

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col px-6 py-8">
      <div className="text-center">
        <h1 className="font-display text-3xl font-semibold text-earth">Calificar intercambio</h1>
        <p className="mt-1 text-sm text-earth/70">
          Sobre tu trueque por &quot;{suPublicacion?.titulo}&quot;
        </p>
      </div>

      {yaCalifique ? (
        <div className="mt-10 flex flex-col items-center gap-3 rounded-lg border border-sand bg-beige px-5 py-8 text-center">
          <p className="font-display text-2xl font-semibold text-olive">¡Gracias por calificar!</p>
          <p className="text-sm text-earth/80">
            Ya registramos tu calificación de este intercambio.
          </p>
          <Link
            href={`/matches/${id}`}
            className="mt-2 text-sm font-semibold text-terracotta focus-visible:outline-none focus-visible:underline"
          >
            Volver al chat
          </Link>
        </div>
      ) : (
        <div className="mt-8">
          <FormularioCalificacion matchId={id} usuarioId={user.id} calificadoId={calificadoId} />
        </div>
      )}
    </main>
  );
}
