import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  getAdminSecret,
  verifySessionToken,
  createSessionToken,
} from "@/lib/auth";
import {
  verifyEnteredPassword,
  saveNewPassword,
  checkAdminSettingsTable,
} from "@/lib/admin-password";

export async function GET(request: NextRequest) {
  // Check if user is authenticated
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const secret = getAdminSecret();
  const isAuthenticated = await verifySessionToken(token, secret);

  if (!isAuthenticated) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  // Check if admin_settings table is ready
  const isTableReady = await checkAdminSettingsTable();
  return NextResponse.json({ tableReady: isTableReady });
}

export async function POST(request: NextRequest) {
  try {
    // 1. Verify caller is authenticated
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const secret = getAdminSecret();
    const isAuthenticated = await verifySessionToken(token, secret);

    if (!isAuthenticated) {
      return NextResponse.json(
        { error: "Session expirée. Veuillez vous reconnecter." },
        { status: 401 }
      );
    }

    // 2. Parse body
    const body = await request.json().catch(() => ({}));
    const { currentPassword, newPassword } = body;

    if (!currentPassword || typeof currentPassword !== "string") {
      return NextResponse.json(
        { error: "Veuillez saisir votre mot de passe actuel." },
        { status: 400 }
      );
    }

    if (!newPassword || typeof newPassword !== "string" || newPassword.length < 6) {
      return NextResponse.json(
        { error: "Le nouveau mot de passe doit comporter au moins 6 caractères." },
        { status: 400 }
      );
    }

    // 3. Verify current password
    const isCurrentValid = await verifyEnteredPassword(currentPassword);
    if (!isCurrentValid) {
      return NextResponse.json(
        { error: "Le mot de passe actuel est incorrect." },
        { status: 401 }
      );
    }

    // 4. Save new password in Supabase
    const result = await saveNewPassword(newPassword);

    if (!result.success) {
      return NextResponse.json(
        {
          error:
            result.error ||
            "Impossible d'enregistrer le mot de passe dans Supabase.",
          tableMissing: true,
        },
        { status: 400 }
      );
    }

    // 5. Refresh session cookie
    const newToken = await createSessionToken(secret);
    const response = NextResponse.json({
      success: true,
      message: "Votre mot de passe a été mis à jour avec succès !",
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: newToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 14 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la mise à jour du mot de passe." },
      { status: 500 }
    );
  }
}

