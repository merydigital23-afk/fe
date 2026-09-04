import { createClient } from "@/lib/supabase/client";

export async function registrarInteres(
  publicacionId: string,
  interesado: boolean,
): Promise<boolean> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  await supabase
    .from("intereses")
    .upsert(
      { usuario_id: user.id, publicacion_id: publicacionId, interesado },
      { onConflict: "usuario_id,publicacion_id" },
    );

  if (!interesado) return false;

  const { data: publicacion } = await supabase
    .from("publicaciones")
    .select("usuario_id")
    .eq("id", publicacionId)
    .single();
  if (!publicacion) return false;
  const otroUsuarioId = publicacion.usuario_id;

  const { data: misPublicaciones } = await supabase
    .from("publicaciones")
    .select("id")
    .eq("usuario_id", user.id);
  const misIds = (misPublicaciones ?? []).map((p) => p.id);
  if (misIds.length === 0) return false;

  const { data: interesReciproco } = await supabase
    .from("intereses")
    .select("publicacion_id")
    .eq("usuario_id", otroUsuarioId)
    .eq("interesado", true)
    .in("publicacion_id", misIds)
    .limit(1)
    .maybeSingle();
  if (!interesReciproco) return false;

  const [usuarioUno, usuarioDos] = [user.id, otroUsuarioId].sort();
  const publicacionUno =
    usuarioUno === user.id ? interesReciproco.publicacion_id : publicacionId;
  const publicacionDos =
    usuarioUno === user.id ? publicacionId : interesReciproco.publicacion_id;

  const { error: matchError } = await supabase.from("matches").upsert(
    {
      usuario_uno: usuarioUno,
      usuario_dos: usuarioDos,
      publicacion_uno: publicacionUno,
      publicacion_dos: publicacionDos,
    },
    { onConflict: "usuario_uno,usuario_dos" },
  );

  return !matchError;
}
