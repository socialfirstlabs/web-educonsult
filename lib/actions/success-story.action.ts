"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { successStorySchema, type SuccessStoryValues } from "../validations/success-story.schema";

export async function getSuccessStories() {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("success_stories")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching success stories:", error.message);
    return [];
  }

  return data;
}

export async function getPublishedSuccessStories() {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("success_stories")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching published success stories:", error.message);
    return [];
  }

  return data;
}

export async function addSuccessStory(values: SuccessStoryValues) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase client not initialized");

  const validatedFields = successStorySchema.safeParse(values);
  if (!validatedFields.success) {
    throw new Error("Invalid fields");
  }

  const { error } = await supabase.from("success_stories").insert([validatedFields.data]);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/success-stories");
  revalidatePath("/success-stories");
}

export async function updateSuccessStory(id: string, values: SuccessStoryValues) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase client not initialized");

  const validatedFields = successStorySchema.safeParse(values);
  if (!validatedFields.success) {
    throw new Error("Invalid fields");
  }

  const { error } = await supabase
    .from("success_stories")
    .update(validatedFields.data)
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/success-stories");
  revalidatePath("/success-stories");
}

export async function deleteSuccessStory(id: string) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase client not initialized");

  const { error } = await supabase.from("success_stories").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/success-stories");
  revalidatePath("/success-stories");
}
