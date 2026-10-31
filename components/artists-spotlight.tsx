"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Artist, Artwork } from "@/types/artemis";
import { useLanguage } from "@/context/language-context";
import { ArrowUpRight } from "lucide-react";

interface ArtistsSpotlightProps {
  artists: Artist[];
  artworks: Artwork[];
}

export function ArtistsSpotlight({ artists, artworks }: ArtistsSpotlightProps) {
  const { lang, t } = useLanguage();

  return (
    <section className="px-[var(--m)] py-20 border-b border-pl bg-wall">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
        <div>
          <h2 className="font-archivo font-extrabold text-[clamp(2rem,4vw,3.2rem)] leading-none uppercase tracking-tight">
            {t("artistsTitle")}
          </h2>
        </div>

        <Link
          href="/artistes"
          className="inline-flex items-center gap-1.5 text-sm font-semibold tracking-wide hover:text-or transition-colors uppercase"
        >
          <span>
            {lang === "fr" ? "Découvrir tous les artistes" : "Discover all artists"}
          </span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        {artists.map((artist) => {
          const artistWorks = artworks.filter((w) => w.artistId === artist.id);
          const previewWork = artistWorks[0];
          const statement = artist.statement?.[lang] || artist.statement?.fr;

          return (
            <div
              key={artist.id}
              className="group border border-pl p-6 lg:p-8 bg-pl/20 hover:bg-pl/50 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-end mb-3">
                  <span className="text-xs text-gr">
                    {artistWorks.length} {t("worksExhibited").toLowerCase()}
                  </span>
                </div>

                <h3 className="font-archivo font-extrabold text-3xl md:text-4xl text-tx uppercase group-hover:text-or transition-colors">
                  <Link href={`/artistes/${artist.slug}`}>
                    {artist.name}
                  </Link>
                </h3>

                {statement && (
                  <blockquote className="mt-4 font-newsreader italic text-lg md:text-xl text-tx/85 leading-snug">
                    « {statement} »
                  </blockquote>
                )}

                <p className="mt-4 text-sm text-gr leading-relaxed line-clamp-3">
                  {artist.bio[lang] || artist.bio.fr}
                </p>
              </div>

              {previewWork && (
                <div className="mt-8 pt-6 border-t border-pl/60 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-14 h-14 overflow-hidden rounded-sm bg-pl shrink-0">
                      <Image
                        src={previewWork.image}
                        alt={previewWork.title[lang]}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-gr uppercase">Œuvre récente</p>
                      <p className="text-sm font-semibold font-newsreader italic text-tx">
                        {previewWork.title[lang]}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/artistes/${artist.slug}`}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-tx/20 group-hover:border-tx group-hover:bg-tx group-hover:text-wall transition-all"
                    aria-label={`Voir les œuvres de ${artist.name}`}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

