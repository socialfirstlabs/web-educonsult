"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  image_url?: string | null;
  published_at?: string | null;
  created_at?: string | null;
  tags?: string[] | null;
}

interface BlogGridProps {
  posts: Post[];
  locale: string;
  readMoreLabel: string;
  emptyLabel: string;
  filterAllLabel: string;
  filterLabel: string;
}

export default function BlogGrid({
  posts,
  locale,
  readMoreLabel,
  emptyLabel,
  filterAllLabel,
  filterLabel,
}: BlogGridProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    for (const post of posts) {
      for (const tag of post.tags ?? []) {
        set.add(tag);
      }
    }
    return [...set].sort();
  }, [posts]);

  const filtered = useMemo(
    () =>
      activeTag
        ? posts.filter((p) => p.tags?.includes(activeTag))
        : posts,
    [posts, activeTag],
  );

  const formatDate = (raw: string | null | undefined) => {
    if (!raw) return "";
    return new Date(raw).toLocaleDateString(
      locale === "ja" ? "ja-JP" : "en-US",
      { year: "numeric", month: "short", day: "numeric" },
    );
  };

  return (
    <>
      {/* Tag filter */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-10" role="group" aria-label={filterLabel}>
          <button
            type="button"
            onClick={() => setActiveTag(null)}
            className={`px-4 py-1.5 rounded-full text-[0.8rem] font-semibold font-[family-name:var(--font-poppins)] border transition-all duration-150 ${
              activeTag === null
                ? "bg-jn-primary text-white border-jn-primary shadow-sm"
                : "bg-white border-jn-border text-jn-text-muted hover:border-jn-primary hover:text-jn-primary"
            }`}
          >
            {filterAllLabel}
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag(tag === activeTag ? null : tag)}
              className={`px-4 py-1.5 rounded-full text-[0.8rem] font-semibold font-[family-name:var(--font-poppins)] border transition-all duration-150 uppercase tracking-wide ${
                activeTag === tag
                  ? "bg-jn-primary text-white border-jn-primary shadow-sm"
                  : "bg-white border-jn-border text-jn-text-muted hover:border-jn-primary hover:text-jn-primary"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-2xl border border-jn-border">
          <p className="text-jn-text-muted text-lg">{emptyLabel}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((post) => (
            <Link href={`/${locale}/blog/${post.slug}`} key={post.id} className="group">
              <article className="bg-white rounded-2xl shadow-sm border border-jn-border overflow-hidden transition-all duration-300 hover:shadow-[var(--shadow-jn-float)] hover:-translate-y-1 flex flex-col h-full">
                <div className="h-56 overflow-hidden relative rounded-t-2xl bg-jn-primary-light">
                  {post.image_url ? (
                    <Image
                      src={post.image_url}
                      alt={post.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-jn-text-light italic text-sm">
                      No image
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    {post.published_at && (
                      <span className="text-sm text-jn-text-muted font-medium">
                        {formatDate(post.published_at ?? post.created_at)}
                      </span>
                    )}
                    {(post.tags ?? []).length > 0 && (
                      <>
                        {post.published_at && <span className="text-jn-border">•</span>}
                        <div className="flex flex-wrap gap-1">
                          {(post.tags ?? []).map((tag) => (
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
                  {post.excerpt && (
                    <p className="text-jn-text-muted text-[0.95rem] mb-6 line-clamp-3 flex-grow">
                      {post.excerpt}
                    </p>
                  )}
                  <span className="inline-flex items-center gap-1 font-[family-name:var(--font-poppins)] font-semibold text-jn-primary group-hover:gap-2 transition-all mt-auto">
                    {readMoreLabel} <span aria-hidden="true">→</span>
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
