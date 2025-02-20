"use client"

import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import Link from "next/link"

export function Sidebar() {
  const pathname = usePathname()

  const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/tasks", label: "Tasks" }, // New
    { href: "/profile", label: "Profile" },
    { href: "/settings", label: "Settings" },
  ]

  return (
    <aside className="w-64 border-r">
      <nav className="space-y-2 p-4">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant={pathname === item.href ? "default" : "ghost"}
              className="w-full justify-start"
            >
              {item.label}
            </Button>
          </Link>
        ))}
      </nav>
    </aside>
  )
}