"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const hasImplicitToken = window.location.hash.includes("access_token");
    const code = new URLSearchParams(window.location.search).get("code");

    if (!hasImplicitToken && !code) {
      router.replace("/splash");
      return;
    }

    // Supabase's default confirmation email can land here two different
    // ways depending on the auth flow: a `code` query param (PKCE) or an
    // `access_token` in the hash (implicit). Handle both.
    const supabase = createClient();
    const exchange = code
      ? supabase.auth.exchangeCodeForSession(code)
      : supabase.auth.getSession();

    exchange.then(({ error }) => {
      router.replace(error ? "/verificacion?error=confirmacion" : "/completar-perfil");
    });
  }, [router]);

  return null;
}
