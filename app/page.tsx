"use client"

import { useRouter } from "next/navigation"
import { BarChart3, Music2, PieChart, Share2, Sparkles } from "lucide-react"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { startDemo } from "@/lib/demo-data"
import { login } from "@/lib/spotify"

const features = [
  {
    icon: BarChart3,
    title: "Top artists & tracks",
    text: "See who you've been playing on repeat in the last month, 6 months or all time.",
  },
  {
    icon: PieChart,
    title: "Genre breakdown",
    text: "Find out what your taste actually looks like when you put it in a chart.",
  },
  {
    icon: Sparkles,
    title: "Story mode",
    text: "Tap through your own little Replay story whenever you feel like it.",
  },
  {
    icon: Share2,
    title: "Shareable cards",
    text: "Download a card for your Instagram story and show off your taste.",
  },
]

export default function Home() {
  const router = useRouter()

  function tryDemo() {
    startDemo()
    router.push("/dashboard")
  }

  return (
    <>
      <Header />

      <main className="mx-auto max-w-6xl px-4">
        {/* hero */}
        <section className="grid items-center gap-12 py-16 md:grid-cols-2 md:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <Music2 className="size-3.5 text-primary" />
              Works with your Spotify account
            </span>
            <h1 className="mt-5 font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl">
              Your music recap, <span className="text-primary">any week</span> of the year.
            </h1>
            <p className="mt-5 max-w-md text-lg text-muted-foreground">
              Why wait until December? Replay shows your top artists, songs and genres right now, plus a story you can
              tap through and share.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" onClick={login}>
                Log in with Spotify
              </Button>
              <Button size="lg" variant="outline" onClick={tryDemo}>
                Try demo
              </Button>
            </div>
          </div>

          {/* little stack of cards as a preview */}
          <div className="relative mx-auto h-[380px] w-full max-w-sm">
            <div className="absolute inset-x-8 top-6 h-80 -rotate-6 rounded-3xl bg-accent/80" />
            <div className="absolute inset-x-4 top-3 h-80 rotate-3 rounded-3xl bg-lime/80" />
            <div className="absolute inset-x-0 top-0 flex h-80 flex-col justify-between rounded-3xl bg-gradient-to-br from-primary to-[#7b2ff7] p-7 text-white shadow-2xl">
              <p className="text-sm font-semibold uppercase tracking-widest opacity-80">Your top artist</p>
              <div>
                <div className="mb-4 size-20 rounded-full bg-white/25" />
                <p className="font-display text-4xl font-bold">Night Static</p>
                <p className="mt-1 opacity-80">412 plays in the last 6 months</p>
              </div>
            </div>
          </div>
        </section>

        {/* features */}
        <section className="grid gap-4 pb-20 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="rounded-lg border bg-card p-5">
              <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-primary/10">
                <f.icon className="size-5 text-primary" />
              </div>
              <h3 className="font-display font-bold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        Replay is a fan project and isn&apos;t affiliated with Spotify.
      </footer>
    </>
  )
}
