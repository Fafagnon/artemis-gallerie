"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="px-[var(--m)] py-8 border-t border-pl flex flex-wrap items-center justify-between gap-4 text-xs md:text-sm text-gr">
      <div>
        <span>{t("copyright")}</span>
      </div>

      <div className="flex items-center gap-6">
        <Link href="/artistes" className="hover:text-tx transition-colors">
          {t("artists")}
        </Link>
        <Link href="/#visite" className="hover:text-tx transition-colors">
          {t("visit")}
        </Link>
        <Link
          href="/admin"
          className="text-tx font-medium hover:text-or transition-colors"
        >
          {t("admin")}
        </Link>
      </div>
    </footer>
  );
}

