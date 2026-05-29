import Link from "next/link";
import CtaBand from "@/components/website/CtaBand";
import { ServiceCard } from "@/components/website/ServiceCard";
import { getServices } from "@/lib/actions/service.action";
import { getT, type Locale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const isJa = (await params).locale === "ja";
  return {
    title: isJa ? "サービス | J&N介護士研修" : "Our Services | J&N Caregiver Training",
    description: isJa
      ? "キャリアカウンセリング・語学指導・ビザサポート・雇用主マッチング・到着後サポートまで全段階をカバー。"
      : "Professional services for every stage — career counseling, language coaching, visa support, employer matching, and post-arrival assistance.",
  };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getT(locale);
  const l = locale as Locale;

  const dbServices = await getServices(l);
  const activeDbServices = dbServices.filter((s) => s.is_active);

  const staticServices = [
    {
      id: "counseling",
      emoji: "🧭",
      stage: t("services.s1.stage"),
      title: t("services.s1.title"),
      description: t("services.s1.desc"),
      featured: false,
    },
    {
      id: "language-support",
      emoji: "🗣️",
      stage: t("services.s2.stage"),
      title: t("services.s2.title"),
      description: t("services.s2.desc"),
      featured: true,
      badge: t("services.s2.badge"),
    },
    {
      id: "visa-support",
      emoji: "📄",
      stage: t("services.s3.stage"),
      title: t("services.s3.title"),
      description: t("services.s3.desc"),
      featured: false,
    },
    {
      id: "placement",
      emoji: "🤝",
      stage: t("services.s4.stage"),
      title: t("services.s4.title"),
      description: t("services.s4.desc"),
      featured: false,
    },
    {
      id: "relocation",
      emoji: "✈️",
      stage: t("services.s5.stage"),
      title: t("services.s5.title"),
      description: t("services.s5.desc"),
      featured: false,
    },
    {
      id: "post-arrival",
      emoji: "🧩",
      stage: t("services.s6.stage"),
      title: t("services.s6.title"),
      description: t("services.s6.desc"),
      featured: false,
    },
  ];

  const processSteps = [
    { step: 1, title: t("services.process.s1.title"), desc: t("services.process.s1.desc") },
    { step: 2, title: t("services.process.s2.title"), desc: t("services.process.s2.desc") },
    { step: 3, title: t("services.process.s3.title"), desc: t("services.process.s3.desc") },
    { step: 4, title: t("services.process.s4.title"), desc: t("services.process.s4.desc") },
  ];

  return (
    <>
      {/* SERVICES HERO */}
      <section className="pb-24 overflow-hidden bg-gradient-to-br from-jn-bg-off to-jn-primary-light">
        <div className="jn-container text-center pt-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white text-jn-primary font-[family-name:var(--font-poppins)] text-[0.85rem] font-semibold rounded-full mb-6 shadow-sm border border-jn-primary-light">
            {t("services.hero.badge")}
          </span>
          <h1 className="jn-heading-1 mb-6 max-w-3xl mx-auto">
            {t("services.hero.title")}
          </h1>
          <p className="jn-body-text leading-[1.8] max-w-3xl mx-auto">
            {t("services.hero.body")}
          </p>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section id="services" className="jn-section bg-jn-bg-off">
        <div className="jn-container">
          <div className="text-center max-w-[760px] mx-auto mb-12">
            <span className="jn-section-label">{t("services.grid.label")}</span>
            <h2 className="jn-heading-2">{t("services.grid.title")}</h2>
            <p className="jn-body-text">{t("services.grid.body")}</p>
          </div>

          {activeDbServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeDbServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  title={service.title}
                  description={service.description}
                  features={service.features}
                  tags={service.tags}
                  image_url={service.image_url}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {staticServices.map((s) => (
                <div
                  key={s.id}
                  id={s.id}
                  className={`bg-white rounded-[24px] shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-jn-float)] flex flex-col group relative ${
                    s.featured
                      ? "border-2 border-jn-accent"
                      : "border border-jn-border"
                  }`}
                >
                  {s.featured && (
                    <span className="absolute top-4 right-4 bg-jn-accent text-jn-text-dark text-xs font-[family-name:var(--font-poppins)] font-bold px-3 py-1.5 rounded-full uppercase z-10 shadow-sm">
                      {(s as typeof s & { badge?: string }).badge}
                    </span>
                  )}
                  <div
                    className={`h-[140px] flex items-center justify-center text-5xl border-b border-jn-border ${
                      s.featured
                        ? "bg-jn-accent-light"
                        : "bg-jn-bg-off group-hover:bg-jn-primary-light"
                    } transition-colors duration-300`}
                  >
                    {s.emoji}
                  </div>
                  <div className="p-6 flex flex-col h-full">
                    <div className="text-[0.85rem] font-semibold text-jn-primary uppercase tracking-wider mb-3">
                      {s.stage}
                    </div>
                    <h3 className="text-xl font-semibold mb-3 font-[family-name:var(--font-poppins)] text-jn-text-dark">
                      {s.title}
                    </h3>
                    <p className="text-[0.95rem] text-jn-text-muted mb-6 flex-grow">
                      {s.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href={`/${l}/contact`} className="jn-btn jn-btn-primary">
              {t("services.grid.cta")}
            </Link>
          </div>
        </div>
      </section>

      {/* SERVICE PROCESS */}
      <section className="jn-section bg-white">
        <div className="jn-container">
          <div className="text-center max-w-[760px] mx-auto mb-12">
            <span className="jn-section-label">{t("services.process.label")}</span>
            <h2 className="jn-heading-2">{t("services.process.title")}</h2>
            <p className="jn-body-text">{t("services.process.body")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((p) => (
              <div
                key={p.step}
                className="bg-jn-bg-off border border-jn-border rounded-2xl p-6 text-center"
              >
                <div className="w-12 h-12 rounded-full bg-jn-primary text-white flex items-center justify-center font-[family-name:var(--font-poppins)] font-semibold mx-auto mb-4">
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

      {/* CTA BAND */}
      <CtaBand locale={l} />
    </>
  );
}
