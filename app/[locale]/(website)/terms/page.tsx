import { getT, type Locale } from "@/lib/i18n";
import Link from "next/link";

export const metadata = {
  title: "Terms & Privacy Policy | J&N Caregiver Training",
  description:
    "Terms of service and privacy policy for J&N Caregiver Training Co. Ltd.",
};

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getT(locale as Locale);
  const l = locale as Locale;

  return (
    <section className="jn-section bg-white">
      <div className="jn-container max-w-3xl mx-auto">
        <h1 className="jn-heading-1 mb-6 mt-2">
          {t("footer.company.terms")}
        </h1>

        <p className="jn-body-text mb-8">{t("terms.intro")}</p>

        <div className="bg-jn-bg-off border border-jn-border rounded-2xl p-8 space-y-6 mb-10">
          <div>
            <h2 className="jn-heading-3 mb-2">{t("terms.data.title")}</h2>
            <p className="text-jn-text-muted">{t("terms.data.body")}</p>
          </div>

          <div>
            <h2 className="jn-heading-3 mb-2">{t("terms.cookies.title")}</h2>
            <p className="text-jn-text-muted">{t("terms.cookies.body")}</p>
          </div>

          <div>
            <h2 className="jn-heading-3 mb-2">{t("terms.contact.title")}</h2>
            <p className="text-jn-text-muted">{t("terms.contact.body")}</p>
            <p className="mt-2 font-medium text-jn-text-dark">
              info@jncaregiver.com
            </p>
          </div>
        </div>

        <Link href={`/${l}/contact`} className="jn-btn jn-btn-outline">
          {t("terms.contact.cta")}
        </Link>
      </div>
    </section>
  );
}
