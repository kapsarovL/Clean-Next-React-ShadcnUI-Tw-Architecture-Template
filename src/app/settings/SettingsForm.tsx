"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { useToast } from "@/components/ui/use-toast"
import { ThemeToggle } from "@/components/shared/ThemeToggle"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Checkbox } from "@/components/ui/checkbox"

const schema = z
  .object({
    email: z.string().email("Invalid email address"),
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),
    profilePicture: z.any().optional(), // File input, validated separately
    notificationsEmail: z.boolean(),
    notificationsPush: z.boolean(),
  })
  .refine(
    (data) =>
      !data.newPassword || data.currentPassword !== undefined,
    {
      message: "Current password is required when changing the password",
      path: ["currentPassword"],
    }
  )
  .refine(
    (data) => !data.newPassword || data.newPassword === data.confirmPassword,
    {
      message: "Passwords must match",
      path: ["confirmPassword"],
    }
  )
  .refine(
    (data) => !data.newPassword || data.newPassword.length >= 8,
    {
      message: "New password must be at least 8 characters",
      path: ["newPassword"],
    }
  )

type FormData = z.infer<typeof schema>

export function SettingsForm() {
  const { data: session, update } = useSession()
  const [loading, setLoading] = useState(false)
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      notificationsEmail: true,
      notificationsPush: false,
    },
  })

  // Pre-fill form from session
  useEffect(() => {
    if (session?.user) {
      reset({
        email: session.user.email || "",
        notificationsEmail: session.user.notificationsEmail ?? true,
        notificationsPush: session.user.notificationsPush ?? false,
      })
      setProfilePicturePreview(session.user.profilePictureUrl || null)
    }
  }, [session, reset])

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please upload an image file.",
        })
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      setValue("profilePicture", file)
    }
  }

  const onSubmit = async (data: FormData) => {
    if (!session) return

    setLoading(true)

    const formData = new FormData()
    formData.append("email", data.email)
    if (data.currentPassword) formData.append("currentPassword", data.currentPassword)
    if (data.newPassword) formData.append("newPassword", data.newPassword)
    if (data.profilePicture instanceof File) formData.append("profilePicture", data.profilePicture)
    formData.append("notificationsEmail", String(data.notificationsEmail))
    formData.append("notificationsPush", String(data.notificationsPush))

    try {
      const response = await fetch("/api/user", {
        method: "PUT",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update profile")
      }

      const updatedUser = await response.json()
      await update({
        email: updatedUser.email,
        profilePictureUrl: updatedUser.profilePictureUrl,
        notificationsEmail: updatedUser.notificationsEmail,
        notificationsPush: updatedUser.notificationsPush,
      })
      toast({
        title: "Success",
        description: "Profile updated successfully.",
      })
      reset({
        ...data,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        profilePicture: undefined,
      })
      router.refresh()
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
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
        {/* Profile Picture */}
        <div className="grid gap-2">
          <Label htmlFor="profilePicture">Profile Picture</Label>
          <div className="flex items-center gap-4">
            {profilePicturePreview && (
              <Image
                src={profilePicturePreview}
                alt="Profile Preview"
                className="w-16 h-16 rounded-full object-cover"
              />
            )}
            <Input
              id="profilePicture"
              type="file"
              accept="image/*"
              onChange={handleProfilePictureChange}
              disabled={loading || !session}
              className="cursor-pointer"
            />
          </div>
          {errors.profilePicture && (
            <p className="text-sm text-destructive">{errors.profilePicture.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="Enter your email"
            disabled={loading || !session}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Current Password */}
        <div className="grid gap-2">
          <Label htmlFor="currentPassword">Current Password</Label>
          <Input
            id="currentPassword"
            type="password"
            {...register("currentPassword")}
            placeholder="Enter current password"
            disabled={loading || !session}
          />
          {errors.currentPassword && (
            <p className="text-sm text-destructive">{errors.currentPassword.message}</p>
          )}
        </div>

        {/* New Password */}
        <div className="grid gap-2">
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            id="newPassword"
            type="password"
            {...register("newPassword")}
            placeholder="Enter new password"
            disabled={loading || !session}
          />
          {errors.newPassword && (
            <p className="text-sm text-destructive">{errors.newPassword.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            {...register("confirmPassword")}
            placeholder="Confirm new password"
            disabled={loading || !session}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Notification Preferences */}
        <div className="grid gap-4">
          <Label>Notification Preferences</Label>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="notificationsEmail"
              {...register("notificationsEmail")}
              disabled={loading || !session}
            />
            <Label htmlFor="notificationsEmail">Receive email notifications</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="notificationsPush"
              {...register("notificationsPush")}
              disabled={loading || !session}
            />
            <Label htmlFor="notificationsPush">Receive push notifications</Label>
          </div>
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={loading || !session}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </form>

      {/* Theme Toggle */}
      <div className="grid gap-2">
        <Label>Theme</Label>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <span>Toggle between light and dark mode</span>
        </div>
      </div>
    </div>
  )
}