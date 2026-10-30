import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = path.extname(file.name) || ".jpg";
    const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, "-").toLowerCase();
    const fileName = `${baseName}-${Date.now()}${ext}`;

    // Try uploading to Supabase Storage first
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
      } else if (uploadError) {
        console.warn("Supabase storage upload error, falling back to local:", uploadError.message);
      }
    } catch (sErr) {
      console.warn("Supabase storage exception, falling back to local:", sErr);
    }

    // Fallback: local public/uploads directory
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, fileName);
    fs.writeFileSync(filePath, buffer);

    const localUrl = `/uploads/${fileName}`;

    return NextResponse.json({ url: localUrl, fileName, storage: "local" });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "Erreur lors du téléversement du fichier" }, { status: 500 });
  }
}
