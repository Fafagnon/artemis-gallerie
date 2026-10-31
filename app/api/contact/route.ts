import { NextRequest, NextResponse } from "next/server";
import {
  createContactMessage,
  getContactMessages,
  updateContactMessageStatus,
  deleteContactMessage,
} from "@/lib/db";
import { ADMIN_COOKIE_NAME, getAdminSecret, verifySessionToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { firstName, lastName, contactInfo, message, artworkId } = body;

    if (!firstName || typeof firstName !== "string" || !firstName.trim()) {
      return NextResponse.json(
        { error: "Veuillez renseigner votre prénom." },
        { status: 400 }
      );
    }

    if (!lastName || typeof lastName !== "string" || !lastName.trim()) {
      return NextResponse.json(
        { error: "Veuillez renseigner votre nom." },
        { status: 400 }
      );
    }

    if (!contactInfo || typeof contactInfo !== "string" || !contactInfo.trim()) {
      return NextResponse.json(
        { error: "Veuillez indiquer un numéro de téléphone ou une adresse email." },
        { status: 400 }
      );
    }

    const saved = await createContactMessage({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      contactInfo: contactInfo.trim(),
      message: message ? message.trim() : undefined,
      artworkId: artworkId || undefined,
    });

    return NextResponse.json({
      success: true,
      message: "Votre demande a été transmise avec succès à l'équipe de Galerie Artemis.",
      data: saved,
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de l'envoi de votre message." },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const secret = getAdminSecret();
  const isAuthenticated = await verifySessionToken(token, secret);

  if (!isAuthenticated) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const messages = await getContactMessages();
  return NextResponse.json(messages);
}

export async function PATCH(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const secret = getAdminSecret();
  const isAuthenticated = await verifySessionToken(token, secret);

  if (!isAuthenticated) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const { id, status } = body;

  if (!id || !status) {
    return NextResponse.json({ error: "ID et statut requis" }, { status: 400 });
  }

  const ok = await updateContactMessageStatus(id, status);
  return NextResponse.json({ success: ok });
}

export async function DELETE(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const secret = getAdminSecret();
  const isAuthenticated = await verifySessionToken(token, secret);

  if (!isAuthenticated) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID requis" }, { status: 400 });
  }

  const ok = await deleteContactMessage(id);
  return NextResponse.json({ success: ok });
}

