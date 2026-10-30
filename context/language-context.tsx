"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Language = "fr" | "en";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  fr: {
    galleryName: "Artemis Galerie",
    headLine: "L’ART CONTEMPORAIN, DE PRÈS",
    collection: "Collection",
    artists: "Artistes",
    visit: "Visite",
    admin: "Back-office",
    close: "Fermer",
    menu: "Menu",
    all: "Tout",
    allArtists: "Tous les artistes",
    peinture: "Peinture",
    dessin: "Dessin",
    sculpture: "Sculpture",
    serigraphie: "Sérigraphie",
    varia: "Varia",
    available: "Disponible",
    reserved: "Réservée",
    sold: "Vendue",
    seeWork: "Voir l’œuvre",
    backToCollection: "Retour à la collection",
    zoomHint: "Cliquer sur l’image pour l’agrandir",
    share: "Partager le lien",
    copied: "Lien copié !",
    viewAvailable: "Voir les œuvres disponibles",
    inquireWhatsApp: "Écrire sur WhatsApp",
    sameArtist: "Du même artiste",
    otherWorks: "Autres œuvres",
    prevWork: "Œuvre précédente",
    nextWork: "Œuvre suivante",
    notFound: "Cette œuvre est introuvable.",
    hoursLabel: "Horaires",
    mapLabel: "Nous trouver",
    contactLabel: "Contact",
    socialLabel: "Suivre la galerie",
    openMap: "Ouvrir dans Google Maps",
    artistsTitle: "Les Artistes",
    artistsSubtitle: "Sélection d'artistes contemporains représentés par Artemis Galerie à Lomé",
    viewArtistProfile: "Voir le profil de l'artiste",
    viewAllWorksOfArtist: "Découvrir toutes ses œuvres",
    bio: "Biographie",
    statement: "Vision artistique",
    worksExhibited: "Œuvres exposées",
    contactAboutArtist: "Se renseigner sur cet artiste",
    address: "Forever, non loin de l’ex LCF, Rue de Kpendjal, Lomé, Togo",
    copyright: "© 2026 Artemis Galerie. Art contemporain.",
  },
  en: {
    galleryName: "Artemis Galerie",
    headLine: "CONTEMPORARY ART, UP CLOSE",
    collection: "Collection",
    artists: "Artists",
    visit: "Visit",
    admin: "Dashboard",
    close: "Close",
    menu: "Menu",
    all: "All",
    allArtists: "All artists",
    peinture: "Painting",
    dessin: "Drawing",
    sculpture: "Sculpture",
    serigraphie: "Screen print",
    varia: "Varied",
    available: "Available",
    reserved: "Reserved",
    sold: "Sold",
    seeWork: "View artwork",
    backToCollection: "Back to collection",
    zoomHint: "Click image to enlarge",
    share: "Share link",
    copied: "Link copied!",
    viewAvailable: "View available works",
    inquireWhatsApp: "Message on WhatsApp",
    sameArtist: "By the same artist",
    otherWorks: "Other works",
    prevWork: "Previous artwork",
    nextWork: "Next artwork",
    notFound: "Artwork could not be found.",
    hoursLabel: "Opening hours",
    mapLabel: "Find us",
    contactLabel: "Contact",
    socialLabel: "Follow the gallery",
    openMap: "Open in Google Maps",
    artistsTitle: "Artists",
    artistsSubtitle: "Curated selection of contemporary artists presented by Artemis Galerie in Lomé",
    viewArtistProfile: "View artist profile",
    viewAllWorksOfArtist: "Discover all artworks",
    bio: "Biography",
    statement: "Artistic vision",
    worksExhibited: "Exhibited artworks",
    contactAboutArtist: "Inquire about this artist",
    address: "Forever, near former LCF, Kpendjal Street, Lomé, Togo",
    copyright: "© 2026 Artemis Galerie. Contemporary art.",
  },
};

const LanguageContext = createContext<LanguageContextType>({
  lang: "fr",
  setLang: () => {},
  t: (key: string) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("fr");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("artemis_lang") as Language;
      if (saved === "fr" || saved === "en") {
        setLangState(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem("artemis_lang", newLang);
      document.documentElement.lang = newLang;
    } catch {
      // ignore
    }
  };

  const t = (key: string): string => {
    return translations[lang]?.[key] || translations.fr[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

