"use server";

import { createClient } from "@/lib/supabase/server";

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

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("You must be logged in to upload images.");
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  // Convert File to Buffer for server-side upload
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error } = await supabase.storage
    .from("images")
    .upload(filePath, buffer, {
      contentType: file.type,
      upsert: false
    });

  if (error) {
    console.error("Supabase Storage Error:", error);
    if (error.message.includes("row-level security") || ('status' in error && error.status === 403)) {
      throw new Error("Permission denied. Please ensure the 'images' bucket exists and has correct RLS policies.");
    }
    throw new Error(error.message);
  }

  const { data: { publicUrl } } = supabase.storage
    .from("images")
    .getPublicUrl(filePath);

  return publicUrl;
}
