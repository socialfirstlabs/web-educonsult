"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { serviceSchema, type ServiceValues } from "../validations/service.schema";
import type { Locale } from "@/lib/i18n";

type ServiceTranslationInput = {
  title: string;
  description: string;
  features?: string;
};

export async function getServices(locale: Locale = "en") {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("services")
    .select("*, translations:service_translations(locale,title,description,features)")
    .order("order_index", { ascending: true });

  if (error) {
    console.error("Error fetching services:", error.message);
    return [];
  }

  return (data ?? []).map((service) => {
    const translation = service.translations?.find(
      (item: { locale: string }) => item.locale === locale
    );
    const { translations: _translations, ...base } = service;
    void _translations;
    if (!translation) return base;
    const { locale: __locale, ...translatedFields } = translation;
    void __locale;
    return { ...base, ...translatedFields };
  });
}

export async function addService(values: ServiceValues, translation?: ServiceTranslationInput) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase client not initialized");

  // --- P1 FIX: Explicit auth guard ---
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("Unauthorized: You must be logged in.");
  // ------------------------------------

  const validatedFields = serviceSchema.safeParse(values);
  if (!validatedFields.success) {
    throw new Error("Invalid fields");
  }

  const { data, error } = await supabase
    .from("services")
    .insert([validatedFields.data])
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (translation && translation.title.trim() && translation.description.trim()) {
    const { error: translationError } = await supabase
      .from("service_translations")
      .upsert(
        [
          {
            service_id: data.id,
            locale: "ja",
            title: translation.title.trim(),
            description: translation.description.trim(),
            features: translation.features?.trim() || null,
          },
        ],
        { onConflict: "service_id,locale" }
      );

    if (translationError) {
      throw new Error(translationError.message);
    }
  }

  revalidatePath("/dashboard/services");
  revalidatePath("/services");
  revalidatePath("/", "layout");
}

export async function updateService(
  id: string,
  values: ServiceValues,
  translation?: ServiceTranslationInput
) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase client not initialized");

  // --- P1 FIX: Explicit auth guard ---
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("Unauthorized: You must be logged in.");
  // ------------------------------------

  const validatedFields = serviceSchema.safeParse(values);
  if (!validatedFields.success) {
    throw new Error("Invalid fields");
  }

  const { error } = await supabase
    .from("services")
    .update(validatedFields.data)
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  if (translation && translation.title.trim() && translation.description.trim()) {
    const { error: translationError } = await supabase
      .from("service_translations")
      .upsert(
        [
          {
            service_id: id,
            locale: "ja",
            title: translation.title.trim(),
            description: translation.description.trim(),
            features: translation.features?.trim() || null,
          },
        ],
        { onConflict: "service_id,locale" }
      );

    if (translationError) {
      throw new Error(translationError.message);
    }
  }

  revalidatePath("/dashboard/services");
  revalidatePath("/services");
  revalidatePath("/", "layout");
}

export async function deleteService(id: string) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase client not initialized");

  // --- P1 FIX: Explicit auth guard ---
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("Unauthorized: You must be logged in.");
  // ------------------------------------

  const { error } = await supabase.from("services").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/services");
  revalidatePath("/services");
  revalidatePath("/", "layout");
}

export async function getServicesForDashboard() {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("services")
    .select("*, translations:service_translations(locale,title,description,features)")
    .order("order_index", { ascending: true });

  if (error) {
    console.error("Error fetching services:", error.message);
    return [];
  }

  return data ?? [];
}
