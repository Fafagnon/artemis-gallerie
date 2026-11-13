/**
 * Image upload from the back-office, shared by the artworks and
 * artists forms.
 *
 * Why compression happens in the browser: Vercel rejects any
 * function request body over 4.5 MB before the route code runs,
 * so an 8.5 MB photo failed with a generic alert and no server
 * log. A photo over 4 MB is compressed here (longest side
 * 1280 px, JPEG) and only the compressed version is sent.
 * A photo already at or under 4 MB is sent untouched, so the
 * working flow for small photos does not change at all.
 */

// 4 MB: under Vercel's 4.5 MB request body cap, with room for
// the multipart envelope around the file.
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

export const MAX_IMAGE_DIMENSION = 1280;
export const JPEG_QUALITY = 0.75;

/** Longest side brought down to the maximum, aspect ratio kept. */
export function targetDimensions(
  width: number,
  height: number,
  max = MAX_IMAGE_DIMENSION
): { width: number; height: number } {
  if (width <= max && height <= max) {
    return { width, height };
  }
  const factor = max / Math.max(width, height);
  return {
    width: Math.round(width * factor),
    height: Math.round(height * factor),
  };
}

/** Only oversized files need compression; the rest go out untouched. */
export function needsCompression(fileSize: number): boolean {
  return fileSize > MAX_UPLOAD_BYTES;
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("unreadable"));
    };
    image.src = url;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("encoding failed"));
        }
      },
      "image/jpeg",
      quality
    );
  });
}

function toJpegName(name: string): string {
  const base = name.replace(/\.[^.]*$/, "") || "photo";
  return `${base}.jpg`;
}

/**
 * Compresses an oversized photo (JPEG, longest side 1280 px),
 * trying lower qualities until the result fits under the limit.
 * Files at or under the limit are returned untouched.
 * Throws an Error with a user-facing French message when the
 * photo cannot be read or stays too large after compression.
 */
export async function compressImageIfNeeded(file: File): Promise<File> {
  if (!needsCompression(file.size)) {
    return file;
  }

  let image: HTMLImageElement;
  try {
    image = await loadImage(file);
  } catch {
    throw new Error(
      "La photo n'a pas pu être lue par le navigateur (format non pris en charge, par exemple HEIC). Exportez-la en JPG puis réessayez."
    );
  }

  const { width, height } = targetDimensions(
    image.naturalWidth,
    image.naturalHeight
  );
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error(
      "La compression de la photo a échoué dans ce navigateur. Réduisez sa taille puis réessayez."
    );
  }
  // JPEG has no transparency: white background, never black.
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);

  for (const quality of [JPEG_QUALITY, 0.6, 0.5]) {
    const blob = await canvasToBlob(canvas, quality);
    if (blob.size <= MAX_UPLOAD_BYTES) {
      return new File([blob], toJpegName(file.name), { type: "image/jpeg" });
    }
  }

  throw new Error(
    "La photo reste trop lourde même après compression. Réduisez sa taille puis réessayez."
  );
}

/** Upload failure with a user-facing French message. */
export class ImageUploadError extends Error {}

async function readErrorMessage(res: Response): Promise<string | null> {
  try {
    const json = await res.json();
    return typeof json?.error === "string" ? json.error : null;
  } catch {
    return null;
  }
}

/**
 * Compresses the file when needed, sends it to /api/upload, and
 * returns the public URL. Every failure throws an
 * ImageUploadError carrying the precise reason to show the user.
 */
export async function uploadImage(file: File): Promise<string> {
  const prepared = await compressImageIfNeeded(file);

  const data = new FormData();
  data.append("file", prepared);

  let res: Response;
  try {
    res = await fetch("/api/upload", { method: "POST", body: data });
  } catch {
    throw new ImageUploadError(
      "La connexion a été interrompue pendant l'envoi. Vérifiez votre connexion puis réessayez."
    );
  }

  if (res.ok) {
    const json = await res.json().catch(() => null);
    if (json && typeof json.url === "string" && json.url) {
      return json.url as string;
    }
    throw new ImageUploadError(
      "Le serveur n'a pas renvoyé l'adresse de l'image. Réessayez."
    );
  }

  if (res.status === 401) {
    throw new ImageUploadError(
      "Votre session a expiré. Reconnectez-vous au back-office puis réessayez."
    );
  }
  if (res.status === 413) {
    throw new ImageUploadError(
      "La photo est trop lourde (limite 4 Mo). Réduisez sa taille puis réessayez."
    );
  }

  throw new ImageUploadError(
    (await readErrorMessage(res)) ||
      "Erreur lors de l'envoi de l'image. Réessayez."
  );
}
