import { getUserAction } from "@/lib/actions/auth.action";
import { LogoutButton } from "@/components/dashboard/LogoutButton";
import { SidebarNav } from "@/components/dashboard/SidebarNav";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { redirect } from "next/navigation";
import { FEATURE_FLAGS } from "@/lib/constants";
import Image from "next/image";

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
        <div className="h-16 flex items-center px-4 border-b gap-3">
          <Image src="/images/JN_Logo--icon.png" alt="J&N" width={32} height={32} className="object-contain" />
          <span className="font-bold text-sm leading-tight">J & N</span>
        </div>
        <SidebarNav enableBlog={FEATURE_FLAGS.ENABLE_BLOG} />
        
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
