"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { serviceSchema, type ServiceValues } from "../validations/service.schema";

export async function getServices() {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("order_index", { ascending: true });

  if (error) {
    console.error("Error fetching services:", error.message);
    return [];
  }

  return data;
}

export async function addService(values: ServiceValues) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase client not initialized");

  const validatedFields = serviceSchema.safeParse(values);
  if (!validatedFields.success) {
    throw new Error("Invalid fields");
  }

  const { error } = await supabase.from("services").insert([validatedFields.data]);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/services");
  revalidatePath("/services");
  revalidatePath("/", "layout");
}

export async function updateService(id: string, values: ServiceValues) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase client not initialized");

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

  revalidatePath("/dashboard/services");
  revalidatePath("/services");
  revalidatePath("/", "layout");
}

export async function deleteService(id: string) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase client not initialized");

  const { error } = await supabase.from("services").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/services");
  revalidatePath("/services");
  revalidatePath("/", "layout");
}
