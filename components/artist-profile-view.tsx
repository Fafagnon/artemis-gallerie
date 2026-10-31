"use client";

import React from "react";
import Link from "next/link";
import { Artist, Artwork, GalleryConfig } from "@/types/artemis";
import { useLanguage } from "@/context/language-context";
import { ArtworkCard } from "@/components/artwork-card";
import { ArrowLeft, MessageSquare } from "lucide-react";

interface ArtistProfileViewProps {
  artist: Artist;
  artworks: Artwork[];
  config: GalleryConfig;
}

export function ArtistProfileView({
  artist,
  artworks,
  config,
}: ArtistProfileViewProps) {
  const { lang, t } = useLanguage();

  const bio = artist.bio[lang] || artist.bio.fr;
  const statement = artist.statement?.[lang] || artist.statement?.fr;

  const waInquiryUrl = `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(
    lang === "fr"
      ? `Bonjour, je souhaiterais des informations concernant les œuvres de l'artiste ${artist.name}.`
      : `Hello, I would like information regarding artworks by artist ${artist.name}.`
  )}`;

  return (
    <main className="pt-28 md:pt-36 pb-24 px-[var(--m)] max-w-7xl mx-auto">
      {/* Back Link */}
      <div className="mb-8">
        <Link
          href="/artistes"
          className="inline-flex items-center gap-2 text-sm text-gr hover:text-tx transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === "fr" ? "Tous les artistes" : "All artists"}</span>
        </Link>
      </div>

      {/* Artist Header / Hero Bio */}
      <section className="mb-20 pb-16 border-b border-pl">
        <h1 className="font-archivo font-extrabold text-[clamp(2.8rem,6vw,5.5rem)] leading-none uppercase tracking-tight text-tx">
          {artist.name}
        </h1>

        {statement && (
          <blockquote className="mt-6 font-newsreader italic text-2xl md:text-3xl text-tx/90 max-w-4xl leading-relaxed">
            « {statement} »
          </blockquote>
        )}

        <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-8 text-gr text-base md:text-lg leading-relaxed">
            <p>{bio}</p>
          </div>

          <div className="md:col-span-4 flex flex-col gap-4">
            <a
              href={waInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-tx text-wall font-semibold text-xs uppercase tracking-wider hover:bg-or hover:text-black transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>
                {lang === "fr"
                  ? "Se renseigner sur cet artiste"
                  : "Inquire about this artist"}
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* Corpus / Artworks by this Artist */}
      <section>
        <div className="flex items-baseline justify-between mb-12">
          <div>
            <h2 className="font-archivo font-extrabold text-2xl md:text-3xl uppercase tracking-tight">
              {lang === "fr" ? "Œuvres exposées" : "Exhibited artworks"}
            </h2>
            <p className="text-xs text-gr uppercase tracking-wider mt-1">
              {lang === "fr"
                ? `${artworks.length} pièce(s) actuellement en galerie`
                : `${artworks.length} artwork(s) currently at the gallery`}
            </p>
          </div>
        </div>

        {artworks.length === 0 ? (
          <p className="text-gr py-12 text-center">
            {lang === "fr"
              ? "Aucune œuvre répertoriée pour le moment pour cet artiste."
              : "No artworks catalogued for this artist yet."}
          </p>
        ) : (
          <div className="artemis-wall">
            {artworks.map((work, idx) => (
              <ArtworkCard
                key={work.id}
                artwork={work}
                artist={artist}
                priority={idx === 0}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

