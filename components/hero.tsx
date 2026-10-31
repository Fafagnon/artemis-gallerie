"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Artwork } from "@/types/artemis";
import { useLanguage } from "@/context/language-context";

interface HeroProps {
  featuredArtworks: Artwork[];
}

export function Hero({ featuredArtworks }: HeroProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const { lang, t } = useLanguage();

  const works = featuredArtworks.length > 0 ? featuredArtworks : [];
  const currentWork = works[currentIdx] || null;

  useEffect(() => {
    if (works.length <= 1) return;

    const interval = setInterval(() => {
      // Check prefers-reduced-motion
      if (
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }
      setCurrentIdx((prev) => (prev + 1) % works.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [works.length]);

  return (
    <section className="relative h-[100svh] bg-[#1B0F08] text-white overflow-clip">
      {/* Art Container */}
      <div className="relative h-full w-full overflow-hidden">
        {currentWork && (
          <Link
            href={`/oeuvres/${currentWork.slug || currentWork.id}`}
            className="absolute inset-0 z-10 cursor-pointer block"
            aria-label={`${currentWork.title[lang]}, ${currentWork.medium[lang]}`}
          >
            {works.map((work, idx) => (
              <div
                key={work.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  idx === currentIdx ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
                }`}
                style={{
                  transition: "opacity 1400ms ease, transform 7000ms cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                <Image
                  src={work.image}
                  alt={work.title[lang]}
                  fill
                  priority={idx === 0}
                  className="object-cover"
                  sizes="100vw"
                />
              </div>
            ))}
          </Link>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/50 via-black/20 to-black/70 z-20" />

        {/* Ticker Marquee */}
        <div
          className="absolute left-0 right-0 z-30 pointer-events-none select-none overflow-hidden whitespace-nowrap font-archivo font-extrabold text-[clamp(2.4rem,7.5vw,8rem)] leading-none text-white/95"
          style={{ bottom: "10%" }}
          aria-hidden="true"
        >
          <div className="animate-ticker flex items-center">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center shrink-0">
                <span className="tracking-tight">{t("headLine")}</span>
                <i className="inline-block w-[0.8em] h-[0.08em] mx-[0.45em] bg-gradient-to-r from-or to-or2 rounded-full" />
                <span className="tracking-tight">Artemis Galerie</span>
                <i className="inline-block w-[0.8em] h-[0.08em] mx-[0.45em] bg-gradient-to-r from-or to-or2 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Current Artwork Subtitle at bottom left */}
        {currentWork && (
          <div className="absolute bottom-6 left-[var(--m)] z-30 pointer-events-none hidden md:block">
            <p className="text-xs uppercase tracking-widest text-white/60 mb-1">
              À la une • Artemis
            </p>
            <p className="text-sm font-semibold tracking-wide text-white">
              <em>{currentWork.title[lang]}</em> — {currentWork.dimensions}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

