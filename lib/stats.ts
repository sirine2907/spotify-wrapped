// small helper functions that turn the raw spotify data into numbers for the ui

import type { Artist, RecentPlay, Track } from "./types"

// counts every artist that shows up in your top artists or top tracks
export function countUniqueArtists(artists: Artist[], tracks: Track[]) {
  const ids = new Set<string>()
  artists.forEach((a) => ids.add(a.id))
  tracks.forEach((t) => t.artists.forEach((a) => ids.add(a.id)))
  return ids.size
}

// returns [{ genre: "indie pop", count: 7 }, ...] sorted from most to least
export function getGenreCounts(artists: Artist[]) {
  const counts: Record<string, number> = {}

  for (const artist of artists) {
    for (const genre of artist.genres || []) {
      counts[genre] = (counts[genre] || 0) + 1
    }
  }

  return Object.entries(counts)
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count)
}

export function getTopGenre(artists: Artist[]) {
  const genres = getGenreCounts(artists)
  return genres.length > 0 ? genres[0].genre : "unknown"
}

// total minutes of the recently played songs (spotify only gives the last 50)
export function getRecentMinutes(recent: RecentPlay[]) {
  let total = 0
  recent.forEach((play) => (total += play.track.duration_ms))
  return Math.round(total / 60000)
}
