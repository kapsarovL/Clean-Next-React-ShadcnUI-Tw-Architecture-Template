import { LoginForm } from "@/components/auth/LoginForm"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="p-6 rounded-lg shadow-lg bg-card">
        <h1 className="text-2xl font-bold mb-6 text-center">Log In</h1>
        <LoginForm />
      </div>
    </div>
  )
}