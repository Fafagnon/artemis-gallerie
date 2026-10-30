import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ArtworkStatus } from "@/types/artemis";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, lang: "fr" | "en" = "fr"): string {
  const locale = lang === "fr" ? "fr-FR" : "en-US";
  return new Intl.NumberFormat(locale).format(price) + "\u00a0FCFA";
}

export function getStatusBadge(status: ArtworkStatus, lang: "fr" | "en" = "fr"): { label: string; colorClass: string } {
  const labels = {
    fr: {
      disponible: "Disponible",
      reserve: "Réservée",
      vendu: "Vendue",
    },
    en: {
      disponible: "Available",
      reserve: "Reserved",
      vendu: "Sold",
    },
  };

  const colors = {
    disponible: "text-tx border-b-2 border-or font-semibold",
    reserve: "text-or font-semibold border-b-2 border-or",
    vendu: "text-gr font-normal",
  };

  return {
    label: labels[lang][status] || status,
    colorClass: colors[status] || "",
  };
}

export function getWhatsAppInquiryUrl(
  phone: string,
  artworkTitle: string,
  artistName: string,
  artworkUrl: string,
  lang: "fr" | "en" = "fr"
): string {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  const message =
    lang === "fr"
      ? `Bonjour, je souhaite des informations sur l’œuvre « ${artworkTitle} » de ${artistName}.\n${artworkUrl}`
      : `Hello, I would like information about “${artworkTitle}” by ${artistName}.\n${artworkUrl}`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function getGeneralWhatsAppUrl(phone: string, lang: "fr" | "en" = "fr"): string {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  const message =
    lang === "fr"
      ? "Bonjour, je voudrais recevoir plus d’informations sur la collection de la Galerie Artémis."
      : "Hello, I would like more information about the collection of Artemis Galerie.";

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

