"use client";

import { createContext, useContext, useState } from "react";

export type FotoItem = { file: File; preview: string };

export type PublicarState = {
  tipo: "ofrezco" | "necesito" | null;
  categoria: string;
  disponibilidadInmediata: boolean;
  titulo: string;
  descripcion: string;
  fotos: FotoItem[];
  zona: string;
  aceptaACambio: string;
};

export const estadoInicial: PublicarState = {
  tipo: null,
  categoria: "",
  disponibilidadInmediata: false,
  titulo: "",
  descripcion: "",
  fotos: [],
  zona: "",
  aceptaACambio: "",
};

type PublicarContextType = {
  estado: PublicarState;
  setEstado: React.Dispatch<React.SetStateAction<PublicarState>>;
};

const PublicarContext = createContext<PublicarContextType | null>(null);

export function usePublicar() {
  const ctx = useContext(PublicarContext);
  if (!ctx) {
    throw new Error("usePublicar debe usarse adentro de PublicarProvider");
  }
  return ctx;
}

export function PublicarProvider({ children }: { children: React.ReactNode }) {
  const [estado, setEstado] = useState<PublicarState>(estadoInicial);
  return (
    <PublicarContext.Provider value={{ estado, setEstado }}>
      {children}
    </PublicarContext.Provider>
  );
}
