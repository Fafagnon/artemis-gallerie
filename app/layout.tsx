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
  metadataBase: new URL("https://www.gallerie-artemis.com"),
  title: "Artemis Galerie | Art Contemporain Lomé",
  description:
    "Artemis Galerie, art contemporain à Lomé, Togo. Catalogue des œuvres originales d'artistes contemporains (LAKA, AGBELESSESSI Dela) et informations de visite.",
  alternates: {
    canonical: "/",
  },
  keywords: [
    "Artemis Galerie",
    "Galerie d'art Lomé",
    "Art contemporain Togo",
    "LAKA",
    "AGBELESSESSI Dela",
    "Art contemporain africain",
    "Tableaux contemporains",
  ],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Artemis Galerie | Art Contemporain Lomé",
    description: "Catalogue des œuvres originales et informations de visite.",
    url: "https://www.gallerie-artemis.com/",
    images: ["/logo.png"],
    locale: "fr_TG",
    type: "website",
  },
};

// Données structurées de la galerie (valeurs vérifiées sur le site en
// ligne : adresse, horaires, téléphone, e-mail et réseaux sociaux).
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ArtGallery",
  name: "Artemis Galerie",
  url: "https://www.gallerie-artemis.com/",
  description:
    "Artemis Galerie, art contemporain à Lomé, Togo. Catalogue des œuvres originales d'artistes contemporains (LAKA, AGBELESSESSI Dela) et informations de visite.",
  telephone: "+228 70 21 11 11",
  email: "galerieartemis@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Rue de Kpendjal, Forever, non loin de l'ex LCF",
    addressLocality: "Lomé",
    addressCountry: "TG",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "10:00",
      closes: "19:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Sunday",
      opens: "14:00",
      closes: "19:00",
    },
  ],
  sameAs: [
    "https://www.instagram.com/artemisgalerietg/",
    "https://www.facebook.com/p/Artemis-Galerie-61569428815346/",
    "https://www.tiktok.com/@artemis.galerie",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${archivo.variable} ${newsreader.variable}`}>
      <body className="antialiased min-h-screen flex flex-col bg-wall text-tx selection:bg-or selection:text-black">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
