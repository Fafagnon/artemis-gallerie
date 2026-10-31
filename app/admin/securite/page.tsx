"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Database,
  Lock,
} from "lucide-react";

export default function AdminSecurityPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [tableReady, setTableReady] = useState<boolean | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  const sqlSetupScript = `-- Table des paramètres sécurisés de la galerie
CREATE TABLE IF NOT EXISTS admin_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all on admin_settings" ON admin_settings;
CREATE POLICY "Allow all on admin_settings" ON admin_settings FOR ALL USING (true) WITH CHECK (true);`;

  useEffect(() => {
    fetch("/api/admin/password")
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.tableReady === "boolean") {
          setTableReady(data.tableReady);
        }
      })
      .catch(() => setTableReady(false));
  }, []);

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlSetupScript);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!currentPassword) {
      setError("Veuillez saisir votre mot de passe actuel.");
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setError("Le nouveau mot de passe doit comporter au moins 6 caractères.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.tableMissing) {
          setTableReady(false);
        }
        setError(data.error || "Impossible de modifier le mot de passe.");
        setLoading(false);
        return;
      }

      setSuccess("Mot de passe mis à jour avec succès ! Il est immédiatement actif pour toutes vos prochaines connexions.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTableReady(true);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Erreur de communication avec le serveur.");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <div className="text-xs uppercase tracking-widest text-or font-semibold mb-1 flex items-center gap-2">
          <KeyRound className="w-3.5 h-3.5" />
          <span>Sécurité & Accès</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-wide">
          Gestion du mot de passe
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Modifiez le mot de passe d'accès à l'espace d'administration de la galerie en toute autonomie.
        </p>
      </div>

      {/* SQL Setup Notice if table not ready in Supabase */}
      {tableReady === false && (
        <div className="bg-amber-950/30 border border-amber-500/30 rounded-2xl p-6 text-zinc-200">
          <div className="flex items-start gap-3">
            <Database className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-3 flex-1">
              <div className="font-semibold text-white text-sm">
                Configuration Supabase requise (à faire 1 seule fois)
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Pour enregistrer le mot de passe directement dans votre base Supabase, la table <code className="bg-black/40 px-1.5 py-0.5 rounded text-amber-300">admin_settings</code> doit être activée.
                Copiez le code ci-dessous et collez-le dans le <strong>SQL Editor</strong> de votre tableau de bord Supabase, puis cliquez sur <strong>Run</strong> :
              </p>

              <div className="relative">
                <pre className="bg-[#0B0B0D] border border-zinc-800 rounded-xl p-4 text-[11px] font-mono text-zinc-300 overflow-x-auto">
                  {sqlSetupScript}
                </pre>
                <button
                  type="button"
                  onClick={handleCopySql}
                  className="absolute top-2.5 right-2.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors border border-zinc-700"
                >
                  {copiedSql ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-400" />
                      <span className="text-green-400">Copié !</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copier le SQL</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Card (2 cols) */}
        <div className="lg:col-span-2 bg-[#141416] border border-zinc-800 rounded-2xl p-7 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <Lock className="w-4 h-4 text-or" />
            <span>Modifier le mot de passe</span>
          </h2>
          <p className="text-xs text-zinc-400 mb-6">
            Le nouveau mot de passe remplacera immédiatement l'ancien pour tout le monde.
          </p>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/25 flex items-start gap-3 text-red-300 text-sm">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed">{error}</div>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/25 flex items-start gap-3 text-green-300 text-sm">
              <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed font-medium">{success}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Current Password */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-300 mb-2">
                Mot de passe actuel
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Saisissez le mot de passe actuel"
                  className="w-full bg-[#0B0B0D] border border-zinc-750 rounded-xl px-4 py-3 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-or focus:ring-1 focus:ring-or/30 pr-11 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 p-1"
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-300 mb-2">
                Nouveau mot de passe
              </label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 caractères"
                  className="w-full bg-[#0B0B0D] border border-zinc-750 rounded-xl px-4 py-3 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-or focus:ring-1 focus:ring-or/30 pr-11 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 p-1"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-300 mb-2">
                Confirmer le nouveau mot de passe
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Répétez le nouveau mot de passe"
                  className="w-full bg-[#0B0B0D] border border-zinc-750 rounded-xl px-4 py-3 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-or focus:ring-1 focus:ring-or/30 pr-11 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 p-1"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl bg-or hover:bg-or2 text-black font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-or/10 active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Mise à jour en cours...
                </span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Enregistrer le nouveau mot de passe</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Security Info Card (1 col) */}
        <div className="space-y-6">
          <div className="bg-[#141416] border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-green-400" />
              <span>Chiffrement & Sécurité</span>
            </h3>
            <ul className="text-xs text-zinc-400 space-y-3 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-or font-bold">•</span>
                <span>
                  <strong>Hachage PBKDF2</strong> : Votre mot de passe n'est jamais stocké en clair, il est protégé par 100 000 itérations cryptographiques avec sel aléatoire.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-or font-bold">•</span>
                <span>
                  <strong>Session 14 jours</strong> : Vous restez connecté confortablement sans devoir retaper le code à chaque visite.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-or font-bold">•</span>
                <span>
                  <strong>Autonomie complète</strong> : Tout changement effectué ici s'applique immédiatement en ligne sans toucher à Vercel.
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-[#141416]/50 border border-zinc-850 rounded-2xl p-6 text-xs text-zinc-400 space-y-2">
            <div className="font-semibold text-white">Conseil pour la galerie</div>
            <p>
              Partagez ce mot de passe uniquement avec les membres autorisés de l'équipe Artemis ayant la charge d'ajouter ou de modifier des tableaux.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

