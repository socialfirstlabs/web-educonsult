import Link from "next/link";
import { Button } from "@/components/ui/button";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import { getServices } from "@/lib/actions/service.action";
import type { Locale } from "@/lib/i18n";
import { getT } from "@/lib/i18n";

export default async function WebsiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale = locale as Locale;
  const t = getT(safeLocale);
  const services = await getServices(safeLocale);
  const activeServices = services?.filter((s) => s.is_active) || [];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6 md:gap-10">
            <Link href={`/${safeLocale}`} className="flex items-center space-x-2">
              <span className="inline-block font-bold text-xl">EduNepal</span>
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link
                href={`/${safeLocale}/services`}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {t("nav.services")}
              </Link>
              <Link
                href={`/${safeLocale}/language-classes`}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {t("nav.languageClasses")}
              </Link>
              <Link
                href={`/${safeLocale}/study-in-japan`}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {t("nav.studyInJapan")}
              </Link>
              <Link
                href={`/${safeLocale}/success-stories`}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {t("nav.successStories")}
              </Link>
              <Link
                href={`/${safeLocale}/blog`}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {t("nav.blog")}
              </Link>
              <Link
                href={`/${safeLocale}/contact`}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {t("nav.contact")}
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link href={`/${safeLocale}/contact`}>
              <Button>{t("cta.applyNow")}</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t py-12 bg-muted/30">
        <div className="container grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-lg font-bold">{t("footer.brandTitle")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("footer.brandDesc")}
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-bold">{t("nav.services")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href={`/${safeLocale}/study-in-japan`}
                  className="hover:underline font-medium"
                >
                  {t("nav.studyInJapan")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${safeLocale}/language-classes`}
                  className="hover:underline font-medium"
                >
                  {t("nav.languageClasses")}
                </Link>
              </li>
              {activeServices.length > 0 ? (
                activeServices.slice(0, 4).map((service) => (
                  <li key={service.id}>
                    <Link
                      href={`/${safeLocale}/services#${service.id}`}
                      className="hover:underline"
                    >
                      {service.title}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li>
                    <Link href={`/${safeLocale}/services`} className="hover:underline">
                      {t("footer.servicesFallback1")}
                    </Link>
                  </li>
                  <li>
                    <Link href={`/${safeLocale}/services`} className="hover:underline">
                      {t("footer.servicesFallback2")}
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold">{t("footer.quickLinks")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`/${safeLocale}/blog`} className="hover:underline">
                  {t("nav.blog")}
                </Link>
              </li>
              <li>
                <Link href={`/${safeLocale}/success-stories`} className="hover:underline">
                  {t("nav.successStories")}
                </Link>
              </li>
              <li>
                <Link href={`/${safeLocale}/contact`} className="hover:underline">
                  {t("footer.contactUs")}
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:underline">
                  {t("footer.adminLogin")}
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-bold">{t("footer.contactInfoTitle")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("footer.contactInfoValue").split("\n").map((line) => (
                <span key={line}>
                  {line}
                  <br />
                </span>
              ))}
            </p>
          </div>
        </div>
        <div className="container mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} EduNepal Consultancy. All rights
          reserved.
        </div>
      </footer>
    </div>
  );
}
