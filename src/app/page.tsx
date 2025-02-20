import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            This is a clean Next.js 15 template with Shadcn UI, TypeScript,
            and TailwindCSS.
          </p>
          <Button>Get Started</Button>
        </CardContent>
      </Card>
    </div>
  )
}