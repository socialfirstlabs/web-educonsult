import CtaBand from "@/components/website/CtaBand";
import { getT, type Locale } from "@/lib/i18n";

export const metadata = {
  title: "About Us | J&N Caregiver Training",
  description:
    "Learn about J&N Caregiver Training Co. Ltd. — empowering Nepali individuals with the skills to build successful caregiving careers in Japan.",
};

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getT(locale);
  const l = locale as Locale;

  const team = [
    {
      name: t("about.team.m1.name"),
      role: t("about.team.m1.role"),
      img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=600&auto=format&fit=crop",
    },
    {
      name: t("about.team.m2.name"),
      role: t("about.team.m2.role"),
      img: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=600&auto=format&fit=crop",
    },
    {
      name: t("about.team.m3.name"),
      role: t("about.team.m3.role"),
      img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop",
    },
  ];

  const values = [
    t("about.values.1"),
    t("about.values.2"),
    t("about.values.3"),
  ];

  return (
    <>
      {/* ABOUT HERO */}
      <section className="pb-24 overflow-hidden bg-gradient-to-br from-jn-bg-off to-jn-primary-light">
        <div className="jn-container text-center pt-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white text-jn-primary font-[family-name:var(--font-poppins)] text-[0.85rem] font-semibold rounded-full mb-6 shadow-sm border border-jn-primary-light">
            {t("about.hero.badge")}
          </span>
          <h1 className="jn-heading-1 mb-6 max-w-3xl mx-auto">
            {t("about.hero.title")}
          </h1>
          <p className="jn-body-text leading-[1.8] max-w-3xl mx-auto">
            {t("about.hero.body")}
          </p>
        </div>
      </section>

      {/* OUR MISSION */}
      <section className="jn-section bg-white">
        <div className="jn-container grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/about-1.png"
              alt="Our Team"
              className="w-full h-auto rounded-3xl shadow-lg"
            />
          </div>
          <div>
            <span className="jn-section-label">{t("about.mission.label")}</span>
            <h2 className="jn-heading-2 mb-6">{t("about.mission.title")}</h2>
            <p className="jn-body-text mb-6">
              {t("about.mission.body")}
            </p>
            <ul className="space-y-4">
              {values.map((v) => (
                <li key={v} className="flex items-center gap-3 text-jn-text-dark text-[1.05rem]">
                  <svg className="w-7 h-7 text-jn-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {v}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* OUR TEAM */}
      <section className="jn-section bg-jn-bg-off">
        <div className="jn-container">
          <div className="text-center max-w-[760px] mx-auto mb-14">
            <span className="jn-section-label">{t("about.team.label")}</span>
            <h2 className="jn-heading-2">{t("about.team.title")}</h2>
            <p className="jn-body-text">
              {t("about.team.body")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member) => (
              <div
                key={member.name}
                className="bg-white rounded-2xl shadow-sm border border-jn-border overflow-hidden group transition-all duration-300 hover:shadow-[var(--shadow-jn-float)] hover:-translate-y-2 hover:border-jn-primary-light"
              >
                <div className="h-64 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold font-[family-name:var(--font-poppins)] text-jn-text-dark mb-1">
                    {member.name}
                  </h3>
                  <p className="text-jn-text-muted text-[0.95rem]">{member.role}</p>
                </div>
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
