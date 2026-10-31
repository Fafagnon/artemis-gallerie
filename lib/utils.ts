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

export function getStatusBadge(
  status: ArtworkStatus,
  lang: "fr" | "en" = "fr"
): { label: string; dotColor: string; pillClass: string } {
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

  const styles = {
    disponible: {
      dotColor: "bg-emerald-500 animate-pulse",
      pillClass:
        "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/25",
    },
    reserve: {
      dotColor: "bg-amber-500",
      pillClass:
        "bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/25",
    },
    vendu: {
      dotColor: "bg-zinc-400",
      pillClass:
        "bg-zinc-500/10 text-zinc-500 border border-zinc-500/20",
    },
  };

  return {
    label: labels[lang][status] || status,
    dotColor: styles[status]?.dotColor || "bg-zinc-400",
    pillClass: styles[status]?.pillClass || "",
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

