"use client"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/shared/ThemeToggle"
import Link from "next/link"

export function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold">Logo</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/">Home</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/about">About</Link>
            </Button>
            {session ? (
              <Button variant="ghost" onClick={() => signOut({ callbackUrl: "/login" })}>
                Sign Out
              </Button>
            ) : (
              <Link href="/api/auth/signin">
                <Button variant="ghost">Sign In</Button>
              </Link>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  )
}