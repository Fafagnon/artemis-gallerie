"use client";

import React, { useState, useMemo } from "react";
import { Artwork, Artist, ArtworkType } from "@/types/artemis";
import { ArtworkCard } from "./artwork-card";
import { useLanguage } from "@/context/language-context";

interface CollectionWallProps {
  initialArtworks: Artwork[];
  artists: Artist[];
}

export function CollectionWall({ initialArtworks, artists }: CollectionWallProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeArtistId, setActiveArtistId] = useState<string>("all");
  const { t } = useLanguage();

  const artistMap = useMemo(() => {
    const map = new Map<string, Artist>();
    artists.forEach((a) => map.set(a.id, a));
    return map;
  }, [artists]);

  // Available categories
  const categories: { key: string; label: string }[] = useMemo(() => {
    const uniqueTypes = new Set(initialArtworks.map((w) => w.type));
    const allList: { key: string; label: string }[] = [{ key: "all", label: t("all") }];
    ["peinture", "dessin", "sculpture", "serigraphie", "varia"].forEach((ty) => {
      if (uniqueTypes.has(ty as ArtworkType)) {
        allList.push({ key: ty, label: t(ty) });
      }
    });
    return allList;
  }, [initialArtworks, t]);

  // Filtered artworks
  const filteredWorks = useMemo(() => {
    return initialArtworks.filter((w) => {
      const matchCategory = activeCategory === "all" || w.type === activeCategory;
      const matchArtist = activeArtistId === "all" || w.artistId === activeArtistId;
      return matchCategory && matchArtist;
    });
  }, [initialArtworks, activeCategory, activeArtistId]);

  return (
    <section className="px-[var(--m)] py-[clamp(80px,10vw,140px)]" id="collection">
      {/* Header and Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 pb-6 border-b border-pl">
        <div>
          <h2 className="font-archivo font-extrabold text-[clamp(2.2rem,4.5vw,3.8rem)] leading-none uppercase tracking-tight">
            {t("collection")}
          </h2>
        </div>

        {/* Dual Filter: Types & Artists - High Contrast, ZERO milky haze */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 sm:gap-2.5" role="group" aria-label="Filtrer par technique">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-full transition-all duration-200 ${
                  activeCategory === cat.key
                    ? "bg-tx text-wall font-bold shadow-sm"
                    : "border border-tx/25 text-tx/70 hover:text-tx hover:border-tx bg-transparent"
                }`}
                aria-pressed={activeCategory === cat.key}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Artist Selector */}
          <div className="relative">
            <select
              value={activeArtistId}
              onChange={(e) => setActiveArtistId(e.target.value)}
              className="appearance-none bg-wall text-tx font-semibold text-xs uppercase tracking-wider py-1.5 px-3.5 pr-8 rounded-full border border-tx/30 hover:border-tx focus:outline-none focus:border-or transition-colors cursor-pointer shadow-sm"
              aria-label="Filtrer par artiste"
            >
              <option value="all">{t("allArtists")}</option>
              {artists.map((artist) => (
                <option key={artist.id} value={artist.id}>
                  {artist.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-tx">
              ▼
            </div>
          </div>
        </div>
      </div>

      {/* Masonry Art Wall */}
      {filteredWorks.length === 0 ? (
        <div className="py-24 text-center text-gr">
          <p className="text-lg">Aucune œuvre ne correspond à cette sélection.</p>
          <button
            onClick={() => {
              setActiveCategory("all");
              setActiveArtistId("all");
            }}
            className="mt-4 underline underline-offset-4 text-tx hover:text-or"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="artemis-wall">
          {filteredWorks.map((work, idx) => (
            <ArtworkCard
              key={work.id}
              artwork={work}
              artist={artistMap.get(work.artistId)}
              priority={idx < 4}
            />
          ))}
        </div>
      )}
    </section>
  );
}

