"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { exchangeCode } from "@/lib/spotify"
import { Button } from "@/components/ui/button"

export default function CallbackPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  // react strict mode runs effects twice in dev, the code can only be used once
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true

    const params = new URLSearchParams(window.location.search)
    const code = params.get("code")

    if (params.get("error") || !code) {
      setError("Spotify login was cancelled.")
      return
    }

    exchangeCode(code, params.get("state"))
      .then(() => {
        localStorage.removeItem("demo_mode")
        router.replace("/dashboard")
      })
      .catch((err) => setError(err.message))
  }, [router])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      {error ? (
        <>
          <p className="font-display text-2xl font-bold">Hmm, that didn&apos;t work</p>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => router.push("/")}>Back home</Button>
        </>
      ) : (
        <>
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Logging you in...</p>
        </>
      )}
    </main>
  )
}
