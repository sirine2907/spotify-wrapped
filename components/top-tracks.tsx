import Cover from "./cover"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import type { Track } from "@/lib/types"

// 215000 -> "3:35"
export function formatDuration(ms: number) {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return minutes + ":" + String(seconds).padStart(2, "0")
}

export default function TopTracks({ tracks }: { tracks: Track[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top tracks</CardTitle>
      </CardHeader>
      <CardContent className="pt-3">
        {tracks.length === 0 && <p className="text-sm text-muted-foreground">No tracks yet for this range.</p>}

        <ol>
          {tracks.slice(0, 10).map((track, index) => (
            <li key={track.id}>
              <a
                href={track.external_urls?.spotify}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-muted"
              >
                <span className="w-5 text-right text-sm font-semibold text-muted-foreground">{index + 1}</span>
                <Cover
                  src={track.album.images[2]?.url || track.album.images[0]?.url}
                  name={track.name}
                  className="size-11"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{track.name}</p>
                  <p className="truncate text-sm text-muted-foreground">
                    {track.artists.map((a) => a.name).join(", ")}
                  </p>
                </div>
                <span className="text-sm tabular-nums text-muted-foreground">{formatDuration(track.duration_ms)}</span>
              </a>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  )
}
