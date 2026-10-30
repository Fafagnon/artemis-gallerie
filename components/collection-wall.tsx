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
          <p className="text-gr text-sm md:text-base mt-2">
            Art contemporain africain • Œuvres originales disponibles à Lomé
          </p>
        </div>

        {/* Dual Filter: Types & Artists */}
        <div className="flex flex-wrap items-center gap-6">
          {/* Artist Selector */}
          <div className="relative">
            <select
              value={activeArtistId}
              onChange={(e) => setActiveArtistId(e.target.value)}
              className="appearance-none bg-pl/60 hover:bg-pl text-tx font-medium text-sm py-2 px-4 pr-8 rounded-none border border-transparent hover:border-tx/30 focus:outline-none focus:border-tx transition-colors cursor-pointer"
              aria-label="Filtrer par artiste"
            >
              <option value="all">{t("allArtists")}</option>
              {artists.map((artist) => (
                <option key={artist.id} value={artist.id}>
                  {artist.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gr">
              ▼
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-5" role="group" aria-label="Filtrer par technique">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`text-sm py-2 transition-all duration-200 border-b-2 ${activeCategory === cat.key
                    ? "font-semibold text-tx border-or"
                    : "text-gr hover:text-tx border-transparent"
                  }`}
                aria-pressed={activeCategory === cat.key}
              >
                {cat.label}
              </button>
            ))}
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

