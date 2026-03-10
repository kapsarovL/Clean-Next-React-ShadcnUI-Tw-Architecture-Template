export default function TasksLoading() {
  return (
    <div className="container mx-auto p-6 space-y-4 animate-pulse">
      <div className="h-9 w-32 bg-muted rounded" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="rounded-lg border p-4 flex justify-between items-center">
          <div className="h-4 w-48 bg-muted rounded" />
          <div className="h-8 w-16 bg-muted rounded" />
        </div>
      ))}
    </div>
  );
}
