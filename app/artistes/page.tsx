import type { Metadata } from "next";
import { getArtists, getArtworks } from "@/lib/db";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ArtistsList } from "@/components/artists-list";
import { ArtistsPageHeader } from "@/components/artists-page-header";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Artistes | Artemis Galerie",
  description:
    "Les artistes contemporains exposés à Artemis Galerie à Lomé, Togo, et leurs œuvres originales.",
  alternates: { canonical: "/artistes" },
};

export default async function ArtistsPage() {
  const [artists, artworks] = await Promise.all([
    getArtists(),
    getArtworks(),
  ]);

  return (
    <div className="min-h-screen bg-wall text-tx">
      <Navigation variant="solid" />

      <main className="pt-28 md:pt-36 pb-24 px-[var(--m)] max-w-7xl mx-auto">
        {/* Page Header without 'Artemis Galerie • Répertoire' */}
        <ArtistsPageHeader />

        {/* Artists Roster Grid */}
        <ArtistsList artists={artists} artworks={artworks} />
      </main>

      <Footer />
    </div>
  );
}
