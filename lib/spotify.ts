// all the spotify stuff lives here: login (pkce), tokens and api calls

import type { Artist, Profile, RecentPlay, TimeRange, Track } from "./types"

const CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || ""
const SCOPES = "user-top-read user-read-recently-played user-read-private"

function getRedirectUri() {
  if (process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI) {
    return process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI
  }
  return window.location.origin + "/callback"
}

// ---------- pkce helpers ----------

function randomString(length: number) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  const values = crypto.getRandomValues(new Uint8Array(length))
  let result = ""
  for (let i = 0; i < values.length; i++) {
    result += chars[values[i] % chars.length]
  }
  return result
}

async function makeCodeChallenge(verifier: string) {
  const data = new TextEncoder().encode(verifier)
  const hash = await crypto.subtle.digest("SHA-256", data)
  // base64url encode the hash
  return btoa(String.fromCharCode(...new Uint8Array(hash)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
}

// ---------- login / logout ----------

export async function login() {
  if (!CLIENT_ID) {
    alert("Missing NEXT_PUBLIC_SPOTIFY_CLIENT_ID in .env.local")
    return
  }

  const verifier = randomString(64)
  const state = randomString(16)
  const challenge = await makeCodeChallenge(verifier)

  localStorage.setItem("code_verifier", verifier)
  localStorage.setItem("auth_state", state)

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: getRedirectUri(),
    scope: SCOPES,
    code_challenge_method: "S256",
    code_challenge: challenge,
    state: state,
  })

  window.location.href = "https://accounts.spotify.com/authorize?" + params.toString()
}

export function logout() {
  localStorage.removeItem("access_token")
  localStorage.removeItem("refresh_token")
  localStorage.removeItem("expires_at")
}

function saveTokens(data: { access_token: string; refresh_token?: string; expires_in: number }) {
  localStorage.setItem("access_token", data.access_token)
  if (data.refresh_token) {
    localStorage.setItem("refresh_token", data.refresh_token)
  }
  // expires_in is in seconds
  localStorage.setItem("expires_at", String(Date.now() + data.expires_in * 1000))
}

// called from /callback after spotify sends us back with a code
export async function exchangeCode(code: string, state: string | null) {
  const verifier = localStorage.getItem("code_verifier")
  const savedState = localStorage.getItem("auth_state")

  if (!verifier || state !== savedState) {
    throw new Error("Login session not found, please try again.")
  }

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: "authorization_code",
      code: code,
      redirect_uri: getRedirectUri(),
      code_verifier: verifier,
    }),
  })

  if (!res.ok) {
    throw new Error("Could not log in with Spotify.")
  }

  const data = await res.json()
  saveTokens(data)
  localStorage.removeItem("code_verifier")
  localStorage.removeItem("auth_state")
}

async function refreshToken() {
  const refresh = localStorage.getItem("refresh_token")
  if (!refresh) return false

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: "refresh_token",
      refresh_token: refresh,
    }),
  })

  if (!res.ok) return false

  saveTokens(await res.json())
  return true
}

export function isLoggedIn() {
  return !!localStorage.getItem("access_token")
}

// returns a valid token, refreshing it first if it expired
export async function getToken() {
  const expiresAt = Number(localStorage.getItem("expires_at") || 0)

  // refresh a minute early so it doesn't expire mid request
  if (Date.now() > expiresAt - 60 * 1000) {
    const ok = await refreshToken()
    if (!ok) return null
  }

  return localStorage.getItem("access_token")
}

// ---------- api calls ----------

async function spotifyFetch(path: string) {
  const token = await getToken()
  if (!token) {
    throw new Error("expired")
  }

  const res = await fetch("https://api.spotify.com/v1" + path, {
    headers: { Authorization: "Bearer " + token },
  })

  if (res.status === 401) throw new Error("expired")
  if (res.status === 429) throw new Error("rate_limited")
  if (!res.ok) throw new Error("Spotify request failed (" + res.status + ")")

  return res.json()
}

export async function getProfile(): Promise<Profile> {
  return spotifyFetch("/me")
}

// I grab 50 so the genre stats have more to work with, the UI only shows the top 10
export async function getTopArtists(range: TimeRange): Promise<Artist[]> {
  const data = await spotifyFetch(`/me/top/artists?time_range=${range}&limit=50`)
  return data.items
}

export async function getTopTracks(range: TimeRange): Promise<Track[]> {
  const data = await spotifyFetch(`/me/top/tracks?time_range=${range}&limit=50`)
  return data.items
}

export async function getRecentlyPlayed(): Promise<RecentPlay[]> {
  const data = await spotifyFetch("/me/player/recently-played?limit=50")
  return data.items
}
