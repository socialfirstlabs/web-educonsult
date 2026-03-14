"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { courseSchema, type CourseValues } from "../validations/course.schema";

export async function getCourses() {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .order("order_index", { ascending: true });

  if (error) {
    console.error("Error fetching courses:", error.message);
    return [];
  }

  return data;
}

export async function getPublishedCourses() {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("is_published", true)
    .order("order_index", { ascending: true });

  if (error) {
    console.error("Error fetching published courses:", error.message);
    return [];
  }

  return data;
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
