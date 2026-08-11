"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (!window.location.hash.includes("access_token")) {
      router.replace("/splash");
      return;
    }

    // Supabase's default confirmation email lands here with the session in
    // the URL hash. Creating the client triggers its built-in
    // detectSessionInUrl handling; getSession() waits for that to finish
    // persisting the session before we navigate away and lose the hash.
    const supabase = createClient();
    supabase.auth.getSession().then(() => {
      router.replace("/completar-perfil");
    });
  }, [router]);

  return null;
}
