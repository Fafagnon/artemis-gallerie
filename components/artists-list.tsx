"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Artist, Artwork } from "@/types/artemis";
import { useLanguage } from "@/context/language-context";
import { ArrowUpRight } from "lucide-react";

interface ArtistsListProps {
  artists: Artist[];
  artworks: Artwork[];
}

export function ArtistsList({ artists, artworks }: ArtistsListProps) {
  const { lang, t } = useLanguage();

  return (
    <div className="space-y-20 md:space-y-32">
      {artists.map((artist, idx) => {
        const artistWorks = artworks.filter((w) => w.artistId === artist.id);
        const featuredWork = artistWorks[0];
        const isReversed = idx % 2 === 1;

        const bio = artist.bio[lang] || artist.bio.fr;
        const statement = artist.statement?.[lang] || artist.statement?.fr;

        return (
          <section
            key={artist.id}
            className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center ${
              isReversed ? "lg:flex-row-reverse" : ""
            }`}
          >
            {/* Visual Preview - Clean, NO floating overlay obstructing the artwork */}
            <div
              className={`lg:col-span-6 ${
                isReversed ? "lg:order-2" : "lg:order-1"
              }`}
            >
              {featuredWork ? (
                <Link
                  href={`/artistes/${artist.slug}`}
                  className="group block relative w-full overflow-hidden bg-pl/30 aspect-[4/3] focus-visible:outline-2"
                  aria-label={`${artist.name}`}
                >
                  <Image
                    src={featuredWork.image}
                    alt={`Œuvre de ${artist.name}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-artemis"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </Link>
              ) : (
                <div className="w-full aspect-[4/3] bg-pl flex items-center justify-center text-gr text-xs uppercase tracking-wider">
                  {lang === "fr" ? "Œuvre en préparation" : "Artwork in preparation"}
                </div>
              )}
            </div>

            {/* Text & Biography */}
            <div
              className={`lg:col-span-6 space-y-6 ${
                isReversed ? "lg:order-1" : "lg:order-2"
              }`}
            >
              <h2 className="font-archivo font-extrabold text-4xl sm:text-5xl uppercase tracking-tight text-tx hover:text-or transition-colors">
                <Link href={`/artistes/${artist.slug}`}>
                  {artist.name}
                </Link>
              </h2>

              {statement && (
                <blockquote className="font-newsreader italic text-xl md:text-2xl text-tx/85 leading-snug border-l-2 border-or pl-4">
                  « {statement} »
                </blockquote>
              )}

              <p className="text-gr leading-relaxed text-base">
                {bio}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href={`/artistes/${artist.slug}`}
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-tx text-wall font-semibold text-xs uppercase tracking-wider hover:bg-or hover:text-black transition-colors"
                >
                  <span>
                    {lang === "fr"
                      ? `Explorer ses œuvres (${artistWorks.length})`
                      : `Explore artworks (${artistWorks.length})`}
                  </span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}

