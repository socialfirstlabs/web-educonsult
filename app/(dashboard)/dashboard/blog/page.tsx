import { BlogClient } from "@/components/dashboard/BlogClient";
import { getBlogPosts } from "@/lib/actions/blog.action";
import { BlogValues } from "@/lib/validations/blog.schema";
import { FEATURE_FLAGS } from "@/lib/constants";
import { notFound } from "next/navigation";

interface BlogPost extends BlogValues {
  id: string;
  created_at: string;
}

export default async function DashboardBlogPage() {
  if (!FEATURE_FLAGS.ENABLE_BLOG) {
    notFound();
  }

  const posts = await getBlogPosts();

  return (
    <div className="container mx-auto">
      <BlogClient posts={posts as BlogPost[]} />
    </div>
  );
}
