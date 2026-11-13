import { NextRequest, NextResponse } from "next/server";
import {
  getArtworks,
  createArtwork,
  updateArtwork,
  deleteArtwork,
  DbOperationError,
} from "@/lib/db";

const STATUSES = ["disponible", "reserve", "vendu"];
const TYPES = ["peinture", "dessin", "sculpture", "serigraphie", "varia"];

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidPrice(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function isValidYear(value: unknown): value is number {
  return (
    Number.isInteger(value) &&
    (value as number) >= 1000 &&
    (value as number) <= new Date().getFullYear() + 1
  );
}

/**
 * Validates an artwork payload. On creation every required field
 * must be present; on update only the fields that are present
 * are checked, so a status-only change stays valid.
 * Returns the first user-facing error message, or null.
 */
function validateArtwork(body: any, partial: boolean): string | null {
  if (!partial || body.title !== undefined) {
    if (!isNonEmptyString(body.title?.fr)) {
      return "Le titre est obligatoire.";
    }
  }
  if (!partial || body.artistId !== undefined) {
    if (!isNonEmptyString(body.artistId)) {
      return "L'artiste est obligatoire.";
    }
  }
  if (!partial || body.price !== undefined) {
    if (!isValidPrice(body.price)) {
      return "Le prix doit être un nombre positif.";
    }
  }
  if (!partial || body.year !== undefined) {
    if (!isValidYear(body.year)) {
      return "L'année est invalide.";
    }
  }
  if (body.status !== undefined && !STATUSES.includes(body.status)) {
    return "Statut invalide.";
  }
  if (body.type !== undefined && !TYPES.includes(body.type)) {
    return "Type invalide.";
  }
  if (!partial || body.image !== undefined) {
    if (!isNonEmptyString(body.image)) {
      return "La photo de l'œuvre est obligatoire.";
    }
  }
  if (!partial || body.dimensions !== undefined) {
    if (!isNonEmptyString(body.dimensions)) {
      return "Les dimensions sont obligatoires.";
    }
  }
  if (!partial || body.medium !== undefined) {
    if (!isNonEmptyString(body.medium?.fr)) {
      return "La technique est obligatoire.";
    }
  }
  return null;
}

async function readJsonBody(req: NextRequest): Promise<any | null> {
  try {
    return await req.json();
  } catch {
    return null;
  }
}

function serverError(error: unknown, fallback: string): NextResponse {
  console.error(fallback, error);
  if (error instanceof DbOperationError) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ error: fallback }, { status: 500 });
}

export async function GET() {
  const artworks = await getArtworks();
  return NextResponse.json(artworks);
}

export async function POST(req: NextRequest) {
  const body = await readJsonBody(req);
  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { error: "Corps de requête invalide." },
      { status: 400 }
    );
  }
  const validationError = validateArtwork(body, false);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }
  try {
    const newArtwork = await createArtwork(body);
    return NextResponse.json(newArtwork, { status: 201 });
  } catch (error) {
    return serverError(error, "Erreur serveur lors de la création");
  }
}

export async function PUT(req: NextRequest) {
  const body = await readJsonBody(req);
  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { error: "Corps de requête invalide." },
      { status: 400 }
    );
  }
  const { id, ...data } = body;
  if (!id) {
    return NextResponse.json({ error: "L'identifiant est requis" }, { status: 400 });
  }
  const validationError = validateArtwork(data, true);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }
  try {
    const updated = await updateArtwork(id, data);
    if (!updated) {
      return NextResponse.json({ error: "Œuvre non trouvée" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    return serverError(error, "Erreur serveur lors de la mise à jour");
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "L'identifiant est requis" }, { status: 400 });
    }
    const success = await deleteArtwork(id);
    if (!success) {
      return NextResponse.json({ error: "Œuvre introuvable" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting artwork:", error);
    return NextResponse.json({ error: "Erreur serveur lors de la suppression" }, { status: 500 });
  }
}
