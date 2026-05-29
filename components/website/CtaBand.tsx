"use client";

import Link from "next/link";
import { getT } from "@/lib/i18n";
import { useApplyModal } from "@/components/website/ApplyModal";

interface CtaBandProps {
  locale: string;
}

export default function CtaBand({ locale }: CtaBandProps) {
  const t = getT(locale);
  const { openModal } = useApplyModal();

  return (
    <section className="relative z-10 -mb-32 mt-16">
      <div className="jn-container">
        <div className="bg-gradient-to-r from-jn-primary to-jn-primary-mid rounded-[2.5rem] px-6 py-16 md:py-20 text-center shadow-2xl shadow-jn-primary/30 relative overflow-hidden border border-white/10">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-jn-accent/20 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

          <div className="relative z-10">
            <h2 className="jn-heading-2 text-white mb-6">{t("cta.band.title")}</h2>
            <p className="text-white/90 max-w-[600px] mx-auto text-[1.15rem] mb-10">
              {t("cta.band.body")}
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                type="button"
                onClick={openModal}
                className="jn-btn jn-btn-accent cursor-pointer"
              >
                {t("cta.band.apply")}
              </button>
              <Link
                href={`/${locale}/contact`}
                className="jn-btn !bg-transparent !text-white !border-white hover:!bg-white/10 hover:!border-white shadow-none"
              >
                {t("cta.band.book")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
