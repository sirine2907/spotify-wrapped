"use client"

import { AlertTriangle, Hourglass, KeyRound } from "lucide-react"
import { Button } from "./ui/button"
import { login, logout } from "@/lib/spotify"

// error is the message thrown in lib/spotify.ts ("expired", "rate_limited" or anything else)
export default function ErrorState({ error }: { error: string }) {
  if (error === "expired") {
    return (
      <Message
        icon={<KeyRound className="size-6" />}
        title="Your session expired"
        text="Spotify logged you out after a while. Just log in again and you're good."
      >
        <Button
          onClick={() => {
            logout()
            login()
          }}
        >
          Log in again
        </Button>
      </Message>
    )
  }

  if (error === "rate_limited") {
    return (
      <Message
        icon={<Hourglass className="size-6" />}
        title="Spotify says slow down"
        text="We sent too many requests in a short time. Wait a few seconds and try again."
      >
        <Button onClick={() => window.location.reload()}>Try again</Button>
      </Message>
    )
  }

  return (
    <Message icon={<AlertTriangle className="size-6" />} title="Something went wrong" text={error}>
      <Button onClick={() => window.location.reload()}>Reload</Button>
    </Message>
  )
}

type MessageProps = {
  icon: React.ReactNode
  title: string
  text: string
  children: React.ReactNode
}

function Message({ icon, title, text, children }: MessageProps) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center rounded-lg border bg-card px-6 py-12 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">{icon}</div>
      <h2 className="font-display text-xl font-bold">{title}</h2>
      <p className="mb-6 mt-2 text-muted-foreground">{text}</p>
      {children}
    </div>
  )
}
