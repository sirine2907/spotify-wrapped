export type TimeRange = "short_term" | "medium_term" | "long_term"

export type SpotifyImage = {
  url: string
}

export type Artist = {
  id: string
  name: string
  images: SpotifyImage[]
  // spotify doesn't always send these, so they're optional
  genres?: string[]
  popularity?: number
  external_urls?: { spotify: string }
}

export type Track = {
  id: string
  name: string
  duration_ms: number
  popularity?: number
  artists: { id: string; name: string }[]
  album: {
    name: string
    images: SpotifyImage[]
  }
  external_urls?: { spotify: string }
}

export type RecentPlay = {
  track: Track
  played_at: string
}

export type Profile = {
  id: string
  display_name: string
  images: SpotifyImage[]
}

export type ReplayData = {
  profile: Profile
  topArtists: Artist[]
  topTracks: Track[]
  recent: RecentPlay[]
}
