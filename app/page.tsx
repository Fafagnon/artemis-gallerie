import { getArtworks, getArtists, getGalleryConfig } from "@/lib/db";
import { Navigation } from "@/components/navigation";
import { Hero } from "@/components/hero";
import { ArtistsSpotlight } from "@/components/artists-spotlight";
import { CollectionWall } from "@/components/collection-wall";
import { VisitSection } from "@/components/visit-section";
import { Footer } from "@/components/footer";

export const revalidate = 0; // Fresh data for admin updates

export default async function HomePage() {
  const [artworks, artists, galleryConfig] = await Promise.all([
    getArtworks(),
    getArtists(),
    getGalleryConfig(),
  ]);

  const heroArtworks = artworks.filter((w) => w.featuredInHero);

  return (
    <main className="min-h-screen">
      <Navigation variant="transparent" />
      <Hero featuredArtworks={heroArtworks.length > 0 ? heroArtworks : artworks.slice(0, 3)} />
      <ArtistsSpotlight artists={artists} artworks={artworks} />
      <CollectionWall initialArtworks={artworks} artists={artists} />
      <VisitSection config={galleryConfig} />
      <Footer />
    </main>
  );
}

