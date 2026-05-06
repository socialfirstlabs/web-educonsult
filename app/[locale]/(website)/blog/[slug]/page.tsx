import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import Image from 'next/image';
import type { Locale } from "@/lib/i18n";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const safeLocale = locale as Locale;
  const supabase = await createClient();
  
  if (!supabase) return <div className="container py-20 px-4">Supabase configuration missing.</div>;

  const { data: post } = await supabase
    .from('blog_posts')
    .select('*, translations:blog_translations(locale,title,slug,excerpt,content)')
    .eq('slug', slug)
    .single();

  if (!post) notFound();

  const translation = post.translations?.find(
    (item: { locale: string }) => item.locale === safeLocale
  );
  const { translations: _translations, ...base } = post;
  void _translations;
  const localizedPost = translation
    ? (() => {
        const { locale: __locale, ...translatedFields } = translation;
        void __locale;
        return { ...base, ...translatedFields };
      })()
    : base;

  return (
    <article className="container py-20 px-4 max-w-4xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{localizedPost.title}</h1>
        <div className="flex items-center gap-4 text-muted-foreground pb-8 border-b">
           <span>{format(new Date(post.published_at || post.created_at), 'MMMM d, yyyy')}</span>
           <span>•</span>
           <span className="font-medium text-primary uppercase text-xs tracking-widest">Guide</span>
        </div>
      </div>

      {localizedPost.image_url && (
        <div className="aspect-video mb-12 rounded-3xl overflow-hidden border shadow-sm relative">
           <Image 
             src={localizedPost.image_url} 
             alt={localizedPost.title} 
             fill 
             className="object-cover" 
             priority
           />
        </div>
      )}

      <div className="prose prose-lg max-w-none prose-slate">
        {/* Render content - assuming HTML stored in Supabase. For security, sanitize in production. */}
        <div dangerouslySetInnerHTML={{ __html: localizedPost.content }} />
      </div>
    </article>
  );
}
