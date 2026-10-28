"use client"

import { useEffect, useState } from "react"
import { getDemoData, isDemoMode } from "./demo-data"
import { getProfile, getRecentlyPlayed, getTopArtists, getTopTracks } from "./spotify"
import type { ReplayData, TimeRange } from "./types"

// loads everything the dashboard / story / share pages need
export function useSpotifyData(range: TimeRange) {
  const [data, setData] = useState<ReplayData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError("")

      // demo mode: fake a little delay so it feels like a real request
      if (isDemoMode()) {
        await new Promise((resolve) => setTimeout(resolve, 500))
        if (!cancelled) {
          setData(getDemoData(range))
          setLoading(false)
        }
        return
      }

      try {
        const [profile, topArtists, topTracks, recent] = await Promise.all([
          getProfile(),
          getTopArtists(range),
          getTopTracks(range),
          getRecentlyPlayed(),
        ])
        if (!cancelled) {
          setData({ profile, topArtists, topTracks, recent })
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Something went wrong")
        }
      }

      if (!cancelled) setLoading(false)
    }

    load()

    // if the range changes before the request finishes, ignore the old one
    return () => {
      cancelled = true
    }
  }, [range])

  return { data, loading, error }
}
