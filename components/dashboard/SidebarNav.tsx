"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  ImageIcon,
  Briefcase,
  ClipboardList,
  UserCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard",             label: "Dashboard",      icon: LayoutDashboard, exact: true },
  { href: "/dashboard/enrollments", label: "Enrollments",    icon: ClipboardList },
  { href: "/dashboard/leads",       label: "Contacts",       icon: Users },
  { href: "/dashboard/services",    label: "Services",       icon: Briefcase },
  { href: "/dashboard/courses",     label: "Courses",        icon: BookOpen },
  { href: "/dashboard/success-stories", label: "Success Stories", icon: ImageIcon },
  { href: "/dashboard/team", label: "Team Members", icon: UserCircle },
];

export function SidebarNav({ enableBlog }: { enableBlog: boolean }) {
  const pathname = usePathname();

  const isActive = (href: string, exact = false) =>
    exact ? pathname === href : pathname.startsWith(href);

  const items = enableBlog
    ? [
        ...navItems.slice(0, 4),
        { href: "/dashboard/blog", label: "Blog", icon: FileText },
        ...navItems.slice(4),
      ]
    : navItems;

  return (
    <nav className="flex-1 p-4 space-y-1">
      {items.map(({ href, label, icon: Icon, exact }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
            isActive(href, exact)
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted text-foreground"
          )}
        >
          <Icon size={18} />
          {label}
        </Link>
      ))}
    </nav>
  );
}
