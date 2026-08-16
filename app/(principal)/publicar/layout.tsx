import { PublicarProvider } from "./publicar-context";

export default function PublicarLayout({ children }: { children: React.ReactNode }) {
  return <PublicarProvider>{children}</PublicarProvider>;
}
