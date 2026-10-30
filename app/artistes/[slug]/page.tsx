import { notFound } from "next/navigation";
import { getArtists, getArtistBySlug, getArtworksByArtist, getGalleryConfig } from "@/lib/db";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ArtworkCard } from "@/components/artwork-card";
import Link from "next/link";
import { ArrowLeft, MessageSquare } from "lucide-react";

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

  const waInquiryUrl = `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(
    `Bonjour, je souhaiterais des informations concernant les œuvres de l'artiste ${artist.name}.`
  )}`;

  return (
    <div className="min-h-screen bg-wall text-tx">
      <Navigation variant="solid" />

      <main className="pt-28 md:pt-36 pb-24 px-[var(--m)] max-w-7xl mx-auto">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/artistes"
            className="inline-flex items-center gap-2 text-sm text-gr hover:text-tx transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Tous les artistes</span>
          </Link>
        </div>

        {/* Artist Header / Hero Bio */}
        <section className="mb-20 pb-16 border-b border-pl">
          <div className="flex items-center gap-3 text-xs uppercase tracking-widest font-semibold text-or mb-3">
            <span>{artist.nationality}</span>
            <span>•</span>
            <span>{artist.city || "Lomé"}</span>
            {artist.birthYear && <span>• Né(e) en {artist.birthYear}</span>}
          </div>

          <h1 className="font-archivo font-extrabold text-[clamp(2.8rem,6vw,5.5rem)] leading-none uppercase tracking-tight text-tx">
            {artist.name}
          </h1>

          {artist.statement && (
            <blockquote className="mt-6 font-newsreader italic text-2xl md:text-3xl text-tx/90 max-w-4xl leading-relaxed">
              « {artist.statement.fr} »
            </blockquote>
          )}

          <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-8 text-gr text-base md:text-lg leading-relaxed">
              <p>{artist.bio.fr}</p>
            </div>

            <div className="md:col-span-4 flex flex-col gap-4">
              <a
                href={waInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-tx text-wall font-semibold text-xs uppercase tracking-wider hover:bg-or hover:text-black transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Se renseigner sur cet artiste</span>
              </a>
            </div>
          </div>
        </section>

        {/* Corpus / Artworks by this Artist */}
        <section>
          <div className="flex items-baseline justify-between mb-12">
            <div>
              <h2 className="font-archivo font-extrabold text-2xl md:text-3xl uppercase tracking-tight">
                Œuvres exposées
              </h2>
              <p className="text-xs text-gr uppercase tracking-wider mt-1">
                {artworks.length} pièce(s) actuellement en galerie
              </p>
            </div>
          </div>

          {artworks.length === 0 ? (
            <p className="text-gr py-12 text-center">
              Aucune œuvre répertoriée pour le moment pour cet artiste.
            </p>
          ) : (
            <div className="artemis-wall">
              {artworks.map((work, idx) => (
                <ArtworkCard
                  key={work.id}
                  artwork={work}
                  artist={artist}
                  priority={idx < 2}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

