-- ==============================================================================
-- SCHEMA SUPABASE COMPLET POUR ARTEMIS GALERIE
-- À COPIER-COLLER DANS LE "SQL EDITOR" DE SUPABASE PUIS CLIQUER SUR "RUN"
-- ==============================================================================

-- 1. Table des Artistes
CREATE TABLE IF NOT EXISTS artists (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  nationality TEXT DEFAULT 'Togolaise',
  city TEXT DEFAULT 'Lomé',
  birth_year INT,
  bio_fr TEXT NOT NULL,
  bio_en TEXT NOT NULL,
  statement_fr TEXT,
  statement_en TEXT,
  avatar_url TEXT,
  cover_image TEXT,
  featured BOOLEAN DEFAULT true,
  display_order INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Table des Œuvres / Tableaux
CREATE TABLE IF NOT EXISTS artworks (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  artist_id TEXT REFERENCES artists(id) ON DELETE CASCADE,
  title_fr TEXT NOT NULL,
  title_en TEXT NOT NULL,
  year INT NOT NULL,
  medium_fr TEXT NOT NULL,
  medium_en TEXT NOT NULL,
  dimensions TEXT NOT NULL,
  price INT NOT NULL, -- Prix en FCFA
  status TEXT CHECK (status IN ('disponible', 'reserve', 'vendu')) DEFAULT 'disponible',
  type TEXT CHECK (type IN ('peinture', 'dessin', 'sculpture', 'serigraphie', 'varia')) DEFAULT 'peinture',
  image TEXT NOT NULL,
  detail_images TEXT[] DEFAULT '{}',
  aspect_ratio FLOAT NOT NULL DEFAULT 1.0,
  description_fr TEXT,
  description_en TEXT,
  featured_in_hero BOOLEAN DEFAULT false,
  display_order INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Activer RLS
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;

-- 4. Politiques d'accès pour le site et le back-office
DROP POLICY IF EXISTS "Public can view artists" ON artists;
DROP POLICY IF EXISTS "Public can view artworks" ON artworks;
DROP POLICY IF EXISTS "Admins can insert artists" ON artists;
DROP POLICY IF EXISTS "Admins can update artists" ON artists;
DROP POLICY IF EXISTS "Admins can delete artists" ON artists;
DROP POLICY IF EXISTS "Admins can insert artworks" ON artworks;
DROP POLICY IF EXISTS "Admins can update artworks" ON artworks;
DROP POLICY IF EXISTS "Admins can delete artworks" ON artworks;
DROP POLICY IF EXISTS "Allow all on artists" ON artists;
DROP POLICY IF EXISTS "Allow all on artworks" ON artworks;

CREATE POLICY "Allow all on artists" ON artists FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on artworks" ON artworks FOR ALL USING (true) WITH CHECK (true);

-- 5. Bucket de stockage pour les photos de tableaux
INSERT INTO storage.buckets (id, name, public) 
VALUES ('artworks', 'artworks', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public can view artwork images" ON storage.objects;
DROP POLICY IF EXISTS "Public can upload artwork images" ON storage.objects;
DROP POLICY IF EXISTS "Public can update artwork images" ON storage.objects;
DROP POLICY IF EXISTS "Public can delete artwork images" ON storage.objects;

CREATE POLICY "Public can view artwork images" ON storage.objects FOR SELECT USING (bucket_id = 'artworks');
CREATE POLICY "Public can upload artwork images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'artworks');
CREATE POLICY "Public can update artwork images" ON storage.objects FOR UPDATE USING (bucket_id = 'artworks');
CREATE POLICY "Public can delete artwork images" ON storage.objects FOR DELETE USING (bucket_id = 'artworks');
