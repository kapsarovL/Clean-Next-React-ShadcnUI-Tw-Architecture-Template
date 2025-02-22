import { ProtectedRoute } from "@/components/layout/ProtectedRoute"
import { SettingsForm } from "./SettingsForm"

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <div className="space-y-8 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold">Settings</h1>
        <SettingsForm />
      </div>
    </ProtectedRoute>
  )
}