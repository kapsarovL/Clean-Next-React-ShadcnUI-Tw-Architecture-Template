"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { ThemeToggle } from "@/components/shared/ThemeToggle"

export function SettingsForm() {
  const { data: session, update } = useSession()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  // Pre-fill email from session
  useEffect(() => {
    if (session?.user?.email) {
      setEmail(session.user.email)
    }
  }, [session])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) return

    setLoading(true)

    try {
      const response = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      // Update session with new email
      await update({ email })
      toast({
        title: "Success",
        description: "Profile updated successfully.",
      })
      router.refresh() // Refresh the page to reflect changes
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            disabled={loading || !session}
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading || !session}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </form>

      <div className="space-y-2">
        <Label>Theme</Label>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <span>Toggle between light and dark mode</span>
        </div>
      </div>
    </div>
  )
}