import { getArtworks, getArtists } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { Palette, Users, CheckCircle, Clock, ShoppingBag, Plus, ArrowUpRight } from "lucide-react";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const [artworks, artists] = await Promise.all([
    getArtworks(),
    getArtists(),
  ]);

  const availableCount = artworks.filter((w) => w.status === "disponible").length;
  const reservedCount = artworks.filter((w) => w.status === "reserve").length;
  const soldCount = artworks.filter((w) => w.status === "vendu").length;

  const totalValue = artworks.reduce((acc, curr) => acc + (curr.price || 0), 0);
  const availableValue = artworks
    .filter((w) => w.status === "disponible")
    .reduce((acc, curr) => acc + (curr.price || 0), 0);

  const artistMap = new Map(artists.map((a) => [a.id, a]));

  return (
    <div className="space-y-10">
      {/* Welcome & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h1 className="text-3xl font-extrabold uppercase tracking-tight text-white">
            Tableau de bord
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Gestion du catalogue, des artistes et des ventes de la Galerie Artémis.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/oeuvres?action=new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-or text-black font-semibold text-xs uppercase tracking-wider rounded hover:bg-or2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau tableau</span>
          </Link>
          <Link
            href="/admin/artistes?action=new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-800 text-white font-semibold text-xs uppercase tracking-wider rounded hover:bg-zinc-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvel artiste</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-lg bg-zinc-900 border border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs uppercase font-semibold tracking-wider">Total Œuvres</span>
            <Palette className="w-4 h-4 text-or" />
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-white">{artworks.length}</div>
            <p className="text-xs text-zinc-500 mt-1">Dans la collection</p>
          </div>
        </div>

        <div className="p-6 rounded-lg bg-zinc-900 border border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs uppercase font-semibold tracking-wider">Artistes Exposés</span>
            <Users className="w-4 h-4 text-or" />
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-white">{artists.length}</div>
            <p className="text-xs text-zinc-500 mt-1">Résidents & Invités</p>
          </div>
        </div>

        <div className="p-6 rounded-lg bg-zinc-900 border border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs uppercase font-semibold tracking-wider">Disponibles</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-emerald-400">{availableCount}</div>
            <p className="text-xs text-zinc-500 mt-1">
              Valeur : {formatPrice(availableValue)}
            </p>
          </div>
        </div>

        <div className="p-6 rounded-lg bg-zinc-900 border border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs uppercase font-semibold tracking-wider">Réservées / Vendues</span>
            <ShoppingBag className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-white">
              {reservedCount} <span className="text-sm font-normal text-zinc-400">rés.</span> / {soldCount} <span className="text-sm font-normal text-zinc-400">vend.</span>
            </div>
            <p className="text-xs text-zinc-500 mt-1">Total collec. : {formatPrice(totalValue)}</p>
          </div>
        </div>
      </div>

      {/* Artworks List Preview */}
      <div className="rounded-lg bg-zinc-900 border border-zinc-800 overflow-hidden">
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold uppercase tracking-tight text-white">
              Derniers Tableaux Répertoriés
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Aperçu en temps réel du catalogue de la galerie
            </p>
          </div>
          <Link
            href="/admin/oeuvres"
            className="text-xs text-or hover:underline uppercase tracking-wider flex items-center gap-1 font-semibold"
          >
            <span>Gérer tous les tableaux</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-zinc-800">
          {artworks.map((work) => {
            const artist = artistMap.get(work.artistId);
            return (
              <div
                key={work.id}
                className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-zinc-850/50 transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded overflow-hidden bg-zinc-800 shrink-0">
                    <Image
                      src={work.image}
                      alt={work.title.fr}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wider text-or font-semibold truncate">
                      {artist?.name || "Artiste inconnu"}
                    </p>
                    <h3 className="text-sm sm:text-base font-newsreader italic font-bold text-white truncate">
                      {work.title.fr}
                    </h3>
                    <p className="text-xs text-zinc-400 truncate">
                      {work.year} • {work.dimensions}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 shrink-0">
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">
                      {formatPrice(work.price)}
                    </p>
                    <span
                      className={`inline-block text-[11px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded ${
                        work.status === "disponible"
                          ? "bg-emerald-950/70 text-emerald-400 border border-emerald-800"
                          : work.status === "reserve"
                          ? "bg-amber-950/70 text-amber-400 border border-amber-800"
                          : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                      }`}
                    >
                      {work.status}
                    </span>
                  </div>

                  <Link
                    href={`/admin/oeuvres?edit=${work.id}`}
                    className="hidden sm:inline-flex px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-xs font-medium rounded transition-colors text-zinc-200"
                  >
                    Modifier
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

