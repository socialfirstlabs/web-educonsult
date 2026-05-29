import Link from "next/link";
import Image from "next/image";
import FaqAccordion from "@/components/website/FaqAccordion";
import CtaBand from "@/components/website/CtaBand";
import ApplyButton from "@/components/website/ApplyButton";
import StatsSection from "@/components/website/StatsSection";
import { getT, type Locale } from "@/lib/i18n";
import { getBlogPosts } from "@/lib/actions/blog.action";
import { getPublishedSuccessStories } from "@/lib/actions/success-story.action";
import { getPublishedCourses } from "@/lib/actions/course.action";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const isJa = (await params).locale === "ja";
  return {
    title: isJa
      ? "J&N介護士研修 | 日本への道"
      : "J&N Caregiver Training | Your Pathway to Japan",
    description: isJa
      ? "ネパール人専門家のための認定介護士養成コース。認定資格・語学指導・日本の雇用主との面接保証。"
      : "Accredited caregiver training for Nepali professionals. Recognized certification, language coaching, and guaranteed employer interviews for Japan.",
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getT(locale);
  const l = locale as Locale;

  const trustItems = [
    { icon: "✓", title: t("home.trust.1.title"), sub: t("home.trust.1.sub") },
    { icon: "🌐", title: t("home.trust.2.title"), sub: t("home.trust.2.sub") },
    { icon: "🏆", title: t("home.trust.3.title"), sub: t("home.trust.3.sub") },
    { icon: "🏠", title: t("home.trust.4.title"), sub: t("home.trust.4.sub") },
  ];

  const japanItems = [
    { icon: "💴", title: t("home.japan.i1.title"), desc: t("home.japan.i1.desc") },
    { icon: "🏥", title: t("home.japan.i2.title"), desc: t("home.japan.i2.desc") },
    { icon: "🏠", title: t("home.japan.i3.title"), desc: t("home.japan.i3.desc") },
    { icon: "📈", title: t("home.japan.i4.title"), desc: t("home.japan.i4.desc") },
  ];

  const stats = [
    { value: "200K+", label: t("home.stats.1.label") },
    { value: "500+", label: t("home.stats.2.label") },
    { value: "40+", label: t("home.stats.3.label") },
    { value: "92%", label: t("home.stats.4.label") },
  ];

  const pathwaySteps = [
    { step: "1", icon: "📝", title: t("home.pathway.s1.title"), desc: t("home.pathway.s1.desc") },
    { step: "2", icon: "📚", title: t("home.pathway.s2.title"), desc: t("home.pathway.s2.desc") },
    { step: "3", icon: "🏅", title: t("home.pathway.s3.title"), desc: t("home.pathway.s3.desc") },
    { step: "4", icon: "🤝", title: t("home.pathway.s4.title"), desc: t("home.pathway.s4.desc") },
    { step: "5", icon: "✈️", title: t("home.pathway.s5.title"), desc: t("home.pathway.s5.desc") },
  ];

  const programs = await getPublishedCourses(l);

  const dbStories = await getPublishedSuccessStories(l);
  const testimonials = dbStories.slice(0, 3).map((s) => ({
    initials: s.student_name.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase(),
    name: s.student_name,
    role: [s.company_name, s.destination].filter(Boolean).join(" · "),
    quote: s.testimonial ?? "",
    image_url: s.image_url ?? null,
  }));

  const latestPosts = await getBlogPosts(true, 3);
  const blogPosts = latestPosts.map((post) => {
    const jaTranslation = post.translations?.find(
      (tr: { locale: string }) => tr.locale === "ja"
    );
    const localized = l === "ja" && jaTranslation ? jaTranslation : null;
    const title = localized?.title || post.title;
    const excerpt = localized?.excerpt || post.excerpt || "";
    const slug = localized?.slug || post.slug;
    const date = post.published_at
      ? new Date(post.published_at).toLocaleDateString(l === "ja" ? "ja-JP" : "en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "";
    return {
      img: post.image_url || "https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=600&auto=format&fit=crop",
      tags: (post as { tags?: string[] }).tags ?? [],
      date,
      title,
      desc: excerpt,
      href: `/${l}/blog/${slug}`,
    };
  });

  const faqItems = [
    { question: t("home.faq.q1"), answer: t("home.faq.a1") },
    { question: t("home.faq.q2"), answer: t("home.faq.a2") },
    { question: t("home.faq.q3"), answer: t("home.faq.a3") },
    { question: t("home.faq.q4"), answer: t("home.faq.a4") },
  ];

  return (
    <>
      {/* HERO */}
      <section className="pb-24 overflow-hidden bg-gradient-to-br from-jn-bg-off to-jn-primary-light">
        <div className="jn-container grid grid-cols-1 lg:grid-cols-2 gap-16 gap-y-8 items-center pt-12">
          {/* Text — DOM-first so it lands in the left column on desktop with no order override needed */}
          <div className="max-w-[580px] order-2 lg:order-none">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white text-jn-primary font-[family-name:var(--font-poppins)] text-[0.85rem] font-semibold rounded-full mb-6 shadow-sm border border-jn-primary-light">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              {t("home.hero.badge")}
            </span>
            <h1 className="jn-heading-1 mb-6">
              {t("home.hero.title")}
            </h1>
            <p className="jn-body-text leading-[1.8] mb-9">
              {t("home.hero.body")}
            </p>
            <div className="flex gap-4 flex-wrap justify-center lg:justify-start">
              <ApplyButton className="jn-btn jn-btn-primary">{t("home.hero.cta1")}</ApplyButton>
              <Link href="#japan" className="jn-btn jn-btn-outline">{t("home.hero.cta2")}</Link>
            </div>
          </div>
          {/* Image — DOM-second (right column on desktop); order-1 pulls it above text on mobile only */}
          <div className="relative order-1 lg:order-none">
            <Image
              src="/images/hero-img.png"
              alt="Caregiver assisting elderly"
              width={600}
              height={600}
              className="w-full h-[260px] sm:h-[360px] lg:h-[600px] object-cover rounded-3xl"
              style={{ boxShadow: "0 20px 40px -10px rgba(36,62,188,0.1)" }}
            />
            <div className="absolute bottom-12 -left-8 bg-white/95 backdrop-blur-sm p-5 px-6 rounded-2xl shadow-xl hidden lg:flex items-center gap-4 border border-jn-border z-10">
              <div className="w-12 h-12 bg-jn-accent-light text-jn-accent-dark rounded-full flex items-center justify-center text-2xl">🤝</div>
              <div>
                <h4 className="text-base font-semibold font-[family-name:var(--font-poppins)]">{t("home.hero.floatTitle")}</h4>
                <p className="text-[0.85rem] text-jn-text-muted">{t("home.hero.floatSub")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <div className="relative z-20 -mt-16 px-4 md:px-0">
        <div className="jn-container max-w-6xl mx-auto">
          <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-[0_10px_40px_-10px_rgba(36,62,188,0.12)] border border-white/60 p-6 md:p-8 flex justify-center lg:justify-between items-center flex-wrap gap-x-12 gap-y-8">
            {trustItems.map((item, i) => (
              <div key={item.title} data-reveal data-reveal-delay={String(i + 1)} className="flex items-center gap-4 group cursor-default transition-transform duration-300 hover:-translate-y-1.5">
                <div aria-hidden="true" className="w-14 h-14 flex items-center justify-center bg-jn-primary-light text-jn-primary rounded-2xl shadow-sm transition-all duration-300 group-hover:bg-jn-primary group-hover:text-white group-hover:shadow-md group-hover:-rotate-3 text-xl font-bold">
                  {item.icon}
                </div>
                <div className="flex flex-col">
                  <span className="text-jn-text-dark font-[family-name:var(--font-poppins)] font-bold text-[1.05rem] leading-tight group-hover:text-jn-primary transition-colors">{item.title}</span>
                  <span className="text-jn-text-muted text-[0.9rem] leading-tight font-medium mt-0.5">{item.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* WHY JAPAN */}
      <section id="japan" className="jn-section bg-white">
        <div className="jn-container">
          <div data-reveal className="text-center max-w-[700px] mx-auto mb-16">
            <span className="jn-section-label">{t("home.japan.label")}</span>
            <h2 className="jn-heading-2">{t("home.japan.title")}</h2>
            <p className="jn-body-text">{t("home.japan.body")}</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            <div data-reveal>
              <Image
                src="/images/home-2.png"
                alt="Beautiful Japan scenery"
                width={680}
                height={510}
                className="w-full h-auto rounded-3xl shadow-lg"
              />
            </div>
            <div className="grid gap-8">
              {japanItems.map((item, i) => (
                <div key={item.title} data-reveal data-reveal-delay={String(i + 1)} className="flex gap-5">
                  <div aria-hidden="true" className="w-14 h-14 bg-white border border-jn-primary-light text-jn-primary shadow-sm rounded-2xl flex items-center justify-center text-2xl shrink-0">{item.icon}</div>
                  <div>
                    <h4 className="text-xl mb-2 text-jn-text-dark font-[family-name:var(--font-poppins)] font-semibold">{item.title}</h4>
                    <p className="text-[1.05rem] text-jn-text-muted">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <StatsSection stats={stats} />

      {/* PATHWAY */}
      <section id="process" className="jn-section bg-white">
        <div className="jn-container">
          <div data-reveal className="text-center max-w-[700px] mx-auto mb-16">
            <span className="jn-section-label">{t("home.pathway.label")}</span>
            <h2 className="jn-heading-2">{t("home.pathway.title")}</h2>
            <p className="jn-body-text">{t("home.pathway.body")}</p>
          </div>
          <div className="flex flex-col lg:flex-row justify-between relative mt-16 gap-10 lg:gap-0">
            <div className="hidden lg:block absolute top-10 left-[5%] w-[90%] h-0.5 bg-jn-border z-0" />
            {pathwaySteps.map((s, i) => (
              <div key={s.step} data-reveal data-reveal-delay={String(i + 1)} className="relative z-10 text-center w-full lg:w-[18%] flex flex-col items-center group">
                <div aria-hidden="true" className="w-20 h-20 bg-white border-2 border-jn-border text-jn-primary rounded-full mb-5 flex items-center justify-center text-[2rem] shadow-sm transition-all duration-300 group-hover:border-jn-accent group-hover:bg-jn-accent-light group-hover:text-jn-accent-dark group-hover:scale-105">
                  {s.icon}
                </div>
                <h4 className="text-[1.1rem] font-semibold mb-2 font-[family-name:var(--font-poppins)]">{s.step}. {s.title}</h4>
                <p className="text-[0.9rem] text-jn-text-muted">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROGRAMS */}
      <section id="programs" className="jn-section bg-jn-bg-off">
        <div className="jn-container">
          <div data-reveal className="text-center max-w-[700px] mx-auto mb-10">
            <span className="jn-section-label">{t("home.programs.label")}</span>
            <h2 className="jn-heading-2">{t("home.programs.title")}</h2>
            <p className="jn-body-text">{t("home.programs.body")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            {programs.length === 0 ? (
              <p className="col-span-3 text-center text-jn-text-muted py-10 italic">
                {t("courses.empty")}
              </p>
            ) : programs.map((p, i) => {
              const featured = !!p.badge;
              return (
                <div
                  key={p.id}
                  data-reveal
                  data-reveal-delay={String((i % 3) + 1)}
                  className={`bg-white rounded-[24px] shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-1.5 flex flex-col group relative ${
                    featured ? "border-2 border-jn-accent" : "border border-jn-border hover:shadow-[0_20px_40px_-10px_rgba(36,62,188,0.1)]"
                  }`}
                >
                  {featured && (
                    <span className="absolute top-4 right-4 bg-jn-accent text-jn-text-dark text-xs font-[family-name:var(--font-poppins)] font-bold px-3 py-1.5 rounded-full uppercase z-10 shadow-sm">
                      {p.badge}
                    </span>
                  )}
                  <div className={`h-[140px] overflow-hidden border-b border-jn-border flex items-center justify-center ${!p.image_url ? (featured ? "bg-jn-accent-light" : "bg-jn-bg-off group-hover:bg-jn-primary-light transition-colors duration-300") : ""}`}>
                    {p.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.image_url as string}
                        alt={p.title as string}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <span className="text-5xl select-none">{(p.icon as string) || "📚"}</span>
                    )}
                  </div>
                  <div className="p-8 flex-grow flex flex-col">
                    <div className="text-[0.85rem] font-semibold text-jn-primary uppercase tracking-wider mb-3 font-[family-name:var(--font-poppins)]">{p.duration as string}</div>
                    <h3 className="jn-heading-3 mb-3">{p.title as string}</h3>
                    <p className="text-[0.95rem] text-jn-text-muted mb-6 flex-grow">{p.description as string}</p>
                    <ApplyButton className="inline-flex items-center justify-start gap-1.5 w-full mt-auto text-jn-primary font-[family-name:var(--font-poppins)] font-semibold text-[0.95rem] hover:text-jn-primary-dark transition-colors group/btn">
                      {t("home.programs.applyNow")}
                      <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                    </ApplyButton>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="success" className="jn-section bg-white">
        <div className="jn-container">
          <div data-reveal className="text-center max-w-[700px] mx-auto mb-10">
            <span className="jn-section-label">{t("home.testimonials.label")}</span>
            <h2 className="jn-heading-2">{t("home.testimonials.title")}</h2>
            <p className="jn-body-text">{t("home.testimonials.body")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            {testimonials.length === 0 ? (
              <p className="col-span-3 text-center text-jn-text-muted py-10 italic">
                {t("successStories.empty")}
              </p>
            ) : testimonials.map((item, i) => (
              <div key={item.name} data-reveal data-reveal-delay={String((i % 3) + 1)} className="bg-white p-8 rounded-[24px] shadow-sm border border-jn-border flex flex-col">
                <div className="text-jn-accent text-xl mb-4 tracking-wide" aria-label="5 out of 5 stars" role="img">★★★★★</div>
                <p className="text-[1.05rem] text-jn-text-dark italic mb-6 flex-grow line-clamp-5">&ldquo;{item.quote}&rdquo;</p>
                <div className="flex items-center gap-4">
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover border border-jn-border"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-jn-primary-light text-jn-primary flex items-center justify-center font-[family-name:var(--font-poppins)] font-semibold text-base shrink-0">
                      {item.initials}
                    </div>
                  )}
                  <div>
                    <h4 className="text-base font-semibold font-[family-name:var(--font-poppins)] text-jn-text-dark">{item.name}</h4>
                    <p className="text-[0.85rem] text-jn-text-muted">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG PREVIEW */}
      <section id="blog" className="jn-section bg-jn-bg-off relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-jn-primary/5 blur-3xl" />
          <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-jn-accent/10 blur-3xl" />
        </div>
        <div className="jn-container relative z-10">
          <div data-reveal className="text-center max-w-[700px] mx-auto mb-16">
            <span className="jn-section-label">{t("home.blog.label")}</span>
            <h2 className="jn-heading-2">{t("home.blog.title")}</h2>
            <p className="jn-body-text">{t("home.blog.body")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post, i) => (
              <Link key={i} href={post.href} className="group" data-reveal data-reveal-delay={String((i % 3) + 1)}>
                <article className="bg-white rounded-2xl shadow-sm border border-jn-border overflow-hidden transition-all duration-300 hover:shadow-[var(--shadow-jn-float)] hover:-translate-y-1 flex flex-col h-full">
                  <div className="h-56 overflow-hidden relative rounded-t-2xl bg-jn-primary-light">
                    <Image
                      src={post.img}
                      alt={post.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {post.date && (
                        <span className="text-sm text-jn-text-muted font-medium">{post.date}</span>
                      )}
                      {post.tags.length > 0 && (
                        <>
                          {post.date && <span className="text-jn-border">•</span>}
                          <div className="flex flex-wrap gap-1">
                            {post.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 rounded-full text-[0.7rem] font-semibold bg-jn-primary-light text-jn-primary uppercase tracking-wide"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold mb-3 font-[family-name:var(--font-poppins)] text-jn-text-dark group-hover:text-jn-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    {post.desc && (
                      <p className="text-jn-text-muted text-[0.95rem] mb-6 line-clamp-3 flex-grow">{post.desc}</p>
                    )}
                    <span className="inline-flex items-center gap-1 font-[family-name:var(--font-poppins)] font-semibold text-jn-primary group-hover:gap-2 transition-all mt-auto">
                      {t("home.blog.readMore")} <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
          <div className="text-center mt-14">
            <Link href={`/${l}/blog`} className="jn-btn jn-btn-outline border-jn-border text-jn-text-dark hover:border-jn-primary hover:text-jn-primary hover:bg-jn-primary-light/50">
              {t("home.blog.viewAll")}
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="jn-section bg-jn-primary relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-white/5 blur-[100px]" />
          <div className="absolute bottom-[0%] -right-[10%] w-[40%] h-[60%] rounded-full bg-jn-accent/20 blur-[100px]" />
        </div>
        <div className="jn-container relative z-10">
          <div className="text-center max-w-[700px] mx-auto mb-12">
            <span className="inline-block font-[family-name:var(--font-poppins)] text-sm font-semibold text-jn-primary uppercase tracking-widest mb-3 bg-white px-4 py-1.5 rounded-full shadow-sm">
              {t("home.faq.label")}
            </span>
            <h2 className="jn-heading-2 text-white mb-6">{t("home.faq.title")}</h2>
            <p className="text-jn-primary-light/90 text-lg">{t("home.faq.body")}</p>
          </div>
          <FaqAccordion items={faqItems} />
        </div>
      </section>

      {/* CTA BAND */}
      <CtaBand locale={l} />
    </>
  );
}
