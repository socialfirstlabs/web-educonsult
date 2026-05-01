import Link from "next/link";
import { Button } from "@/components/ui/button";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import { getServices } from "@/lib/actions/service.action";

export default async function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const services = await getServices();
  const activeServices = services?.filter((s) => s.is_active) || [];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <span className="inline-block font-bold text-xl">EduNepal</span>
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link
                href="/services"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Services
              </Link>
              <Link
                href="/language-classes"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Language Classes
              </Link>
              <Link
                href="/study-in-japan"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Study in Japan
              </Link>
              <Link
                href="/success-stories"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Success Stories
              </Link>
              <Link
                href="/blog"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Blog
              </Link>
              <Link
                href="/contact"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Contact
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link href="/contact">
              <Button>Apply Now</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t py-12 bg-muted/30">
        <div className="container grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-lg font-bold">EduNepal Consultancy</h3>
            <p className="text-sm text-muted-foreground">
              Helping students achieve their dreams of studying in Japan and
              mastering the Japanese language.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/study-in-japan"
                  className="hover:underline font-medium"
                >
                  Study in Japan
                </Link>
              </li>
              <li>
                <Link
                  href="/language-classes"
                  className="hover:underline font-medium"
                >
                  Language Classes
                </Link>
              </li>
              {activeServices.length > 0 ? (
                activeServices.slice(0, 4).map((service) => (
                  <li key={service.id}>
                    <Link
                      href={`/services#${service.id}`}
                      className="hover:underline"
                    >
                      {service.title}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li>
                    <Link href="/services" className="hover:underline">
                      Study Abroad Counseling
                    </Link>
                  </li>
                  <li>
                    <Link href="/services" className="hover:underline">
                      Visa Processing
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/blog" className="hover:underline">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/success-stories" className="hover:underline">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:underline">
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Contact Info</h3>
            <p className="text-sm text-muted-foreground">
              Kathmandu, Nepal
              <br />
              Phone: +977-1-4XXXXXX
              <br />
              Email: info@edunepal.com
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
