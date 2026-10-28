import Cover from "./cover"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import type { RecentPlay } from "@/lib/types"

// "5 min ago", "3 h ago", "2 d ago"
function timeAgo(date: string) {
  const minutes = Math.floor((Date.now() - new Date(date).getTime()) / 60000)
  if (minutes < 1) return "just now"
  if (minutes < 60) return minutes + " min ago"
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return hours + " h ago"
  return Math.floor(hours / 24) + " d ago"
}

export default function RecentPlays({ recent }: { recent: RecentPlay[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recently played</CardTitle>
      </CardHeader>
      <CardContent className="pt-3">
        {recent.length === 0 && <p className="text-sm text-muted-foreground">Nothing played recently.</p>}

        <ul>
          {recent.slice(0, 10).map((play) => (
            <li key={play.played_at} className="flex items-center gap-3 px-2 py-2.5">
              <Cover
                src={play.track.album.images[2]?.url || play.track.album.images[0]?.url}
                name={play.track.name}
                className="size-10"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{play.track.name}</p>
                <p className="truncate text-xs text-muted-foreground">{play.track.artists[0]?.name}</p>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">{timeAgo(play.played_at)}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
