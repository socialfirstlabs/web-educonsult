import Image from "next/image";
import { getPublishedSuccessStories } from "@/lib/actions/success-story.action";
import { getT, type Locale } from "@/lib/i18n";
import CtaBand from "@/components/website/CtaBand";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isJa = locale === "ja";
  return {
    title: isJa
      ? "成功事例 | J&N介護士研修"
      : "Success Stories | J&N Caregiver Training",
    description: isJa
      ? "日本で介護キャリアを成功させた修了生たちの実体験をご覧ください。"
      : "Read about our graduates who have successfully built caregiving careers in Japan.",
  };
}

export default async function SuccessStoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale = locale as Locale;
  const t = getT(safeLocale);
  const stories = await getPublishedSuccessStories(safeLocale);

  return (
    <>
      {/* HERO */}
      <section className="pb-24 overflow-hidden bg-gradient-to-br from-jn-bg-off to-jn-primary-light">
        <div className="jn-container text-center pt-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white text-jn-primary font-[family-name:var(--font-poppins)] text-[0.85rem] font-semibold rounded-full mb-6 shadow-sm border border-jn-primary-light">
            {t("successStories.hero.badge")}
          </span>
          <h1 className="jn-heading-1 mb-6 max-w-3xl mx-auto">
            {t("successStories.title")}
          </h1>
          <p className="jn-body-text leading-[1.8] max-w-3xl mx-auto">
            {t("successStories.hero.body")}
          </p>
        </div>
      </section>

      {/* STORIES GRID */}
      <section className="jn-section bg-jn-bg-off">
        <div className="jn-container">
          {stories.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-2xl border border-jn-border">
              <p className="text-jn-text-muted text-lg italic">{t("successStories.empty")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {stories.map((story) => {
                const initials = story.student_name
                  .split(" ")
                  .map((w: string) => w[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase();

                return (
                  <div
                    key={story.id}
                    className="bg-white p-8 rounded-[24px] shadow-sm border border-jn-border flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-jn-float)] hover:border-jn-primary-light"
                  >
                    {/* Stars */}
                    <div className="text-jn-accent text-lg mb-4 tracking-wide">★★★★★</div>

                    {/* Quote */}
                    <p className="text-[1.02rem] text-jn-text-dark italic mb-6 flex-grow line-clamp-5 leading-relaxed">
                      &ldquo;{story.testimonial}&rdquo;
                    </p>

                    {/* Meta: company + destination */}
                    {(story.company_name || story.destination) && (
                      <div className="flex flex-wrap gap-2 mb-5">
                        {story.company_name && (
                          <span className="px-2.5 py-1 rounded-full text-[0.72rem] font-semibold bg-jn-bg-off border border-jn-border text-jn-text-muted">
                            🏢 {story.company_name}
                          </span>
                        )}
                        {story.destination && (
                          <span className="px-2.5 py-1 rounded-full text-[0.72rem] font-semibold bg-jn-primary-light text-jn-primary border border-jn-primary-light">
                            📍 {story.destination}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Author */}
                    <div className="flex items-center gap-4 pt-5 border-t border-jn-border">
                      {story.image_url ? (
                        <Image
                          src={story.image_url}
                          alt={story.student_name}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-full object-cover border border-jn-border shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-jn-primary-light text-jn-primary flex items-center justify-center font-[family-name:var(--font-poppins)] font-semibold text-base shrink-0">
                          {initials}
                        </div>
                      )}
                      <div>
                        <h4 className="text-base font-semibold font-[family-name:var(--font-poppins)] text-jn-text-dark">
                          {story.student_name}
                        </h4>
                        {story.destination && (
                          <p className="text-[0.85rem] text-jn-text-muted">{story.destination}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <CtaBand locale={safeLocale} />
    </>
  );
}
