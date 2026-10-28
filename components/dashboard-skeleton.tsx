// grey boxes that roughly match the dashboard layout while data loads

function Box({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-lg bg-muted ${className}`} />
}

export default function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Box className="h-32" />
        <Box className="h-32" />
        <Box className="h-32" />
        <Box className="h-32" />
      </div>

      <div className="rounded-lg border bg-card p-5">
        <Box className="mb-5 h-6 w-32" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Box className="size-24 rounded-full" />
              <Box className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Box className="h-72" />
        <Box className="h-72" />
      </div>
    </div>
  )
}
