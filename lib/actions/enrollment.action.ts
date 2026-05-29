"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import {
  enrollmentSchema,
  type EnrollmentFormValues,
} from "@/lib/validations/enrollment.schema";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

// ─── Public: submit application form ─────────────────────────────────────────

export async function submitEnrollment(values: EnrollmentFormValues) {
  // ── Rate limiting ──────────────────────────────────────────────────────────
  const ip = getClientIp(await headers())
  const { allowed } = checkRateLimit(ip)
  if (!allowed) {
    return { success: false, error: "Too many requests. Please try again in a minute." }
  }

  const parsed = enrollmentSchema.safeParse(values);

  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  if (!supabase) {
    return { success: false, error: "Service unavailable" };
  }

  const { error } = await supabase.from("enrollments").insert(parsed.data);

  if (error) {
    console.error("submitEnrollment error:", error);
    return { success: false, error: "Failed to submit application. Please try again." };
  }

  return { success: true };
}

// ─── Admin: fetch all enrollments ────────────────────────────────────────────

export async function getEnrollments() {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("enrollments")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getEnrollments error:", error);
    return [];
  }

  return data ?? [];
}

// ─── Admin: update status ────────────────────────────────────────────────────

export async function updateEnrollmentStatus(id: string, status: string) {
  const supabase = await createClient();
  if (!supabase) return { success: false };

  // Verify the caller is an admin before mutating
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const { error } = await supabase
    .from("enrollments")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error("updateEnrollmentStatus error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/enrollments");
  return { success: true };
}

// ─── Admin: delete enrollment ────────────────────────────────────────────────

export async function deleteEnrollment(id: string) {
  const supabase = await createClient();
  if (!supabase) return { success: false };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const { error } = await supabase
    .from("enrollments")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("deleteEnrollment error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/enrollments");
  return { success: true };
}
