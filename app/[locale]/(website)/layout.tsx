import Navbar from "@/components/website/Navbar";
import Footer from "@/components/website/Footer";
import { ApplyModalProvider } from "@/components/website/ApplyModal";
import type { Locale } from "@/lib/i18n";

export default async function WebsiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale = locale as Locale;

  return (
    <ApplyModalProvider locale={safeLocale}>
      <div className="flex flex-col min-h-screen">
        <Navbar locale={safeLocale} />
        <main className="flex-1 pt-20">{children}</main>
        <Footer locale={safeLocale} />
      </div>
    </ApplyModalProvider>
  );
}
