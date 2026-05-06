"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { successStorySchema, type SuccessStoryValues } from "../validations/success-story.schema";
import type { Locale } from "@/lib/i18n";

type SuccessStoryTranslationInput = {
  student_name: string;
  destination_country: string;
  university_name?: string;
  testimonial?: string;
};

export async function getSuccessStories(locale: Locale = "en") {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("success_stories")
    .select("*, translations:success_story_translations(locale,student_name,destination_country,university_name,testimonial)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching success stories:", error.message);
    return [];
  }

  return (data ?? []).map((story) => {
    const translation = story.translations?.find(
      (item: { locale: string }) => item.locale === locale
    );
    const { translations: _translations, ...base } = story;
    void _translations;
    if (!translation) return base;
    const { locale: __locale, ...translatedFields } = translation;
    void __locale;
    return { ...base, ...translatedFields };
  });
}

export async function getPublishedSuccessStories(locale: Locale = "en") {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("success_stories")
    .select("*, translations:success_story_translations(locale,student_name,destination_country,university_name,testimonial)")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching published success stories:", error.message);
    return [];
  }

  return (data ?? []).map((story) => {
    const translation = story.translations?.find(
      (item: { locale: string }) => item.locale === locale
    );
    const { translations: _translations, ...base } = story;
    void _translations;
    if (!translation) return base;
    const { locale: __locale, ...translatedFields } = translation;
    void __locale;
    return { ...base, ...translatedFields };
  });
}

export async function addSuccessStory(
  values: SuccessStoryValues,
  translation?: SuccessStoryTranslationInput
) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase client not initialized");

  const validatedFields = successStorySchema.safeParse(values);
  if (!validatedFields.success) {
    throw new Error("Invalid fields");
  }

  const { data, error } = await supabase
    .from("success_stories")
    .insert([validatedFields.data])
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (translation && translation.student_name.trim() && translation.destination_country.trim()) {
    const { error: translationError } = await supabase
      .from("success_story_translations")
      .upsert(
        [
          {
            success_story_id: data.id,
            locale: "ja",
            student_name: translation.student_name.trim(),
            destination_country: translation.destination_country.trim(),
            university_name: translation.university_name?.trim() || null,
            testimonial: translation.testimonial?.trim() || null,
          },
        ],
        { onConflict: "success_story_id,locale" }
      );

    if (translationError) {
      throw new Error(translationError.message);
    }
  }

  revalidatePath("/dashboard/success-stories");
  revalidatePath("/success-stories");
}

export async function updateSuccessStory(
  id: string,
  values: SuccessStoryValues,
  translation?: SuccessStoryTranslationInput
) {
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

  if (translation && translation.student_name.trim() && translation.destination_country.trim()) {
    const { error: translationError } = await supabase
      .from("success_story_translations")
      .upsert(
        [
          {
            success_story_id: id,
            locale: "ja",
            student_name: translation.student_name.trim(),
            destination_country: translation.destination_country.trim(),
            university_name: translation.university_name?.trim() || null,
            testimonial: translation.testimonial?.trim() || null,
          },
        ],
        { onConflict: "success_story_id,locale" }
      );

    if (translationError) {
      throw new Error(translationError.message);
    }
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

export async function getSuccessStoriesForDashboard() {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("success_stories")
    .select("*, translations:success_story_translations(locale,student_name,destination_country,university_name,testimonial)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching success stories:", error.message);
    return [];
  }

  return data ?? [];
}
