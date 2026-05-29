import CtaBand from "@/components/website/CtaBand";
import { LeadForm } from "@/components/website/LeadForm";
import { getT, type Locale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const isJa = (await params).locale === "ja";
  return {
    title: isJa ? "お問い合わせ | J&N介護士研修" : "Contact Us | J&N Caregiver Training",
    description: isJa
      ? "研修プログラム・入学・提携に関するご質問はこちら。すべてのステップでサポートします。"
      : "Have questions about our training programs, admissions, or partnerships? We are here to help you every step of the way.",
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getT(locale);
  const l = locale as Locale;
  const contactDetails = [
    {
      emoji: "📍",
      title: t("contact.info.visit.title"),
      lines: [t("contact.info.visit.l1"), t("contact.info.visit.l2")],
    },
    {
      emoji: "📧",
      title: t("contact.info.email.title"),
      lines: [t("contact.info.email.l1"), t("contact.info.email.l2")],
    },
    {
      emoji: "☎️",
      title: t("contact.info.call.title"),
      lines: [t("contact.info.call.l1"), t("contact.info.call.l2")],
    },
  ];

  return (
    <>
      {/* CONTACT HERO */}
      <section className="pb-24 overflow-hidden bg-gradient-to-br from-jn-bg-off to-jn-primary-light">
        <div className="jn-container text-center pt-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white text-jn-primary font-[family-name:var(--font-poppins)] text-[0.85rem] font-semibold rounded-full mb-6 shadow-sm border border-jn-primary-light">
            {t("contact.hero.badge")}
          </span>
          <h1 className="jn-heading-1 mb-6 max-w-3xl mx-auto">
            {t("contact.hero.title")}
          </h1>
          <p className="jn-body-text leading-[1.8] max-w-3xl mx-auto">
            {t("contact.hero.body")}
          </p>
        </div>
      </section>

      {/* CONTACT DETAILS & FORM */}
      <section className="jn-section bg-white">
        <div className="jn-container grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: contact info */}
          <div>
            <h2 className="jn-heading-2 mb-8">{t("contact.info.title")}</h2>
            <div className="space-y-8 mb-8">
              {contactDetails.map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-jn-primary-light text-jn-primary rounded-xl flex items-center justify-center shrink-0 text-xl">
                    {item.emoji}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1 text-jn-text-dark font-[family-name:var(--font-poppins)]">
                      {item.title}
                    </h4>
                    {item.lines.map((line) => (
                      <p key={line} className="text-jn-text-muted">
                        {line.includes("@") ? (
                          <a
                            href={`mailto:${line.trim()}`}
                            className="hover:text-jn-primary transition-colors underline underline-offset-2 decoration-jn-border hover:decoration-jn-primary"
                          >
                            {line}
                          </a>
                        ) : line.match(/^\+[\d\s\-().]+$/) ? (
                          <a
                            href={`tel:${line.replace(/\s/g, "")}`}
                            className="hover:text-jn-primary transition-colors"
                          >
                            {line}
                          </a>
                        ) : (
                          line
                        )}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Map */}
            <div className="rounded-2xl overflow-hidden border border-jn-border shadow-sm">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d220.71557218303042!2d85.30582621916733!3d27.7342891161583!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19001a0b9b2f%3A0x3ff2bf6519e05c39!2sPacific%20Spa%20%26%20Health%20Club!5e0!3m2!1sen!2snp!4v1780047325538!5m2!1sen!2snp"
                width="100%"
                height="360"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="J&N Caregiver Training location"
              />
            </div>
          </div>

          {/* Right: lead form */}
          <div className="bg-jn-bg-off p-8 md:p-10 rounded-[24px] shadow-sm border border-jn-border">
            <h3 className="jn-heading-3 mb-6">{t("contact.form.title")}</h3>
            <p className="text-jn-text-muted mb-8">
              {t("contact.form.sub")}
            </p>
            <LeadForm locale={l} />
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <CtaBand locale={l} />
    </>
  );
}
