import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "404 — Page Not Found | J&N Caregiver Training",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-jn-bg-off to-jn-primary-light flex flex-col items-center justify-center px-4 py-24 text-center">
      {/* Logo */}
      <Link href="/en" className="mb-12 inline-block">
        <Image
          src="/images/JN_Logo.png"
          alt="J&N Caregiver Training"
          width={140}
          height={52}
          className="max-h-12 w-auto object-contain"
        />
      </Link>

      {/* 404 number */}
      <div
        className="font-[family-name:var(--font-poppins)] font-bold text-jn-primary leading-none mb-6 select-none"
        style={{ fontSize: "clamp(5rem,20vw,10rem)" }}
        aria-hidden="true"
      >
        404
      </div>

      {/* Heading */}
      <h1 className="font-[family-name:var(--font-poppins)] font-semibold text-jn-text-dark mb-4"
          style={{ fontSize: "clamp(1.5rem,4vw,2.25rem)", lineHeight: 1.2 }}>
        {/* EN */}Page not found
        {/* JP */}<span className="block text-[0.7em] text-jn-text-muted font-normal mt-1">ページが見つかりません</span>
      </h1>

      <p className="text-jn-text-muted text-lg mb-10 max-w-md">
        Sorry, we could not find the page you were looking for.
      </p>

      <div className="flex gap-4 flex-wrap justify-center">
        <Link
          href="/en"
          className="inline-flex items-center gap-2 px-7 py-3.5 bg-jn-primary text-white rounded-full font-[family-name:var(--font-poppins)] font-semibold text-[0.95rem] hover:bg-jn-primary-mid transition-colors shadow-md"
        >
          ← Back to Home (EN)
        </Link>
        <Link
          href="/ja"
          className="inline-flex items-center gap-2 px-7 py-3.5 border-2 border-jn-primary text-jn-primary rounded-full font-[family-name:var(--font-poppins)] font-semibold text-[0.95rem] hover:bg-jn-primary-light transition-colors"
        >
          ← ホームへ (JA)
        </Link>
      </div>
    </div>
  );
}
