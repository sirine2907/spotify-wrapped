import { ImageResponse } from "next/og"

// the preview image you see when the link is shared on twitter / discord / etc.
// satori (what renders this) only supports flexbox, so everything is display: flex
export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #1a0b2e 0%, #5b1e7a 50%, #ff4f7b 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "#ff4f7b",
              border: "10px solid white",
              display: "flex",
            }}
          />
          <div style={{ fontSize: "48px", fontWeight: 700 }}>Replay</div>
        </div>
        <div style={{ fontSize: "84px", fontWeight: 700, marginTop: "40px", lineHeight: 1.05 }}>
          Your music recap, any week of the year.
        </div>
        <div style={{ fontSize: "32px", marginTop: "30px", opacity: 0.85 }}>
          Top artists, songs, genres and a story you can share.
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
