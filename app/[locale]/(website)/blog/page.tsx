import { getBlogPosts } from "@/lib/actions/blog.action";
import CtaBand from "@/components/website/CtaBand";
import BlogGrid from "@/components/website/BlogGrid";
import { getT, type Locale } from "@/lib/i18n";
import { FEATURE_FLAGS } from "@/lib/constants";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const isJa = (await params).locale === "ja";
  const title = isJa
    ? "ブログ & インサイト | J&N介護士研修"
    : "Blog & Insights | J&N Caregiver Training";
  const description = isJa
    ? "介護キャリアの始め方、日本での生活、修了生の成功事例など役立つ情報を発信しています。"
    : "Discover everything you need to know about starting your caregiver career, life in Japan, and success stories from our graduates.";
  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getT(locale);
  const l = locale as Locale;

  if (!FEATURE_FLAGS.ENABLE_BLOG) {
    notFound();
  }

  const posts = await getBlogPosts(true);
  const localizedPosts = (posts ?? []).map((post) => {
    const translation = post.translations?.find(
      (item: { locale: string }) => item.locale === l,
    );
    const { translations: _translations, ...base } = post;
    void _translations;
    if (!translation) return base;
    const { locale: __locale, ...translatedFields } = translation;
    void __locale;
    return { ...base, ...translatedFields };
  });

  return (
    <>
      {/* BLOG HERO */}
      <section className="pb-24 overflow-hidden bg-gradient-to-br from-jn-bg-off to-jn-primary-light">
        <div className="jn-container text-center pt-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white text-jn-primary font-[family-name:var(--font-poppins)] text-[0.85rem] font-semibold rounded-full mb-6 shadow-sm border border-jn-primary-light">
            {t("blog.hero.badge")}
          </span>
          <h1 className="jn-heading-1 mb-6 max-w-3xl mx-auto">
            {t("blog.hero.title")}
          </h1>
          <p className="jn-body-text leading-[1.8] max-w-3xl mx-auto">
            {t("blog.hero.body")}
          </p>
        </div>
      </section>

      {/* BLOG CONTENT */}
      <section className="jn-section bg-jn-bg-off">
        <div className="jn-container">
          <BlogGrid
            posts={localizedPosts.map((p) => ({
              id: p.id,
              slug: p.slug,
              title: p.title,
              excerpt: p.excerpt ?? null,
              image_url: p.image_url ?? null,
              published_at: p.published_at ?? null,
              created_at: (p as { created_at?: string }).created_at ?? null,
              tags: (p as { tags?: string[] }).tags ?? null,
            }))}
            locale={l}
            readMoreLabel={t("blog.readMore")}
            emptyLabel={t("blog.empty")}
            filterAllLabel={t("blog.filter.all")}
            filterLabel={t("blog.filter.label")}
          />
        </div>
      </section>

      {/* CTA BAND */}
      <CtaBand locale={l} />
    </>
  );
}
