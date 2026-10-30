"use client";

import React from "react";
import { GalleryConfig } from "@/types/artemis";
import { useLanguage } from "@/context/language-context";
import { getGeneralWhatsAppUrl } from "@/lib/utils";
import { Phone, Mail, MapPin, Clock, ExternalLink } from "lucide-react";

interface VisitSectionProps {
  config: GalleryConfig;
}

export function VisitSection({ config }: VisitSectionProps) {
  const { lang, t } = useLanguage();
  const address = config.address[lang] || config.address.fr;
  const hours = config.hours[lang] || config.hours.fr;
  const waUrl = getGeneralWhatsAppUrl(config.whatsapp, lang);

  return (
    <section className="bg-pl text-tx py-[clamp(80px,10vw,140px)] px-[var(--m)]" id="visite">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Left Column: Heading and Address */}
        <div className="lg:col-span-4">
          <h2 className="font-archivo font-extrabold text-[clamp(2rem,4vw,3.5rem)] leading-none uppercase tracking-tight">
            {t("visit")}
          </h2>
          <address className="not-italic text-lg md:text-xl font-normal leading-relaxed mt-6 max-w-sm">
            {address}
          </address>

          <div className="mt-8">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-6 py-4 bg-tx text-wall font-semibold text-sm hover:bg-or hover:text-black transition-colors duration-300"
            >
              {t("inquireWhatsApp")}
            </a>
          </div>
        </div>

        {/* Right Columns: Hours, Map, Contact, Socials */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-10 lg:gap-12">
          {/* Hours Block */}
          <div>
            <div className="flex items-center gap-2 mb-4 text-xs tracking-widest uppercase font-semibold text-gr">
              <Clock className="w-3.5 h-3.5" />
              <h3>{t("hoursLabel")}</h3>
            </div>
            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
              {hours.map(([day, hr], i) => (
                <React.Fragment key={i}>
                  <dt className="text-gr font-medium">{day}</dt>
                  <dd className="font-semibold text-tx">{hr}</dd>
                </React.Fragment>
              ))}
            </dl>
          </div>

          {/* Map Block */}
          <div>
            <div className="flex items-center gap-2 mb-4 text-xs tracking-widest uppercase font-semibold text-gr">
              <MapPin className="w-3.5 h-3.5" />
              <h3>{t("mapLabel")}</h3>
            </div>
            <div className="overflow-hidden rounded-sm border border-tx/10 shadow-sm aspect-[16/10]">
              <iframe
                src={config.mapEmbedUrl}
                title="Carte Google Maps de la Galerie Artémis"
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <a
              href={config.locationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-tx hover:text-or underline underline-offset-4 decoration-or"
            >
              {t("openMap")}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Contact Block */}
          <div className="pt-6 border-t border-tx/10">
            <h3 className="text-xs tracking-widest uppercase font-semibold text-gr mb-4">
              {t("contactLabel")}
            </h3>
            <div className="space-y-3 text-sm">
              <a
                href={`tel:${config.phone.replace(/\s+/g, "")}`}
                className="flex items-center gap-3 text-tx hover:text-or transition-colors"
              >
                <Phone className="w-4 h-4 text-gr" />
                <span>{config.phone}</span>
              </a>
              <a
                href={`mailto:${config.email}`}
                className="flex items-center gap-3 text-tx hover:text-or transition-colors"
              >
                <Mail className="w-4 h-4 text-gr" />
                <span>{config.email}</span>
              </a>
            </div>
          </div>

          {/* Socials Block */}
          <div className="pt-6 border-t border-tx/10">
            <h3 className="text-xs tracking-widest uppercase font-semibold text-gr mb-4">
              {t("socialLabel")}
            </h3>
            <div className="flex flex-wrap gap-4 text-sm">
              <a
                href={config.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-tx hover:text-or underline underline-offset-4 decoration-or/50 transition-colors"
              >
                Instagram
              </a>
              <a
                href={config.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-tx hover:text-or underline underline-offset-4 decoration-or/50 transition-colors"
              >
                Facebook
              </a>
              <a
                href={config.socials.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="text-tx hover:text-or underline underline-offset-4 decoration-or/50 transition-colors"
              >
                TikTok
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

