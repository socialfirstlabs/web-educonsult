import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, BookOpen, Globe, CheckCircle } from "lucide-react";
import { getT, type Locale } from "@/lib/i18n";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = getT(locale);
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center bg-gradient-to-r from-blue-900 to-indigo-800 text-white">
        <div className="container px-4 text-center z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            {t("home.heroTitle")}
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-blue-100">
            {t("home.heroSubtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/${locale}/contact`}>
              <Button
                size="lg"
                className="bg-white text-blue-900 hover:bg-blue-50 text-lg px-8 py-6"
              >
                {t("cta.freeCounseling")}
              </Button>
            </Link>
            <Link href={`/${locale}/language-classes`}>
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-white/10 text-lg px-8 py-6"
              >
                {t("cta.viewCourses")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-background">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">{t("home.coreServices")}</h2>
            <div className="w-24 h-1 bg-primary mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Globe className="w-12 h-12 text-primary mb-4" />
                <CardTitle>{t("home.services.studyInJapan.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                {t("home.services.studyInJapan.desc")}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <BookOpen className="w-12 h-12 text-primary mb-4" />
                <CardTitle>{t("home.services.languageClasses.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                {t("home.services.languageClasses.desc")}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <GraduationCap className="w-12 h-12 text-primary mb-4" />
                <CardTitle>{t("home.services.visaDocumentation.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                {t("home.services.visaDocumentation.desc")}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Japan */}
      <section className="py-20 bg-muted/50">
        <div className="container px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">{t("home.whyJapan.title")}</h2>
            <ul className="space-y-4">
              {[
                t("home.whyJapan.items.1"),
                t("home.whyJapan.items.2"),
                t("home.whyJapan.items.3"),
                t("home.whyJapan.items.4"),
                t("home.whyJapan.items.5"),
                t("home.whyJapan.items.6"),
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle className="text-green-500" size={20} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link href={`/${locale}/study-in-japan`} className="inline-block mt-8">
              <Button variant="link" className="p-0 text-primary font-bold">
                {t("cta.learnMoreJapan")}
              </Button>
            </Link>
          </div>
          <div className="aspect-video bg-blue-100 rounded-2xl overflow-hidden flex items-center justify-center border-4 border-white shadow-xl">
            <span className="text-blue-400 font-bold italic">
              {t("home.heroPlaceholder")}
            </span>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground text-center">
        <div className="container px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t("home.cta.title")}
          </h2>
          <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
            {t("home.cta.subtitle")}
          </p>
          <Link href={`/${locale}/contact`}>
            <Button
              size="lg"
              variant="secondary"
              className="px-10 py-6 text-lg"
            >
              {t("cta.bookCounseling")}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
