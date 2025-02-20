import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/shared/ThemeToggle"

export function Navbar() {
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
            <Button variant="ghost">Home</Button>
            <Button variant="ghost">About</Button>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  )
}