import Link from "next/link";
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  FileText, 
  Image as ImageIcon,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        <div className="p-4 border-t">
          <Button variant="ghost" className="w-full justify-start gap-3">
            <LogOut size={20} /> Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 border-b flex items-center px-8 bg-background">
          <h2 className="font-semibold text-xl">Admin Dashboard</h2>
        </header>
        <div className="flex-1 overflow-auto bg-muted/10 p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
