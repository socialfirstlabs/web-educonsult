import { BlogClient } from "@/components/dashboard/BlogClient";
import { getBlogPosts } from "@/lib/actions/blog.action";
import { BlogValues } from "@/lib/validations/blog.schema";
import { FEATURE_FLAGS } from "@/lib/constants";
import { notFound } from "next/navigation";
import { getUserAction } from "@/lib/actions/auth.action";
import { User } from "@supabase/supabase-js";

interface BlogPost extends BlogValues {
  id: string;
  created_at: string;
}

export default async function DashboardBlogPage() {
  if (!FEATURE_FLAGS.ENABLE_BLOG) {
    notFound();
  }

  const [posts, user] = await Promise.all([
    getBlogPosts(),
    getUserAction()
  ]);

  return (
    <div className="container mx-auto">
      <BlogClient 
        posts={posts as BlogPost[]} 
        currentUser={user as User | null}
      />
    </div>
  );
}
