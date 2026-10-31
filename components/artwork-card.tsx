"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Artwork, Artist } from "@/types/artemis";
import { useLanguage } from "@/context/language-context";
import { formatPrice, getStatusBadge } from "@/lib/utils";

interface ArtworkCardProps {
  artwork: Artwork;
  artist?: Artist | null;
  priority?: boolean;
}

export function ArtworkCard({ artwork, artist, priority = false }: ArtworkCardProps) {
  const { lang } = useLanguage();
  const title = artwork.title[lang] || artwork.title.fr;
  const medium = artwork.medium[lang] || artwork.medium.fr;
  const artistName = artist ? artist.name : "Artiste Artemis";
  const artistSlug = artist ? artist.slug : null;

  // Aspect ratio calculation matching original styling logic
  const ratio = artwork.aspectRatio || 1;
  const widthPercent = ratio < 0.9 ? "74%" : ratio < 1.1 ? "88%" : "100%";
  const badge = getStatusBadge(artwork.status, lang);

  return (
    <figure
      className="break-inside-avoid mb-14 md:mb-24 transition-opacity duration-300 group"
      style={{ width: widthPercent }}
    >
      <Link
        href={`/oeuvres/${artwork.slug || artwork.id}`}
        className="block relative overflow-hidden bg-pl/40 focus-visible:outline-2"
        aria-label={`${title} par ${artistName}`}
      >
        <div
          className="relative w-full overflow-hidden transition-transform duration-700 ease-artemis group-hover:scale-[1.015]"
          style={{ aspectRatio: `${ratio}` }}
        >
          <Image
            src={artwork.image}
            alt={title}
            fill
            priority={priority}
            sizes="(max-width: 820px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </Link>

      <figcaption className="pt-4 max-w-md">
        <div className="text-sm font-semibold tracking-wide uppercase text-tx">
          {artistSlug ? (
            <Link
              href={`/artistes/${artistSlug}`}
              className="hover:underline underline-offset-4 decoration-or decoration-2 transition-all"
            >
              {artistName}
            </Link>
          ) : (
            artistName
          )}
        </div>

        <div className="text-xl md:text-2xl my-1 leading-snug">
          <Link
            href={`/oeuvres/${artwork.slug || artwork.id}`}
            className="hover:underline underline-offset-4 decoration-or decoration-2 font-newsreader italic font-normal text-tx"
          >
            <em>{title}</em>
          </Link>
        </div>

        <div className="text-xs md:text-sm text-gr tracking-normal mt-1">
          {medium} • {artwork.dimensions}
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-3 text-sm">
          <span
            className={
              artwork.status === "vendu"
                ? "line-through text-gr font-medium"
                : "font-semibold text-tx"
            }
          >
            {formatPrice(artwork.price, lang)}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${badge.pillClass}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${badge.dotColor}`} />
            <span>{badge.label}</span>
          </span>
        </div>
      </figcaption>
    </figure>
  );
}

