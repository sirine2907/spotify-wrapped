"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import DashboardSkeleton from "@/components/dashboard-skeleton"
import ErrorState from "@/components/error-state"
import GenreChart from "@/components/genre-chart"
import Header from "@/components/header"
import HoursChart from "@/components/hours-chart"
import RangeTabs from "@/components/range-tabs"
import RecentPlays from "@/components/recent-plays"
import StatCards from "@/components/stat-cards"
import TopArtists from "@/components/top-artists"
import TopTracks from "@/components/top-tracks"
import { Button } from "@/components/ui/button"
import { isDemoMode, stopDemo } from "@/lib/demo-data"
import { isLoggedIn, logout } from "@/lib/spotify"
import { useSpotifyData } from "@/lib/use-spotify-data"
import type { TimeRange } from "@/lib/types"

export default function DashboardPage() {
  const router = useRouter()
  const [range, setRange] = useState<TimeRange>("medium_term")
  const { data, loading, error } = useSpotifyData(range)

  const [demo, setDemo] = useState(false)

  // no token and not in demo = send them back to the landing page
  useEffect(() => {
    if (isDemoMode()) {
      setDemo(true)
    } else if (!isLoggedIn()) {
      router.replace("/")
    }
  }, [router])

  function handleLogout() {
    logout()
    stopDemo()
    router.push("/")
  }

  return (
    <>
      <Header>
        {demo && (
          <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold text-foreground">Demo mode</span>
        )}
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut /> {demo ? "Exit demo" : "Log out"}
        </Button>
      </Header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Welcome back</p>
            <h1 className="font-display text-3xl font-bold">{data?.profile.display_name || "..."}</h1>
          </div>
          <RangeTabs value={range} onChange={setRange} />
        </div>

        {loading && <DashboardSkeleton />}
        {error && !loading && <ErrorState error={error} />}

        {data && !loading && (
          <>
            <StatCards data={data} />
            <TopArtists artists={data.topArtists} />
            <div className="grid gap-6 lg:grid-cols-2">
              <GenreChart artists={data.topArtists} />
              <HoursChart recent={data.recent} />
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <TopTracks tracks={data.topTracks} />
              <RecentPlays recent={data.recent} />
            </div>
          </>
        )}
      </main>
    </>
  )
}
