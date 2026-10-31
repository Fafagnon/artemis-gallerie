"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Artwork, Artist } from "@/types/artemis";
import { useLanguage } from "@/context/language-context";
import { formatPrice, getStatusBadge, getWhatsAppInquiryUrl } from "@/lib/utils";
import { Lightbox } from "@/components/lightbox";
import { Share2, ArrowLeft, ArrowRight, Check, Maximize2 } from "lucide-react";

interface ArtworkDetailClientProps {
  artwork: Artwork;
  artist: Artist | null;
  relatedWorks: Artwork[];
  isSameArtist: boolean;
  prevWork: Artwork;
  nextWork: Artwork;
  galleryPhone: string;
}

export function ArtworkDetailClient({
  artwork,
  artist,
  relatedWorks,
  isSameArtist,
  prevWork,
  nextWork,
  galleryPhone,
}: ArtworkDetailClientProps) {
  const { lang, t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<string>(artwork.image);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const title = artwork.title[lang] || artwork.title.fr;
  const medium = artwork.medium[lang] || artwork.medium.fr;
  const description = artwork.description?.[lang] || artwork.description?.fr;
  const artistName = artist ? artist.name : "Artiste Artemis";
  const artistSlug = artist ? artist.slug : null;

  const allImages = [artwork.image, ...(artwork.detailImages || [])];
  const activeImageIndex = allImages.indexOf(selectedImage);

  const badge = getStatusBadge(artwork.status, lang);
  const isSold = artwork.status === "vendu";

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const waUrl = getWhatsAppInquiryUrl(galleryPhone, title, artistName, currentUrl, lang);

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `${title}, ${artistName} | Artemis Galerie`,
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }
  };

  return (
    <>
      <div className="px-[var(--m)] max-w-7xl mx-auto">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/#collection"
            className="inline-flex items-center gap-2 text-sm text-gr hover:text-tx transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t("backToCollection")}</span>
          </Link>
        </div>

        {/* Main Grid: Gallery on left, Cartel on right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Gallery Column */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            <div
              className="relative w-full bg-pl/30 overflow-hidden cursor-zoom-in group"
              onClick={() => setLightboxOpen(true)}
              style={{ aspectRatio: `${artwork.aspectRatio || 1}` }}
            >
              <Image
                src={selectedImage}
                alt={title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 65vw"
                className="object-contain"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
              <div className="absolute bottom-4 right-4 bg-black/60 text-white p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-4 h-4" />
              </div>
            </div>

            <p className="text-xs text-gr flex items-center justify-between">
              <span>{t("zoomHint")}</span>
              <span>Format : {artwork.dimensions}</span>
            </p>

            {/* Thumbnail selector if multiple images */}
            {allImages.length > 1 && (
              <div className="flex gap-4 pt-4 border-t border-pl">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-20 h-20 overflow-hidden border-2 transition-all ${selectedImage === img
                        ? "border-tx scale-105"
                        : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                  >
                    <Image
                      src={img}
                      alt={`${title} détail ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cartel Column (Sticky on desktop) */}
          <aside className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-28 space-y-6">
            <div>
              <div className="text-sm font-semibold tracking-wider uppercase text-tx">
                {artistSlug ? (
                  <Link
                    href={`/artistes/${artistSlug}`}
                    className="hover:underline underline-offset-4 decoration-or decoration-2"
                  >
                    {artistName}
                  </Link>
                ) : (
                  artistName
                )}
              </div>

              <h1 className="font-newsreader italic text-4xl sm:text-5xl my-2 text-tx font-normal leading-tight">
                {title}
              </h1>

              <div className="text-sm text-gr space-y-1 mt-4">
                <p>
                  {artwork.type.charAt(0).toUpperCase() + artwork.type.slice(1)}
                </p>
                <p>{medium}</p>
                <p>{artwork.dimensions}</p>
              </div>
            </div>

            {/* Price & Status */}
            <div className="flex items-center gap-4 py-4 border-y border-pl text-2xl font-semibold">
              <span className={isSold ? "line-through text-gr" : "text-tx"}>
                {formatPrice(artwork.price, lang)}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase ${badge.pillClass}`}
              >
                <span className={`w-2 h-2 rounded-full ${badge.dotColor}`} />
                <span>{badge.label}</span>
              </span>
            </div>

            {/* Description */}
            {description && (
              <p className="font-newsreader text-lg leading-relaxed text-tx/85 italic">
                {description}
              </p>
            )}

            {/* Action buttons */}
            <div className="space-y-4 pt-2">
              {isSold ? (
                <Link
                  href="/#collection"
                  className="w-full text-center block py-4 px-6 border-2 border-tx font-semibold text-sm hover:bg-tx hover:text-wall transition-colors"
                >
                  {t("viewAvailable")}
                </Link>
              ) : (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center block py-4 px-6 bg-tx text-wall font-semibold text-sm hover:bg-or hover:text-black transition-colors"
                >
                  {t("inquireWhatsApp")}
                </a>
              )}

              <div className="flex items-center justify-between text-xs text-gr pt-2">
                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 hover:text-tx underline underline-offset-4 decoration-or"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copied ? t("copied") : t("share")}</span>
                </button>

                <Link
                  href="/#visite"
                  className="hover:text-tx underline underline-offset-4 decoration-or"
                >
                  Horaires et galerie
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* Related Artworks */}
        {relatedWorks.length > 0 && (
          <section className="mt-28 pt-16 border-t border-pl">
            <h2 className="font-archivo font-extrabold text-2xl md:text-3xl uppercase tracking-tight mb-8">
              {isSameArtist ? t("sameArtist") : t("otherWorks")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {relatedWorks.map((work) => (
                <Link
                  key={work.id}
                  href={`/oeuvres/${work.slug || work.id}`}
                  className="group block"
                >
                  <div
                    className="relative w-full overflow-hidden bg-pl/40 mb-3"
                    style={{ aspectRatio: `${work.aspectRatio || 1}` }}
                  >
                    <Image
                      src={work.image}
                      alt={work.title[lang]}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-artemis"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <p className="text-xs uppercase font-semibold text-gr">
                    {artistName}
                  </p>
                  <h3 className="font-newsreader italic text-lg text-tx group-hover:underline decoration-or decoration-2">
                    {work.title[lang]}
                  </h3>
                  <p className="text-xs text-gr mt-1">
                    {formatPrice(work.price, lang)}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Previous / Next Artworks Navigation */}
        <nav className="flex items-center justify-between mt-20 pt-8 border-t border-pl text-sm">
          <Link
            href={`/oeuvres/${prevWork.slug || prevWork.id}`}
            className="group flex flex-col items-start gap-1"
          >
            <span className="text-xs text-gr flex items-center gap-1 group-hover:text-tx">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t("prevWork")}</span>
            </span>
            <span className="font-newsreader italic text-base md:text-lg group-hover:underline decoration-or">
              {prevWork.title[lang]}
            </span>
          </Link>

          <Link
            href={`/oeuvres/${nextWork.slug || nextWork.id}`}
            className="group flex flex-col items-end gap-1 text-right"
          >
            <span className="text-xs text-gr flex items-center gap-1 group-hover:text-tx">
              <span>{t("nextWork")}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
            <span className="font-newsreader italic text-base md:text-lg group-hover:underline decoration-or">
              {nextWork.title[lang]}
            </span>
          </Link>
        </nav>
      </div>

      {/* Mobile Sticky Action Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-wall border-t border-pl px-5 py-3.5 flex items-center justify-between gap-4 shadow-lg">
        <div>
          <p className="text-xs text-gr">{badge.label}</p>
          <p className="text-base font-bold text-tx">
            {formatPrice(artwork.price, lang)}
          </p>
        </div>
        <div>
          {isSold ? (
            <Link
              href="/#collection"
              className="px-5 py-2.5 border border-tx font-semibold text-xs inline-block"
            >
              {t("viewAvailable")}
            </Link>
          ) : (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-tx text-wall font-semibold text-xs inline-block hover:bg-or hover:text-black transition-colors"
            >
              {t("inquireWhatsApp")}
            </a>
          )}
        </div>
      </div>

      {/* Lightbox for Zoom */}
      <Lightbox
        isOpen={lightboxOpen}
        images={allImages}
        initialIndex={activeImageIndex >= 0 ? activeImageIndex : 0}
        altText={title}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
}

