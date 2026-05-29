"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { getT } from "@/lib/i18n";
import { localeConfig } from "@/lib/i18n/config";
import { useApplyModal } from "@/components/website/ApplyModal";

interface NavService {
  title: string;
  tags: string | null;
}

interface NavbarProps {
  locale: string;
  services?: NavService[];
}

export default function Navbar({ locale, services = [] }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLLIElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const t = getT(locale);
  const l = locale;
  const close = () => { setMobileOpen(false); setMobileServicesOpen(false); };
  const { openModal } = useApplyModal();

  // Language toggle: compute switched path
  const altLocale = locale === "en" ? "ja" : "en";
  const switchedPath = pathname.replace(new RegExp(`^/${locale}`), `/${altLocale}`);
  const altConfig = localeConfig[altLocale as "en" | "ja"];

  const fallbackIcons = ["🧭", "🗣️", "📄", "🤝"];

  const megaItems = services.length > 0
    ? services.map((s, i) => ({
        icon: fallbackIcons[i] ?? "🔹",
        title: s.title,
        tags: s.tags ? s.tags.split(",").map((tg) => tg.trim()).filter(Boolean) : [],
      }))
    : [
        { icon: "🧭", title: t("nav.menu.item1.title"), tags: [] },
        { icon: "🗣️", title: t("nav.menu.item2.title"), tags: [] },
        { icon: "📄", title: t("nav.menu.item3.title"), tags: [] },
        { icon: "🤝", title: t("nav.menu.item4.title"), tags: [] },
      ];

  const mobileServiceItems = services.length > 0
    ? services.map((s, i) => ({
        icon: fallbackIcons[i] ?? "🔹",
        label: s.title,
        tags: s.tags ? s.tags.split(",").map((tg) => tg.trim()).filter(Boolean) : [],
      }))
    : [
        { icon: "🧭", label: t("nav.menu.item1.title"), tags: [] },
        { icon: "🗣️", label: t("nav.menu.item2.title"), tags: [] },
        { icon: "📄", label: t("nav.menu.item3.title"), tags: [] },
        { icon: "🤝", label: t("nav.menu.item4.title"), tags: [] },
      ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-b transition-all duration-300 ${
        scrolled ? "shadow-sm border-jn-border" : "border-transparent"
      }`}
    >
      <div className="jn-container flex items-center justify-between h-20">
        {/* Logo */}
        <Link href={`/${l}`} className="flex items-center" onClick={close}>
          <Image
            src="/images/JN_Logo.png"
            alt="J & N Caregiver Training"
            width={120}
            height={44}
            className="max-h-11 w-[10rem] object-contain"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
          <li>
            <Link
              href={`/${l}#programs`}
              className="font-[family-name:var(--font-poppins)] text-jn-text-muted font-medium text-[0.95rem] hover:text-jn-primary transition-colors"
            >
              {t("nav.programs")}
            </Link>
          </li>

          {/* Services mega-menu */}
          <li
            ref={servicesRef}
            className="relative"
            onMouseEnter={() => setIsServicesOpen(true)}
            onMouseLeave={() => setIsServicesOpen(false)}
            onBlur={(e) => {
              if (!servicesRef.current?.contains(e.relatedTarget as Node)) {
                setIsServicesOpen(false);
              }
            }}
          >
            <Link
              href={`/${l}/services`}
              aria-expanded={isServicesOpen}
              aria-haspopup="true"
              onFocus={() => setIsServicesOpen(true)}
              onKeyDown={(e) => {
                if (e.key === "Escape") { setIsServicesOpen(false); }
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  const first = servicesRef.current?.querySelector<HTMLElement>('[data-megamenu-item]');
                  first?.focus();
                }
              }}
              className="font-[family-name:var(--font-poppins)] text-jn-text-muted font-medium text-[0.95rem] hover:text-jn-primary transition-colors inline-flex items-center gap-1"
            >
              {t("nav.services")}
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${isServicesOpen ? "rotate-180 text-jn-primary" : "text-jn-text-light"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Link>
            {/* Mega menu */}
            <div
              className={`hidden md:block absolute left-1/2 top-full mt-0 pt-5 w-[min(920px,92vw)] -translate-x-1/2 transition-all duration-300 ${
                isServicesOpen
                  ? "opacity-100 visible translate-y-0 pointer-events-auto"
                  : "opacity-0 invisible translate-y-2 pointer-events-none"
              }`}
            >
              <div className="bg-white backdrop-blur-xl rounded-3xl border border-jn-primary-light shadow-[0_20px_60px_-20px_rgba(36,62,188,0.35)] p-8">
                <div className="grid grid-cols-12 gap-8">
                  <div className="col-span-8">
                    <p className="text-[0.75rem] uppercase tracking-[0.18em] text-jn-primary font-[family-name:var(--font-poppins)] font-semibold mb-4">{t("nav.menu.serviceNavLabel")}</p>
                    <div className="grid grid-cols-2 gap-3">
                      {megaItems.map((item) => (
                        <Link
                          key={item.title}
                          href={`/${l}/services`}
                          data-megamenu-item
                          className="group/item rounded-xl border border-jn-border bg-jn-bg-off p-4
                                     hover:border-jn-primary hover:bg-jn-primary-light/50
                                     hover:shadow-[0_4px_16px_-4px_rgba(36,62,188,0.15)]
                                     transition-all duration-200 flex flex-col gap-2.5
                                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jn-primary"
                          onClick={close}
                          onKeyDown={(e) => { if (e.key === "Escape") { setIsServicesOpen(false); } }}
                        >
                          {/* Icon + title row */}
                          <div className="flex items-start gap-2">
                            <span className="text-xl leading-none mt-0.5 shrink-0">{item.icon}</span>
                            <p className="text-[0.88rem] font-[family-name:var(--font-poppins)] font-semibold text-jn-text-dark leading-snug group-hover/item:text-jn-primary transition-colors duration-150">
                              {item.title}
                            </p>
                          </div>

                          {/* Tags */}
                          {item.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {item.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="text-[0.65rem] font-semibold text-jn-primary bg-white border border-[#c7d0f5] px-2 py-[2px] rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* CTA */}
                          <p className="text-[0.75rem] text-jn-primary font-semibold mt-auto flex items-center gap-1
                                        opacity-0 group-hover/item:opacity-100 transition-opacity duration-150">
                            {t("nav.menu.openService")}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="col-span-4 rounded-2xl bg-gradient-to-br from-jn-primary to-jn-primary-mid text-white p-6 flex flex-col">
                    <p className="text-[0.75rem] uppercase tracking-[0.18em] text-white/80">{t("nav.menu.quickActions")}</p>
                    <h4 className="text-xl text-white mt-3 mb-2 font-[family-name:var(--font-poppins)]">{t("nav.menu.exploreTitle")}</h4>
                    <p className="text-[0.9rem] text-white/85 mb-5">{t("nav.menu.exploreDesc")}</p>
                    <Link href={`/${l}/services`} className="inline-flex items-center justify-center rounded-full bg-white text-jn-primary font-[family-name:var(--font-poppins)] font-semibold px-5 py-3 hover:bg-jn-accent hover:text-jn-text-dark transition-colors" onClick={close}>{t("nav.menu.viewAll")}</Link>
                    <Link href={`/${l}/contact`} className="mt-3 inline-flex items-center justify-center rounded-full border border-white/35 text-white font-[family-name:var(--font-poppins)] font-semibold px-5 py-3 hover:bg-white/10 transition-colors" onClick={close}>{t("nav.menu.book")}</Link>
                  </div>
                </div>
              </div>
            </div>
          </li>

          <li>
            <Link href={`/${l}/about`} className="font-[family-name:var(--font-poppins)] text-jn-text-muted font-medium text-[0.95rem] hover:text-jn-primary transition-colors">{t("nav.aboutUs")}</Link>
          </li>
          <li>
            <Link href={`/${l}/blog`} className="font-[family-name:var(--font-poppins)] text-jn-text-muted font-medium text-[0.95rem] hover:text-jn-primary transition-colors">{t("nav.blog")}</Link>
          </li>
          <li>
            <Link href={`/${l}/contact`} className="font-[family-name:var(--font-poppins)] text-jn-text-muted font-medium text-[0.95rem] hover:text-jn-primary transition-colors">{t("nav.contact")}</Link>
          </li>

          {/* Language Toggle */}
          <li>
            <Link
              href={switchedPath}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-jn-border text-jn-text-muted font-[family-name:var(--font-poppins)] text-[0.85rem] font-medium hover:border-jn-primary hover:text-jn-primary transition-colors"
              aria-label={`Switch to ${altConfig.label}`}
            >
              <span>{altConfig.flag}</span>
              <span>{altConfig.nativeLabel}</span>
            </Link>
          </li>

          <li>
            <button
              type="button"
              onClick={openModal}
              className="px-6 py-2.5 bg-jn-primary text-white rounded-full font-[family-name:var(--font-poppins)] font-medium hover:bg-jn-primary-mid transition-colors cursor-pointer"
            >
              {t("nav.enrollNow")}
            </button>
          </li>
        </ul>

        {/* Mobile right side: lang toggle + hamburger */}
        <div className="flex md:hidden items-center gap-3">
          <Link
            href={switchedPath}
            onClick={close}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-jn-border text-jn-text-muted text-[0.8rem] font-medium hover:border-jn-primary hover:text-jn-primary transition-colors"
            aria-label={`Switch to ${altConfig.label}`}
          >
            <span>{altConfig.flag}</span>
            <span className="hidden xs:inline">{altConfig.nativeLabel}</span>
          </Link>
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
            className="flex flex-col gap-[5px] cursor-pointer bg-transparent border-0 p-1"
          >
            <span className={`w-6 h-0.5 bg-jn-text-dark rounded-sm transition-transform duration-300 ${mobileOpen ? "translate-y-[7px] rotate-45" : ""}`} />
            <span className={`w-6 h-0.5 bg-jn-text-dark rounded-sm transition-opacity duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`w-6 h-0.5 bg-jn-text-dark rounded-sm transition-transform duration-300 ${mobileOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden flex flex-col bg-white px-6 py-6 shadow-2xl border-t border-jn-border gap-4 max-h-[calc(100vh-80px)] overflow-y-auto">
          <Link href={`/${l}#programs`} onClick={close} className="block w-full text-[1.05rem] text-jn-text-dark font-medium py-1 border-b border-jn-border/30 pb-3">{t("nav.programs")}</Link>

          <div className="border-b border-jn-border/30 pb-3">
            <div className="flex items-center justify-between">
              <Link href={`/${l}/services`} onClick={close} className="text-[1.05rem] text-jn-text-dark font-medium py-1">{t("nav.services")}</Link>
              <button type="button" onClick={() => setMobileServicesOpen((o) => !o)} className="p-2 text-jn-text-light hover:text-jn-primary" aria-label="Toggle services">
                <svg className={`w-5 h-5 transition-transform duration-300 ${mobileServicesOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            {mobileServicesOpen && (
              <div className="flex flex-col gap-3 mt-3 pl-4 border-l border-jn-border">
                {mobileServiceItems.map((item) => (
                  <Link key={item.label} href={`/${l}/services`} onClick={close} className="flex flex-col gap-1.5 py-2">
                    <span className="text-[0.95rem] font-semibold text-jn-text-dark">{item.icon} {item.label}</span>
                    {item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[0.68rem] font-semibold text-jn-primary bg-jn-primary-light border border-[#c7d0f5] px-2 py-[2px] rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                ))}
                <div className="pt-2 mt-2 border-t border-jn-border/50">
                  <Link href={`/${l}/services`} onClick={close} className="text-jn-primary font-semibold text-sm">{t("nav.menu.viewAll")} →</Link>
                </div>
              </div>
            )}
          </div>

          <Link href={`/${l}/about`} onClick={close} className="block w-full text-[1.05rem] text-jn-text-dark font-medium py-1 border-b border-jn-border/30 pb-3">{t("nav.aboutUs")}</Link>
          <Link href={`/${l}/blog`} onClick={close} className="block w-full text-[1.05rem] text-jn-text-dark font-medium py-1 border-b border-jn-border/30 pb-3">{t("nav.blog")}</Link>
          <Link href={`/${l}/contact`} onClick={close} className="block w-full text-[1.05rem] text-jn-text-dark font-medium py-1 border-b border-jn-border/30 pb-3">{t("nav.contact")}</Link>
          <button
            type="button"
            onClick={() => { close(); openModal(); }}
            className="w-full text-center px-6 py-3 bg-jn-primary text-white rounded-full font-[family-name:var(--font-poppins)] font-medium hover:bg-jn-primary-mid transition-colors cursor-pointer"
          >
            {t("nav.enrollNow")}
          </button>
        </div>
      )}
    </nav>
  );
}
