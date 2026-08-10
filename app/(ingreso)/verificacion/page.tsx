import type { Metadata } from "next";
import { Suspense } from "react";
import VerificacionContent from "./verificacion-content";

export const metadata: Metadata = {
  title: "Verificación · CrespoTrueké",
};

export default function VerificacionPage() {
  return (
    <Suspense fallback={null}>
      <VerificacionContent />
    </Suspense>
  );
}
