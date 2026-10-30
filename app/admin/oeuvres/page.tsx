import { getArtworks, getArtists } from "@/lib/db";
import { ArtworksManager } from "./artworks-manager";

export const revalidate = 0;

export default async function AdminArtworksPage() {
  const [artworks, artists] = await Promise.all([
    getArtworks(),
    getArtists(),
  ]);

  return <ArtworksManager initialArtworks={artworks} artists={artists} />;
}

