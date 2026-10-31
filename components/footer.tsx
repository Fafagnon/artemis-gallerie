"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";

export function Footer() {
  const { lang, t } = useLanguage();

  return (
    <footer className="py-8 px-[var(--m)] border-t border-pl flex flex-wrap items-center justify-between gap-6 text-sm text-gr">
      <div>
        <span>{t("copyright")}</span>
      </div>

      <div className="flex items-center gap-6">
        <Link href="/" className="hover:text-tx transition-colors font-medium">
          {t("home")}
        </Link>
        <Link href="/artistes" className="hover:text-tx transition-colors">
          {t("artists")}
        </Link>
        <Link href="/#collection" className="hover:text-tx transition-colors">
          {t("collection")}
        </Link>
        <Link href="/#contact" className="hover:text-tx transition-colors">
          {lang === "fr" ? "Contact" : "Contact"}
        </Link>
        <Link
          href="/admin"
          className="text-gr/40 hover:text-tx text-xs transition-colors"
          title="Administration"
        >
          Administration
        </Link>
      </div>
    </footer>
  );
}
