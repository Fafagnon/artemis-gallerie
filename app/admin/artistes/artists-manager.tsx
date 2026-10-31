"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Artist, Artwork } from "@/types/artemis";
import { Plus, Edit2, Trash2, X, Upload, Users, Palette } from "lucide-react";
import { ConfirmModal } from "@/components/admin/confirm-modal";

interface ArtistsManagerProps {
  initialArtists: Artist[];
  artworks: Artwork[];
}

export function ArtistsManager({ initialArtists, artworks }: ArtistsManagerProps) {
  const [artists, setArtists] = useState<Artist[]>(initialArtists);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);
  const [artistToDelete, setArtistToDelete] = useState<{ id: string; name: string; worksCount: number } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    nationality: "Togolaise",
    city: "Lomé",
    birthYear: 1985,
    bioFr: "",
    bioEn: "",
    statementFr: "",
    statementEn: "",
    avatarUrl: "",
    featured: true,
  });

  const openNewModal = () => {
    setEditingArtist(null);
    setFormData({
      name: "",
      slug: "",
      nationality: "Togolaise",
      city: "Lomé",
      birthYear: 1985,
      bioFr: "",
      bioEn: "",
      statementFr: "",
      statementEn: "",
      avatarUrl: "",
      featured: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (artist: Artist) => {
    setEditingArtist(artist);
    setFormData({
      name: artist.name,
      slug: artist.slug,
      nationality: artist.nationality,
      city: artist.city || "Lomé",
      birthYear: artist.birthYear || 1985,
      bioFr: artist.bio.fr,
      bioEn: artist.bio.en,
      statementFr: artist.statement?.fr || "",
      statementEn: artist.statement?.en || "",
      avatarUrl: artist.avatarUrl || "",
      featured: artist.featured,
    });
    setIsModalOpen(true);
  };

  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-");

    setFormData((prev) => ({
      ...prev,
      name,
      slug: editingArtist ? prev.slug : slug,
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const data = new FormData();
      data.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      if (!res.ok) throw new Error("Upload failed");
      const json = await res.json();
      setFormData((prev) => ({ ...prev, avatarUrl: json.url }));
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'envoi de l'image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      alert("Le nom de l'artiste est obligatoire");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-"),
        nationality: formData.nationality,
        city: formData.city,
        birthYear: Number(formData.birthYear) || undefined,
        bio: { fr: formData.bioFr, en: formData.bioEn || formData.bioFr },
        statement: { fr: formData.statementFr, en: formData.statementEn || formData.statementFr },
        avatarUrl: formData.avatarUrl,
        featured: formData.featured,
      };

      if (editingArtist) {
        const res = await fetch("/api/artists", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingArtist.id, ...payload }),
        });
        if (res.ok) {
          const updated = await res.json();
          setArtists((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
          setIsModalOpen(false);
        }
      } else {
        const res = await fetch("/api/artists", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const created = await res.json();
          setArtists((prev) => [...prev, created]);
          setIsModalOpen(false);
        }
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!artistToDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/artists?id=${encodeURIComponent(artistToDelete.id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setArtists((prev) => prev.filter((a) => a.id !== artistToDelete.id));
        setArtistToDelete(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h1 className="text-3xl font-extrabold uppercase tracking-tight text-white">
            Gestion des Artistes
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Répertoire des créateurs contemporains représentés par Artemis Galerie.
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-or text-black font-semibold text-xs uppercase tracking-wider rounded hover:bg-or2 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un artiste</span>
        </button>
      </div>

      {/* Artists Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {artists.map((artist) => {
          const artistWorks = artworks.filter((w) => w.artistId === artist.id);

          return (
            <div
              key={artist.id}
              className="p-6 rounded-lg bg-zinc-900 border border-zinc-800 flex flex-col justify-between hover:border-zinc-700 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {artist.avatarUrl ? (
                      <div className="relative w-12 h-12 rounded-full overflow-hidden bg-zinc-800 shrink-0 border border-zinc-700">
                        <Image
                          src={artist.avatarUrl}
                          alt={artist.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 grid place-content-center text-zinc-400 shrink-0">
                        <Users className="w-5 h-5" />
                      </div>
                    )}
                    <div>
                      <h2 className="text-xl font-bold uppercase tracking-tight text-white">
                        {artist.name}
                      </h2>
                      <p className="text-xs text-or font-semibold uppercase tracking-wider">
                        {artist.nationality} • {artist.city || "Lomé"}
                      </p>
                    </div>
                  </div>

                  <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                    <Palette className="w-3.5 h-3.5 text-or" />
                    <span>{artistWorks.length} œuvre(s)</span>
                  </span>
                </div>

                {artist.statement && (
                  <p className="mt-4 text-sm font-newsreader italic text-zinc-300 line-clamp-2">
                    « {artist.statement.fr} »
                  </p>
                )}

                <p className="mt-3 text-xs text-zinc-400 leading-relaxed line-clamp-3">
                  {artist.bio.fr}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between text-xs">
                <span className="text-zinc-500 font-mono">
                  /artistes/{artist.slug}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(artist)}
                    className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                    title="Modifier"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      const worksCount = artworks.filter((w) => w.artistId === artist.id).length;
                      setArtistToDelete({ id: artist.id, name: artist.name, worksCount });
                    }}
                    className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-red-400 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add / Edit Artist */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-xl rounded-xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto my-auto shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-6">
              <h2 className="text-xl font-bold uppercase tracking-tight text-white">
                {editingArtist ? "Modifier l'artiste" : "Créer un nouvel artiste"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 text-sm">
              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1.5 font-semibold">
                  Nom de l'artiste *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="ex. LAKA ou AGBELESSESSI Dela"
                  className="w-full bg-zinc-800 border border-zinc-700 px-3.5 py-2.5 rounded text-white focus:outline-none focus:border-or"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1.5 font-semibold">
                    Nationalité
                  </label>
                  <input
                    type="text"
                    value={formData.nationality}
                    onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 px-3.5 py-2.5 rounded text-white focus:outline-none focus:border-or"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1.5 font-semibold">
                    Ville
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 px-3.5 py-2.5 rounded text-white focus:outline-none focus:border-or"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1.5 font-semibold">
                    Année naiss.
                  </label>
                  <input
                    type="number"
                    value={formData.birthYear}
                    onChange={(e) => setFormData({ ...formData, birthYear: Number(e.target.value) })}
                    className="w-full bg-zinc-800 border border-zinc-700 px-3.5 py-2.5 rounded text-white focus:outline-none focus:border-or"
                  />
                </div>
              </div>

              {/* Statement */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1.5 font-semibold">
                  Citation / Démarche artistique
                </label>
                <input
                  type="text"
                  value={formData.statementFr}
                  onChange={(e) => setFormData({ ...formData, statementFr: e.target.value })}
                  placeholder="ex. La matière est vivante ; chaque touche de couleur est un souffle de la terre."
                  className="w-full bg-zinc-800 border border-zinc-700 px-3.5 py-2.5 rounded text-white focus:outline-none focus:border-or"
                />
              </div>

              {/* Bio FR & EN */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1.5 font-semibold">
                  Biographie complète (Français)
                </label>
                <textarea
                  rows={3}
                  value={formData.bioFr}
                  onChange={(e) => setFormData({ ...formData, bioFr: e.target.value })}
                  placeholder="Parcours, expositions, thématiques explorées..."
                  className="w-full bg-zinc-800 border border-zinc-700 px-3.5 py-2.5 rounded text-white focus:outline-none focus:border-or"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1.5 font-semibold">
                  Biographie (Anglais)
                </label>
                <textarea
                  rows={2}
                  value={formData.bioEn}
                  onChange={(e) => setFormData({ ...formData, bioEn: e.target.value })}
                  placeholder="English biography..."
                  className="w-full bg-zinc-800 border border-zinc-700 px-3.5 py-2.5 rounded text-white focus:outline-none focus:border-or"
                />
              </div>

              {/* Photo upload / URL */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1.5 font-semibold">
                  Photo ou Œuvre emblématique
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="text"
                    value={formData.avatarUrl}
                    onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                    placeholder="/artworks/laka/terre-feconde.jpeg ou URL"
                    className="flex-1 bg-zinc-800 border border-zinc-700 px-3.5 py-2.5 rounded text-white focus:outline-none focus:border-or"
                  />
                  <label className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded cursor-pointer flex items-center gap-2 border border-zinc-700">
                    <Upload className="w-4 h-4 text-or" />
                    <span>{uploading ? "Envoi..." : "Uploader"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium rounded transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-or text-black font-semibold rounded hover:bg-or2 transition-colors uppercase tracking-wider text-xs"
                >
                  {loading ? "Enregistrement..." : editingArtist ? "Mettre à jour" : "Créer l'artiste"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={!!artistToDelete}
        title="Supprimer l'artiste"
        message={
          artistToDelete
            ? artistToDelete.worksCount > 0
              ? `Cet artiste possède ${artistToDelete.worksCount} œuvre(s) associée(s). Confirmez-vous sa suppression ?`
              : `Confirmez-vous la suppression définitive de l'artiste « ${artistToDelete.name} » ?`
            : ""
        }
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setArtistToDelete(null)}
      />
    </div>
  );
}

