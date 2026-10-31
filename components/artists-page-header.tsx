"use client";

import React from "react";
import { useLanguage } from "@/context/language-context";

export function ArtistsPageHeader() {
  const { lang } = useLanguage();

  return (
    <div className="mb-16 md:mb-24 pb-8 border-b border-pl">
      <h1 className="font-archivo font-extrabold text-[clamp(2.5rem,5.5vw,4.5rem)] leading-none uppercase tracking-tight">
        {lang === "fr" ? "Les Artistes" : "Artists"}
      </h1>
      <p className="text-gr text-base md:text-lg mt-4 max-w-2xl font-normal">
        {lang === "fr"
          ? "Découvrez les artistes contemporains majeurs présentés par la galerie, leurs démarches plastiques et leurs toiles originales."
          : "Discover the prominent contemporary artists presented by the gallery, their artistic practices, and original paintings."}
      </p>
    </div>
  );
}

