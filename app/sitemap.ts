import type { MetadataRoute } from "next";
import { getArtists, getArtworks } from "@/lib/db";

// Généré à chaque requête : les œuvres et artistes ajoutés depuis
// l'admin apparaissent dans le sitemap sans attendre un redéploiement.
export const dynamic = "force-dynamic";

const BASE_URL = "https://www.gallerie-artemis.com";

function toDate(value?: string): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/artistes`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  try {
    const [artists, artworks] = await Promise.all([
      getArtists(),
      getArtworks(),
    ]);
    for (const artist of artists) {
      entries.push({
        url: `${BASE_URL}/artistes/${artist.slug}`,
        lastModified: toDate(artist.updatedAt) ?? now,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
    for (const artwork of artworks) {
      entries.push({
        url: `${BASE_URL}/oeuvres/${artwork.slug || artwork.id}`,
        lastModified: toDate(artwork.updatedAt) ?? now,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  } catch (error) {
    // Listes indisponibles : le sitemap partiel (accueil + artistes)
    // reste valide, les pages de détail seront ajoutées au prochain appel.
    console.error("Sitemap: listes indisponibles, sitemap partiel :", error);
  }

  return entries;
}
