import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Chats · CrespoTrueké",
};

type Usuario = {
  id: string;
  nombre: string | null;
  foto_url: string | null;
};

type Mensaje = {
  match_id: string;
  texto: string;
  creado_en: string;
};

function formatearHora(fechaIso: string): string {
  const fecha = new Date(fechaIso);
  const ahora = new Date();
  const esHoy = fecha.toDateString() === ahora.toDateString();
  if (esHoy) {
    return fecha.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
  }
  return fecha.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" });
}

export default async function ChatsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-6 py-8 text-center">
        <p className="rounded-lg border border-sand bg-beige px-4 py-3 text-sm font-medium text-earth">
          Tu sesión venció. Volvé a iniciar sesión para ver tus chats.
        </p>
      </main>
    );
  }

  const { data: matches, error } = await supabase
    .from("matches")
    .select("id, creado_en, usuario_uno, usuario_dos")
    .or(`usuario_uno.eq.${user.id},usuario_dos.eq.${user.id}`);

  const idsOtros = Array.from(
    new Set(
      (matches ?? []).map((m) => (m.usuario_uno === user.id ? m.usuario_dos : m.usuario_uno)),
    ),
  );
  const idsMatches = (matches ?? []).map((m) => m.id);

  const { data: usuarios } = idsOtros.length
    ? await supabase.from("usuarios").select("id, nombre, foto_url").in("id", idsOtros)
    : { data: [] as Usuario[] };
  const usuariosPorId = new Map((usuarios ?? []).map((u) => [u.id, u as Usuario]));

  const { data: mensajes } = idsMatches.length
    ? await supabase
        .from("mensajes")
        .select("match_id, texto, creado_en")
        .in("match_id", idsMatches)
        .order("creado_en", { ascending: false })
    : { data: [] as Mensaje[] };

  const ultimoMensajePorMatch = new Map<string, Mensaje>();
  for (const m of mensajes ?? []) {
    if (!ultimoMensajePorMatch.has(m.match_id)) {
      ultimoMensajePorMatch.set(m.match_id, m as Mensaje);
    }
  }

  const conversaciones = (matches ?? [])
    .map((m) => {
      const otroId = m.usuario_uno === user.id ? m.usuario_dos : m.usuario_uno;
      const ultimoMensaje = ultimoMensajePorMatch.get(m.id);
      return {
        matchId: m.id,
        otro: usuariosPorId.get(otroId),
        ultimoMensaje,
        ordenarPor: ultimoMensaje?.creado_en ?? m.creado_en,
      };
    })
    .sort((a, b) => (a.ordenarPor < b.ordenarPor ? 1 : -1));

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col px-6 py-8">
      <div className="text-center">
        <h1 className="font-display text-3xl font-semibold text-earth">Chats</h1>
        <p className="mt-1 text-sm text-earth/70">Tus conversaciones con otros vecinos.</p>
      </div>

      {error && (
        <p className="mt-8 rounded-lg border border-sand bg-beige px-4 py-3 text-center text-sm text-earth">
          No pudimos cargar tus chats. Probá de nuevo en un momento.
        </p>
      )}

      {!error && conversaciones.length === 0 && (
        <p className="mt-16 text-center text-sm text-earth/60">
          Todavía no tenés conversaciones. Cuando tengas un match, aparece acá.
        </p>
      )}

      {!error && conversaciones.length > 0 && (
        <div className="mt-6 flex flex-col">
          {conversaciones.map((c) => (
            <Link
              key={c.matchId}
              href={`/matches/${c.matchId}`}
              className="flex items-center gap-3 border-b border-sand px-1 py-3 transition-colors hover:bg-beige"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-sand bg-beige">
                {c.otro?.foto_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.otro.foto_url} alt="" className="h-full w-full object-cover" />
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
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate font-semibold text-earth">
                    {c.otro?.nombre ?? "Vecino/a"}
                  </p>
                  {c.ultimoMensaje && (
                    <span className="shrink-0 text-xs text-earth/50">
                      {formatearHora(c.ultimoMensaje.creado_en)}
                    </span>
                  )}
                </div>
                <p className="truncate text-sm text-earth/60">
                  {c.ultimoMensaje?.texto ?? "Sin mensajes todavía"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
