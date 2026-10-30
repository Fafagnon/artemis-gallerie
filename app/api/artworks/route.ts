import { NextRequest, NextResponse } from "next/server";
import { getArtworks, createArtwork, updateArtwork, deleteArtwork } from "@/lib/db";

export async function GET() {
  const artworks = await getArtworks();
  return NextResponse.json(artworks);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.title?.fr || !body.artistId) {
      return NextResponse.json(
        { error: "Le titre et l'artiste associé sont obligatoires" },
        { status: 400 }
      );
    }
    const newArtwork = await createArtwork(body);
    return NextResponse.json(newArtwork, { status: 201 });
  } catch (error) {
    console.error("Error creating artwork:", error);
    return NextResponse.json({ error: "Erreur serveur lors de la création" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) {
      return NextResponse.json({ error: "L'identifiant est requis" }, { status: 400 });
    }
    const updated = await updateArtwork(id, data);
    if (!updated) {
      return NextResponse.json({ error: "Œuvre non trouvée" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating artwork:", error);
    return NextResponse.json({ error: "Erreur serveur lors de la mise à jour" }, { status: 500 });
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

