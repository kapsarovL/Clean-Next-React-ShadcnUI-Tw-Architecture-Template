import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    role: string;
  }
  
  interface Session {
    user: {
      id: string;
      email: string;
      role: string;
      profilePictureUrl?: string;
      notificationsEmail?: boolean;
      notificationsPush?: boolean;
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
  }
}