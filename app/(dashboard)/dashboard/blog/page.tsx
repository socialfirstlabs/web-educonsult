import { BlogClient } from "@/components/dashboard/BlogClient";
import { getBlogPostsForDashboard } from "@/lib/actions/blog.action";
import { FEATURE_FLAGS } from "@/lib/constants";
import { notFound } from "next/navigation";
import { getUserAction } from "@/lib/actions/auth.action";
import { User } from "@supabase/supabase-js";

export default async function DashboardBlogPage() {
  if (!FEATURE_FLAGS.ENABLE_BLOG) {
    notFound();
  }

  const [posts, user] = await Promise.all([
    getBlogPostsForDashboard(),
    getUserAction()
  ]);

  return (
    <div className="container mx-auto">
        <BlogClient
          posts={posts}
          currentUser={user as User | null}
        />
    </div>
  );
}
