import type { Metadata } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
import { ThemeProvider } from "next-themes"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk" })

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://127.0.0.1:3000"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Replay - Your Spotify stats, any time of the year",
    template: "%s | Replay",
  },
  description:
    "See your top artists, top tracks, genres and listening habits from Spotify whenever you want, then share your own Replay story.",
  keywords: ["spotify stats", "spotify wrapped", "top artists", "music recap", "listening stats"],
  openGraph: {
    title: "Replay - Your Spotify stats, any time of the year",
    description: "Top artists, songs, genres and a story you can share. No need to wait for December.",
    url: SITE_URL,
    siteName: "Replay",
    images: [{ url: "/api/og", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Replay - Your Spotify stats, any time of the year",
    description: "Top artists, songs, genres and a story you can share.",
    images: ["/api/og"],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning because next-themes adds the "dark" class before react loads
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${grotesk.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
