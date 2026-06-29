import type { Metadata } from "next";
import { Atkinson_Hyperlegible } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";

const atkinson = Atkinson_Hyperlegible({
  variable: "--font-sara",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SARA — Plataforma Accesible de Emergencia",
  description:
    "SARA facilita la comunicación, ayuda y el rescate en situaciones críticas para personas con discapacidad.",
  keywords: ["emergencia", "accesibilidad", "discapacidad", "Venezuela", "voluntarios"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${atkinson.variable} h-full antialiased`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-on-surface">
        <Navbar />
        <main className="flex-1 pb-20 lg:pb-0">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
