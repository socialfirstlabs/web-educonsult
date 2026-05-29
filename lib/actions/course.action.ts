"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { courseSchema, type CourseValues } from "../validations/course.schema";
import type { Locale } from "@/lib/i18n";

type CourseTranslationInput = {
  title: string;
  description: string;
  duration?: string;
  schedule?: string;
  fees?: string;
  badge?: string;
};

export async function getCourses(locale: Locale = "en") {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("courses")
    .select("*, translations:course_translations(locale,title,description,duration,schedule,fees,badge)")
    .order("order_index", { ascending: true });

  if (error) {
    console.error("Error fetching courses:", error.message);
    return [];
  }

  return (data ?? []).map((course) => {
    const translation = course.translations?.find(
      (item: { locale: string }) => item.locale === locale
    );
    const { translations: _translations, ...base } = course;
    void _translations;
    if (!translation) return base;
    const { locale: __locale, ...translatedFields } = translation;
    void __locale;
    return { ...base, ...translatedFields };
  });
}

export async function getPublishedCourses(locale: Locale = "en") {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("courses")
    .select("*, translations:course_translations(locale,title,description,duration,schedule,fees,badge)")
    .eq("is_published", true)
    .order("order_index", { ascending: true });

  if (error) {
    console.error("Error fetching published courses:", error.message);
    return [];
  }

  return (data ?? []).map((course) => {
    const translation = course.translations?.find(
      (item: { locale: string }) => item.locale === locale
    );
    const { translations: _translations, ...base } = course;
    void _translations;
    if (!translation) return base;
    const { locale: __locale, ...translatedFields } = translation;
    void __locale;
    return { ...base, ...translatedFields };
  });
}

export async function addCourse(values: CourseValues, translation?: CourseTranslationInput) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase client not initialized");

  // --- P1 FIX: Explicit auth guard ---
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("Unauthorized: You must be logged in.");
  // ------------------------------------

  const validatedFields = courseSchema.safeParse(values);
  if (!validatedFields.success) {
    throw new Error("Invalid fields");
  }

  const { data, error } = await supabase
    .from("courses")
    .insert([validatedFields.data])
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (translation && translation.title.trim() && translation.description.trim()) {
    const { error: translationError } = await supabase
      .from("course_translations")
      .upsert(
        [
          {
            course_id: data.id,
            locale: "ja",
            title: translation.title.trim(),
            description: translation.description.trim(),
            duration: translation.duration?.trim() || null,
            schedule: translation.schedule?.trim() || null,
            fees: translation.fees?.trim() || null,
            badge: translation.badge?.trim() || null,
          },
        ],
        { onConflict: "course_id,locale" }
      );

    if (translationError) {
      throw new Error(translationError.message);
    }
  }

  revalidatePath("/dashboard/courses");
  revalidatePath("/language-classes");
  revalidatePath("/", "layout");
  return { success: true };
}

export async function updateCourse(
  id: string,
  values: CourseValues,
  translation?: CourseTranslationInput
) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase client not initialized");

  // --- P1 FIX: Explicit auth guard ---
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("Unauthorized: You must be logged in.");
  // ------------------------------------

  const validatedFields = courseSchema.safeParse(values);
  if (!validatedFields.success) {
    throw new Error("Invalid fields");
  }

  const { error } = await supabase
    .from("courses")
    .update(validatedFields.data)
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  if (translation && translation.title.trim() && translation.description.trim()) {
    const { error: translationError } = await supabase
      .from("course_translations")
      .upsert(
        [
          {
            course_id: id,
            locale: "ja",
            title: translation.title.trim(),
            description: translation.description.trim(),
            duration: translation.duration?.trim() || null,
            schedule: translation.schedule?.trim() || null,
            fees: translation.fees?.trim() || null,
            badge: translation.badge?.trim() || null,
          },
        ],
        { onConflict: "course_id,locale" }
      );

    if (translationError) {
      throw new Error(translationError.message);
    }
  }

  revalidatePath("/dashboard/courses");
  revalidatePath("/language-classes");
  revalidatePath("/", "layout");
  return { success: true };
}

export async function deleteCourse(id: string) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase client not initialized");

  // --- P1 FIX: Explicit auth guard ---
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("Unauthorized: You must be logged in.");
  // ------------------------------------

  const { error } = await supabase.from("courses").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/courses");
  revalidatePath("/language-classes");
  revalidatePath("/", "layout");
  return { success: true };
}

export async function getCoursesForDashboard() {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("courses")
    .select("*, translations:course_translations(locale,title,description,duration,schedule,fees,badge)")
    .order("order_index", { ascending: true });

  if (error) {
    console.error("Error fetching courses:", error.message);
    return [];
  }

  return data ?? [];
}
