"use server";

import { createClient } from "@/lib/supabase/server";
import { blogSchema, BlogValues } from "@/lib/validations/blog.schema";
import { revalidatePath } from "next/cache";

type BlogTranslationInput = {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
};

export async function getBlogPosts(onlyPublished = false) {
  const supabase = await createClient();
  if (!supabase) return [];

  let query = supabase
    .from("blog_posts")
    .select("*, translations:blog_translations(locale,title,slug,excerpt,content)")
    .order("created_at", { ascending: false });

  if (onlyPublished) {
    query = query.eq("is_published", true);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Fetch blog posts error:", error);
    return [];
  }

  return data;
}

export async function getBlogPostsForDashboard() {
  return getBlogPosts();
}

export async function getBlogPostBySlug(slug: string) {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Fetch blog post by slug error:", error);
    return null;
  }

  return data;
}

export async function createBlogPost(
  values: BlogValues,
  translation?: BlogTranslationInput
) {
  const validatedFields = blogSchema.safeParse(values);

  if (!validatedFields.success) {
    throw new Error(validatedFields.error.message);
  }

  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase client not initialized");

  const { data, error } = await supabase
    .from("blog_posts")
    .insert([{
      ...validatedFields.data,
      published_at: validatedFields.data.is_published ? new Date().toISOString() : null
    }])
    .select("id")
    .single();

  if (error) {
    console.error("Create blog post error:", error);
    throw new Error(error.message);
  }

  if (
    translation &&
    translation.title.trim() &&
    translation.slug.trim() &&
    translation.content.trim() &&
    data?.id
  ) {
    const { error: translationError } = await supabase
      .from("blog_translations")
      .upsert(
        [
          {
            blog_id: data.id,
            locale: "ja",
            title: translation.title.trim(),
            slug: translation.slug.trim(),
            excerpt: translation.excerpt?.trim() || null,
            content: translation.content.trim(),
          },
        ],
        { onConflict: "blog_id,locale" }
      );

    if (translationError) {
      throw new Error(translationError.message);
    }
  }

  revalidatePath("/blog");
  revalidatePath("/dashboard/blog");
  return { success: true };
}

export async function updateBlogPost(
  id: string,
  values: BlogValues,
  translation?: BlogTranslationInput
) {
  const validatedFields = blogSchema.safeParse(values);

  if (!validatedFields.success) {
    throw new Error(validatedFields.error.message);
  }

  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase client not initialized");

  const { error } = await supabase
    .from("blog_posts")
    .update({
      ...validatedFields.data,
      published_at: validatedFields.data.is_published ? (validatedFields.data.published_at || new Date().toISOString()) : null
    })
    .eq("id", id);

  if (error) {
    console.error("Update blog post error:", error);
    throw new Error(error.message);
  }

  if (
    translation &&
    translation.title.trim() &&
    translation.slug.trim() &&
    translation.content.trim()
  ) {
    const { error: translationError } = await supabase
      .from("blog_translations")
      .upsert(
        [
          {
            blog_id: id,
            locale: "ja",
            title: translation.title.trim(),
            slug: translation.slug.trim(),
            excerpt: translation.excerpt?.trim() || null,
            content: translation.content.trim(),
          },
        ],
        { onConflict: "blog_id,locale" }
      );

    if (translationError) {
      throw new Error(translationError.message);
    }
  }

  revalidatePath("/blog");
  revalidatePath(`/blog/${values.slug}`);
  revalidatePath("/dashboard/blog");
  return { success: true };
}

export async function deleteBlogPost(id: string) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase client not initialized");

  const { error } = await supabase
    .from("blog_posts")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Delete blog post error:", error);
    throw new Error(error.message);
  }

  revalidatePath("/blog");
  revalidatePath("/dashboard/blog");
  return { success: true };
}
