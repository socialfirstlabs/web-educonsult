import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import Image from "next/image";
import { getT, type Locale } from "@/lib/i18n";
import { FEATURE_FLAGS } from "@/lib/constants";
import sanitizeHtml from "sanitize-html";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  if (!FEATURE_FLAGS.ENABLE_BLOG) return {};
  const { slug, locale } = await params;
  const supabase = await createClient();
  if (!supabase) return {};

  const { data: post } = await supabase
    .from("blog_posts")
    .select("title, excerpt, image_url, published_at, author_name, translations:blog_translations(locale,title,excerpt,slug)")
    .eq("slug", slug)
    .single();

  if (!post) return {};
  const translation = post.translations?.find((t: { locale: string }) => t.locale === locale);
  const title = (translation as { title?: string } | undefined)?.title ?? post.title;
  const description = (translation as { excerpt?: string } | undefined)?.excerpt ?? post.excerpt ?? undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description: description ?? "",
      type: "article",
      publishedTime: post.published_at ?? undefined,
      authors: post.author_name ? [post.author_name] : undefined,
      images: post.image_url ? [{ url: post.image_url }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: description ?? "",
      images: post.image_url ? [post.image_url] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const safeLocale = locale as Locale;
  const t = getT(safeLocale);

  if (!FEATURE_FLAGS.ENABLE_BLOG) {
    notFound();
  }

  const supabase = await createClient();
  
  if (!supabase)
    return (
      <div className="container py-20 px-4">
        {t("blog.supabaseMissing")}
      </div>
    );

  let post = null;

  const { data: basePost } = await supabase
    .from("blog_posts")
    .select("*, translations:blog_translations(locale,title,slug,excerpt,content)")
    .eq("slug", slug)
    .single();

  post = basePost || null;

  if (!post) {
    const { data: translation } = await supabase
      .from("blog_translations")
      .select("blog_id")
      .eq("slug", slug)
      .eq("locale", safeLocale)
      .single();

    if (translation?.blog_id) {
      const { data: translatedPost } = await supabase
        .from("blog_posts")
        .select("*, translations:blog_translations(locale,title,slug,excerpt,content)")
        .eq("id", translation.blog_id)
        .single();

      post = translatedPost || null;
    }
  }

  if (!post) notFound();

  const translation = post.translations?.find(
    (item: { locale: string }) => item.locale === safeLocale
  );
  const { translations: _translations, ...base } = post;
  void _translations;
  const tags = (post as { tags?: string[] | null }).tags ?? [];
  const localizedPost = translation
    ? (() => {
        const { locale: __locale, ...translatedFields } = translation;
        void __locale;
        return { ...base, ...translatedFields };
      })()
    : base;

  return (
    <article className="container py-20 px-4 max-w-4xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{localizedPost.title}</h1>
        <div className="flex items-center gap-4 text-muted-foreground pb-8 border-b">
            <span>{format(new Date(post.published_at ?? post.created_at ?? new Date()), "MMMM d, yyyy")}</span>
            <span>•</span>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag: string) => (
                  <span key={tag} className="font-medium text-primary uppercase text-xs tracking-widest">
                    {tag}
                  </span>
                ))}
              </div>
            )}
        </div>
      </header>

      {localizedPost.image_url && (
        <div className="aspect-video mb-12 rounded-3xl overflow-hidden border shadow-sm relative">
           <Image 
              src={localizedPost.image_url} 
              alt={localizedPost.title} 
              fill 
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 896px, 896px"
              className="object-cover" 
              priority
            />
        </div>
      )}

      <div className="blog-content">
        {/* Render HTML content stored in Supabase.
            sanitize-html strips all disallowed tags/attributes before render.
            Config is intentionally strict — see security audit P2 fixes. */}
        <div dangerouslySetInnerHTML={{
          __html: sanitizeHtml(localizedPost.content, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'iframe']),
            allowedAttributes: {
              ...sanitizeHtml.defaults.allowedAttributes,
              // img: no style/class — prevents CSS-based data exfiltration
              'img': ['src', 'alt', 'width', 'height'],
              // iframe: only src/dimensions — `allow` and `allowfullscreen` removed
              // to minimise the permission surface granted to embedded content
              'iframe': ['src', 'width', 'height'],
            },
            // Only youtube-nocookie.com (no tracking cookies) and Vimeo player.
            // youtube.com embeds set persistent ad-tracking cookies; -nocookie does not.
            allowedIframeHostnames: ['www.youtube-nocookie.com', 'player.vimeo.com'],
            // Reject any http:// src — enforces HTTPS-only for all embedded content.
            // Prevents mixed-content warnings and SSRF pixel-tracking via http images.
            allowedSchemes: ['https', 'mailto'],
            allowedSchemesByTag: {
              img:    ['https'],
              iframe: ['https'],
              a:      ['https', 'mailto'],
            },
          })
        }} />
      </div>

      <footer className="mt-16 pt-8 border-t border-slate-100">
        <div className="bg-slate-50 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl">
            {post.author_name?.charAt(0) || t("blog.authorFallback").charAt(0)}
          </div>
          <div className="flex-1">
            <p className="text-xs uppercase tracking-widest font-bold text-primary mb-1">
              {t("blog.authorLabel")}
            </p>
            <h3 className="text-xl font-bold mb-2">
              {post.author_name || t("blog.authorFallback")}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {t("blog.authorBio")}
            </p>
          </div>
        </div>
      </footer>
    </article>
  );
}
