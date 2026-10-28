import Link from "next/link"
import { Play } from "lucide-react"
import { Button } from "./ui/button"
import { getPersonality } from "@/lib/stats"
import type { ReplayData } from "@/lib/types"

export default function PersonalityCard({ data }: { data: ReplayData }) {
  const personality = getPersonality(data.topArtists, data.topTracks)

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-gradient-to-br from-primary to-[#7b2ff7] p-6 text-white sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-medium uppercase tracking-widest opacity-80">Your listening personality</p>
        <p className="mt-1 font-display text-3xl font-bold">{personality.name}</p>
        <p className="mt-1 max-w-xl opacity-90">{personality.description}</p>
      </div>
      <Button asChild size="lg" className="shrink-0 bg-white text-[#1a1325] hover:bg-white/90">
        <Link href="/replay">
          <Play className="fill-current" /> Play your Replay
        </Link>
      </Button>
    </div>
  )
}
