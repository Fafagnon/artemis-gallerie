# 🎨 Artemis Galerie — Art Contemporain (Next.js 15)

Site officiel et plateforme de gestion d'art contemporain pour la **Galerie Artémis** (Forever, Rue de Kpendjal, Lomé, Togo).

Projet migré et développé sous **Next.js 15 (App Router)**, **React 19**, **TypeScript** et **Tailwind CSS**, respectant scrupuleusement la charte graphique muséale (*Archivo* & *Newsreader*, palette blanc/or/noir galerie, micro-interactions haute fidélité) et intégrant un **Back-Office d'administration** complet.

---

## 🌟 Fonctionnalités

### 🏛️ Expérience Publique (Front-Office)
* **Hero Immersif & Marquee Ticker** : Bannière sticky de 180svh avec fondu enchaîné des toiles à la une, ruban typographique rotatif en continu (*« L’ART CONTEMPORAIN, DE PRÈS — Artemis Galerie »*) et lien direct vers l'œuvre active.
* **Intégration Pro des Artistes** :
  * **Section Vedette sur l'accueil** : Cartes avec citations curatoriales, techniques et aperçu visuel des œuvres.
  * **Page Répertoire Artistes (`/artistes`)** : Index muséal complet de tous les artistes de la galerie.
  * **Profil Dédié Artiste (`/artistes/[slug]`)** : Démarche artistique, biographie bilingue, et corpus exhaustif des œuvres exposées.
* **Catalogue & Mur Asymétrique (`/#collection`)** :
  * Double système de filtrage en temps réel : par **Discipline** (*Peinture, Dessin, Sculpture, Sérigraphie, Varia*) et par **Artiste** (*LAKA, AGBELESSESSI Dela, etc.*).
  * Affichage asymétrique façon vernissage avec calcul automatique du ratio d'aspect.
  * Effet d'atténuation lumineuse au survol (*hover dimming*) mettant en valeur l'œuvre active.
* **Fiche d'Œuvre Haute Résolution (`/oeuvres/[id]`)** :
  * Cartel d'acquisition sticky sur grand écran (Titre en italique *Newsreader*, dimensions, technique, prix en FCFA, statut).
  * **Visionneuse plein écran (Lightbox)** avec zoom x2 haute définition et navigation clavier.
  * Bouton direct de commande/réservation via **WhatsApp** pré-rempli (`+228 70 21 11 11`).
  * Partage natif via Web Share API ou copie de lien en un clic.
  * Recommandations intelligentes (*« Du même artiste »* ou *« Autres œuvres »*).
  * Barre d'action fixe sur mobile pour faciliter l'achat.
* **Visite & Contact (`/#visite`)** : Horaires de la galerie à Lomé, carte Google Maps interactive, contact téléphonique direct et réseaux sociaux (Instagram, Facebook, TikTok).
* **Bilinguisme Natif (FR / EN)** : Commutateur instantané sans rechargement de page.

---

### ⚙️ Back-Office (Espace d'Administration `/admin`)
Accédez à `/admin` pour gérer l'ensemble de la galerie sans toucher au code :
* **Tableau de Bord de Synthèse** :
  * Nombre total d'œuvres et d'artistes exposés.
  * Répartition des statuts : *Disponibles* 🟢, *Réservées* 🟡, *Vendues* ⚪.
  * Valeur financière totale du catalogue en FCFA.
* **Gestion des Tableaux (`/admin/oeuvres`)** :
  * Liste tabulaire avec recherche par titre/format et filtre par artiste.
  * **Changement de statut en 1 clic** directement depuis le tableau.
  * Formulaire d'ajout / modification :
    * Sélection de l'artiste dans un menu déroulant.
    * Titres et descriptions bilingues (FR / EN).
    * Format / dimensions (ex. `60 × 56 cm`), prix en FCFA, technique, année.
    * Téléversement direct d'images (*upload* local) ou saisie d'URL.
    * Coche pour définir si l'œuvre s'affiche dans le Hero en page d'accueil.
  * Suppression sécurisée avec confirmation.
* **Gestion des Artistes (`/admin/artistes`)** :
  * Fiches artistes avec aperçu du nombre d'œuvres rattachées.
  * Création / édition d'artiste : Nom, nationalité, ville, année de naissance, citation/démarche, biographie bilingue, photo.

---

## 📁 Artistes & Tableaux Intégrés au Démarrage

### 1. **LAKA** (Togo)
* *Terre Féconde* — 60 × 56 cm — 450 000 FCFA *(Disponible • À la une)*
* *Tendresse expansive (2)* — 100 × 100 cm — 450 000 FCFA *(Disponible • À la une)*
* *Tendresse expansive (1)* — 60 × 60 cm — 450 000 FCFA *(Disponible)*
* *Transmission de la connaissance (2)* — 53 × 55 cm — 400 000 FCFA *(Disponible)*
* *Transmission de la connaissance (1)* — 53 × 50 cm — 400 000 FCFA *(Disponible)*

### 2. **AGBELESSESSI Dela** (Togo)
* *Portrait 2019* — 86 × 63 cm — 150 000 FCFA *(Disponible • À la une)*
* *Chiffres et lettres (Harmonie)* — 85.5 × 62.5 cm — 150 000 FCFA *(Disponible)*

---

## 🚀 Lancement Rapide

### Prérequis
* Node.js 18+ (testé avec Node v24)
* npm

### Installation & Démarrage
```bash
# Lancer le serveur de développement
npm run dev

# Ouvrir dans votre navigateur
# Site public : http://localhost:3000
# Back-Office : http://localhost:3000/admin
```

---

## 🗄️ Base de données & Évolution Supabase

* **Mode Autonome (Actuel - Prêt à l'emploi)** :
  Toutes les données sont stockées et synchronisées dans `data/artemis-data.json` via des routes API et le module `lib/db.ts`. Vous n'avez besoin d'aucun compte externe pour travailler immédiatement en local.
* **Mode Cloud (Optionnel - Supabase)** :
  Le fichier `supabase-schema.sql` contient la structure PostgreSQL complète avec Row Level Security (RLS) et politiques d'accès pour basculer facilement sur Supabase lors d'une mise en production sur Vercel.

