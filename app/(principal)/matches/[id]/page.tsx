import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Chat } from "./chat";
import { ConfirmarIntercambio } from "./confirmar-intercambio";

export const metadata: Metadata = {
  title: "Chat · CrespoTrueké",
};

export default async function ChatPage(props: PageProps<"/matches/[id]">) {
  const { id } = await props.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-6 py-8 text-center">
        <p className="rounded-lg border border-sand bg-beige px-4 py-3 text-sm font-medium text-earth">
          Tu sesión venció. Volvé a iniciar sesión para ver el chat.
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

  const soyUno = match.usuario_uno === user.id;
  const miPublicacionId = soyUno ? match.publicacion_uno : match.publicacion_dos;
  const suPublicacionId = soyUno ? match.publicacion_dos : match.publicacion_uno;

  const { data: publicaciones } = await supabase
    .from("publicaciones")
    .select("id, titulo")
    .in("id", [miPublicacionId, suPublicacionId]);

  const miPublicacion = publicaciones?.find((p) => p.id === miPublicacionId);
  const suPublicacion = publicaciones?.find((p) => p.id === suPublicacionId);

  const { data: mensajes } = await supabase
    .from("mensajes")
    .select("id, usuario_id, texto, creado_en")
    .eq("match_id", id)
    .order("creado_en", { ascending: true });

  return (
    <main className="mx-auto flex h-dvh max-w-md flex-col px-6 py-6">
      <div className="flex items-center gap-3 border-b border-sand pb-4">
        <Link
          href="/matches"
          aria-label="Volver a mis matches"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-earth transition-colors hover:bg-beige focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
        <div className="min-w-0">
          <p className="truncate font-display text-lg font-semibold text-earth">
            {suPublicacion?.titulo ?? "Chat"}
          </p>
          <p className="truncate text-xs text-earth/60">
            A cambio de tu &quot;{miPublicacion?.titulo}&quot;
          </p>
        </div>
      </div>

      <ConfirmarIntercambio
        matchId={id}
        usuarioId={user.id}
        usuarioUno={match.usuario_uno}
        confirmadoUnoInicial={match.confirmado_uno}
        confirmadoDosInicial={match.confirmado_dos}
      />

      <Chat matchId={id} usuarioId={user.id} mensajesIniciales={mensajes ?? []} />
    </main>
  );
}
