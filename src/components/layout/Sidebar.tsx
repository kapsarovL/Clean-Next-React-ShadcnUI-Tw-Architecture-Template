"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/tasks", label: "Tasks" },
  { href: "/profile", label: "Profile" },
  { href: "/settings", label: "Settings" },
  { href: "/admin", label: "Admin", role: "ADMIN" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="w-64 border-r">
      <nav className="space-y-2 p-4">
        {navItems.map((item) => {
          if (item.role && session?.user.role !== item.role) {
            return null;
          }
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname === item.href ? "default" : "ghost"}
                className="w-full justify-start"
              >
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}