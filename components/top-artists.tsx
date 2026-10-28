import Cover from "./cover"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import type { Artist } from "@/lib/types"

export default function TopArtists({ artists }: { artists: Artist[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top artists</CardTitle>
      </CardHeader>
      <CardContent>
        {artists.length === 0 && <p className="text-sm text-muted-foreground">No artists yet for this range.</p>}

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {artists.slice(0, 10).map((artist, index) => (
            <a
              key={artist.id}
              href={artist.external_urls?.spotify}
              target="_blank"
              rel="noreferrer"
              className="group text-center"
            >
              <div className="relative mx-auto w-fit">
                <Cover
                  src={artist.images[0]?.url}
                  name={artist.name}
                  round
                  className="size-24 text-3xl transition-transform group-hover:scale-105"
                />
                <span className="absolute -left-1 -top-1 flex size-7 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">
                  {index + 1}
                </span>
              </div>
              <p className="mt-2 truncate font-semibold">{artist.name}</p>
              <p className="truncate text-xs capitalize text-muted-foreground">
                {artist.genres?.slice(0, 2).join(", ") || "-"}
              </p>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
