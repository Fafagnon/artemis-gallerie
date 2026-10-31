"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/language-context";
import { X } from "lucide-react";

interface NavigationProps {
  variant?: "transparent" | "solid";
}

export function Navigation({ variant = "transparent" }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { lang, switchLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const isSolidHeader = variant === "solid" || isScrolled;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 flex items-start justify-between px-[var(--m)] transition-all duration-300 pointer-events-none ${
          isSolidHeader
            ? "bg-wall/90 backdrop-blur-md border-b border-pl text-tx py-3 sm:py-3.5 shadow-sm"
            : "text-white py-5 sm:py-6"
        }`}
      >
        {/* Brand / Logo - Grand when at top, smoothly compact when scrolled down */}
        <Link
          href="/"
          className={`relative block transition-all duration-300 ease-artemis group focus-visible:outline-white pointer-events-auto ${
            isSolidHeader
              ? "w-10 sm:w-12"
              : "w-[clamp(110px,13vw,165px)]"
          }`}
          aria-label="Artemis Galerie"
        >
          {/* Subtle ambient glow only when large at top */}
          {!isSolidHeader && (
            <div className="absolute -inset-4 bg-radial from-black/40 via-black/15 to-transparent rounded-full blur-md pointer-events-none -z-10" />
          )}
          <div className="relative w-full aspect-[148/220] filter drop-shadow-md">
            <Image
              src="/logo.png"
              alt="Artemis Galerie"
              fill
              priority
              sizes="(max-width: 768px) 120px, 165px"
              className="object-contain object-left-top transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </div>
        </Link>

        {/* Right side actions: Direct FR/EN Switcher (ONLY one on the site) + Menu button */}
        <div className="flex items-center gap-3 sm:gap-4 pointer-events-auto mt-0.5">
          {/* Direct Language Switcher */}
          <div
            className={`flex items-center text-xs font-semibold tracking-wider rounded-full px-3 py-1.5 border transition-all ${
              isSolidHeader
                ? "bg-pl/80 border-tx/15 text-tx"
                : "bg-black/35 backdrop-blur-md border-white/25 text-white"
            }`}
            role="group"
            aria-label="Changer de langue"
          >
            <button
              onClick={() => switchLanguage("fr")}
              className={`px-1.5 py-0.5 rounded transition-colors ${
                lang === "fr" ? "text-or font-bold" : "opacity-60 hover:opacity-100"
              }`}
              aria-pressed={lang === "fr"}
            >
              FR
            </button>
            <span className="opacity-30 mx-0.5">/</span>
            <button
              onClick={() => switchLanguage("en")}
              className={`px-1.5 py-0.5 rounded transition-colors ${
                lang === "en" ? "text-or font-bold" : "opacity-60 hover:opacity-100"
              }`}
              aria-pressed={lang === "en"}
            >
              EN
            </button>
          </div>

          {/* Menu button */}
          <button
            onClick={() => setIsOpen(true)}
            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full grid place-content-center transition-all duration-300 focus-visible:outline-2 ${
              isSolidHeader
                ? "border border-tx/25 bg-tx/5 text-tx hover:bg-tx/10"
                : "border border-white/30 bg-black/30 backdrop-blur-md text-white hover:bg-black/50"
            }`}
            aria-label={t("menu")}
            aria-expanded={isOpen}
          >
            <div className="flex flex-col gap-1.5 items-end w-4 sm:w-5">
              <span className={`h-0.5 w-4 sm:w-5 ${isSolidHeader ? "bg-tx" : "bg-white"}`} />
              <span
                className={`h-0.5 w-3 sm:w-3.5 transition-all group-hover:w-4 sm:group-hover:w-5 ${
                  isSolidHeader ? "bg-tx" : "bg-white"
                }`}
              />
            </div>
          </button>
        </div>
      </header>

      {/* Fullscreen Overlay Menu */}
      <nav
        className={`fixed inset-0 z-50 bg-black text-white flex flex-col justify-between p-[var(--m)] pt-[calc(env(safe-area-inset-top,0px)+90px)] transition-all duration-700 ease-artemis ${
          isOpen
            ? "opacity-100 pointer-events-auto visible translate-y-0"
            : "opacity-0 pointer-events-none invisible -translate-y-6"
        }`}
        aria-label={t("menu")}
        aria-hidden={!isOpen}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-6 right-[var(--m)] w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-white/35 bg-black/40 text-white grid place-content-center hover:bg-white/10 transition-colors"
          aria-label={t("close")}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Navigation list (without Contact & Acquisitions as requested) */}
        <ul className="space-y-5 md:space-y-7 my-auto">
          <li>
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="font-archivo font-extrabold text-[clamp(2.5rem,7vw,5.5rem)] leading-none hover:text-or2 transition-colors block"
            >
              {t("home")}
            </Link>
          </li>
          <li>
            <Link
              href="/#collection"
              onClick={() => setIsOpen(false)}
              className="font-archivo font-extrabold text-[clamp(2.5rem,7vw,5.5rem)] leading-none hover:text-or2 transition-colors block"
            >
              {t("collection")}
            </Link>
          </li>
          <li>
            <Link
              href="/artistes"
              onClick={() => setIsOpen(false)}
              className="font-archivo font-extrabold text-[clamp(2.5rem,7vw,5.5rem)] leading-none hover:text-or2 transition-colors block"
            >
              {t("artists")}
            </Link>
          </li>
          <li>
            <Link
              href="/#visite"
              onClick={() => setIsOpen(false)}
              className="font-archivo font-extrabold text-[clamp(2.5rem,7vw,5.5rem)] leading-none hover:text-or2 transition-colors block"
            >
              {t("visit")}
            </Link>
          </li>
        </ul>

        {/* Drawer footer: Socials only (duplicate language switcher removed) */}
        <div className="flex items-center justify-end gap-6 pt-6 border-t border-white/15 text-xs uppercase tracking-wider text-white/70">
          <a
            href="https://www.instagram.com/artemisgalerietg/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-or2 transition-colors"
          >
            Instagram
          </a>
          <a
            href="https://www.facebook.com/p/Artemis-Galerie-61569428815346/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-or2 transition-colors"
          >
            Facebook
          </a>
          <a
            href="https://www.tiktok.com/@artemis.galerie"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-or2 transition-colors"
          >
            TikTok
          </a>
        </div>
      </nav>
    </>
  );
}
