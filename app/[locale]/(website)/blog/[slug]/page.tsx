import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { getT, type Locale } from "@/lib/i18n";
import { FEATURE_FLAGS, SITE_CONFIG } from "@/lib/constants";
import sanitizeHtml from "sanitize-html";
import type { Metadata } from "next";
import ReadingProgress from "@/components/website/ReadingProgress";
import ShareButtons from "@/components/website/ShareButtons";

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
    .select(
      "title, excerpt, image_url, published_at, author_name, translations:blog_translations(locale,title,excerpt,slug)",
    )
    .eq("slug", slug)
    .single();

  if (!post) return {};
  const translation = post.translations?.find(
    (t: { locale: string }) => t.locale === locale,
  );
  const title =
    (translation as { title?: string } | undefined)?.title ?? post.title;
  const description =
    (translation as { excerpt?: string } | undefined)?.excerpt ??
    post.excerpt ??
    undefined;

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

  if (!FEATURE_FLAGS.ENABLE_BLOG) notFound();

  const supabase = await createClient();
  if (!supabase)
    return (
      <div className="jn-container py-20">{t("blog.supabaseMissing")}</div>
    );

  let post = null;

  const { data: basePost } = await supabase
    .from("blog_posts")
    .select(
      "*, translations:blog_translations(locale,title,slug,excerpt,content)",
    )
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
        .select(
          "*, translations:blog_translations(locale,title,slug,excerpt,content)",
        )
        .eq("id", translation.blog_id)
        .single();
      post = translatedPost || null;
    }
  }

  if (!post) notFound();

  const translation = post.translations?.find(
    (item: { locale: string }) => item.locale === safeLocale,
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

  const publishedDate = format(
    new Date(post.published_at ?? post.created_at ?? new Date()),
    safeLocale === "ja" ? "yyyy年M月d日" : "MMMM d, yyyy",
  );

  const clean = sanitizeHtml(localizedPost.content ?? "", {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "iframe"]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "width", "height"],
      iframe: ["src", "width", "height"],
    },
    allowedIframeHostnames: [
      "www.youtube-nocookie.com",
      "player.vimeo.com",
    ],
    allowedSchemes: ["https", "mailto"],
    allowedSchemesByTag: {
      img: ["https"],
      iframe: ["https"],
      a: ["https", "mailto"],
    },
  });

  return (
    <>
      <ReadingProgress />

      <article className="bg-white">
        {/* Hero image */}
        {localizedPost.image_url && (
          <div className="w-full h-[420px] md:h-[520px] relative overflow-hidden">
            <Image
              src={localizedPost.image_url}
              alt={localizedPost.title}
              fill
              sizes="100vw"
              className="object-cover object-top"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          </div>
        )}

        <div className="jn-container max-w-3xl mx-auto py-16">
          {/* Back link */}
          <Link
            href={`/${safeLocale}/blog`}
            className="inline-flex items-center gap-1.5 text-[0.88rem] font-semibold font-[family-name:var(--font-poppins)] text-jn-text-muted hover:text-jn-primary transition-colors mb-8"
          >
            {t("blog.backToBlog")}
          </Link>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-[0.72rem] font-semibold bg-jn-primary-light text-jn-primary border border-jn-primary-light uppercase tracking-wider font-[family-name:var(--font-poppins)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="jn-heading-1 mb-6">{localizedPost.title}</h1>

          {/* Meta row */}
          <div className="flex items-center gap-3 text-[0.9rem] text-jn-text-muted pb-8 mb-8 border-b border-jn-border">
            <time dateTime={post.published_at ?? post.created_at ?? ""}>
              {publishedDate}
            </time>
            {post.author_name && (
              <>
                <span aria-hidden="true">·</span>
                <span>{post.author_name}</span>
              </>
            )}
          </div>

          {/* Body */}
          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: clean }}
          />

          {/* Share */}
          <ShareButtons
            title={localizedPost.title}
            url={`${SITE_CONFIG.url}/${locale}/blog/${localizedPost.slug ?? slug}`}
            shareLabel={t("blog.share.label")}
            copyLabel={t("blog.share.copy")}
            copiedLabel={t("blog.share.copied")}
            twitterLabel={t("blog.share.twitter")}
            facebookLabel={t("blog.share.facebook")}
            whatsappLabel={t("blog.share.whatsapp")}
          />

          {/* Author card */}
          <div className="mt-10 bg-jn-bg-off border border-jn-border rounded-[1.5rem] p-8 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="w-20 h-20 rounded-full bg-jn-primary-light flex items-center justify-center text-jn-primary font-[family-name:var(--font-poppins)] font-bold text-2xl shrink-0">
              {post.author_name?.charAt(0) || t("blog.authorFallback").charAt(0)}
            </div>
            <div className="flex-1">
              <p className="text-[0.75rem] uppercase tracking-widest font-bold text-jn-primary mb-1 font-[family-name:var(--font-poppins)]">
                {t("blog.authorLabel")}
              </p>
              <h3 className="text-xl font-semibold font-[family-name:var(--font-poppins)] text-jn-text-dark mb-2">
                {post.author_name || t("blog.authorFallback")}
              </h3>
              <p className="text-jn-text-muted text-[0.92rem] leading-relaxed">
                {t("blog.authorBio")}
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-10 text-center">
            <Link
              href={`/${safeLocale}/blog`}
              className="jn-btn jn-btn-outline"
            >
              {t("blog.backToBlog")}
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
