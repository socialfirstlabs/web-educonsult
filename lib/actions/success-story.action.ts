"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { successStorySchema, type SuccessStoryValues } from "../validations/success-story.schema";
import type { Locale } from "@/lib/i18n";

type SuccessStoryTranslationInput = {
  student_name: string;
  destination: string;
  company_name?: string;
  testimonial?: string;
};

const SELECT_FIELDS = "*, translations:success_story_translations(locale,student_name,destination,company_name,testimonial)";

function mergeTranslation<T extends { translations?: { locale: string }[] }>(
  story: T,
  locale: Locale
) {
  const translation = story.translations?.find((item) => item.locale === locale);
  const { translations: _t, ...base } = story as T & { translations?: unknown[] };
  void _t;
  if (!translation) return base;
  const { locale: _l, ...fields } = translation as { locale: string } & Record<string, unknown>;
  void _l;
  return { ...base, ...fields };
}

export async function getSuccessStories(locale: Locale = "en") {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("success_stories")
    .select(SELECT_FIELDS)
    .order("created_at", { ascending: false });

  if (error) { console.error("Error fetching success stories:", error.message); return []; }
  return (data ?? []).map((s) => mergeTranslation(s, locale));
}

export async function getPublishedSuccessStories(locale: Locale = "en") {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("success_stories")
    .select(SELECT_FIELDS)
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) { console.error("Error fetching published success stories:", error.message); return []; }
  return (data ?? []).map((s) => mergeTranslation(s, locale));
}

export async function addSuccessStory(
  values: SuccessStoryValues,
  translation?: SuccessStoryTranslationInput
) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase client not initialized");

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("Unauthorized: You must be logged in.");

  const validatedFields = successStorySchema.safeParse(values);
  if (!validatedFields.success) throw new Error("Invalid fields");

  const { data, error } = await supabase
    .from("success_stories")
    .insert([validatedFields.data])
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  if (translation && translation.student_name.trim() && translation.destination.trim()) {
    const { error: translationError } = await supabase
      .from("success_story_translations")
      .upsert(
        [{
          success_story_id: data.id,
          locale: "ja",
          student_name: translation.student_name.trim(),
          destination: translation.destination.trim(),
          company_name: translation.company_name?.trim() || null,
          testimonial: translation.testimonial?.trim() || null,
        }],
        { onConflict: "success_story_id,locale" }
      );
    if (translationError) throw new Error(translationError.message);
  }

  revalidatePath("/dashboard/success-stories");
  revalidatePath("/success-stories");
  revalidatePath("/", "layout");
  return { success: true };
}

export async function updateSuccessStory(
  id: string,
  values: SuccessStoryValues,
  translation?: SuccessStoryTranslationInput
) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase client not initialized");

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("Unauthorized: You must be logged in.");

  const validatedFields = successStorySchema.safeParse(values);
  if (!validatedFields.success) throw new Error("Invalid fields");

  const { error } = await supabase
    .from("success_stories")
    .update(validatedFields.data)
    .eq("id", id);

  if (error) throw new Error(error.message);

  if (translation && translation.student_name.trim() && translation.destination.trim()) {
    const { error: translationError } = await supabase
      .from("success_story_translations")
      .upsert(
        [{
          success_story_id: id,
          locale: "ja",
          student_name: translation.student_name.trim(),
          destination: translation.destination.trim(),
          company_name: translation.company_name?.trim() || null,
          testimonial: translation.testimonial?.trim() || null,
        }],
        { onConflict: "success_story_id,locale" }
      );
    if (translationError) throw new Error(translationError.message);
  }

  revalidatePath("/dashboard/success-stories");
  revalidatePath("/success-stories");
  revalidatePath("/", "layout");
  return { success: true };
}

export async function deleteSuccessStory(id: string) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase client not initialized");

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("Unauthorized: You must be logged in.");

  const { error } = await supabase.from("success_stories").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/success-stories");
  revalidatePath("/success-stories");
  revalidatePath("/", "layout");
  return { success: true };
}

export async function getSuccessStoriesForDashboard() {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("success_stories")
    .select(SELECT_FIELDS)
    .order("created_at", { ascending: false });

  if (error) { console.error("Error fetching success stories:", error.message); return []; }
  return data ?? [];
}
