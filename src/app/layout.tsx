"use client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AuthProvider } from "@/context/AuthContext"
import { Navbar } from "@/components/layout/Navbar"
import { Sidebar } from "@/components/layout/Sidebar"
import { cn } from "@/lib/utils"
import "./globals.css";

const queryClient = new QueryClient();



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen font-sans antialiased")}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Navbar />
            <main className="flex">
              <Sidebar />
              <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
              </div>
            </main>
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
