import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { getT, type Locale } from "@/lib/i18n";

export const metadata = {
  title: "Study in Japan | EduNepal Consultancy",
  description: "Learn about the advantages of studying in Japan, visa process, costs, and work opportunities for Nepalese students.",
};

export default async function StudyInJapanPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale = locale as Locale;
  const t = getT(safeLocale);
  return (
    <div className="container py-20 px-4 space-y-20">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            {t("studyJapan.heroTitle")} <br />
            <span className="text-primary">{t("studyJapan.heroAccent")}</span>
          </h1>
          <p className="text-xl text-muted-foreground">{t("studyJapan.heroSubtitle")}</p>
          <div className="flex gap-4">
            <Link href={`/${safeLocale}/contact`}>
               <Button size="lg" className="px-8">{t("cta.freeCounseling")}</Button>
            </Link>
          </div>
        </div>
        <div className="flex-1 aspect-video bg-muted rounded-3xl flex items-center justify-center border-4 border-white shadow-xl">
             <span className="text-muted-foreground italic">{t("studyJapan.heroPlaceholder")}</span>
        </div>
      </div>

      {/* Advantages */}
      <section className="bg-muted/50 -mx-4 px-4 py-20 rounded-3xl">
        <div className="max-w-4xl mx-auto text-center mb-12">
           <h2 className="text-3xl font-bold mb-4">{t("studyJapan.advantagesTitle")}</h2>
           <p className="text-muted-foreground">{t("studyJapan.advantagesSubtitle")}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
           {[
             { title: t("studyJapan.advantages.1.title"), desc: t("studyJapan.advantages.1.desc") },
             { title: t("studyJapan.advantages.2.title"), desc: t("studyJapan.advantages.2.desc") },
             { title: t("studyJapan.advantages.3.title"), desc: t("studyJapan.advantages.3.desc") },
             { title: t("studyJapan.advantages.4.title"), desc: t("studyJapan.advantages.4.desc") },
             { title: t("studyJapan.advantages.5.title"), desc: t("studyJapan.advantages.5.desc") },
             { title: t("studyJapan.advantages.6.title"), desc: t("studyJapan.advantages.6.desc") }
           ].map((item, i) => (
             <Card key={i} className="border-none shadow-sm">
                <CardHeader>
                   <CardTitle className="text-lg flex items-center gap-2">
                      <CheckCircle2 className="text-primary" size={20} /> {item.title}
                   </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">{item.desc}</CardContent>
             </Card>
           ))}
        </div>
      </section>

      {/* Process */}
      <section className="space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">{t("studyJapan.processTitle")}</h2>
          <p className="text-muted-foreground">{t("studyJapan.processSubtitle")}</p>
        </div>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            { step: t("studyJapan.process.1.step"), title: t("studyJapan.process.1.title"), desc: t("studyJapan.process.1.desc") },
            { step: t("studyJapan.process.2.step"), title: t("studyJapan.process.2.title"), desc: t("studyJapan.process.2.desc") },
            { step: t("studyJapan.process.3.step"), title: t("studyJapan.process.3.title"), desc: t("studyJapan.process.3.desc") },
            { step: t("studyJapan.process.4.step"), title: t("studyJapan.process.4.title"), desc: t("studyJapan.process.4.desc") }
          ].map((item, i) => (
            <div key={i} className="relative p-6 border rounded-2xl bg-background shadow-sm hover:shadow-md transition-shadow">
               <div className="absolute -top-4 -left-4 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">{item.step}</div>
               <h3 className="text-xl font-bold mt-4 mb-2">{item.title}</h3>
               <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cost & Work */}
      <div className="grid md:grid-cols-2 gap-12 items-center border rounded-3xl p-8 md:p-12 bg-primary text-primary-foreground">
        <div>
           <h2 className="text-3xl font-bold mb-6">{t("studyJapan.costsTitle")}</h2>
           <div className="space-y-6">
              <p className="text-primary-foreground/90">{t("studyJapan.costsDesc")}</p>
              <ul className="space-y-3">
                 <li className="flex gap-2"><strong>{t("studyJapan.costs.workLimit")}:</strong> {t("studyJapan.costs.workLimitValue")}</li>
                 <li className="flex gap-2"><strong>{t("studyJapan.costs.hourlyWage")}:</strong> {t("studyJapan.costs.hourlyWageValue")}</li>
                 <li className="flex gap-2"><strong>{t("studyJapan.costs.expenses")}:</strong> {t("studyJapan.costs.expensesValue")}</li>
              </ul>
           </div>
        </div>
        <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm border border-white/20">
           <h3 className="text-xl font-bold mb-4">{t("studyJapan.ctaTitle")}</h3>
           <p className="mb-8 opacity-90">{t("studyJapan.ctaSubtitle")}</p>
           <Link href={`/${safeLocale}/contact`}>
              <Button variant="secondary" size="lg" className="w-full">{t("cta.bookFreeCounseling")}</Button>
           </Link>
        </div>
      </div>
    </div>
  );
}
