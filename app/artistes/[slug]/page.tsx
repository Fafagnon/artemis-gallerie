import { notFound } from "next/navigation";
import { getArtists, getArtistBySlug, getArtworksByArtist, getGalleryConfig } from "@/lib/db";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ArtistProfileView } from "@/components/artist-profile-view";

export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const artists = await getArtists();
  return artists.map((a) => ({
    slug: a.slug,
  }));
}

export default async function ArtistProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const artist = await getArtistBySlug(slug);

  if (!artist) {
    notFound();
  }

  const artworks = await getArtworksByArtist(artist.id);
  const config = await getGalleryConfig();

  return (
    <div className="min-h-screen bg-wall text-tx">
      <Navigation variant="solid" />
      <ArtistProfileView artist={artist} artworks={artworks} config={config} />
      <Footer />
    </div>
  );
}
