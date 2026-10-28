// fake data so people can try the app without logging in.
// all the artists and songs here are made up.

import type { Artist, RecentPlay, ReplayData, TimeRange, Track } from "./types"

export function isDemoMode() {
  return localStorage.getItem("demo_mode") === "true"
}

export function startDemo() {
  localStorage.setItem("demo_mode", "true")
}

export function stopDemo() {
  localStorage.removeItem("demo_mode")
}

function artist(id: string, name: string, genres: string[], popularity: number): Artist {
  return { id, name, genres, popularity, images: [] }
}

const artists: Artist[] = [
  artist("a1", "Night Static", ["indie pop", "synthpop"], 72),
  artist("a2", "Luna Vega", ["bedroom pop", "indie pop"], 64),
  artist("a3", "Velvet Harbor", ["dream pop", "shoegaze"], 48),
  artist("a4", "Koda Rivers", ["alternative r&b", "neo soul"], 69),
  artist("a5", "Saint Marlo", ["hip hop", "alternative hip hop"], 77),
  artist("a6", "Hollow Pines", ["indie folk", "folk pop"], 41),
  artist("a7", "Mira Sol", ["latin pop", "indie pop"], 81),
  artist("a8", "Static Bloom", ["shoegaze", "dream pop"], 35),
  artist("a9", "Juno Park", ["synthpop", "electropop"], 66),
  artist("a10", "Ozone Kids", ["indie rock", "garage rock"], 52),
  artist("a11", "Amara Lee", ["neo soul", "alternative r&b"], 58),
  artist("a12", "Cold Arcade", ["synthwave", "electronic"], 44),
  artist("a13", "Tidal Youth", ["indie rock", "post-punk"], 39),
  artist("a14", "Rumi Nakamura", ["lo-fi", "chillhop"], 55),
  artist("a15", "DJ Pastel", ["house", "electronic"], 60),
  artist("a16", "Fern & Fable", ["indie folk"], 33),
  artist("a17", "Neon Saints", ["synthpop", "indie pop"], 62),
  artist("a18", "Kai Moreno", ["latin pop", "reggaeton"], 74),
  artist("a19", "Paper Moons", ["bedroom pop", "lo-fi"], 47),
  artist("a20", "The Quiet Hours", ["indie rock", "dream pop"], 43),
]

// track(id, name, artist index, duration in seconds)
function track(id: string, name: string, artistIndex: number, seconds: number): Track {
  const a = artists[artistIndex]
  return {
    id,
    name,
    duration_ms: seconds * 1000,
    popularity: a.popularity,
    artists: [{ id: a.id, name: a.name }],
    album: { name: name, images: [] },
  }
}

const tracks: Track[] = [
  track("t1", "Midnight Satellites", 0, 214),
  track("t2", "Glow in the Dark", 1, 187),
  track("t3", "Neon Rain", 0, 232),
  track("t4", "Slow Motion Summer", 3, 201),
  track("t5", "Golden Hour Freeway", 4, 176),
  track("t6", "Seaside Static", 2, 263),
  track("t7", "Corazón de Papel", 6, 195),
  track("t8", "Pinewood", 5, 241),
  track("t9", "Low Tide", 7, 288),
  track("t10", "Heartbeat Arcade", 8, 199),
  track("t11", "Basement Lights", 9, 168),
  track("t12", "Sunday Morning Soul", 10, 223),
  track("t13", "Overdrive 1987", 11, 254),
  track("t14", "Paper Planes Again", 0, 205),
  track("t15", "Rooftop Tapes", 13, 142),
  track("t16", "Velvet Sky", 1, 216),
  track("t17", "After the Party", 14, 312),
  track("t18", "Wildflower Road", 15, 229),
  track("t19", "Pink Telephone", 16, 191),
  track("t20", "Fuego Lento", 17, 183),
  track("t21", "Cassette Dreams", 18, 158),
  track("t22", "Static Hearts", 12, 207),
  track("t23", "Cloud Nine Motel", 19, 244),
  track("t24", "Lazy River", 3, 219),
  track("t25", "City of Echoes", 4, 197),
]

// hours the demo user listens at, more plays in the evening
const listeningHours = [8, 9, 12, 13, 17, 18, 18, 19, 20, 20, 21, 21, 22, 22, 22, 23, 23, 0, 1]

function makeRecentPlays(): RecentPlay[] {
  const plays: RecentPlay[] = []
  const now = new Date()

  for (let day = 0; day < 4; day++) {
    listeningHours.forEach((hour, i) => {
      const date = new Date(now)
      date.setDate(now.getDate() - day)
      date.setHours(hour, (i * 7) % 60, 0, 0)

      if (date < now) {
        plays.push({
          track: tracks[(i + day * 3) % tracks.length],
          played_at: date.toISOString(),
        })
      }
    })
  }

  // newest first, and spotify only returns 50
  plays.sort((a, b) => new Date(b.played_at).getTime() - new Date(a.played_at).getTime())
  return plays.slice(0, 50)
}

// moves the first n items to the end so every range looks a bit different
function rotate<T>(list: T[], n: number) {
  return [...list.slice(n), ...list.slice(0, n)]
}

export function getDemoData(range: TimeRange): ReplayData {
  let offset = 0
  if (range === "short_term") offset = 3
  if (range === "long_term") offset = 6

  return {
    profile: { id: "demo", display_name: "Demo Listener", images: [] },
    topArtists: rotate(artists, offset),
    topTracks: rotate(tracks, offset),
    recent: makeRecentPlays(),
  }
}
