"use client"

import Link from "next/link"
import { Disc3 } from "lucide-react"
import ThemeToggle from "./theme-toggle"

export default function Header({ children }: { children?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold">
          <Disc3 className="size-6 text-primary" />
          Replay
        </Link>
        <div className="flex items-center gap-2">
          {children}
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
