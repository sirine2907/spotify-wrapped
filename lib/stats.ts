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

// top 6 genres for the pie chart, everything else goes into "other"
export function getGenreChartData(artists: Artist[]) {
  const genres = getGenreCounts(artists)
  const top = genres.slice(0, 6).map((g) => ({ name: g.genre, value: g.count }))

  let otherCount = 0
  genres.slice(6).forEach((g) => (otherCount += g.count))
  if (otherCount > 0) {
    top.push({ name: "other", value: otherCount })
  }

  return top
}

// how many songs you played in each hour of the day (0 = midnight)
export function getListeningHours(recent: RecentPlay[]) {
  const hours = []
  for (let h = 0; h < 24; h++) {
    hours.push({ hour: h, label: formatHour(h), plays: 0 })
  }

  for (const play of recent) {
    // getHours() uses the user's own timezone, which is what we want
    const h = new Date(play.played_at).getHours()
    hours[h].plays++
  }

  return hours
}

export function getPeakHour(recent: RecentPlay[]) {
  const hours = getListeningHours(recent)
  let peak = hours[0]
  for (const h of hours) {
    if (h.plays > peak.plays) peak = h
  }
  return peak
}

// 0 -> "12am", 13 -> "1pm"
export function formatHour(h: number) {
  if (h === 0) return "12am"
  if (h === 12) return "12pm"
  return h < 12 ? h + "am" : h - 12 + "pm"
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
