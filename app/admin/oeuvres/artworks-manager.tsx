"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Artwork, Artist, ArtworkStatus, ArtworkType } from "@/types/artemis";
import { formatPrice } from "@/lib/utils";
import { Plus, Edit2, Trash2, CheckCircle2, Upload, AlertCircle, X, Search } from "lucide-react";

interface ArtworksManagerProps {
  initialArtworks: Artwork[];
  artists: Artist[];
}

export function ArtworksManager({ initialArtworks, artists }: ArtworksManagerProps) {
  const [artworks, setArtworks] = useState<Artwork[]>(initialArtworks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterArtist, setFilterArtist] = useState("all");

  // Form State
  const [formData, setFormData] = useState({
    titleFr: "",
    titleEn: "",
    artistId: artists[0]?.id || "",
    year: new Date().getFullYear(),
    mediumFr: "Technique mixte sur toile",
    mediumEn: "Mixed media on canvas",
    dimensions: "60 × 50 cm",
    price: 400000,
    status: "disponible" as ArtworkStatus,
    type: "peinture" as ArtworkType,
    image: "",
    descriptionFr: "",
    descriptionEn: "",
    featuredInHero: false,
  });

  const artistMap = new Map(artists.map((a) => [a.id, a]));

  const openNewModal = () => {
    setEditingArtwork(null);
    setFormData({
      titleFr: "",
      titleEn: "",
      artistId: artists[0]?.id || "",
      year: new Date().getFullYear(),
      mediumFr: "Technique mixte sur toile",
      mediumEn: "Mixed media on canvas",
      dimensions: "60 × 50 cm",
      price: 400000,
      status: "disponible",
      type: "peinture",
      image: "",
      descriptionFr: "",
      descriptionEn: "",
      featuredInHero: false,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (artwork: Artwork) => {
    setEditingArtwork(artwork);
    setFormData({
      titleFr: artwork.title.fr,
      titleEn: artwork.title.en,
      artistId: artwork.artistId,
      year: artwork.year,
      mediumFr: artwork.medium.fr,
      mediumEn: artwork.medium.en,
      dimensions: artwork.dimensions,
      price: artwork.price,
      status: artwork.status,
      type: artwork.type,
      image: artwork.image,
      descriptionFr: artwork.description?.fr || "",
      descriptionEn: artwork.description?.en || "",
      featuredInHero: artwork.featuredInHero || false,
    });
    setIsModalOpen(true);
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
      setFormData((prev) => ({ ...prev, image: json.url }));
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'envoi de l'image");
    } finally {
      setUploading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: ArtworkStatus) => {
    try {
      const res = await fetch("/api/artworks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (res.ok) {
        setArtworks((prev) =>
          prev.map((w) => (w.id === id ? { ...w, status: newStatus } : w))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titleFr || !formData.artistId) {
      alert("Veuillez renseigner le titre et l'artiste");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: { fr: formData.titleFr, en: formData.titleEn || formData.titleFr },
        artistId: formData.artistId,
        year: Number(formData.year) || new Date().getFullYear(),
        medium: { fr: formData.mediumFr, en: formData.mediumEn || formData.mediumFr },
        dimensions: formData.dimensions,
        price: Number(formData.price),
        status: formData.status,
        type: formData.type,
        image: formData.image || "/artworks/laka/terre-feconde.jpeg",
        aspectRatio: 1.0,
        description: { fr: formData.descriptionFr, en: formData.descriptionEn },
        featuredInHero: formData.featuredInHero,
        slug: formData.titleFr
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]/g, "-")
          .replace(/-+/g, "-"),
      };

      if (editingArtwork) {
        const res = await fetch("/api/artworks", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingArtwork.id, ...payload }),
        });
        if (res.ok) {
          const updated = await res.json();
          setArtworks((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));
          setIsModalOpen(false);
        }
      } else {
        const res = await fetch("/api/artworks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const created = await res.json();
          setArtworks((prev) => [created, ...prev]);
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

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Supprimer définitivement l'œuvre « ${title} » ?`)) return;

    try {
      const res = await fetch(`/api/artworks?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setArtworks((prev) => prev.filter((w) => w.id !== id));
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suppression");
    }
  };

  const filtered = artworks.filter((w) => {
    const matchSearch =
      w.title.fr.toLowerCase().includes(search.toLowerCase()) ||
      w.dimensions.toLowerCase().includes(search.toLowerCase());
    const matchArtist = filterArtist === "all" || w.artistId === filterArtist;
    return matchSearch && matchArtist;
  });

  return (
    <div className="space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h1 className="text-3xl font-extrabold uppercase tracking-tight text-white">
            Tableaux & Œuvres
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Gérez l'ensemble des toiles exposées, leurs prix et leurs statuts.
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-or text-black font-semibold text-xs uppercase tracking-wider rounded hover:bg-or2 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter une œuvre</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-zinc-900 p-4 rounded-lg border border-zinc-800">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par titre ou format..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 pl-9 pr-4 py-2 text-sm text-white placeholder-zinc-500 rounded focus:outline-none focus:border-or"
          />
        </div>

        <div className="w-full sm:w-auto">
          <select
            value={filterArtist}
            onChange={(e) => setFilterArtist(e.target.value)}
            className="w-full sm:w-56 bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-white rounded focus:outline-none focus:border-or"
          >
            <option value="all">Tous les artistes</option>
            {artists.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Artworks Table */}
      <div className="rounded-lg bg-zinc-900 border border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="bg-zinc-850 text-xs uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
              <tr>
                <th className="py-4 px-6">Œuvre</th>
                <th className="py-4 px-6">Artiste</th>
                <th className="py-4 px-6">Format & Tech.</th>
                <th className="py-4 px-6">Prix</th>
                <th className="py-4 px-6">Statut Vente</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filtered.map((work) => {
                const artist = artistMap.get(work.artistId);
                return (
                  <tr key={work.id} className="hover:bg-zinc-850/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded overflow-hidden bg-zinc-800 shrink-0">
                          <Image
                            src={work.image}
                            alt={work.title.fr}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div>
                          <div className="font-newsreader italic font-bold text-white text-base">
                            {work.title.fr}
                          </div>
                          {work.featuredInHero && (
                            <span className="text-[10px] text-or uppercase tracking-wider">
                              ★ En avant Hero
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 font-semibold text-zinc-200">
                      {artist?.name || "—"}
                    </td>

                    <td className="py-4 px-6 text-xs text-zinc-400">
                      <div>{work.dimensions}</div>
                      <div>{work.medium.fr}</div>
                    </td>

                    <td className="py-4 px-6 font-bold text-white">
                      {formatPrice(work.price)}
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5">
                        <select
                          value={work.status}
                          onChange={(e) =>
                            handleStatusChange(work.id, e.target.value as ArtworkStatus)
                          }
                          className={`text-xs font-semibold px-2 py-1 rounded border focus:outline-none cursor-pointer ${work.status === "disponible"
                              ? "bg-emerald-950/60 border-emerald-800 text-emerald-400"
                              : work.status === "reserve"
                                ? "bg-amber-950/60 border-amber-800 text-amber-400"
                                : "bg-zinc-800 border-zinc-700 text-zinc-400"
                            }`}
                        >
                          <option value="disponible">Disponible</option>
                          <option value="reserve">Réservée</option>
                          <option value="vendu">Vendue</option>
                        </select>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(work)}
                          className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                          title="Modifier"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(work.id, work.title.fr)}
                          className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-red-400 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit Artwork */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-2xl rounded-xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto my-auto shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-6">
              <h2 className="text-xl font-bold uppercase tracking-tight text-white">
                {editingArtwork ? "Modifier le tableau" : "Ajouter un nouveau tableau"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 text-sm">
              {/* Artist and Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1.5 font-semibold">
                    Artiste *
                  </label>
                  <select
                    value={formData.artistId}
                    onChange={(e) => setFormData({ ...formData, artistId: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 px-3.5 py-2.5 rounded text-white focus:outline-none focus:border-or"
                    required
                  >
                    {artists.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1.5 font-semibold">
                    Discipline / Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value as ArtworkType })
                    }
                    className="w-full bg-zinc-800 border border-zinc-700 px-3.5 py-2.5 rounded text-white focus:outline-none focus:border-or"
                  >
                    <option value="peinture">Peinture</option>
                    <option value="dessin">Dessin</option>
                    <option value="sculpture">Sculpture</option>
                    <option value="serigraphie">Sérigraphie</option>
                    <option value="varia">Varia</option>
                  </select>
                </div>
              </div>

              {/* Title FR & EN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1.5 font-semibold">
                    Titre (Français) *
                  </label>
                  <input
                    type="text"
                    value={formData.titleFr}
                    onChange={(e) => setFormData({ ...formData, titleFr: e.target.value })}
                    placeholder="ex. Terre Féconde"
                    className="w-full bg-zinc-800 border border-zinc-700 px-3.5 py-2.5 rounded text-white focus:outline-none focus:border-or"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1.5 font-semibold">
                    Titre (Anglais)
                  </label>
                  <input
                    type="text"
                    value={formData.titleEn}
                    onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                    placeholder="ex. Fertile Ground"
                    className="w-full bg-zinc-800 border border-zinc-700 px-3.5 py-2.5 rounded text-white focus:outline-none focus:border-or"
                  />
                </div>
              </div>

              {/* Dimensions & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1.5 font-semibold">
                    Dimensions *
                  </label>
                  <input
                    type="text"
                    value={formData.dimensions}
                    onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                    placeholder="ex. 60 × 56 cm"
                    className="w-full bg-zinc-800 border border-zinc-700 px-3.5 py-2.5 rounded text-white focus:outline-none focus:border-or"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1.5 font-semibold">
                    Prix (FCFA) *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    placeholder="450000"
                    className="w-full bg-zinc-800 border border-zinc-700 px-3.5 py-2.5 rounded text-white focus:outline-none focus:border-or"
                    required
                  />
                </div>
              </div>

              {/* Medium & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1.5 font-semibold">
                    Technique / Médium
                  </label>
                  <input
                    type="text"
                    value={formData.mediumFr}
                    onChange={(e) => setFormData({ ...formData, mediumFr: e.target.value })}
                    placeholder="Technique mixte sur toile"
                    className="w-full bg-zinc-800 border border-zinc-700 px-3.5 py-2.5 rounded text-white focus:outline-none focus:border-or"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1.5 font-semibold">
                    Statut commercial
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as ArtworkStatus })
                    }
                    className="w-full bg-zinc-800 border border-zinc-700 px-3.5 py-2.5 rounded text-white focus:outline-none focus:border-or"
                  >
                    <option value="disponible">Disponible</option>
                    <option value="reserve">Réservée</option>
                    <option value="vendu">Vendue</option>
                  </select>
                </div>
              </div>

              {/* Image Upload / URL */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1.5 font-semibold">
                  Photo principale de l'œuvre
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
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
                {formData.image && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="relative w-12 h-12 rounded overflow-hidden bg-zinc-800">
                      <Image
                        src={formData.image}
                        alt="Aperçu"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-xs text-zinc-400 truncate max-w-xs">{formData.image}</span>
                  </div>
                )}
              </div>

              {/* Featured in Hero checkbox */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="featuredInHero"
                  checked={formData.featuredInHero}
                  onChange={(e) => setFormData({ ...formData, featuredInHero: e.target.checked })}
                  className="w-4 h-4 accent-or rounded cursor-pointer"
                />
                <label htmlFor="featuredInHero" className="text-sm text-zinc-300 cursor-pointer">
                  Mettre en avant dans le diaporama Hero de la page d'accueil
                </label>
              </div>

              {/* Curatorial description */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1.5 font-semibold">
                  Texte de présentation / Démarche curatoriale
                </label>
                <textarea
                  rows={3}
                  value={formData.descriptionFr}
                  onChange={(e) => setFormData({ ...formData, descriptionFr: e.target.value })}
                  placeholder="Notes explicatives sur l'œuvre, symbolisme, intentions artistiques..."
                  className="w-full bg-zinc-800 border border-zinc-700 px-3.5 py-2.5 rounded text-white focus:outline-none focus:border-or"
                />
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
                  {loading ? "Enregistrement..." : editingArtwork ? "Mettre à jour" : "Créer le tableau"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

