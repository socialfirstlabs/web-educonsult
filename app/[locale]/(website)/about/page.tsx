import CtaBand from "@/components/website/CtaBand";
import { getT, type Locale } from "@/lib/i18n";
import { getTeamMembers } from "@/lib/actions/team-member.action";

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

  const team = await getTeamMembers(l);

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
                key={member.id}
                className="bg-white rounded-2xl shadow-sm border border-jn-border overflow-hidden group transition-all duration-300 hover:shadow-[var(--shadow-jn-float)] hover:-translate-y-2 hover:border-jn-primary-light"
              >
                <div className="h-64 overflow-hidden bg-jn-bg-off flex items-center justify-center">
                  {member.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={member.image_url}
                      alt={member.name as string}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <svg className="w-24 h-24 text-jn-text-muted/30" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                    </svg>
                  )}
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold font-[family-name:var(--font-poppins)] text-jn-text-dark mb-1">
                    {member.name as string}
                  </h3>
                  <p className="text-jn-text-muted text-[0.95rem]">{member.position as string}</p>
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
