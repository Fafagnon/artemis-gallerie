import type { Metadata } from "next";
import { Archivo, Newsreader } from "next/font/google";
import "@/styles/globals.css";
import { LanguageProvider } from "@/context/language-context";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://artemis-galerie.tg"),
  title: "Artemis Galerie | Art Contemporain Lomé",
  description:
    "Artemis Galerie, art contemporain à Lomé, Togo. Catalogue des œuvres originales d'artistes contemporains (LAKA, AGBELESSESSI Dela) et informations de visite.",
  keywords: [
    "Artemis Galerie",
    "Galerie d'art Lomé",
    "Art contemporain Togo",
    "LAKA",
    "AGBELESSESSI Dela",
    "Art contemporain africain",
    "Tableaux contemporains",
  ],
  openGraph: {
    title: "Artemis Galerie | Art Contemporain Lomé",
    description: "Catalogue des œuvres originales et informations de visite.",
    images: ["/logo.png"],
    locale: "fr_TG",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${archivo.variable} ${newsreader.variable}`}>
      <body className="antialiased min-h-screen flex flex-col bg-wall text-tx selection:bg-or selection:text-black">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
