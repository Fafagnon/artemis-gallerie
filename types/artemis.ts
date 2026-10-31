export type ArtworkStatus = 'disponible' | 'reserve' | 'vendu';
export type ArtworkType = 'peinture' | 'dessin' | 'sculpture' | 'serigraphie' | 'varia';

export interface LocalizedString {
  fr: string;
  en: string;
}

export interface Artist {
  id: string;
  slug: string;
  name: string;
  nationality: string;
  city?: string;
  birthYear?: number;
  bio: LocalizedString;
  avatarUrl?: string;
  coverImage?: string;
  statement?: LocalizedString;
  featured: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Artwork {
  id: string;
  slug: string;
  artistId: string;
  title: LocalizedString;
  year: number;
  medium: LocalizedString;
  dimensions: string;
  price: number; // in FCFA
  status: ArtworkStatus;
  type: ArtworkType;
  image: string;
  detailImages?: string[];
  aspectRatio: number; // width / height
  description?: LocalizedString;
  featuredInHero?: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface GalleryConfig {
  phone: string;
  whatsapp: string;
  email: string;
  address: LocalizedString;
  hours: {
    fr: [string, string][];
    en: [string, string][];
  };
  socials: {
    instagram: string;
    facebook: string;
    tiktok: string;
  };
  locationUrl: string;
  mapEmbedUrl: string;
}



export interface ContactMessage {
  id: string;
  firstName: string;
  lastName: string;
  contactInfo: string;
  message?: string;
  artworkId?: string;
  status: 'unread' | 'read' | 'archived';
  createdAt: string;
}
