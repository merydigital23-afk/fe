import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "CrespoTrueké",
  description: "Trueque comunitario en Crespo, Entre Ríos.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${dmSans.variable} ${fraunces.variable}`}>
      <body className="min-h-dvh bg-cream font-sans text-earth antialiased">
        {children}
      </body>
    </html>
  );
}
