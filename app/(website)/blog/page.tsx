import { getBlogPosts } from '@/lib/actions/blog.action';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { format } from 'date-fns';
import Image from 'next/image';
import { FEATURE_FLAGS } from '@/lib/constants';
import { notFound } from 'next/navigation';
import { Clock } from 'lucide-react';

export const metadata = {
  title: "Blog & Expert Guides | EduNepal Consultancy",
  description: "Explore our latest expert guides, success stories, and updates about studying in Japan and language learning.",
  openGraph: {
    title: "Blog & Expert Guides | EduNepal Consultancy",
    description: "Expert insights for your international education journey.",
    type: 'website',
  }
};

export default async function BlogPage() {
  if (!FEATURE_FLAGS.ENABLE_BLOG) {
    notFound();
  }

  const posts = await getBlogPosts(true);

  return (
    <div className="container py-20 px-4 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-20">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-slate-900">Expert Insights & Guides</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Your comprehensive resource for international education, visa tips, and Japanese language mastery.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {posts?.map((post) => {
          const wordCount = post.content.split(/\s+/).length;
          const readingTime = Math.ceil(wordCount / 200);

          return (
            <Link href={`/blog/${post.slug}`} key={post.id} className="group">
              <Card className="h-full overflow-hidden transition-all duration-300 border-slate-100 group-hover:shadow-2xl group-hover:shadow-slate-200 group-hover:-translate-y-1 rounded-[2rem]">
                <div className="aspect-[16/10] bg-muted relative overflow-hidden">
                  {post.image_url ? (
                    <Image 
                      src={post.image_url} 
                      alt={post.title} 
                      fill 
                      className="object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground italic bg-slate-50">No Image</div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm text-primary text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                      Guide
                    </span>
                  </div>
                </div>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} className="text-primary/70" />
                      <span>{readingTime} min read</span>
                    </div>
                    <span>•</span>
                    <span>{format(new Date(post.published_at || post.created_at), 'MMM d, yyyy')}</span>
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors line-clamp-2 text-xl font-bold leading-snug">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-6">
                  <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </CardContent>
                <CardFooter className="pt-0 flex items-center justify-between border-t border-slate-50 mt-auto py-4">
                   <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                        {post.author_name?.charAt(0) || 'E'}
                      </div>
                      <span className="text-[11px] font-medium text-slate-500">{post.author_name || 'EduNepal Team'}</span>
                   </div>
                   <span className="text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">Read Article →</span>
                </CardFooter>
              </Card>
            </Link>
          );
        })}
        {(!posts || posts.length === 0) && (
          <div className="col-span-full py-32 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
             <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Clock size={24} className="text-slate-300" />
             </div>
             <h3 className="text-xl font-bold mb-2">Coming Soon</h3>
             <p className="text-muted-foreground max-w-xs mx-auto">Stay tuned! Our experts are drafting insightful articles for your journey.</p>
          </div>
        )}
      </div>
    </div>
  );
}
