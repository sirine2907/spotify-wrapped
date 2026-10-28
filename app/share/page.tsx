"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toPng } from "html-to-image"
import { ArrowLeft, Download, Loader2 } from "lucide-react"
import Cover from "@/components/cover"
import ErrorState from "@/components/error-state"
import Header from "@/components/header"
import RangeTabs, { RANGE_LABELS } from "@/components/range-tabs"
import { Button } from "@/components/ui/button"
import { isDemoMode } from "@/lib/demo-data"
import { isLoggedIn } from "@/lib/spotify"
import { getPersonality, getTopGenre } from "@/lib/stats"
import { useSpotifyData } from "@/lib/use-spotify-data"
import type { TimeRange } from "@/lib/types"
import { cn } from "@/lib/utils"

type CardSize = "story" | "square"

export default function SharePage() {
  const router = useRouter()
  const [range, setRange] = useState<TimeRange>("medium_term")
  const [size, setSize] = useState<CardSize>("story")
  const [downloading, setDownloading] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const { data, loading, error } = useSpotifyData(range)

  useEffect(() => {
    if (!isDemoMode() && !isLoggedIn()) router.replace("/")
  }, [router])

  async function handleDownload() {
    if (!cardRef.current) return
    setDownloading(true)

    try {
      // the preview is small, pixelRatio scales it up to 1080px wide
      const width = cardRef.current.offsetWidth
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 1080 / width, cacheBust: true })

      const link = document.createElement("a")
      link.download = `replay-${size}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error(err)
      alert("Couldn't create the image, try again.")
    }

    setDownloading(false)
  }

  return (
    <>
      <Header>
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard">
            <ArrowLeft /> Dashboard
          </Link>
        </Button>
      </Header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="font-display text-3xl font-bold">Share your Replay</h1>
        <p className="mt-1 text-muted-foreground">Pick a range and a size, then download the card as a PNG.</p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <RangeTabs value={range} onChange={setRange} />
          <div className="inline-flex rounded-full border bg-card p-1">
            {(["story", "square"] as CardSize[]).map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={cn(
                  "cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium capitalize",
                  size === s ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {s === "story" ? "Story 9:16" : "Square 1:1"}
              </button>
            ))}
          </div>
          <Button onClick={handleDownload} disabled={!data || loading || downloading}>
            {downloading ? <Loader2 className="animate-spin" /> : <Download />}
            Download PNG
          </Button>
        </div>

        <div className="mt-8 flex justify-center">
          {error && <ErrorState error={error} />}

          {loading && (
            <div
              className={cn(
                "animate-pulse rounded-3xl bg-muted",
                size === "story" ? "h-[640px] w-[360px]" : "size-[400px]"
              )}
            />
          )}

          {data && !loading && (
            <div
              ref={cardRef}
              className={cn(
                "flex flex-col overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a0b2e] via-[#5b1e7a] to-[#ff4f7b] text-white shadow-2xl",
                size === "story" ? "h-[640px] w-[360px] p-8" : "size-[400px] p-7"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-lg font-bold">Replay</span>
                <span className="text-xs opacity-80">{RANGE_LABELS[range]}</span>
              </div>

              {size === "story" ? (
                <>
                  <div className="mt-10 flex flex-col items-center text-center">
                    <Cover
                      src={data.topArtists[0]?.images[0]?.url}
                      name={data.topArtists[0]?.name || "?"}
                      round
                      className="size-32 text-5xl shadow-xl"
                    />
                    <p className="mt-4 text-xs uppercase tracking-widest opacity-80">Top artist</p>
                    <p className="font-display text-3xl font-bold">{data.topArtists[0]?.name}</p>
                  </div>

                  <div className="mt-8">
                    <p className="mb-2 text-xs uppercase tracking-widest opacity-80">Top songs</p>
                    {data.topTracks.slice(0, 5).map((t, i) => (
                      <p key={t.id} className="truncate py-0.5">
                        <span className="mr-2 font-bold">{i + 1}</span>
                        {t.name}
                      </p>
                    ))}
                  </div>

                  <div className="mt-auto grid grid-cols-2 gap-4 border-t border-white/25 pt-5">
                    <div>
                      <p className="text-xs uppercase tracking-widest opacity-80">Top genre</p>
                      <p className="font-bold capitalize">{getTopGenre(data.topArtists)}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest opacity-80">Personality</p>
                      <p className="font-bold">{getPersonality(data.topArtists, data.topTracks).name}</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="mt-6 flex items-center gap-4">
                    <Cover
                      src={data.topArtists[0]?.images[0]?.url}
                      name={data.topArtists[0]?.name || "?"}
                      round
                      className="size-20 text-3xl"
                    />
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-widest opacity-80">Top artist</p>
                      <p className="truncate font-display text-2xl font-bold">{data.topArtists[0]?.name}</p>
                    </div>
                  </div>

                  <div className="mt-5">
                    {data.topTracks.slice(0, 3).map((t, i) => (
                      <p key={t.id} className="truncate py-0.5 text-sm">
                        <span className="mr-2 font-bold">{i + 1}</span>
                        {t.name}
                      </p>
                    ))}
                  </div>

                  <div className="mt-auto flex justify-between border-t border-white/25 pt-4 text-sm">
                    <span className="font-bold capitalize">{getTopGenre(data.topArtists)}</span>
                    <span className="font-bold">{getPersonality(data.topArtists, data.topTracks).name}</span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
