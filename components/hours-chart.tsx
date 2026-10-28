"use client"

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { getListeningHours, getPeakHour } from "@/lib/stats"
import type { RecentPlay } from "@/lib/types"

export default function HoursChart({ recent }: { recent: RecentPlay[] }) {
  const data = getListeningHours(recent)
  const peak = getPeakHour(recent)

  return (
    <Card>
      <CardHeader>
        <CardTitle>When you listen</CardTitle>
        {peak.plays > 0 && (
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            Peak: {peak.label}
          </span>
        )}
      </CardHeader>
      <CardContent>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis
                dataKey="label"
                interval={5}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              />
              <Tooltip
                cursor={{ fill: "var(--muted)" }}
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  color: "var(--foreground)",
                }}
                formatter={(value) => [value + " plays", ""]}
              />
              <Bar dataKey="plays" fill="var(--primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Based on your last 50 plays.</p>
      </CardContent>
    </Card>
  )
}
