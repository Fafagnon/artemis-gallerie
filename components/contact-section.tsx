"use client";

import React, { useState } from "react";
import { MessageSquare, Send, CheckCircle2, Phone, Mail, Sparkles, AlertCircle } from "lucide-react";
import { useLanguage } from "@/context/language-context";

interface ContactSectionProps {
  phone?: string;
  whatsapp?: string;
  email?: string;
}

export function ContactSection({
  phone = "+228 70 21 11 11",
  whatsapp = "22870211111",
  email = "galerieartemis@gmail.com",
}: ContactSectionProps) {
  const { lang } = useLanguage();

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
          ? "Veuillez renseigner votre nom et prénom."
          : "Please enter your first and last name."
      );
      return;
    }

    if (!formData.contactInfo.trim()) {
      setError(
        lang === "fr"
          ? "Veuillez indiquer un numéro de téléphone ou un e-mail."
          : "Please provide a phone number or email."
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
      setError(
        lang === "fr"
          ? "Erreur lors de l'envoi. Veuillez réessayer ou nous joindre sur WhatsApp."
          : "Sending error. Please retry or contact us directly on WhatsApp."
      );
      setLoading(false);
    }
  };

  const cleanWaNumber = whatsapp.replace(/[^0-9]/g, "");

  return (
    <section className="px-[var(--m)] py-20 md:py-28 bg-[#101012] text-white border-t border-zinc-800/80">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Heading and info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-or font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {lang === "fr" ? "Acquisitions & Renseignements" : "Acquisitions & Inquiries"}
            </span>
          </div>

          <h2 className="font-archivo font-extrabold text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-white leading-tight">
            {lang === "fr" ? (
              <>
                Vous avez une question <span className="font-newsreader italic text-or lowercase font-normal">sur une œuvre</span> ?
              </>
            ) : (
              <>
                Have a question <span className="font-newsreader italic text-or lowercase font-normal">about an artwork</span> ?
              </>
            )}
          </h2>

          <p className="text-zinc-400 text-sm md:text-base leading-relaxed font-normal">
            {lang === "fr"
              ? "Une acquisition, un renseignement sur la cote d'un artiste ou une demande de visite privée ? Laissez-nous vos coordonnées, notre équipe vous répond avec diligence et discrétion."
              : "Inquiring about an artwork, an artist's availability, or scheduling a private viewing? Leave your contact details and our team will get in touch promptly."}
          </p>

          <div className="pt-4 space-y-3">
            <a
              href={`https://wa.me/${cleanWaNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-xs uppercase tracking-wider font-semibold text-zinc-300 hover:text-or transition-colors"
            >
              <span className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 grid place-content-center text-or">
                <MessageSquare className="w-3.5 h-3.5" />
              </span>
              <span>WhatsApp direct : {phone}</span>
            </a>

            <div className="flex items-center gap-3 text-xs uppercase tracking-wider font-semibold text-zinc-300">
              <span className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 grid place-content-center text-or">
                <Mail className="w-3.5 h-3.5" />
              </span>
              <span>{email}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-7 bg-[#17171A] border border-zinc-800 rounded-2xl p-6 sm:p-9 shadow-2xl relative">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-or/40 to-transparent" />

          {success ? (
            <div className="py-10 text-center space-y-4 animate-in fade-in duration-300">
              <div className="w-14 h-14 rounded-full bg-green-500/10 border border-green-500/25 text-green-400 mx-auto grid place-content-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="font-archivo font-extrabold text-2xl uppercase tracking-wide text-white">
                {lang === "fr" ? "Message bien reçu !" : "Message received!"}
              </h3>
              <p className="text-zinc-300 text-sm max-w-md mx-auto leading-relaxed">
                {lang === "fr"
                  ? "Merci pour votre intérêt. La direction de la galerie prendra contact avec vous dans les plus brefs délais."
                  : "Thank you for reaching out. The gallery directors will get back to you shortly."}
              </p>
              <button
                type="button"
                onClick={() => setSuccess(false)}
                className="mt-4 px-6 py-2.5 rounded-lg border border-zinc-700 text-xs uppercase tracking-wider text-zinc-300 hover:text-white hover:border-zinc-500 transition-colors"
              >
                {lang === "fr" ? "Envoyer un autre message" : "Send another message"}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/25 flex items-start gap-3 text-red-300 text-xs">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-300 mb-2">
                    {lang === "fr" ? "Prénom *" : "First Name *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    placeholder={lang === "fr" ? "Votre prénom" : "Your first name"}
                    className="w-full bg-[#0E0E10] border border-zinc-750 rounded-xl px-4 py-3 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-or focus:ring-1 focus:ring-or/30 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-300 mb-2">
                    {lang === "fr" ? "Nom *" : "Last Name *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    placeholder={lang === "fr" ? "Votre nom de famille" : "Your last name"}
                    className="w-full bg-[#0E0E10] border border-zinc-750 rounded-xl px-4 py-3 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-or focus:ring-1 focus:ring-or/30 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-300 mb-2">
                  {lang === "fr" ? "Téléphone ou E-mail *" : "Phone number or Email *"}
                </label>
                <input
                  type="text"
                  required
                  value={formData.contactInfo}
                  onChange={(e) =>
                    setFormData({ ...formData, contactInfo: e.target.value })
                  }
                  placeholder={
                    lang === "fr"
                      ? "ex: +228 90 00 00 00 ou email@domaine.com"
                      : "e.g. +228 90 00 00 00 or email@domain.com"
                  }
                  className="w-full bg-[#0E0E10] border border-zinc-750 rounded-xl px-4 py-3 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-or focus:ring-1 focus:ring-or/30 transition-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs uppercase tracking-wider font-semibold text-zinc-300">
                    {lang === "fr" ? "Votre message" : "Your message"}
                  </label>
                  <span className="text-[11px] text-zinc-500">
                    {lang === "fr" ? "(Optionnel)" : "(Optional)"}
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder={
                    lang === "fr"
                      ? "Précisez l'œuvre ou la nature de votre question..."
                      : "Mention the artwork or detail of your inquiry..."
                  }
                  className="w-full bg-[#0E0E10] border border-zinc-750 rounded-xl px-4 py-3 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-or focus:ring-1 focus:ring-or/30 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl bg-or hover:bg-or2 text-black font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-or/10 active:scale-[0.99] disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>{lang === "fr" ? "Transmission..." : "Sending..."}</span>
                  </span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{lang === "fr" ? "Envoyer ma demande" : "Submit Inquiry"}</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

