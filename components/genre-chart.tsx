"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { getGenreChartData } from "@/lib/stats"
import type { Artist } from "@/lib/types"

export const CHART_COLORS = ["#ff4f7b", "#ffb020", "#8cc700", "#7b2ff7", "#0ea5a4", "#ff7a45", "#a397b8"]

export default function GenreChart({ artists }: { artists: Artist[] }) {
  const data = getGenreChartData(artists)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Genre breakdown</CardTitle>
        <span className="text-xs text-muted-foreground">from your top {artists.length} artists</span>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            Spotify didn&apos;t send any genre info for your top artists.
          </p>
        ) : (
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <div className="h-56 w-56 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    stroke="none"
                  >
                    {data.map((entry, index) => (
                      <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      color: "var(--foreground)",
                    }}
                    itemStyle={{ color: "var(--foreground)" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* legend */}
            <ul className="w-full space-y-2">
              {data.map((entry, index) => (
                <li key={entry.name} className="flex items-center gap-2 text-sm">
                  <span
                    className="size-3 shrink-0 rounded-full"
                    style={{ background: CHART_COLORS[index % CHART_COLORS.length] }}
                  />
                  <span className="flex-1 truncate capitalize">{entry.name}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {entry.value} {entry.value === 1 ? "artist" : "artists"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
