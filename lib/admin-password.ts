import { supabase } from "@/lib/supabase";
import {
  hashPassword,
  verifyPasswordAgainstHash,
  getAdminSecret,
} from "@/lib/auth";

const SETTINGS_KEY = "admin_password_hash";

/**
 * Checks whether the Supabase admin_settings table exists and is accessible
 */
export async function checkAdminSettingsTable(): Promise<boolean> {
  try {
    const { error } = await supabase.from("admin_settings").select("key").limit(1);
    return !error;
  } catch {
    return false;
  }
}

/**
 * Retrieves the stored password hash from Supabase
 */
export async function getStoredPasswordHash(): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from("admin_settings")
      .select("value")
      .eq("key", SETTINGS_KEY)
      .maybeSingle();

    if (error || !data) return null;
    return data.value;
  } catch {
    return null;
  }
}

/**
 * Saves a new password hash to Supabase admin_settings table
 */
export async function saveNewPassword(
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const newHash = await hashPassword(newPassword);

    const { error } = await supabase
      .from("admin_settings")
      .upsert(
        {
          key: SETTINGS_KEY,
          value: newHash,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "key" }
      );

    if (error) {
      console.error("Error saving new password in Supabase:", error);
      return {
        success: false,
        error:
          error.message ||
          "La table 'admin_settings' n'est pas encore créée dans Supabase.",
      };
    }

    return { success: true };
  } catch (err: any) {
    console.error("saveNewPassword exception:", err);
    return {
      success: false,
      error: err?.message || "Erreur inattendue.",
    };
  }
}

/**
 * Validates the entered password against Supabase if configured, or falls back to env secret
 */
export async function verifyEnteredPassword(password: string): Promise<boolean> {
  if (!password || typeof password !== "string") return false;

  // 1. Check Supabase first
  const storedHash = await getStoredPasswordHash();
  if (storedHash) {
    const isValid = await verifyPasswordAgainstHash(password, storedHash);
    if (isValid) return true;
  }

  // 2. Fall back to environment variable or default secret
  const defaultSecret = getAdminSecret();
  return password.trim() === defaultSecret.trim();
}

