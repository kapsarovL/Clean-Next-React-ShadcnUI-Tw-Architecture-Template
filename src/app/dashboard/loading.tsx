export default function DashboardLoading() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-pulse">
      <div className="h-9 w-40 bg-muted rounded" />
      <div className="grid gap-6 md:grid-cols-2">
        {[0, 1].map((i) => (
          <div key={i} className="rounded-lg border bg-card p-6 space-y-4">
            <div className="h-5 w-24 bg-muted rounded" />
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-muted" />
              <div className="space-y-2">
                <div className="h-4 w-32 bg-muted rounded" />
                <div className="h-3 w-20 bg-muted rounded" />
              </div>
            </div>
            <div className="h-9 w-28 bg-muted rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
