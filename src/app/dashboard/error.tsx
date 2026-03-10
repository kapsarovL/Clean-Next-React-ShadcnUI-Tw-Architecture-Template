'use client';

export default function DashboardError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="max-w-4xl mx-auto space-y-4 py-12 text-center">
      <h2 className="text-2xl font-bold">Something went wrong</h2>
      <p className="text-muted-foreground">Failed to load the dashboard. Please try again.</p>
      <button
        onClick={reset}
        className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90"
      >
        Try again
      </button>
    </div>
  );
}
