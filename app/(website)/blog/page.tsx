import { getBlogPosts } from '@/lib/actions/blog.action';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { format } from 'date-fns';
import Image from 'next/image';
import { FEATURE_FLAGS } from '@/lib/constants';
import { notFound } from 'next/navigation';

export const metadata = {
  title: "Blog & Updates | EduNepal Consultancy",
  description: "Read the latest news, guides, and tips about studying abroad and Japanese language learning.",
};

export default async function BlogPage() {
  if (!FEATURE_FLAGS.ENABLE_BLOG) {
    notFound();
  }

  const posts = await getBlogPosts(true);

  return (
    <div className="container py-20 px-4">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-bold mb-4">Latest Blog & News</h1>
        <p className="text-xl text-muted-foreground">Expert insights and guides for your education journey.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts?.map((post) => (
          <Link href={`/blog/${post.slug}`} key={post.id} className="group">
            <Card className="h-full overflow-hidden transition-all group-hover:shadow-lg">
              <div className="aspect-video bg-muted relative overflow-hidden">
                {post.image_url ? (
                  <Image 
                    src={post.image_url} 
                    alt={post.title} 
                    fill 
                    className="object-cover transition-transform group-hover:scale-105" 
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground italic">No Image</div>
                )}
              </div>
              <CardHeader>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <span>{format(new Date(post.published_at || post.created_at), 'MMM d, yyyy')}</span>
                </div>
                <CardTitle className="group-hover:text-primary transition-colors line-clamp-2">{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
              </CardContent>
              <CardFooter>
                 <span className="text-sm font-bold text-primary">Read More →</span>
              </CardFooter>
            </Card>
          </Link>
        ))}
        {(!posts || posts.length === 0) && (
          <div className="col-span-full py-20 text-center bg-muted/30 rounded-2xl">
             <p className="text-muted-foreground">Stay tuned! Our experts are writing insightful articles for you.</p>
          </div>
        )}
      </div>
    </div>
  );
}
