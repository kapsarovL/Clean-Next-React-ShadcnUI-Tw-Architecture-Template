'use client';

export default function TasksError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container mx-auto p-6 space-y-4 text-center">
      <h2 className="text-2xl font-bold">Something went wrong</h2>
      <p className="text-muted-foreground">Failed to load tasks. Please try again.</p>
      <button
        onClick={reset}
        className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90"
      >
        Try again
      </button>
    </div>
  );
}
