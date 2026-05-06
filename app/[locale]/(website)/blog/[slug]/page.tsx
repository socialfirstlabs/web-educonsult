import { getBlogPostBySlug } from '@/lib/actions/blog.action';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import Image from 'next/image';
import type { Locale } from "@/lib/i18n";
import sanitizeHtml from 'sanitize-html';

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
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{localizedPost.title}</h1>
        <div className="flex items-center gap-4 text-muted-foreground pb-8 border-b">
           <span>{format(new Date(post.published_at || post.created_at), 'MMMM d, yyyy')}</span>
           <span>•</span>
           <span className="font-medium text-primary uppercase text-xs tracking-widest">Guide</span>
        </div>
      </header>

      {localizedPost.image_url && (
        <div className="aspect-video mb-12 rounded-3xl overflow-hidden border shadow-sm relative">
           <Image 
              src={localizedPost.image_url} 
              alt={localizedPost.title} 
              fill 
              sizes="100vw"
              className="object-cover" 
              priority
            />
        </div>
      )}

      <div className="prose prose-lg max-w-none prose-slate">
        {/* Render content - assuming HTML stored in Supabase. For security, sanitize in production. */}
        <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(localizedPost.content, {
          allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img', 'iframe' ]),
          allowedAttributes: {
            ...sanitizeHtml.defaults.allowedAttributes,
            '*': ['class'],
            'img': ['src', 'alt', 'title', 'width', 'height'],
            'iframe': ['src', 'width', 'height', 'frameborder', 'allow', 'allowfullscreen']
          },
          allowedIframeHostnames: ['www.youtube.com', 'player.vimeo.com']
        }) }} />
      </div>

      <footer className="mt-16 pt-8 border-t border-slate-100">
        <div className="bg-slate-50 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl">
            {post.author_name?.charAt(0) || 'E'}
          </div>
          <div className="flex-1">
            <p className="text-xs uppercase tracking-widest font-bold text-primary mb-1">About the Author</p>
            <h3 className="text-xl font-bold mb-2">{post.author_name || 'EduNepal Team'}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Expert education consultants at EduNepal, dedicated to helping students achieve their international education goals with professional guidance and support.
            </p>
          </div>
        </div>
      </footer>
    </article>
  );
}
