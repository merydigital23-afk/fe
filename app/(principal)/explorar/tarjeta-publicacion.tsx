import Link from "next/link";

type Publicacion = {
  id: string;
  tipo: string;
  categoria: string;
  titulo: string;
  zona: string;
  fotos: string[] | null;
  disponibilidad_inmediata: boolean;
};

export function TarjetaPublicacion({ publicacion }: { publicacion: Publicacion }) {
  const foto = publicacion.fotos?.[0];

  return (
    <Link
      href={`/publicacion/${publicacion.id}`}
      className="block overflow-hidden rounded-lg border border-sand bg-beige transition-colors hover:border-terracotta/50"
    >
      <div className="aspect-square bg-sand/40">
        {foto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={foto} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-earth/30">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <circle cx="9" cy="10" r="1.5" />
              <path d="M21 16l-5.5-5.5a1 1 0 0 0-1.4 0L4 21" />
            </svg>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1 p-3">
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
        <p className="truncate text-sm font-semibold text-earth">{publicacion.titulo}</p>
        <p className="truncate text-xs text-earth/60">
          {publicacion.categoria} · {publicacion.zona}
        </p>
      </div>
    </Link>
  );
}
