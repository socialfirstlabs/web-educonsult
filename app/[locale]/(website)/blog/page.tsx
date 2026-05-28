import { getBlogPosts } from "@/lib/actions/blog.action";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { format } from "date-fns";
import Image from "next/image";
import { getT, type Locale } from "@/lib/i18n";
import { FEATURE_FLAGS } from "@/lib/constants";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Blog & Expert Guides | J&N Caregiver Training",
  description:
    "Explore our latest expert guides, success stories, and updates about studying in Japan and language learning.",
  openGraph: {
    title: "Blog & Expert Guides | J&N Caregiver Training",
    description: "Expert insights for your international education journey.",
    type: "website",
  },
};

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale = locale as Locale;
  const t = getT(safeLocale);

  if (!FEATURE_FLAGS.ENABLE_BLOG) {
    notFound();
  }

  const posts = await getBlogPosts(true);
  const localizedPosts = (posts ?? []).map((post) => {
    const translation = post.translations?.find(
      (item: { locale: string }) => item.locale === safeLocale,
    );
    const { translations: _translations, ...base } = post;
    void _translations;
    if (!translation) return base;
    const { locale: __locale, ...translatedFields } = translation;
    void __locale;
    return { ...base, ...translatedFields };
  });

  return (
    <div className="container py-20 px-4">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-bold mb-4">{t("blog.title")}</h1>
        <p className="text-xl text-muted-foreground">{t("blog.subtitle")}</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {localizedPosts?.map((post) => (
          <Link
            href={`/${safeLocale}/blog/${post.slug}`}
            key={post.id}
            className="group"
          >
            <Card className="h-full overflow-hidden transition-all group-hover:shadow-lg">
              <div className="aspect-video bg-muted relative overflow-hidden">
                {post.image_url ? (
                  <Image
                    src={post.image_url}
                    alt={post.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground italic">
                    No Image
                  </div>
                )}
              </div>
              <CardHeader>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <span>
                    {format(
                      new Date(post.published_at ?? post.created_at ?? new Date()),
                      "MMM d, yyyy",
                    )}
                  </span>
                </div>
                <CardTitle className="group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {post.excerpt}
                </p>
              </CardContent>
              <CardFooter>
                <span className="text-sm font-bold text-primary">
                  {t("blog.readMore")}
                </span>
              </CardFooter>
            </Card>
          </Link>
        ))}
        {localizedPosts.length === 0 && (
          <div className="col-span-full py-20 text-center bg-muted/30 rounded-2xl">
            <p className="text-muted-foreground">{t("blog.empty")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
