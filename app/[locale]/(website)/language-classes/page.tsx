import Image from "next/image";
import Link from "next/link";
import { getPublishedCourses } from "@/lib/actions/course.action";
import { getT, type Locale } from "@/lib/i18n";
import CtaBand from "@/components/website/CtaBand";
import ApplyButton from "@/components/website/ApplyButton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isJa = locale === "ja";
  return {
    title: isJa
      ? "日本語クラス | J&N介護士研修"
      : "Japanese Language Classes | J&N Caregiver Training",
    description: isJa
      ? "経験豊富な講師によるJLPT対応の日本語コース（N5・N4・N3）。カトマンズで受講可能。"
      : "Expert-led Japanese language courses (N5, N4, N3) in Kathmandu. Flexible schedules and affordable fees.",
  };
}

export default async function LanguageClassesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale = locale as Locale;
  const t = getT(safeLocale);
  const courses = await getPublishedCourses(safeLocale);

  return (
    <>
      {/* HERO */}
      <section className="pb-24 overflow-hidden bg-gradient-to-br from-jn-bg-off to-jn-primary-light">
        <div className="jn-container text-center pt-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white text-jn-primary font-[family-name:var(--font-poppins)] text-[0.85rem] font-semibold rounded-full mb-6 shadow-sm border border-jn-primary-light">
            {t("nav.languageClasses")}
          </span>
          <h1 className="jn-heading-1 mb-6 max-w-3xl mx-auto">
            {t("languageClasses.title")}
          </h1>
          <p className="jn-body-text leading-[1.8] max-w-3xl mx-auto">
            {t("languageClasses.subtitle")}
          </p>
        </div>
      </section>

      {/* COURSES GRID */}
      <section className="jn-section bg-jn-bg-off">
        <div className="jn-container">
          {courses.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-2xl border border-jn-border">
              <p className="text-jn-text-muted text-lg">{t("languageClasses.empty")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-[24px] shadow-md border border-jn-border overflow-hidden flex flex-col group transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-jn-float)] hover:border-jn-primary-light relative"
                >
                  {course.badge && (
                    <span className="absolute top-4 right-4 bg-jn-accent text-jn-text-dark text-xs font-[family-name:var(--font-poppins)] font-bold px-3 py-1.5 rounded-full uppercase z-10 shadow-sm">
                      {course.badge as string}
                    </span>
                  )}

                  {/* Image / icon area */}
                  <div className="h-[140px] overflow-hidden border-b border-jn-border flex items-center justify-center bg-jn-bg-off group-hover:bg-jn-primary-light transition-colors duration-300">
                    {course.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={course.image_url as string}
                        alt={course.title as string}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <span className="text-5xl select-none">{(course.icon as string) || "🗣️"}</span>
                    )}
                  </div>

                  <div className="p-8 flex-grow flex flex-col gap-4">
                    {course.duration && (
                      <div className="text-[0.85rem] font-semibold text-jn-primary uppercase tracking-wider font-[family-name:var(--font-poppins)]">
                        {course.duration as string}
                      </div>
                    )}
                    <h3 className="jn-heading-3">{course.title as string}</h3>
                    <p className="text-[0.95rem] text-jn-text-muted flex-grow">{course.description as string}</p>

                    {/* Meta row */}
                    <div className="border-t border-jn-border pt-4 grid grid-cols-1 gap-2">
                      {course.schedule && (
                        <div className="flex items-center gap-2 text-[0.88rem] text-jn-text-muted">
                          <span className="text-jn-primary shrink-0">📅</span>
                          <span><strong className="text-jn-text-dark">{t("languageClasses.schedule")}:</strong> {course.schedule as string}</span>
                        </div>
                      )}
                      {course.fees && (
                        <div className="flex items-center gap-2 text-[0.88rem] text-jn-text-muted">
                          <span className="text-jn-primary shrink-0">💴</span>
                          <span><strong className="text-jn-text-dark">{t("languageClasses.fees")}:</strong> {course.fees as string}</span>
                        </div>
                      )}
                    </div>

                    <ApplyButton className="jn-btn jn-btn-primary w-full mt-2">
                      {t("cta.enrollNow")}
                    </ApplyButton>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href={`/${safeLocale}/contact`} className="jn-btn jn-btn-outline">
              {t("nav.contact")}
            </Link>
          </div>
        </div>
      </section>

      <CtaBand locale={safeLocale} />
    </>
  );
}
