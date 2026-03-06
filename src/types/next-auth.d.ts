import "next-auth"
import "next-auth/jwt"

declare module "next-auth" {
  interface User {
    role?: string
    profilePictureUrl?: string | null
    notificationsEmail?: boolean
    notificationsPush?: boolean
  }

  interface Session {
    user: {
      id: string
      email?: string | null
      name?: string | null
      image?: string | null
      role?: string
      profilePictureUrl?: string | null
      notificationsEmail?: boolean
      notificationsPush?: boolean
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    role?: string
    profilePictureUrl?: string | null
    notificationsEmail?: boolean
    notificationsPush?: boolean
  }
}
