import { getArtists, getArtworks } from "@/lib/db";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export const revalidate = 0;

export default async function ArtistsPage() {
  const [artists, artworks] = await Promise.all([
    getArtists(),
    getArtworks(),
  ]);

  return (
    <div className="min-h-screen bg-wall text-tx">
      <Navigation variant="solid" />

      <main className="pt-28 md:pt-36 pb-24 px-[var(--m)] max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-16 md:mb-24 pb-8 border-b border-pl">
          <p className="text-xs uppercase tracking-widest text-gr mb-2 font-semibold">
            Artemis Galerie • Répertoire
          </p>
          <h1 className="font-archivo font-extrabold text-[clamp(2.5rem,5.5vw,4.5rem)] leading-none uppercase tracking-tight">
            Les Artistes
          </h1>
          <p className="text-gr text-base md:text-lg mt-4 max-w-2xl font-normal">
            Découvrez les artistes contemporains majeurs présentés par la galerie, leurs démarches plastiques et leurs toiles originales.
          </p>
        </div>

        {/* Artists Roster Grid */}
        <div className="space-y-20 md:space-y-32">
          {artists.map((artist, idx) => {
            const artistWorks = artworks.filter((w) => w.artistId === artist.id);
            const featuredWork = artistWorks[0];
            const isReversed = idx % 2 === 1;

            return (
              <section
                key={artist.id}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center ${
                  isReversed ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Visual Preview */}
                <div
                  className={`lg:col-span-6 ${
                    isReversed ? "lg:order-2" : "lg:order-1"
                  }`}
                >
                  {featuredWork ? (
                    <Link
                      href={`/artistes/${artist.slug}`}
                      className="group block relative w-full overflow-hidden bg-pl/50 aspect-[4/3] focus-visible:outline-2"
                    >
                      <Image
                        src={featuredWork.image}
                        alt={`Œuvre de ${artist.name}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-artemis"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
                      <div className="absolute bottom-4 left-4 right-4 bg-wall/90 backdrop-blur-sm p-3 flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gr uppercase">Exposition permanente</p>
                          <p className="text-sm font-semibold font-newsreader italic text-tx">
                            {featuredWork.title.fr}
                          </p>
                        </div>
                        <span className="text-xs font-semibold text-tx group-hover:text-or flex items-center gap-1">
                          Voir <ArrowUpRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </Link>
                  ) : (
                    <div className="w-full aspect-[4/3] bg-pl flex items-center justify-center text-gr">
                      Portrait en cours
                    </div>
                  )}
                </div>

                {/* Text & Biography */}
                <div
                  className={`lg:col-span-6 space-y-6 ${
                    isReversed ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  <div className="flex items-center gap-3 text-xs uppercase tracking-widest font-semibold text-or">
                    <span>{artist.nationality}</span>
                    <span>•</span>
                    <span>{artist.city || "Lomé"}</span>
                  </div>

                  <h2 className="font-archivo font-extrabold text-4xl sm:text-5xl uppercase tracking-tight text-tx hover:text-or transition-colors">
                    <Link href={`/artistes/${artist.slug}`}>
                      {artist.name}
                    </Link>
                  </h2>

                  {artist.statement && (
                    <blockquote className="font-newsreader italic text-xl md:text-2xl text-tx/85 leading-snug border-l-2 border-or pl-4">
                      « {artist.statement.fr} »
                    </blockquote>
                  )}

                  <p className="text-gr leading-relaxed text-base">
                    {artist.bio.fr}
                  </p>

                  <div className="pt-4 flex flex-wrap items-center gap-4">
                    <Link
                      href={`/artistes/${artist.slug}`}
                      className="inline-flex items-center gap-2 px-6 py-3.5 bg-tx text-wall font-semibold text-xs uppercase tracking-wider hover:bg-or hover:text-black transition-colors"
                    >
                      <span>Explorer ses œuvres ({artistWorks.length})</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}

