"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { teamMemberSchema, type TeamMemberValues } from "../validations/team-member.schema";
import type { Locale } from "@/lib/i18n";

type TeamMemberTranslationInput = {
  name: string;
  position: string;
};

const SELECT_FIELDS =
  "*, translations:team_member_translations(locale,name,position)";

function mergeTranslation<T extends { translations?: { locale: string }[] }>(
  member: T,
  locale: Locale
) {
  const translation = member.translations?.find((t) => t.locale === locale);
  const { translations: _t, ...base } = member as T & { translations?: unknown[] };
  void _t;
  if (!translation) return base;
  const { locale: _l, ...fields } = translation as { locale: string } & Record<string, unknown>;
  void _l;
  return { ...base, ...fields };
}

export async function getTeamMembers(locale: Locale = "en") {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("team_members")
    .select(SELECT_FIELDS)
    .eq("is_active", true)
    .order("order_index", { ascending: true });

  if (error) { console.error("Error fetching team members:", error.message); return []; }
  return (data ?? []).map((m) => mergeTranslation(m, locale));
}

export async function getTeamMembersForDashboard() {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("team_members")
    .select(SELECT_FIELDS)
    .order("order_index", { ascending: true });

  if (error) { console.error("Error fetching team members:", error.message); return []; }
  return data ?? [];
}

export async function addTeamMember(
  values: TeamMemberValues,
  translation?: TeamMemberTranslationInput
) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase client not initialized");

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("Unauthorized: You must be logged in.");

  const validated = teamMemberSchema.safeParse(values);
  if (!validated.success) throw new Error("Invalid fields");

  const { data, error } = await supabase
    .from("team_members")
    .insert([validated.data])
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  if (translation && translation.name.trim()) {
    const { error: translationError } = await supabase
      .from("team_member_translations")
      .upsert(
        [{
          team_member_id: data.id,
          locale: "ja",
          name: translation.name.trim(),
          position: translation.position.trim(),
        }],
        { onConflict: "team_member_id,locale" }
      );
    if (translationError) throw new Error(translationError.message);
  }

  revalidatePath("/dashboard/team");
  revalidatePath("/", "layout");
  return { success: true };
}

export async function updateTeamMember(
  id: string,
  values: TeamMemberValues,
  translation?: TeamMemberTranslationInput
) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase client not initialized");

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("Unauthorized: You must be logged in.");

  const validated = teamMemberSchema.safeParse(values);
  if (!validated.success) throw new Error("Invalid fields");

  const { error } = await supabase
    .from("team_members")
    .update(validated.data)
    .eq("id", id);

  if (error) throw new Error(error.message);

  if (translation) {
    const { error: translationError } = await supabase
      .from("team_member_translations")
      .upsert(
        [{
          team_member_id: id,
          locale: "ja",
          name: translation.name.trim(),
          position: translation.position.trim(),
        }],
        { onConflict: "team_member_id,locale" }
      );
    if (translationError) throw new Error(translationError.message);
  }

  revalidatePath("/dashboard/team");
  revalidatePath("/", "layout");
  return { success: true };
}

export async function deleteTeamMember(id: string) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase client not initialized");

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("Unauthorized: You must be logged in.");

  const { error } = await supabase.from("team_members").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/team");
  revalidatePath("/", "layout");
  return { success: true };
}
