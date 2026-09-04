"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function CerrarSesion() {
  const router = useRouter();

  async function cerrarSesion() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <button
      type="button"
      onClick={cerrarSesion}
      className="text-sm font-semibold text-earth/60 transition-colors hover:text-earth focus-visible:outline-none focus-visible:underline"
    >
      Cerrar sesión
    </button>
  );
}
