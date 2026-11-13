/**
 * URL slug from a title or a name: trimmed, lowercased, accents
 * stripped, anything else turned into a single hyphen, with no
 * leading or trailing hyphen. Returns "" when nothing usable
 * remains (for example a title made of punctuation only); the
 * caller picks the fallback slug in that case.
 */
export function slugify(text: string): string {
  return (text || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}
