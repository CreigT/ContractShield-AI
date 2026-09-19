import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ContractShield AI — Review Smarter. Sign with Confidence.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0B0B0D",
          color: "#F5F5F4",
          padding: "72px",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 6, textTransform: "uppercase", color: "#D4AF37" }}>
          Creignificent LLC
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 72, fontWeight: 600, lineHeight: 1.05 }}>Review Smarter.</div>
          <div style={{ fontSize: 72, fontWeight: 600, lineHeight: 1.05 }}>Sign with Confidence.</div>
          <div style={{ fontSize: 28, color: "#A8A29E", marginTop: 12 }}>
            AI contract review for small businesses
          </div>
        </div>
        <div style={{ fontSize: 24, color: "#D4AF37" }}>ContractShield AI</div>
      </div>
    ),
    size,
  );
}
