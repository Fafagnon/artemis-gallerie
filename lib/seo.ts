/**
 * Infos stables de la galerie, vérifiées sur le site en ligne.
 * Une seule source, utilisée par le JSON-LD du layout et par llms.txt,
 * pour ne jamais avoir deux versions différentes de la même info.
 */
export const GALLERY = {
  name: "Artemis Galerie",
  url: "https://www.gallerie-artemis.com/",
  description:
    "Artemis Galerie, art contemporain à Lomé, Togo. Catalogue des œuvres originales d'artistes contemporains (LAKA, AGBELESSESSI Dela) et informations de visite.",
  telephone: "+228 70 21 11 11",
  email: "galerieartemis@gmail.com",
  streetAddress: "Rue de Kpendjal, Forever, non loin de l'ex LCF",
  locality: "Lomé",
  country: "TG",
  hours: "mardi au samedi 10:00-19:00, dimanche 14:00-19:00, lundi fermé",
  instagram: "https://www.instagram.com/artemisgalerietg/",
  facebook: "https://www.facebook.com/p/Artemis-Galerie-61569428815346/",
  tiktok: "https://www.tiktok.com/@artemis.galerie",
} as const;

/** Nettoie un texte et le coupe à une longueur adaptée aux métas. */
export function truncateForMeta(text: string, maxLength: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength - 1).trimEnd()}…`;
}
