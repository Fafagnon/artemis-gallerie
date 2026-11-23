"use client";

import React from "react";
import Image from "next/image";
import { useLanguage } from "@/context/language-context";

/**
 * Homepage hero: a single photo of the gallery building at
 * night, full screen. No artwork slideshow anymore: the hero
 * shows the place itself. The photo is a portrait, so on a
 * wide screen only a vertical band is visible; the position
 * below keeps the ground floor and the sculpture in frame.
 */
export function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative h-[100svh] bg-[#1B0F08] text-white overflow-clip">
      {/* Gallery photo */}
      <div className="relative h-full w-full overflow-hidden">
        <Image
          src="/hero-galerie.jpg"
          alt="La Galerie Artemis de nuit"
          fill
          priority
          className="object-cover"
          style={{ objectPosition: "50% 65%" }}
          sizes="100vw"
        />
      </div>

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
    </section>
  );
}
