"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function FiltrosExplorar({
  categorias,
  zonas,
}: {
  categorias: string[];
  zonas: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [busqueda, setBusqueda] = useState(searchParams.get("q") ?? "");

  function actualizarParam(nombre: string, valor: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (valor) params.set(nombre, valor);
    else params.delete(nombre);
    router.push(params.toString() ? `${pathname}?${params.toString()}` : pathname);
  }

  useEffect(() => {
    const actual = searchParams.get("q") ?? "";
    if (busqueda === actual) return;
    const timeout = setTimeout(() => actualizarParam("q", busqueda), 400);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busqueda]);

  return (
    <div className="mt-6 flex flex-col gap-3">
      <div className="relative">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-earth/40"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
        <input
          type="search"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar publicaciones"
          className="h-12 w-full rounded-lg border border-sand bg-beige pl-11 pr-4 text-base text-earth placeholder:text-earth/40 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
        />
      </div>

      <div className="flex gap-3">
        <select
          value={searchParams.get("categoria") ?? ""}
          onChange={(e) => actualizarParam("categoria", e.target.value)}
          className="h-11 flex-1 rounded-lg border border-sand bg-beige px-3 text-sm text-earth focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
        >
          <option value="">Todas las categorías</option>
          {categorias.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={searchParams.get("zona") ?? ""}
          onChange={(e) => actualizarParam("zona", e.target.value)}
          className="h-11 flex-1 rounded-lg border border-sand bg-beige px-3 text-sm text-earth focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
        >
          <option value="">Todas las zonas</option>
          {zonas.map((z) => (
            <option key={z} value={z}>
              {z}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
