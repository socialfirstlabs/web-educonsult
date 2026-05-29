import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, BookOpen, FileText, Briefcase, Trophy, ClipboardList } from "lucide-react";
import { FEATURE_FLAGS } from "@/lib/constants";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();

  if (!supabase) return (
    <div className="p-4 border border-destructive text-destructive rounded-md bg-destructive/10">
      Supabase environment variables are missing.
    </div>
  );

  const [
    { count: enrollmentsCount },
    { count: contactsCount },
    { count: coursesCount },
    { count: servicesCount },
    { count: postsCount },
    { count: successCount },
  ] = await Promise.all([
    supabase.from('enrollments').select('*', { count: 'exact', head: true }),
    supabase.from('contacts').select('*', { count: 'exact', head: true }),
    supabase.from('courses').select('*', { count: 'exact', head: true }),
    supabase.from('services').select('*', { count: 'exact', head: true }),
    supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
    supabase.from('success_stories').select('*', { count: 'exact', head: true }),
  ]);

  const stats = [
    { title: "Enrollments", value: enrollmentsCount ?? 0, icon: ClipboardList, color: "text-emerald-600", href: "/dashboard/enrollments" },
    { title: "Contacts", value: contactsCount ?? 0, icon: Users, color: "text-blue-600", href: "/dashboard/leads" },
    { title: "Services", value: servicesCount ?? 0, icon: Briefcase, color: "text-indigo-600", href: "/dashboard/services" },
    { title: "Courses", value: coursesCount ?? 0, icon: BookOpen, color: "text-green-600", href: "/dashboard/courses" },
    { title: "Success Stories", value: successCount ?? 0, icon: Trophy, color: "text-orange-600", href: "/dashboard/success-stories" },
    ...(FEATURE_FLAGS.ENABLE_BLOG
      ? [{ title: "Blog Posts", value: postsCount ?? 0, icon: FileText, color: "text-purple-600", href: "/dashboard/blog" }]
      : []),
  ];

  const quickActions = [
    { label: "View Enrollments", desc: "Review and manage application forms", href: "/dashboard/enrollments", icon: ClipboardList },
    { label: "Manage Contacts", desc: "View and manage student inquiries", href: "/dashboard/leads", icon: Users },
    { label: "Add Service", desc: "Create a new service listing", href: "/dashboard/services", icon: Briefcase },
    { label: "Add Course", desc: "Create a new language class", href: "/dashboard/courses", icon: BookOpen },
    { label: "Add Success Story", desc: "Publish a student testimonial", href: "/dashboard/success-stories", icon: GraduationCap },
    ...(FEATURE_FLAGS.ENABLE_BLOG
      ? [{ label: "Write Blog Post", desc: "Publish a new SEO article", href: "/dashboard/blog", icon: FileText }]
      : []),
  ];

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map(({ label, desc, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="p-4 border rounded-lg hover:bg-muted/50 hover:border-primary/30 transition-colors flex items-start gap-3"
              >
                <div className="mt-0.5 p-2 bg-primary/10 rounded-md">
                  <Icon size={16} className="text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
