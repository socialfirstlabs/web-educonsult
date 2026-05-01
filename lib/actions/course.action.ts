"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { courseSchema, type CourseValues } from "../validations/course.schema";
import type { Locale } from "@/lib/i18n";

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

export async function addCourse(values: CourseValues) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase client not initialized");

  const validatedFields = courseSchema.safeParse(values);
  if (!validatedFields.success) {
    throw new Error("Invalid fields");
  }

  const { error } = await supabase.from("courses").insert([validatedFields.data]);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/courses");
  revalidatePath("/language-classes");
}

export async function updateCourse(id: string, values: CourseValues) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase client not initialized");

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

  revalidatePath("/dashboard/courses");
  revalidatePath("/language-classes");
}

export async function deleteCourse(id: string) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase client not initialized");

  const { error } = await supabase.from("courses").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/courses");
  revalidatePath("/language-classes");
}
