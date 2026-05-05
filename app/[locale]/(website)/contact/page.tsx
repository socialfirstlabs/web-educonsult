import { LeadForm } from "@/components/website/LeadForm";
import { getPublishedCourses } from "@/lib/actions/course.action";
import { getT, type Locale } from "@/lib/i18n";

export const metadata = {
  title: "Contact Us | EduNepal Consultancy",
  description:
    "Get free counseling for your study abroad dreams. Contact us for Japanese language classes and visa processing.",
};

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = getT(locale);
  const courses = await getPublishedCourses(locale);

  return (
    <div className="container py-20 px-4">
      <div className="mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t("contact.title")}</h1>
          <p className="text-xl text-muted-foreground">{t("contact.subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-6">{t("contact.freeCounselingTitle")}</h2>
            <p className="mb-8 text-muted-foreground">{t("contact.freeCounselingDesc")}</p>
            <LeadForm courses={courses} locale={locale} />
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-4">{t("contact.officeTitle")}</h3>
              <p className="text-muted-foreground">
                {t("contact.officeAddress").split("\n").map((line) => (
                  <span key={line}>
                    {line}
                    <br />
                  </span>
                ))}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">{t("contact.phoneEmailTitle")}</h3>
              <p className="text-muted-foreground">
                {t("contact.phoneEmailValue").split("\n").map((line) => (
                  <span key={line}>
                    {line}
                    <br />
                  </span>
                ))}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">{t("contact.hoursTitle")}</h3>
              <p className="text-muted-foreground">
                {t("contact.hoursValue").split("\n").map((line) => (
                  <span key={line}>
                    {line}
                    <br />
                  </span>
                ))}
              </p>
            </div>
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d56502.18050881408!2d85.3144914!3d27.7362292!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x666f85d4555c2d43%3A0xe068e8cb2a545cc3!2sJLCC%2C%20Kathmandu%20(Japanese%20Language%20%26%20Culture%20Centre%2C%20Kathmandu)!5e0!3m2!1sen!2snp!4v1773389899650!5m2!1sen!2snp"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
