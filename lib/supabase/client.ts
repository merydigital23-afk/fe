import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // Avoids confirmation links failing when the email app opens them in a
      // different browser/webview than the one used to sign up: PKCE (the
      // default) needs a local secret from that original browser, implicit
      // flow doesn't.
      auth: { flowType: "implicit" },
    },
  );
}
