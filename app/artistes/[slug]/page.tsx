import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArtists, getArtistBySlug, getArtworksByArtist, getGalleryConfig } from "@/lib/db";
import { truncateForMeta } from "@/lib/seo";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ArtistProfileView } from "@/components/artist-profile-view";

export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const artist = await getArtistBySlug(slug);
  if (!artist) return {};
  const url = `/artistes/${artist.slug}`;
  const title = `${artist.name} | Artemis Galerie`;
  const bio = artist.bio?.fr?.replace(/\s+/g, " ").trim();
  const description = bio
    ? truncateForMeta(bio, 160)
    : `Œuvres de ${artist.name} exposées à Artemis Galerie, art contemporain à Lomé, Togo.`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      ...(artist.avatarUrl
        ? { images: [{ url: artist.avatarUrl, alt: artist.name }] }
        : {}),
      type: "website",
    },
  };
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
