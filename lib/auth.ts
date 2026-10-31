/**
 * Authentication and Session Management for Galerie Artemis Admin Back-Office
 * 
 * Uses Web Crypto API (HMAC-SHA256 & PBKDF2) for zero-dependency Edge & Node compatibility.
 */

export const ADMIN_COOKIE_NAME = "artemis_admin_session";
const SESSION_MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000; // 14 days

const encoder = new TextEncoder();

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

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
 * Hashes a password using standard PBKDF2 with 100,000 iterations and 16-byte salt
 */
export async function hashPassword(password: string, saltHex?: string): Promise<string> {
  const salt = saltHex ? hexToBytes(saltHex) : crypto.getRandomValues(new Uint8Array(16));
  const passwordKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const derivedKey = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt as any,
      iterations: 100000,
      hash: "SHA-256",
    },
    passwordKey,
    256
  );
  const saltHexStr = Array.from(salt)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const hashHexStr = Array.from(new Uint8Array(derivedKey))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${saltHexStr}:${hashHexStr}`;
}

/**
 * Verifies a password against a stored PBKDF2 hash
 */
export async function verifyPasswordAgainstHash(
  password: string,
  storedHash: string
): Promise<boolean> {
  if (!password || !storedHash) return false;
  const [saltHex, hashHex] = storedHash.split(":");
  if (!saltHex || !hashHex) return false;
  try {
    const computed = await hashPassword(password, saltHex);
    const computedHashHex = computed.split(":")[1];
    return hashHex === computedHashHex;
  } catch {
    return false;
  }
}

/**
 * Validates the raw password entered against static secret
 */
export function verifyAdminPassword(password: string): boolean {
  if (!password || typeof password !== "string") return false;
  const secret = getAdminSecret();
  return password.trim() === secret.trim();
}
