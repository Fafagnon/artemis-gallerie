/**
 * Authentication and Session Management for Galerie Artemis Admin Back-Office
 * 
 * Uses Web Crypto API (HMAC-SHA256) for zero-dependency Edge & Node compatibility.
 */

export const ADMIN_COOKIE_NAME = "artemis_admin_session";
const SESSION_MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000; // 14 days

const encoder = new TextEncoder();

/**
 * Returns the configured admin password or secret key.
 * Can be configured via ADMIN_PASSWORD or ADMIN_SECRET_KEY in environment variables.
 */
export function getAdminSecret(): string {
  return (
    process.env.ADMIN_PASSWORD ||
    process.env.ADMIN_SECRET_KEY ||
    "artemis2026"
  );
}

/**
 * Derives a CryptoKey for HMAC-SHA256 from the admin secret
 */
async function getCryptoKey(secret: string): Promise<CryptoKey> {
  return await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

/**
 * Creates a signed session token: `${timestamp}.${hexSignature}`
 */
export async function createSessionToken(secret: string): Promise<string> {
  const timestamp = Date.now().toString();
  const key = await getCryptoKey(secret);
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(`artemis-admin-session:${timestamp}`)
  );
  
  const signature = Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return `${timestamp}.${signature}`;
}

/**
 * Verifies if a given session token is valid and not expired
 */
export async function verifySessionToken(
  token: string | undefined | null,
  secret: string,
  maxAgeMs: number = SESSION_MAX_AGE_MS
): Promise<boolean> {
  if (!token || typeof token !== "string") return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [timestampStr, signature] = parts;
  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) return false;

  // Check expiration & future timestamps
  const now = Date.now();
  if (now - timestamp > maxAgeMs || timestamp > now + 60000) {
    return false;
  }

  try {
    const key = await getCryptoKey(secret);
    const expectedSigBuffer = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(`artemis-admin-session:${timestampStr}`)
    );

    const expectedSig = Array.from(new Uint8Array(expectedSigBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    if (signature.length !== expectedSig.length) return false;

    // Constant-time comparison
    let match = 0;
    for (let i = 0; i < signature.length; i++) {
      match |= signature.charCodeAt(i) ^ expectedSig.charCodeAt(i);
    }
    return match === 0;
  } catch {
    return false;
  }
}

/**
 * Validates the raw password entered by the user
 */
export function verifyAdminPassword(password: string): boolean {
  if (!password || typeof password !== "string") return false;
  const secret = getAdminSecret();
  return password.trim() === secret.trim();
}

