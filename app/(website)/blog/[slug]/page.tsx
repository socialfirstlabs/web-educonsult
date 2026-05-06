import { getBlogPostBySlug } from '@/lib/actions/blog.action';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import Image from 'next/image';
import { FEATURE_FLAGS, SITE_CONFIG } from '@/lib/constants';
import Link from 'next/link';
import { ChevronRight, Calendar, User, Clock } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) return { title: "Post Not Found" };

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.published_at || post.created_at,
      authors: [post.author_name || 'EduNepal Team'],
      images: [post.image_url],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.image_url],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  if (!FEATURE_FLAGS.ENABLE_BLOG) {
    notFound();
  }

  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post || !post.is_published) notFound();

  // Calculate reading time (simple estimation: 200 words per minute)
  const wordCount = post.content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "image": post.image_url,
    "datePublished": post.published_at || post.created_at,
    "dateModified": post.published_at || post.created_at,
    "author": [{
      "@type": "Organization",
      "name": post.author_name || "EduNepal Team",
      "url": SITE_CONFIG.url
    }],
    "description": post.excerpt,
    "publisher": {
      "@type": "Organization",
      "name": SITE_CONFIG.name,
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_CONFIG.url}/favicon.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${SITE_CONFIG.url}/blog/${post.slug}`
    }
  };

  return (
    <article className="container py-12 px-4 max-w-4xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8 overflow-x-auto whitespace-nowrap pb-2">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight size={14} />
        <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
        <ChevronRight size={14} />
        <span className="text-foreground truncate max-w-[200px]">{post.title}</span>
      </nav>

      <header className="mb-10 text-center md:text-left">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-6 leading-[1.15] tracking-tight text-slate-900">
          {post.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-y-4 gap-x-6 text-sm text-muted-foreground py-6 border-y border-slate-100 mb-10">
           <div className="flex items-center gap-2">
             <User size={16} className="text-primary/70" />
             <span className="font-medium text-slate-700">{post.author_name || 'EduNepal Team'}</span>
           </div>
           <div className="flex items-center gap-2">
             <Calendar size={16} className="text-primary/70" />
             <span>{format(new Date(post.published_at || post.created_at), 'MMMM d, yyyy')}</span>
           </div>
           <div className="flex items-center gap-2">
             <Clock size={16} className="text-primary/70" />
             <span>{readingTime} min read</span>
           </div>
        </div>
      </header>

      {post.image_url && (
        <div className="aspect-video mb-12 rounded-[2rem] overflow-hidden border shadow-xl shadow-slate-200/50 relative">
           <Image 
             src={post.image_url} 
             alt={post.title} 
             fill 
             className="object-cover" 
             priority
           />
        </div>
      )}

      <div className="prose prose-lg max-w-none prose-slate prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary hover:prose-a:underline prose-img:rounded-2xl">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
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
