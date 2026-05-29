import Image from "next/image";
import Link from "next/link";
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
      ? "日本で学ぶ | J&N介護士研修"
      : "Study in Japan | J&N Caregiver Training",
    description: isJa
      ? "日本での留学メリット、ビザ手続き、費用、就労機会について詳しく解説します。"
      : "Learn about the advantages of studying in Japan, visa process, costs, and work opportunities for Nepalese students.",
  };
}

export default async function StudyInJapanPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale = locale as Locale;
  const t = getT(safeLocale);

  const advantages = [
    { icon: "🎓", title: t("studyJapan.advantages.1.title"), desc: t("studyJapan.advantages.1.desc") },
    { icon: "🛡️", title: t("studyJapan.advantages.2.title"), desc: t("studyJapan.advantages.2.desc") },
    { icon: "💴", title: t("studyJapan.advantages.3.title"), desc: t("studyJapan.advantages.3.desc") },
    { icon: "⏰", title: t("studyJapan.advantages.4.title"), desc: t("studyJapan.advantages.4.desc") },
    { icon: "💼", title: t("studyJapan.advantages.5.title"), desc: t("studyJapan.advantages.5.desc") },
    { icon: "🌸", title: t("studyJapan.advantages.6.title"), desc: t("studyJapan.advantages.6.desc") },
  ];

  const processSteps = [
    { step: "01", title: t("studyJapan.process.1.title"), desc: t("studyJapan.process.1.desc") },
    { step: "02", title: t("studyJapan.process.2.title"), desc: t("studyJapan.process.2.desc") },
    { step: "03", title: t("studyJapan.process.3.title"), desc: t("studyJapan.process.3.desc") },
    { step: "04", title: t("studyJapan.process.4.title"), desc: t("studyJapan.process.4.desc") },
  ];

  return (
    <>
      {/* HERO */}
      <section className="pb-24 overflow-hidden bg-gradient-to-br from-jn-bg-off to-jn-primary-light">
        <div className="jn-container grid grid-cols-1 lg:grid-cols-2 gap-16 items-center pt-12">
          <div className="max-w-[580px]">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white text-jn-primary font-[family-name:var(--font-poppins)] text-[0.85rem] font-semibold rounded-full mb-6 shadow-sm border border-jn-primary-light">
              {t("nav.studyInJapan")}
            </span>
            <h1 className="jn-heading-1 mb-6">
              {t("studyJapan.heroTitle")}{" "}
              <span className="text-jn-primary">{t("studyJapan.heroAccent")}</span>
            </h1>
            <p className="jn-body-text leading-[1.8] mb-9">{t("studyJapan.heroSubtitle")}</p>
            <div className="flex gap-4 flex-wrap">
              <ApplyButton className="jn-btn jn-btn-primary">{t("cta.freeCounseling")}</ApplyButton>
              <Link href={`/${safeLocale}/contact`} className="jn-btn jn-btn-outline">
                {t("nav.menu.book")}
              </Link>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="aspect-[4/3] relative rounded-3xl overflow-hidden shadow-[0_20px_40px_-10px_rgba(36,62,188,0.15)]">
              <Image
                src="/images/home-2.png"
                alt="Japan — your next destination"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ADVANTAGES */}
      <section className="jn-section bg-white">
        <div className="jn-container">
          <div className="text-center max-w-[700px] mx-auto mb-16">
            <span className="jn-section-label">{t("studyJapan.advantagesTitle")}</span>
            <h2 className="jn-heading-2">{t("studyJapan.advantagesTitle")}</h2>
            <p className="jn-body-text">{t("studyJapan.advantagesSubtitle")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {advantages.map((item) => (
              <div
                key={item.title}
                className="bg-jn-bg-off border border-jn-border rounded-[24px] p-8 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1.5 hover:border-jn-primary-light hover:shadow-[var(--shadow-jn-float)] group"
              >
                <div className="w-14 h-14 bg-white border border-jn-primary-light text-jn-primary rounded-2xl flex items-center justify-center text-2xl shadow-sm group-hover:bg-jn-primary group-hover:text-white transition-all duration-300">
                  {item.icon}
                </div>
                <h3 className="text-[1.05rem] font-semibold font-[family-name:var(--font-poppins)] text-jn-text-dark">
                  {item.title}
                </h3>
                <p className="text-[0.95rem] text-jn-text-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="jn-section bg-jn-bg-off">
        <div className="jn-container">
          <div className="text-center max-w-[700px] mx-auto mb-16">
            <span className="jn-section-label">{t("studyJapan.processTitle")}</span>
            <h2 className="jn-heading-2">{t("studyJapan.processTitle")}</h2>
            <p className="jn-body-text">{t("studyJapan.processSubtitle")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((p) => (
              <div
                key={p.step}
                className="bg-white border border-jn-border rounded-2xl p-6 text-center transition-all duration-300 hover:border-jn-primary-light hover:shadow-[var(--shadow-jn-float)] group"
              >
                <div className="w-12 h-12 rounded-full bg-jn-primary text-white flex items-center justify-center font-[family-name:var(--font-poppins)] font-bold text-sm mx-auto mb-4 group-hover:scale-105 transition-transform">
                  {p.step}
                </div>
                <h4 className="font-[family-name:var(--font-poppins)] font-semibold text-jn-text-dark mb-2">
                  {p.title}
                </h4>
                <p className="text-jn-text-muted text-[0.95rem]">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COSTS & WORK */}
      <section className="jn-section bg-jn-primary relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 rounded-full bg-white/5 blur-[80px]" />
          <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 rounded-full bg-jn-accent/20 blur-[80px]" />
        </div>
        <div className="jn-container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <span className="inline-block font-[family-name:var(--font-poppins)] text-sm font-semibold text-jn-primary uppercase tracking-widest mb-4 bg-white px-4 py-1.5 rounded-full shadow-sm">
                {t("studyJapan.costsTitle")}
              </span>
              <h2 className="jn-heading-2 text-white mb-6">{t("studyJapan.costsTitle")}</h2>
              <p className="text-white/85 text-[1.05rem] mb-8 leading-relaxed">{t("studyJapan.costsDesc")}</p>
              <ul className="space-y-4">
                {[
                  { label: t("studyJapan.costs.workLimit"), value: t("studyJapan.costs.workLimitValue") },
                  { label: t("studyJapan.costs.hourlyWage"), value: t("studyJapan.costs.hourlyWageValue") },
                  { label: t("studyJapan.costs.expenses"), value: t("studyJapan.costs.expensesValue") },
                ].map((row) => (
                  <li key={row.label} className="flex items-start gap-3">
                    <span className="mt-1 w-5 h-5 rounded-full bg-jn-accent flex items-center justify-center shrink-0 text-xs font-bold text-jn-text-dark">✓</span>
                    <span className="text-white/90">
                      <strong className="text-white">{row.label}:</strong> {row.value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white/10 border border-white/20 rounded-[2rem] p-8 md:p-10 backdrop-blur-sm">
              <h3 className="text-2xl font-semibold font-[family-name:var(--font-poppins)] text-white mb-3">
                {t("studyJapan.ctaTitle")}
              </h3>
              <p className="text-white/85 mb-8 leading-relaxed">{t("studyJapan.ctaSubtitle")}</p>
              <ApplyButton className="jn-btn jn-btn-accent w-full justify-center">
                {t("cta.freeCounseling")}
              </ApplyButton>
              <Link
                href={`/${safeLocale}/contact`}
                className="mt-3 jn-btn !bg-transparent !text-white !border-white hover:!bg-white/10 w-full justify-center"
              >
                {t("nav.contact")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CtaBand locale={safeLocale} />
    </>
  );
}
