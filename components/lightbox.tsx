"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from "lucide-react";

interface LightboxProps {
  isOpen: boolean;
  images: string[];
  initialIndex?: number;
  altText: string;
  onClose: () => void;
}

export function Lightbox({
  isOpen,
  images,
  initialIndex = 0,
  altText,
  onClose,
}: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setIsZoomed(false);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, images.length, currentIndex]);

  if (!isOpen || images.length === 0) return null;

  const currentSrc = images[currentIndex] || images[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setIsZoomed(false);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsZoomed(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Visionneuse grand format"
      className="fixed inset-0 z-50 bg-black/95 text-white flex items-center justify-center backdrop-blur-sm select-none"
    >
      {/* Controls Bar */}
      <div className="absolute top-6 right-6 z-50 flex items-center gap-3">
        <button
          onClick={() => setIsZoomed((z) => !z)}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          title={isZoomed ? "Réduire" : "Zoomer"}
          aria-label={isZoomed ? "Réduire" : "Zoomer"}
        >
          {isZoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
        </button>
        <button
          onClick={onClose}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          title="Fermer"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Arrows if multiple pictures */}
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Image précédente"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Image suivante"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Image container */}
      <div
        className={`w-full h-full flex items-center justify-center p-4 md:p-12 overflow-auto transition-all duration-300 ${
          isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
        }`}
        onClick={() => setIsZoomed((z) => !z)}
      >
        <div
          className={`relative transition-all duration-300 ${
            isZoomed
              ? "w-[180vw] h-[180vh] md:w-[150vw] md:h-[150vh] shrink-0"
              : "w-full h-full max-w-6xl max-h-[85vh]"
          }`}
        >
          <Image
            src={currentSrc}
            alt={altText}
            fill
            priority
            className="object-contain"
            sizes="100vw"
          />
        </div>
      </div>

      {/* Image counter */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs tracking-widest uppercase bg-black/60 px-4 py-1.5 rounded-full border border-white/10">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
}

