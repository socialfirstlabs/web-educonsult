import Link from "next/link";
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  FileText, 
  Image as ImageIcon,
  Briefcase
} from "lucide-react";
import { getUserAction } from "@/lib/actions/auth.action";
import { LogoutButton } from "@/components/dashboard/LogoutButton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserAction();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-muted/20 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b font-bold text-lg">
          Admin Portal
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link href="/dashboard/leads" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors">
            <Users size={20} /> Leads
          </Link>
          <Link href="/dashboard/services" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors">
            <Briefcase size={20} /> Services
          </Link>
          <Link href="/dashboard/courses" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors">
            <BookOpen size={20} /> Courses
          </Link>
          <Link href="/dashboard/blog" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors">
            <FileText size={20} /> Blog
          </Link>
          <Link href="/dashboard/success-stories" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors">
            <ImageIcon size={20} /> Success Stories
          </Link>
        </nav>
        
        {user && (
          <div className="px-4 py-2 mb-2">
            <div className="flex items-center gap-3 px-3 py-2 bg-muted/40 rounded-lg border border-muted-foreground/10">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium truncate">{user.email}</span>
                <span className="text-[10px] text-muted-foreground uppercase">Administrator</span>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 border-t">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 border-b flex items-center px-8 bg-background justify-between">
          <h2 className="font-semibold text-xl">Admin Dashboard</h2>
          <div className="flex items-center gap-4">
            {/* User Profile in Header for Mobile if needed, but for now just showing it */}
          </div>
        </header>
        <div className="flex-1 overflow-auto bg-muted/10 p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
