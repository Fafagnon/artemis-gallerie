import fs from "fs";
import path from "path";
import { Artist, Artwork, GalleryConfig } from "@/types/artemis";
import { supabase } from "@/lib/supabase";

const DATA_FILE = path.join(process.cwd(), "data", "artemis-data.json");

interface ArtemisStore {
  artists: Artist[];
  artworks: Artwork[];
  galleryConfig: GalleryConfig;
}

function readLocalStore(): ArtemisStore {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      throw new Error(`Data file not found at ${DATA_FILE}`);
    }
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (error) {
    console.error("Error reading local artemis store:", error);
    return {
      artists: [],
      artworks: [],
      galleryConfig: {
        phone: "+228 70 21 11 11",
        whatsapp: "22870211111",
        email: "galerieartemis@gmail.com",
        address: { fr: "Forever, Lomé, Togo", en: "Forever, Lomé, Togo" },
        hours: { fr: [], en: [] },
        socials: { instagram: "", facebook: "", tiktok: "" },
        locationUrl: "",
        mapEmbedUrl: "",
      },
    };
  }
}

function writeLocalStore(data: ArtemisStore): void {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing local artemis store:", error);
  }
}

// Helpers to map Supabase rows to TypeScript types
function mapArtistRow(row: any): Artist {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    nationality: row.nationality || "Togolaise",
    city: row.city || "Lomé",
    birthYear: row.birth_year,
    bio: {
      fr: row.bio_fr || "",
      en: row.bio_en || row.bio_fr || "",
    },
    statement: row.statement_fr
      ? {
        fr: row.statement_fr,
        en: row.statement_en || row.statement_fr,
      }
      : undefined,
    avatarUrl: row.avatar_url,
    coverImage: row.cover_image,
    featured: row.featured ?? true,
    order: row.display_order ?? 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapArtworkRow(row: any): Artwork {
  return {
    id: row.id,
    slug: row.slug,
    artistId: row.artist_id,
    title: {
      fr: row.title_fr,
      en: row.title_en || row.title_fr,
    },
    year: row.year,
    medium: {
      fr: row.medium_fr,
      en: row.medium_en || row.medium_fr,
    },
    dimensions: row.dimensions,
    price: row.price,
    status: row.status,
    type: row.type,
    image: row.image,
    detailImages: row.detail_images || [],
    aspectRatio: row.aspect_ratio || 1.0,
    description: row.description_fr
      ? {
        fr: row.description_fr,
        en: row.description_en || row.description_fr,
      }
      : undefined,
    featuredInHero: row.featured_in_hero ?? false,
    order: row.display_order ?? 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ARTISTS API
export async function getArtists(): Promise<Artist[]> {
  try {
    const { data, error } = await supabase
      .from("artists")
      .select("*")
      .order("display_order", { ascending: true });

    if (!error && data && data.length > 0) {
      return data.map(mapArtistRow);
    }
  } catch (err) {
    console.warn("Supabase getArtists error, using fallback:", err);
  }

  const local = readLocalStore();
  return local.artists.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}

export async function getArtistById(id: string): Promise<Artist | null> {
  const artists = await getArtists();
  return artists.find((a) => a.id === id || a.slug === id) || null;
}

export async function getArtistBySlug(slug: string): Promise<Artist | null> {
  const artists = await getArtists();
  return artists.find((a) => a.slug === slug) || null;
}

export async function createArtist(
  data: Omit<Artist, "id" | "createdAt" | "updatedAt">
): Promise<Artist> {
  const id = `artist-${Date.now()}`;
  const now = new Date().toISOString();
  const newArtist: Artist = {
    ...data,
    id,
    createdAt: now,
    updatedAt: now,
  };

  // Try saving to Supabase
  try {
    const { data: supaData, error } = await supabase
      .from("artists")
      .insert({
        id: newArtist.id,
        slug: newArtist.slug,
        name: newArtist.name,
        nationality: newArtist.nationality,
        city: newArtist.city,
        birth_year: newArtist.birthYear,
        bio_fr: newArtist.bio.fr,
        bio_en: newArtist.bio.en,
        statement_fr: newArtist.statement?.fr,
        statement_en: newArtist.statement?.en,
        avatar_url: newArtist.avatarUrl,
        cover_image: newArtist.coverImage,
        featured: newArtist.featured,
        display_order: newArtist.order ?? 1,
      })
      .select()
      .single();

    if (!error && supaData) {
      // Keep local store in sync
      const store = readLocalStore();
      store.artists.push(mapArtistRow(supaData));
      writeLocalStore(store);
      return mapArtistRow(supaData);
    }
  } catch (err) {
    console.warn("Supabase createArtist error, saving to local store:", err);
  }

  // Fallback to local store
  const store = readLocalStore();
  store.artists.push(newArtist);
  writeLocalStore(store);
  return newArtist;
}

export async function updateArtist(
  id: string,
  data: Partial<Artist>
): Promise<Artist | null> {
  try {
    const payload: any = { updated_at: new Date().toISOString() };
    if (data.name !== undefined) payload.name = data.name;
    if (data.slug !== undefined) payload.slug = data.slug;
    if (data.nationality !== undefined) payload.nationality = data.nationality;
    if (data.city !== undefined) payload.city = data.city;
    if (data.birthYear !== undefined) payload.birth_year = data.birthYear;
    if (data.bio?.fr !== undefined) payload.bio_fr = data.bio.fr;
    if (data.bio?.en !== undefined) payload.bio_en = data.bio.en;
    if (data.statement?.fr !== undefined) payload.statement_fr = data.statement.fr;
    if (data.statement?.en !== undefined) payload.statement_en = data.statement.en;
    if (data.avatarUrl !== undefined) payload.avatar_url = data.avatarUrl;
    if (data.featured !== undefined) payload.featured = data.featured;
    if (data.order !== undefined) payload.display_order = data.order;

    const { data: supaData, error } = await supabase
      .from("artists")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (!error && supaData) {
      const updated = mapArtistRow(supaData);
      const store = readLocalStore();
      const idx = store.artists.findIndex((a) => a.id === id);
      if (idx !== -1) {
        store.artists[idx] = updated;
        writeLocalStore(store);
      }
      return updated;
    }
  } catch (err) {
    console.warn("Supabase updateArtist error, updating local store:", err);
  }

  const store = readLocalStore();
  const idx = store.artists.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  const updated: Artist = {
    ...store.artists[idx],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  store.artists[idx] = updated;
  writeLocalStore(store);
  return updated;
}

export async function deleteArtist(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("artists").delete().eq("id", id);
    if (!error) {
      const store = readLocalStore();
      store.artists = store.artists.filter((a) => a.id !== id);
      writeLocalStore(store);
      return true;
    }
  } catch (err) {
    console.warn("Supabase deleteArtist error:", err);
  }

  const store = readLocalStore();
  const initialLen = store.artists.length;
  store.artists = store.artists.filter((a) => a.id !== id);
  if (store.artists.length !== initialLen) {
    writeLocalStore(store);
    return true;
  }
  return false;
}

// ARTWORKS API
export async function getArtworks(): Promise<Artwork[]> {
  try {
    const { data, error } = await supabase
      .from("artworks")
      .select("*")
      .order("display_order", { ascending: true });

    if (!error && data && data.length > 0) {
      return data.map(mapArtworkRow);
    }
  } catch (err) {
    console.warn("Supabase getArtworks error, using local fallback:", err);
  }

  const local = readLocalStore();
  return local.artworks.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}

export async function getArtworkById(id: string): Promise<Artwork | null> {
  const works = await getArtworks();
  return works.find((w) => w.id === id || w.slug === id) || null;
}

export async function getArtworksByArtist(artistId: string): Promise<Artwork[]> {
  const works = await getArtworks();
  return works.filter((w) => w.artistId === artistId);
}

export async function createArtwork(
  data: Omit<Artwork, "id" | "createdAt" | "updatedAt">
): Promise<Artwork> {
  const id = `work-${Date.now()}`;
  const now = new Date().toISOString();
  const newArtwork: Artwork = {
    ...data,
    id,
    createdAt: now,
    updatedAt: now,
  };

  try {
    const { data: supaData, error } = await supabase
      .from("artworks")
      .insert({
        id: newArtwork.id,
        slug: newArtwork.slug,
        artist_id: newArtwork.artistId,
        title_fr: newArtwork.title.fr,
        title_en: newArtwork.title.en,
        year: newArtwork.year,
        medium_fr: newArtwork.medium.fr,
        medium_en: newArtwork.medium.en,
        dimensions: newArtwork.dimensions,
        price: newArtwork.price,
        status: newArtwork.status,
        type: newArtwork.type,
        image: newArtwork.image,
        detail_images: newArtwork.detailImages || [],
        aspect_ratio: newArtwork.aspectRatio,
        description_fr: newArtwork.description?.fr,
        description_en: newArtwork.description?.en,
        featured_in_hero: newArtwork.featuredInHero,
        display_order: newArtwork.order ?? 1,
      })
      .select()
      .single();

    if (!error && supaData) {
      const created = mapArtworkRow(supaData);
      const store = readLocalStore();
      store.artworks.push(created);
      writeLocalStore(store);
      return created;
    }
  } catch (err) {
    console.warn("Supabase createArtwork error, saving locally:", err);
  }

  const store = readLocalStore();
  store.artworks.push(newArtwork);
  writeLocalStore(store);
  return newArtwork;
}

export async function updateArtwork(
  id: string,
  data: Partial<Artwork>
): Promise<Artwork | null> {
  try {
    const payload: any = { updated_at: new Date().toISOString() };
    if (data.title?.fr !== undefined) payload.title_fr = data.title.fr;
    if (data.title?.en !== undefined) payload.title_en = data.title.en;
    if (data.artistId !== undefined) payload.artist_id = data.artistId;
    if (data.year !== undefined) payload.year = data.year;
    if (data.medium?.fr !== undefined) payload.medium_fr = data.medium.fr;
    if (data.medium?.en !== undefined) payload.medium_en = data.medium.en;
    if (data.dimensions !== undefined) payload.dimensions = data.dimensions;
    if (data.price !== undefined) payload.price = data.price;
    if (data.status !== undefined) payload.status = data.status;
    if (data.type !== undefined) payload.type = data.type;
    if (data.image !== undefined) payload.image = data.image;
    if (data.detailImages !== undefined) payload.detail_images = data.detailImages;
    if (data.aspectRatio !== undefined) payload.aspect_ratio = data.aspectRatio;
    if (data.description?.fr !== undefined) payload.description_fr = data.description.fr;
    if (data.description?.en !== undefined) payload.description_en = data.description.en;
    if (data.featuredInHero !== undefined) payload.featured_in_hero = data.featuredInHero;
    if (data.order !== undefined) payload.display_order = data.order;

    const { data: supaData, error } = await supabase
      .from("artworks")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (!error && supaData) {
      const updated = mapArtworkRow(supaData);
      const store = readLocalStore();
      const idx = store.artworks.findIndex((w) => w.id === id);
      if (idx !== -1) {
        store.artworks[idx] = updated;
        writeLocalStore(store);
      }
      return updated;
    }
  } catch (err) {
    console.warn("Supabase updateArtwork error, updating locally:", err);
  }

  const store = readLocalStore();
  const idx = store.artworks.findIndex((w) => w.id === id);
  if (idx === -1) return null;
  const updated: Artwork = {
    ...store.artworks[idx],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  store.artworks[idx] = updated;
  writeLocalStore(store);
  return updated;
}

export async function deleteArtwork(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("artworks").delete().eq("id", id);
    if (!error) {
      const store = readLocalStore();
      store.artworks = store.artworks.filter((w) => w.id !== id);
      writeLocalStore(store);
      return true;
    }
  } catch (err) {
    console.warn("Supabase deleteArtwork error:", err);
  }

  const store = readLocalStore();
  const initialLen = store.artworks.length;
  store.artworks = store.artworks.filter((w) => w.id !== id);
  if (store.artworks.length !== initialLen) {
    writeLocalStore(store);
    return true;
  }
  return false;
}

// GALLERY CONFIG API
export async function getGalleryConfig(): Promise<GalleryConfig> {
  const store = readLocalStore();
  return store.galleryConfig;
}

export async function updateGalleryConfig(
  partial: Partial<GalleryConfig>
): Promise<GalleryConfig> {
  const store = readLocalStore();
  store.galleryConfig = {
    ...store.galleryConfig,
    ...partial,
  };
  writeLocalStore(store);
  return store.galleryConfig;
}
