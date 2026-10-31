"use client";

import React, { useState } from "react";
import { GalleryConfig } from "@/types/artemis";
import { useLanguage } from "@/context/language-context";
import { getGeneralWhatsAppUrl } from "@/lib/utils";
import { Phone, Mail, MapPin, Clock, ExternalLink, CheckCircle2, MessageSquare } from "lucide-react";

interface VisitSectionProps {
  config: GalleryConfig;
}

export function VisitSection({ config }: VisitSectionProps) {
  const { lang, t } = useLanguage();
  const address = config.address[lang] || config.address.fr;
  const hours = config.hours[lang] || config.hours.fr;
  const waUrl = getGeneralWhatsAppUrl(config.whatsapp, lang);

  // Discreet Contact Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    contactInfo: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError(
        lang === "fr"
          ? "Veuillez renseigner votre prénom et nom."
          : "Please enter your first and last name."
      );
      return;
    }

    if (!formData.contactInfo.trim()) {
      setError(
        lang === "fr"
          ? "Veuillez indiquer un numéro ou un e-mail."
          : "Please provide a phone or email."
      );
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Une erreur est survenue.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setFormData({
        firstName: "",
        lastName: "",
        contactInfo: "",
        message: "",
      });
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de l'envoi. Veuillez réessayer.");
      setLoading(false);
    }
  };

  return (
    <section className="bg-pl text-tx py-[clamp(64px,8vw,110px)] px-[var(--m)] border-t border-tx/10" id="visite">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Discreet Contact Form */}
        <div className="lg:col-span-6 bg-wall/60 border border-tx/10 p-6 sm:p-8 rounded-sm">
          <h2 className="font-archivo font-extrabold text-2xl sm:text-3xl uppercase tracking-tight text-tx leading-tight mb-2">
            {lang === "fr" ? "VOUS AVEZ UNE QUESTION SUR UNE ŒUVRE ?" : "HAVE A QUESTION ABOUT AN ARTWORK?"}
          </h2>
          <p className="text-gr text-xs mb-6">
            {lang === "fr"
              ? "Laissez-nous vos coordonnées, la galerie vous recontactera rapidement."
              : "Leave your contact information, the gallery will get in touch with you shortly."}
          </p>

          {success ? (
            <div className="py-8 text-center space-y-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <p className="font-semibold text-tx text-sm">
                {lang === "fr" ? "Message envoyé avec succès." : "Message successfully sent."}
              </p>
              <button
                type="button"
                onClick={() => setSuccess(false)}
                className="text-xs text-gr hover:text-tx underline underline-offset-4"
              >
                {lang === "fr" ? "Envoyer un autre message" : "Send another message"}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 text-xs">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-gr mb-1">
                    {lang === "fr" ? "Prénom *" : "First Name *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className="w-full bg-wall text-tx border border-tx/20 rounded-none px-3 py-2 text-sm focus:outline-none focus:border-tx transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-gr mb-1">
                    {lang === "fr" ? "Nom *" : "Last Name *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className="w-full bg-wall text-tx border border-tx/20 rounded-none px-3 py-2 text-sm focus:outline-none focus:border-tx transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-gr mb-1">
                  {lang === "fr" ? "Téléphone ou E-mail *" : "Phone or Email *"}
                </label>
                <input
                  type="text"
                  required
                  value={formData.contactInfo}
                  onChange={(e) =>
                    setFormData({ ...formData, contactInfo: e.target.value })
                  }
                  className="w-full bg-wall text-tx border border-tx/20 rounded-none px-3 py-2 text-sm focus:outline-none focus:border-tx transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-gr mb-1">
                  {lang === "fr" ? "Votre message" : "Your message"}
                </label>
                <textarea
                  rows={2}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full bg-wall text-tx border border-tx/20 rounded-none px-3 py-2 text-sm focus:outline-none focus:border-tx transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 bg-tx text-wall font-bold uppercase tracking-wider text-xs hover:bg-or hover:text-black transition-colors disabled:opacity-50"
              >
                {loading
                  ? (lang === "fr" ? "Envoi..." : "Sending...")
                  : (lang === "fr" ? "Envoyer" : "Send")}
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Gallery Address, Hours, Map & Contacts */}
        <div className="lg:col-span-6 space-y-8">
          <div>
            <span className="text-xs uppercase tracking-widest text-gr block mb-1 font-semibold">
              {lang === "fr" ? "Galerie d'art contemporain" : "Contemporary Art Gallery"}
            </span>
            <address className="not-italic text-lg md:text-xl font-normal leading-relaxed text-tx">
              {address}
            </address>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4 border-t border-tx/10">
            {/* Hours */}
            <div>
              <div className="flex items-center gap-2 mb-3 text-xs tracking-widest uppercase font-semibold text-gr">
                <Clock className="w-3.5 h-3.5" />
                <h3>{t("hoursLabel")}</h3>
              </div>
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-xs">
                {hours.map(([day, hr], i) => (
                  <React.Fragment key={i}>
                    <dt className="text-gr">{day}</dt>
                    <dd className="font-semibold text-tx">{hr}</dd>
                  </React.Fragment>
                ))}
              </dl>
            </div>

            {/* Direct Contact */}
            <div>
              <div className="flex items-center gap-2 mb-3 text-xs tracking-widest uppercase font-semibold text-gr">
                <Phone className="w-3.5 h-3.5" />
                <h3>{t("contactLabel")}</h3>
              </div>
              <div className="space-y-2 text-xs">
                <a
                  href={`tel:${config.phone.replace(/\s+/g, "")}`}
                  className="flex items-center gap-2 text-tx hover:text-or transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-gr" />
                  <span>{config.phone}</span>
                </a>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-tx hover:text-or transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-gr" />
                  <span>WhatsApp direct</span>
                </a>
                <a
                  href={`mailto:${config.email}`}
                  className="flex items-center gap-2 text-tx hover:text-or transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-gr" />
                  <span>{config.email}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Map and Socials */}
          <div className="pt-4 border-t border-tx/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <a
              href={config.locationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-tx hover:text-or underline underline-offset-4 decoration-or"
            >
              <MapPin className="w-3.5 h-3.5 text-or" />
              <span>{t("openMap")}</span>
              <ExternalLink className="w-3 h-3 text-gr" />
            </a>

            <div className="flex items-center gap-4 text-xs">
              <a
                href={config.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gr hover:text-tx transition-colors"
              >
                Instagram
              </a>
              <a
                href={config.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gr hover:text-tx transition-colors"
              >
                Facebook
              </a>
              <a
                href={config.socials.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gr hover:text-tx transition-colors"
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
