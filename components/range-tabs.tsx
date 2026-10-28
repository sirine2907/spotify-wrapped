"use client"

import type { TimeRange } from "@/lib/types"
import { cn } from "@/lib/utils"

export const RANGE_LABELS: Record<TimeRange, string> = {
  short_term: "Last 4 weeks",
  medium_term: "Last 6 months",
  long_term: "All time",
}

type Props = {
  value: TimeRange
  onChange: (range: TimeRange) => void
}

export default function RangeTabs({ value, onChange }: Props) {
  const ranges: TimeRange[] = ["short_term", "medium_term", "long_term"]

  return (
    <div className="inline-flex rounded-full border bg-card p-1">
      {ranges.map((r) => (
        <button
          key={r}
          onClick={() => onChange(r)}
          className={cn(
            "cursor-pointer rounded-full px-3 py-1.5 text-sm font-medium transition-colors sm:px-4",
            value === r ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {RANGE_LABELS[r]}
        </button>
      ))}
    </div>
  )
}
