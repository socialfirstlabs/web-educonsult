import { BlogClient } from "@/components/dashboard/BlogClient";
import { getBlogPosts } from "@/lib/actions/blog.action";
import { BlogValues } from "@/lib/validations/blog.schema";

interface BlogPost extends BlogValues {
  id: string;
  created_at: string;
}

export default async function DashboardBlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="container mx-auto">
      <BlogClient posts={posts as BlogPost[]} />
    </div>
  );
}
