import { Clock, Mic2, Shapes, Trophy } from "lucide-react"
import { countUniqueArtists, getGenreCounts, getRecentMinutes, getTopGenre } from "@/lib/stats"
import type { ReplayData } from "@/lib/types"

export default function StatCards({ data }: { data: ReplayData }) {
  const stats = [
    {
      label: "Unique artists",
      value: countUniqueArtists(data.topArtists, data.topTracks),
      icon: Mic2,
      color: "bg-primary/15 text-primary",
    },
    {
      label: "Unique genres",
      value: getGenreCounts(data.topArtists).length,
      icon: Shapes,
      color: "bg-accent/20 text-accent",
    },
    {
      label: "Top genre",
      value: getTopGenre(data.topArtists),
      icon: Trophy,
      color: "bg-lime/20 text-lime",
    },
    {
      label: "Minutes (last 50 plays)",
      value: getRecentMinutes(data.recent),
      icon: Clock,
      color: "bg-[#7b2ff7]/15 text-[#7b2ff7] dark:text-[#a777ff]",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-lg border bg-card p-5">
          <div className={`mb-3 flex size-9 items-center justify-center rounded-full ${stat.color}`}>
            <stat.icon className="size-4" />
          </div>
          <p className="truncate font-display text-2xl font-bold capitalize">{stat.value}</p>
          <p className="text-sm text-muted-foreground">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}
