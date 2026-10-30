import { NextRequest, NextResponse } from "next/server";
import { getArtists, createArtist, updateArtist, deleteArtist } from "@/lib/db";

export async function GET() {
  const artists = await getArtists();
  return NextResponse.json(artists);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.slug) {
      return NextResponse.json({ error: "Le nom et le slug sont requis" }, { status: 400 });
    }
    const newArtist = await createArtist(body);
    return NextResponse.json(newArtist, { status: 201 });
  } catch (error) {
    console.error("Error creating artist:", error);
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
    const updated = await updateArtist(id, data);
    if (!updated) {
      return NextResponse.json({ error: "Artiste non trouvé" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating artist:", error);
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
    const success = await deleteArtist(id);
    if (!success) {
      return NextResponse.json({ error: "Artiste introuvable" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting artist:", error);
    return NextResponse.json({ error: "Erreur serveur lors de la suppression" }, { status: 500 });
  }
}

