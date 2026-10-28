// takes the README screenshots using demo mode
// run the app first (npm run build && npm start), then: node scripts/screenshots.mjs

import { chromium } from "playwright"
import { mkdirSync } from "fs"

const BASE = process.env.BASE_URL || "http://127.0.0.1:3000"
const OUT = "docs/screenshots"

mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch()

async function openPage(theme, viewport = { width: 1440, height: 900 }) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 })
  // turn on demo mode + pick the theme before the page loads
  await context.addInitScript((t) => {
    localStorage.setItem("demo_mode", "true")
    localStorage.setItem("theme", t)
  }, theme)
  return context.newPage()
}

async function wait(page, ms = 1200) {
  await page.waitForLoadState("networkidle")
  await page.waitForTimeout(ms)
}

// landing
let page = await openPage("light")
await page.goto(BASE)
await wait(page)
await page.screenshot({ path: `${OUT}/landing.png` })

// dashboard light + dark
for (const theme of ["light", "dark"]) {
  page = await openPage(theme)
  await page.goto(BASE + "/dashboard")
  await page.getByText("Top artists").first().waitFor()
  await wait(page)
  await page.screenshot({ path: `${OUT}/dashboard-${theme}.png`, fullPage: true })

  if (theme === "dark") {
    const charts = page.locator("div.grid", { has: page.getByText("Genre breakdown") }).last()
    await charts.screenshot({ path: `${OUT}/charts.png` })
  }
}

// story mode (top artist slide + personality slide)
page = await openPage("dark")
await page.goto(BASE + "/replay")
await page.getByText("This is your Replay.").waitFor()
await page.keyboard.press("ArrowRight")
await wait(page, 1500)
await page.screenshot({ path: `${OUT}/story-artist.png` })
for (let i = 0; i < 4; i++) await page.keyboard.press("ArrowRight")
await wait(page, 1800)
await page.screenshot({ path: `${OUT}/story-personality.png` })

// share card
page = await openPage("light")
await page.goto(BASE + "/share")
await page.getByText("Top songs").waitFor()
await wait(page)
await page.screenshot({ path: `${OUT}/share-card.png`, fullPage: true })

// mobile dashboard
page = await openPage("dark", { width: 390, height: 844 })
await page.goto(BASE + "/dashboard")
await page.getByText("Top artists").first().waitFor()
await wait(page)
await page.screenshot({ path: `${OUT}/mobile.png` })

await browser.close()
console.log("screenshots saved to " + OUT)
