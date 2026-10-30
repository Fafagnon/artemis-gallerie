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
  const { lang, setLang, t } = useLanguage();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Lock scroll when menu is open
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

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-[var(--m)] py-5 transition-colors duration-300 ${variant === "solid"
            ? "bg-wall/90 backdrop-blur-md border-b border-pl text-tx"
            : "text-white"
          }`}
      >
        <Link
          href="/"
          className="relative block w-[clamp(90px,10vw,140px)] group focus-visible:outline-white"
          aria-label="Artemis Galerie"
        >
          <div className="relative w-full aspect-[220/85]">
            <Image
              src="/logo.png"
              alt="Artemis Galerie"
              fill
              priority
              sizes="(max-width: 768px) 100px, 140px"
              className={`object-contain transition-opacity duration-300 ${variant === "solid" ? "filter brightness-0 dark:invert" : ""
                }`}
            />
          </div>
        </Link>

        {/* Menu button */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsOpen(true)}
            className={`w-12 h-12 rounded-full grid place-content-center transition-all duration-300 focus-visible:outline-2 ${variant === "solid"
                ? "border border-tx/30 bg-tx/5 text-tx hover:bg-tx/10"
                : "border border-white/30 bg-black/30 backdrop-blur-md text-white hover:bg-black/50"
              }`}
            aria-label={t("menu")}
            aria-expanded={isOpen}
          >
            <div className="flex flex-col gap-1.5 items-end w-5">
              <span className={`h-0.5 w-5 ${variant === "solid" ? "bg-tx" : "bg-white"}`} />
              <span className={`h-0.5 w-3.5 transition-all group-hover:w-5 ${variant === "solid" ? "bg-tx" : "bg-white"}`} />
            </div>
          </button>
        </div>
      </header>

      {/* Fullscreen Overlay Menu */}
      <nav
        className={`fixed inset-0 z-50 bg-black text-white flex flex-col justify-between p-[var(--m)] pt-[calc(env(safe-area-inset-top,0px)+100px)] transition-all duration-700 ease-artemis ${isOpen
            ? "opacity-100 pointer-events-auto visible translate-y-0"
            : "opacity-0 pointer-events-none invisible -translate-y-6"
          }`}
        aria-label={t("menu")}
        aria-hidden={!isOpen}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-7 right-[var(--m)] w-12 h-12 rounded-full border border-white/35 bg-black/40 text-white grid place-content-center hover:bg-white/10 transition-colors"
          aria-label={t("close")}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Primary Links */}
        <ul className="list-none space-y-4 my-auto">
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

        {/* Bottom footer: Language & Socials */}
        <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-white/15 text-sm">
          <div className="flex items-center gap-2" role="group" aria-label="Langue">
            <button
              onClick={() => setLang("fr")}
              className={`py-1.5 px-3 transition-colors ${lang === "fr"
                  ? "text-white border-b-2 border-or font-semibold"
                  : "text-white/50 hover:text-white"
                }`}
              aria-pressed={lang === "fr"}
            >
              FR
            </button>
            <span className="text-white/20">|</span>
            <button
              onClick={() => setLang("en")}
              className={`py-1.5 px-3 transition-colors ${lang === "en"
                  ? "text-white border-b-2 border-or font-semibold"
                  : "text-white/50 hover:text-white"
                }`}
              aria-pressed={lang === "en"}
            >
              EN
            </button>
          </div>

          <div className="flex items-center gap-6 text-white/70">
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
        </div>
      </nav>
    </>
  );
}

