import { getBlogPosts } from "@/lib/actions/blog.action";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import CtaBand from "@/components/website/CtaBand";
import { getT, type Locale } from "@/lib/i18n";
import { FEATURE_FLAGS } from "@/lib/constants";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Blog & Insights | J&N Caregiver Training",
  description:
    "Discover everything you need to know about starting your caregiver career, life in Japan, and success stories from our graduates.",
  openGraph: {
    title: "Blog & Insights | J&N Caregiver Training",
    description:
      "Discover everything you need to know about starting your caregiver career, life in Japan, and success stories from our graduates.",
    type: "website",
  },
};

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
          {/* Blog Grid */}
          {localizedPosts.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-2xl border border-jn-border">
              <p className="text-jn-text-muted text-lg">{t("blog.empty")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {localizedPosts.map((post) => (
                <Link
                  href={`/${l}/blog/${post.slug}`}
                  key={post.id}
                  className="group"
                >
                  <article className="bg-white rounded-2xl shadow-sm border border-jn-border overflow-hidden transition-all duration-300 hover:shadow-[var(--shadow-jn-float)] hover:-translate-y-1 flex flex-col h-full">
                    {/* Image */}
                    <div className="h-56 overflow-hidden relative rounded-t-2xl bg-jn-primary-light">
                      {post.image_url ? (
                        <Image
                          src={post.image_url}
                          alt={post.title}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-jn-text-light italic text-sm">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-1">
                      <div className="text-sm text-jn-text-muted mb-3 font-medium">
                        {format(
                          new Date(
                            post.published_at ?? post.created_at ?? new Date(),
                          ),
                          "MMM d, yyyy",
                        )}
                      </div>
                      <h3 className="text-xl font-semibold mb-3 font-[family-name:var(--font-poppins)] text-jn-text-dark group-hover:text-jn-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-jn-text-muted text-[0.95rem] mb-6 line-clamp-3 flex-grow">
                          {post.excerpt}
                        </p>
                      )}
                      <span className="inline-flex items-center gap-1 font-[family-name:var(--font-poppins)] font-semibold text-jn-primary group-hover:gap-2 transition-all mt-auto">
                        {t("blog.readMore")} <span aria-hidden="true">→</span>
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA BAND */}
      <CtaBand locale={l} />
    </>
  );
}
