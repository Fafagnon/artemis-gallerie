import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  getAdminSecret,
  verifySessionToken,
} from "@/lib/auth";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const secret = getAdminSecret();
  const isValid = await verifySessionToken(token, secret);

  return NextResponse.json({ authenticated: isValid });
}

