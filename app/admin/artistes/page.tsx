import { getArtists, getArtworks } from "@/lib/db";
import { ArtistsManager } from "./artists-manager";

export const revalidate = 0;

export default async function AdminArtistsPage() {
  const [artists, artworks] = await Promise.all([
    getArtists(),
    getArtworks(),
  ]);

  return <ArtistsManager initialArtists={artists} artworks={artworks} />;
}

