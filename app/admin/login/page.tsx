"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Eye, EyeOff, ArrowRight, ArrowLeft, ShieldAlert } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("from") || "/admin";

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("Veuillez saisir votre mot de passe.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Mot de passe incorrect.");
        setLoading(false);
        return;
      }

      // Success: redirect to target admin page
      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Erreur de connexion au serveur. Veuillez réessayer.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-5 shadow-inner">
          <Lock className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wider text-white uppercase font-archivo">
          Galerie Artemis
        </h1>
        <p className="mt-2 text-sm text-zinc-400 font-light">
          Espace d'administration réservé à la direction de la galerie.
        </p>
      </div>

      {/* Login Card */}
      <div className="bg-[#141417]/90 border border-zinc-800/90 rounded-2xl p-7 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        {/* Subtle top border accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/25 flex items-start gap-3 text-red-300 text-sm animate-in fade-in duration-200">
            <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="leading-snug">{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="password"
              className="block text-xs uppercase tracking-wider font-semibold text-zinc-300 mb-2"
            >
              Mot de passe d'administration
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                autoFocus
                disabled={loading}
                className="w-full bg-[#0A0A0C] border border-zinc-700/80 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 transition-all pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 p-1 rounded-md transition-colors"
                aria-label={showPassword ? "Masquer" : "Afficher"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                Vérification...
              </span>
            ) : (
              <>
                <span>Déverrouiller le Back-Office</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Back to public site */}
      <div className="mt-8 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Retour à la galerie publique</span>
        </Link>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0C] text-zinc-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-archivo selection:bg-amber-500 selection:text-black">
      {/* Background Ambience / Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-b from-amber-500/8 via-amber-600/3 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#18181b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

      <Suspense
        fallback={
          <div className="text-zinc-500 text-sm flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            Chargement...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}

