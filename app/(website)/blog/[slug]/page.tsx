import { getBlogPostBySlug } from '@/lib/actions/blog.action';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import Image from 'next/image';
import { FEATURE_FLAGS } from '@/lib/constants';

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  if (!FEATURE_FLAGS.ENABLE_BLOG) {
    notFound();
  }

  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post || !post.is_published) notFound();

  return (
    <article className="container py-20 px-4 max-w-4xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{post.title}</h1>
        <div className="flex items-center gap-4 text-muted-foreground pb-8 border-b">
           <span>{format(new Date(post.published_at || post.created_at), 'MMMM d, yyyy')}</span>
           <span>•</span>
           <span className="font-medium text-primary uppercase text-xs tracking-widest">Guide</span>
        </div>
      </div>

      {post.image_url && (
        <div className="aspect-video mb-12 rounded-3xl overflow-hidden border shadow-sm relative">
           <Image 
             src={post.image_url} 
             alt={post.title} 
             fill 
             className="object-cover" 
             priority
           />
        </div>
      )}

      <div className="prose prose-lg max-w-none prose-slate">
        {/* Render content - assuming HTML stored in Supabase. For security, sanitize in production. */}
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </article>
  );
}
