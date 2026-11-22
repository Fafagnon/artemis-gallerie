import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArtworks, getArtworkById, getArtists, getGalleryConfig } from "@/lib/db";
import { truncateForMeta } from "@/lib/seo";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ArtworkDetailClient } from "./artwork-detail-client";

export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const artwork = await getArtworkById(id);
  if (!artwork) return {};
  const artists = await getArtists();
  const artist = artists.find((a) => a.id === artwork.artistId);
  const artistName = artist?.name ?? "Artemis Galerie";
  const url = `/oeuvres/${artwork.slug || artwork.id}`;
  const title = `${artwork.title.fr} – ${artistName} | Artemis Galerie`;
  const description = artwork.description?.fr
    ? truncateForMeta(artwork.description.fr, 160)
    : `${artwork.title.fr}, ${artwork.medium.fr}, ${artwork.year}, par ${artistName}. Œuvre originale exposée à Artemis Galerie, Lomé, Togo.`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      images: [{ url: artwork.image, alt: `${artwork.title.fr} par ${artistName}` }],
      type: "website",
    },
  };
}

export async function generateStaticParams() {
  const artworks = await getArtworks();
  return artworks.map((w) => ({
    id: w.slug || w.id,
  }));
}

export default async function ArtworkDetailPage({ params }: PageProps) {
  const { id } = await params;
  const artworks = await getArtworks();
  const artwork = await getArtworkById(id);

  if (!artwork) {
    notFound();
  }

  const artists = await getArtists();
  const artist = artists.find((a) => a.id === artwork.artistId) || null;
  const config = await getGalleryConfig();

  // Find previous and next artworks
  const currentIndex = artworks.findIndex((w) => w.id === artwork.id);
  const prevWork = artworks[(currentIndex - 1 + artworks.length) % artworks.length];
  const nextWork = artworks[(currentIndex + 1) % artworks.length];

  // Artworks by the same artist (excluding current)
  const sameArtistWorks = artworks.filter(
    (w) => w.artistId === artwork.artistId && w.id !== artwork.id
  );

  const relatedWorks =
    sameArtistWorks.length > 0
      ? sameArtistWorks.slice(0, 3)
      : artworks.filter((w) => w.id !== artwork.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-wall text-tx">
      <Navigation variant="solid" />
      <main className="pt-24 md:pt-32 pb-20">
        <ArtworkDetailClient
          artwork={artwork}
          artist={artist}
          relatedWorks={relatedWorks}
          isSameArtist={sameArtistWorks.length > 0}
          prevWork={prevWork}
          nextWork={nextWork}
          galleryPhone={config.whatsapp}
        />
      </main>
      <Footer />
    </div>
  );
}

