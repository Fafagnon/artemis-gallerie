import { getArtists, getArtworks } from "@/lib/db";
import { GALLERY } from "@/lib/seo";

// Généré à chaque requête : le catalogue des IA suit les œuvres
// et artistes ajoutés depuis l'admin, sans attendre un redéploiement.
export const dynamic = "force-dynamic";

const BASE_URL = "https://www.gallerie-artemis.com";

export async function GET(): Promise<Response> {
  const lines: string[] = [];
  lines.push(`# ${GALLERY.name}`, "");
  lines.push(
    `> ${GALLERY.description} Adresse : ${GALLERY.streetAddress}, ${GALLERY.locality}, Togo. Horaires : ${GALLERY.hours}. Téléphone : ${GALLERY.telephone}. E-mail : ${GALLERY.email}. Les œuvres sont visibles sur place, aucun paiement en ligne.`,
    ""
  );
  lines.push("## Pages principales", "");
  lines.push(`- [Accueil](${BASE_URL}/)`, `- [Artistes](${BASE_URL}/artistes)`, "");

  try {
    const [artists, artworks] = await Promise.all([
      getArtists(),
      getArtworks(),
    ]);
    lines.push("## Artistes", "");
    for (const artist of artists) {
      lines.push(`- [${artist.name}](${BASE_URL}/artistes/${artist.slug})`);
    }
    lines.push("", "## Œuvres", "");
    const namesById = new Map(artists.map((a) => [a.id, a.name]));
    for (const work of artworks) {
      const artistName = namesById.get(work.artistId) ?? GALLERY.name;
      const sold = work.status === "vendu" ? " (vendue)" : "";
      lines.push(
        `- [${work.title.fr} – ${artistName}](${BASE_URL}/oeuvres/${work.slug || work.id}) : ${work.medium.fr}, ${work.year}, ${work.price.toLocaleString("fr-FR")} FCFA${sold}`
      );
    }
  } catch (error) {
    // Listes indisponibles : l'en-tête et les infos pratiques restent valides.
    console.error("llms.txt: listes indisponibles :", error);
  }

  lines.push("", "## Informations pratiques", "");
  lines.push(`- Adresse : ${GALLERY.streetAddress}, ${GALLERY.locality}, Togo`);
  lines.push(`- Horaires : ${GALLERY.hours}`);
  lines.push(`- Téléphone : ${GALLERY.telephone}`);
  lines.push(`- E-mail : ${GALLERY.email}`);
  lines.push(`- Instagram : ${GALLERY.instagram}`);
  lines.push(`- Facebook : ${GALLERY.facebook}`);
  lines.push(`- TikTok : ${GALLERY.tiktok}`);

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
