"use server";

import { createClient } from "@/lib/supabase/server";
import { fileTypeFromBuffer } from "file-type";

/** MIME types allowed for upload. Validated server-side via magic bytes — not the client header. */
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export async function uploadImage(formData: FormData) {
  const file = formData.get("file") as File;
  const folder = (formData.get("folder") as string) || "success-stories";

  if (!file) throw new Error("No file provided");

  // 5MB Limit
  const MAX_SIZE = 5 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    throw new Error("File size exceeds 5MB limit");
  }

  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase client not initialized");

  // Auth check: only authenticated users may upload
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Unauthorized: You must be logged in to upload images.");
  }

  // Convert File to Buffer for server-side processing
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // --- P1 FIX: Server-side MIME validation via magic bytes ---
  // Never trust file.type (client-supplied header). Inspect the actual binary signature.
  const detected = await fileTypeFromBuffer(buffer);

  if (!detected || !ALLOWED_MIME_TYPES.has(detected.mime)) {
    throw new Error(
      `Invalid file type${detected ? ` (${detected.mime})` : ""}. Only JPEG, PNG, WebP, and GIF images are allowed.`
    );
  }
  // ----------------------------------------------------------

  // Use the server-detected extension to prevent extension spoofing (e.g. malware.php → malware.jpg)
  const fileName = `${crypto.randomUUID()}-${Date.now()}.${detected.ext}`;
  const filePath = `${folder}/${fileName}`;

  const { error } = await supabase.storage
    .from("images")
    .upload(filePath, buffer, {
      contentType: detected.mime, // Use server-verified MIME, not client's file.type
      upsert: false,
    });

  if (error) {
    console.error("Supabase Storage Error:", error);
    if (
      error.message.includes("row-level security") ||
      ("status" in error && error.status === 403)
    ) {
      throw new Error(
        "Permission denied. Please ensure the 'images' bucket exists and has correct RLS policies."
      );
    }
    throw new Error(error.message);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("images").getPublicUrl(filePath);

  return publicUrl;
}
