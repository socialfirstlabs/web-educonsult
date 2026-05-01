import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, BookOpen, FileText } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  
  if (!supabase) return <div className="p-4 border border-destructive text-destructive rounded-md bg-destructive/10">Supabase environment variables are missing.</div>;

  // Fetch summary stats in parallel
  const [
    { count: leadsCount },
    { count: coursesCount },
    { count: postsCount },
    { count: successCount }
  ] = await Promise.all([
    supabase.from('leads').select('*', { count: 'exact', head: true }),
    supabase.from('courses').select('*', { count: 'exact', head: true }),
    supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
    supabase.from('success_stories').select('*', { count: 'exact', head: true })
  ]);

  const stats = [
    { title: "Total Leads", value: leadsCount || 0, icon: Users, color: "text-blue-600" },
    { title: "Active Courses", value: coursesCount || 0, icon: BookOpen, color: "text-green-600" },
    { title: "Blog Posts", value: postsCount || 0, icon: FileText, color: "text-purple-600" },
    { title: "Success Stories", value: successCount || 0, icon: GraduationCap, color: "text-orange-600" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
         <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="grid grid-cols-2 gap-4">
                  <button className="p-4 border rounded-lg hover:bg-muted/50 transition-colors text-left">
                     <p className="font-semibold">Add Course</p>
                     <p className="text-sm text-muted-foreground">Create a new language class</p>
                  </button>
                  <button className="p-4 border rounded-lg hover:bg-muted/50 transition-colors text-left">
                     <p className="font-semibold">Write Blog</p>
                     <p className="text-sm text-muted-foreground">Post a new SEO article</p>
                  </button>
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
