"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { X } from "lucide-react"
import Cover from "@/components/cover"
import ErrorState from "@/components/error-state"
import { Button } from "@/components/ui/button"
import { isDemoMode } from "@/lib/demo-data"
import { isLoggedIn } from "@/lib/spotify"
import { getGenreCounts, getPeakHour, getPersonality, getRecentMinutes } from "@/lib/stats"
import { useSpotifyData } from "@/lib/use-spotify-data"

const SLIDE_TIME = 6000 // ms before going to the next slide

const backgrounds = [
  "from-[#1a0b2e] via-[#5b1e7a] to-[#ff4f7b]",
  "from-[#ff4f7b] to-[#7b2ff7]",
  "from-[#ffb020] via-[#ff7a45] to-[#d6246e]",
  "from-[#0ea5a4] via-[#2f6bff] to-[#7b2ff7]",
  "from-[#1a1325] via-[#3b2a6b] to-[#0ea5a4]",
  "from-[#8cc700] via-[#0ea5a4] to-[#1a1325]",
]

export default function ReplayPage() {
  const router = useRouter()
  const { data, loading, error } = useSpotifyData("medium_term")
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!isDemoMode() && !isLoggedIn()) router.replace("/")
  }, [router])

  const total = backgrounds.length

  const next = useCallback(() => {
    setIndex((i) => (i < total - 1 ? i + 1 : i))
  }, [total])

  const prev = useCallback(() => {
    setIndex((i) => (i > 0 ? i - 1 : i))
  }, [])

  // auto play, stops on the last slide
  useEffect(() => {
    if (!data || index === total - 1) return
    const timer = setTimeout(next, SLIDE_TIME)
    return () => clearTimeout(timer)
  }, [index, data, next, total])

  // keyboard controls
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === " ") next()
      if (e.key === "ArrowLeft") prev()
      if (e.key === "Escape") router.push("/dashboard")
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [next, prev, router])

  // tap on the left third goes back, anywhere else goes forward
  function handleTap(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    if (e.clientX - rect.left < rect.width / 3) prev()
    else next()
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <ErrorState error={error} />
      </main>
    )
  }

  if (loading || !data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#110c1b]">
        <p className="animate-pulse font-display text-2xl font-bold text-white">Getting your Replay ready...</p>
      </main>
    )
  }

  const topArtist = data.topArtists[0]
  const topTrack = data.topTracks[0]
  const genres = getGenreCounts(data.topArtists)
  const peak = getPeakHour(data.recent)
  const personality = getPersonality(data.topArtists, data.topTracks)

  return (
    <main className="flex min-h-screen items-center justify-center bg-black sm:p-6">
      <div
        onClick={handleTap}
        className={`relative flex h-screen w-full cursor-pointer select-none flex-col overflow-hidden bg-gradient-to-br p-7 text-white transition-colors duration-700 sm:aspect-[9/16] sm:h-[90vh] sm:w-auto sm:rounded-3xl ${backgrounds[index]}`}
      >
        {/* progress bars */}
        <div className="flex gap-1.5">
          {backgrounds.map((_, i) => (
            <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-white/30">
              {i < index && <div className="h-full w-full bg-white" />}
              {i === index && (
                <div
                  key={index}
                  className="animate-fill h-full bg-white"
                  style={{ animationDuration: index === total - 1 ? "0s" : SLIDE_TIME + "ms" }}
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="font-display text-sm font-bold opacity-80">Replay</span>
          <Link
            href="/dashboard"
            onClick={(e) => e.stopPropagation()}
            className="rounded-full p-1 hover:bg-white/20"
            aria-label="Close"
          >
            <X className="size-5" />
          </Link>
        </div>

        {/* key makes react re-mount the slide so the animations play again */}
        <div key={index} className="flex flex-1 flex-col justify-center">
          {index === 0 && (
            <>
              <p className="animate-rise text-lg opacity-80">Hey {data.profile.display_name},</p>
              <h1 className="animate-rise mt-2 font-display text-6xl font-bold leading-none" style={{ animationDelay: "0.2s" }}>
                This is your Replay.
              </h1>
              <p className="animate-rise mt-6 text-lg opacity-80" style={{ animationDelay: "0.5s" }}>
                The last 6 months of listening. No need to wait for December.
              </p>
            </>
          )}

          {index === 1 && topArtist && (
            <>
              <p className="animate-rise text-lg opacity-80">Your #1 artist was</p>
              <div className="animate-rise my-6" style={{ animationDelay: "0.2s" }}>
                <Cover src={topArtist.images[0]?.url} name={topArtist.name} round className="size-44 text-7xl shadow-2xl" />
              </div>
              <h2 className="animate-rise font-display text-5xl font-bold" style={{ animationDelay: "0.4s" }}>
                {topArtist.name}
              </h2>
              <div className="animate-rise mt-6 space-y-1 opacity-90" style={{ animationDelay: "0.7s" }}>
                {data.topArtists.slice(1, 5).map((a, i) => (
                  <p key={a.id}>
                    <span className="mr-2 font-bold">#{i + 2}</span>
                    {a.name}
                  </p>
                ))}
              </div>
            </>
          )}

          {index === 2 && topTrack && (
            <>
              <p className="animate-rise text-lg opacity-80">The song you couldn&apos;t stop playing</p>
              <div className="animate-rise my-6" style={{ animationDelay: "0.2s" }}>
                <Cover
                  src={topTrack.album.images[0]?.url}
                  name={topTrack.name}
                  className="size-44 rounded-xl text-7xl shadow-2xl"
                />
              </div>
              <h2 className="animate-rise font-display text-4xl font-bold" style={{ animationDelay: "0.4s" }}>
                {topTrack.name}
              </h2>
              <p className="animate-rise text-lg opacity-80" style={{ animationDelay: "0.5s" }}>
                {topTrack.artists.map((a) => a.name).join(", ")}
              </p>
            </>
          )}

          {index === 3 && (
            <>
              <p className="animate-rise text-lg opacity-80">Your top genre was</p>
              <h2
                className="animate-rise my-4 font-display text-6xl font-bold capitalize leading-none"
                style={{ animationDelay: "0.2s" }}
              >
                {genres[0]?.genre || "a mystery"}
              </h2>
              {genres.length > 0 && (
                <div className="animate-rise mt-6 space-y-3" style={{ animationDelay: "0.5s" }}>
                  {genres.slice(0, 4).map((g) => (
                    <div key={g.genre}>
                      <div className="mb-1 flex justify-between text-sm capitalize">
                        <span>{g.genre}</span>
                        <span>{g.count} artists</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/25">
                        <div
                          className="h-full rounded-full bg-white"
                          style={{ width: (g.count / genres[0].count) * 100 + "%" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {index === 4 && (
            <>
              <p className="animate-rise text-lg opacity-80">You listen the most around</p>
              <h2 className="animate-rise my-4 font-display text-8xl font-bold" style={{ animationDelay: "0.2s" }}>
                {peak.label}
              </h2>
              <p className="animate-rise text-lg opacity-90" style={{ animationDelay: "0.5s" }}>
                That&apos;s {getRecentMinutes(data.recent)} minutes of music in your last {data.recent.length} plays.
              </p>
            </>
          )}

          {index === 5 && (
            <>
              <p className="animate-rise text-lg opacity-80">Your listening personality</p>
              <h2 className="animate-rise my-4 font-display text-5xl font-bold" style={{ animationDelay: "0.2s" }}>
                {personality.name}
              </h2>
              <p className="animate-rise text-lg opacity-90" style={{ animationDelay: "0.4s" }}>
                {personality.description}
              </p>
              <div
                className="animate-rise mt-10 flex flex-col gap-3"
                style={{ animationDelay: "0.7s" }}
                onClick={(e) => e.stopPropagation()}
              >
                <Button asChild size="lg" className="bg-white text-[#1a1325] hover:bg-white/90">
                  <Link href="/share">Make a share card</Link>
                </Button>
                <Button asChild size="lg" variant="ghost" className="text-white hover:bg-white/15">
                  <Link href="/dashboard">Back to dashboard</Link>
                </Button>
              </div>
            </>
          )}
        </div>

        <p className="text-center text-xs opacity-60">Tap or use the arrow keys</p>
      </div>
    </main>
  )
}
