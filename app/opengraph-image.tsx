import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "J&N Caregiver Training — Your Pathway to Japan";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#243EBC",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 80px",
          position: "relative",
        }}
      >
        {/* Background accent circle */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -100,
            left: -100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(225,180,40,0.15)",
          }}
        />

        {/* Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 40,
            padding: "8px 20px",
            marginBottom: 32,
          }}
        >
          <span style={{ color: "#E1B428", fontSize: 18 }}>✓</span>
          <span
            style={{
              color: "rgba(255,255,255,0.9)",
              fontSize: 18,
              fontFamily: "sans-serif",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Accredited Caregiver Training
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            color: "white",
            fontSize: 64,
            fontFamily: "sans-serif",
            fontWeight: 700,
            textAlign: "center",
            lineHeight: 1.15,
            marginBottom: 24,
            maxWidth: 900,
          }}
        >
          J&N Caregiver Training
        </div>

        {/* Sub */}
        <div
          style={{
            color: "rgba(255,255,255,0.85)",
            fontSize: 30,
            fontFamily: "sans-serif",
            textAlign: "center",
            maxWidth: 800,
          }}
        >
          Your Pathway to Japan 🇯🇵 · From Nepal to a Rewarding Career
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            gap: 48,
            marginTop: 56,
          }}
        >
          {[
            ["500+", "Graduates"],
            ["40+", "Employers"],
            ["92%", "Placement Rate"],
          ].map(([val, label]) => (
            <div
              key={label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
              }}
            >
              <span
                style={{
                  color: "#E1B428",
                  fontSize: 40,
                  fontWeight: 700,
                  fontFamily: "sans-serif",
                }}
              >
                {val}
              </span>
              <span
                style={{
                  color: "rgba(255,255,255,0.7)",
                  fontSize: 18,
                  fontFamily: "sans-serif",
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
