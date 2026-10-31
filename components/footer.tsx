"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="py-8 px-[var(--m)] border-t border-pl bg-wall text-xs text-gr flex flex-col sm:flex-row items-center justify-between gap-4">
      <div>
        <span>{t("copyright")}</span>
      </div>

      <nav className="flex items-center gap-6" aria-label="Navigation secondaire">
        <Link href="/" className="hover:text-tx transition-colors font-medium">
          {t("home")}
        </Link>
        <Link href="/artistes" className="hover:text-tx transition-colors font-medium">
          {t("artists")}
        </Link>
        <Link href="/#collection" className="hover:text-tx transition-colors font-medium">
          {t("collection")}
        </Link>
        <Link href="/#visite" className="hover:text-tx transition-colors font-medium">
          {t("visit")}
        </Link>
        <Link
          href="/admin"
          className="text-gr/30 hover:text-tx transition-colors"
          title="Administration"
        >
          Administration
        </Link>
      </nav>
    </footer>
  );
}
