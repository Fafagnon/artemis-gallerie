import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { supabase } from "@/lib/supabase";
import { MAX_UPLOAD_BYTES } from "@/lib/image-upload";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.startsWith("multipart/form-data")) {
      return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 });
    }

    let formData: FormData;
    try {
      formData = await req.formData();
    } catch {
      // A multipart body that cannot be parsed here is an
      // oversized body truncated by the server: answer with the
      // clear size message instead of a generic 500.
      return NextResponse.json(
        { error: "La photo est trop lourde (limite 4 Mo). Réduisez sa taille puis réessayez." },
        { status: 413 }
      );
    }
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Seules les images sont acceptées." },
        { status: 400 }
      );
    }

    // Defense in depth: the browser compresses oversized photos
    // before sending, but anything still over the limit gets a
    // clear error here instead of a silent platform rejection.
    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { error: "La photo est trop lourde (limite 4 Mo). Réduisez sa taille puis réessayez." },
        { status: 413 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = (path.extname(file.name) || ".jpg").toLowerCase();
    const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, "-").toLowerCase();
    const fileName = `${baseName}-${Date.now()}${ext}`;

    // Upload to Supabase Storage. Any failure is reported with a
    // clear error: there is no local fallback in production,
    // because the deployed filesystem is read-only and a write
    // to public/uploads would fail there anyway.
    try {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("artworks")
        .upload(fileName, buffer, {
          contentType: file.type || "image/jpeg",
          upsert: true,
        });

      if (!uploadError && uploadData) {
        const { data: publicUrlData } = supabase.storage
          .from("artworks")
          .getPublicUrl(fileName);

        if (publicUrlData?.publicUrl) {
          return NextResponse.json({
            url: publicUrlData.publicUrl,
            fileName,
            storage: "supabase",
          });
        }
        console.error("Supabase storage upload succeeded but no public URL was returned");
      } else if (uploadError) {
        console.error("Supabase storage upload error:", uploadError.message);
      }
    } catch (sErr) {
      console.error("Supabase storage exception:", sErr);
    }

    // Local development only: keep the local fallback so the
    // back-office stays usable without Supabase credentials.
    if (process.env.NODE_ENV !== "production") {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const filePath = path.join(uploadsDir, fileName);
      fs.writeFileSync(filePath, buffer);

      const localUrl = `/uploads/${fileName}`;

      return NextResponse.json({ url: localUrl, fileName, storage: "local" });
    }

    return NextResponse.json(
      { error: "Le stockage des images est momentanément indisponible. Réessayez dans quelques instants." },
      { status: 502 }
    );
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "Erreur lors du téléversement du fichier" }, { status: 500 });
  }
}
