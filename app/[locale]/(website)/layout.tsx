import Navbar from "@/components/website/Navbar";
import Footer from "@/components/website/Footer";
import { ApplyModalProvider } from "@/components/website/ApplyModal";
import { getServices } from "@/lib/actions/service.action";
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

  const allServices = await getServices(safeLocale);
  const navServices = allServices
    .filter((s) => s.is_active)
    .slice(0, 4)
    .map((s) => ({ title: s.title, tags: s.tags ?? null }));

  return (
    <ApplyModalProvider locale={safeLocale}>
      <div className="flex flex-col min-h-screen">
        <Navbar locale={safeLocale} services={navServices} />
        <main className="flex-1 pt-20">{children}</main>
        <Footer locale={safeLocale} />
      </div>
    </ApplyModalProvider>
  );
}
