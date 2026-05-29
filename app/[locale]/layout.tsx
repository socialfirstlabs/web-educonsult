import { notFound } from "next/navigation";
import { isValidLocale } from "@/lib/i18n/config";
import LocaleSetter from "@/components/LocaleSetter";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  return (
    <>
      <LocaleSetter locale={locale} />
      {children}
    </>
  );
}
