import { ImageResponse } from "next/og";

// Tarayıcı sekmesinde görünen favicon: bir konum pini (damla) içinde
// beyaz yatak silüeti — "otelini bul" mesajı. Pin, opengraph-image.tsx ile
// aynı mavi gradyanı kullanır; zemin şeffaftır, böylece pin her tema/sekmede
// kendi şekliyle durur.
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24">
          <defs>
            <linearGradient id="pinGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#1e3a8a" />
              <stop offset="0.55" stopColor="#2563eb" />
              <stop offset="1" stopColor="#0891b2" />
            </linearGradient>
          </defs>

          {/* Konum pini gövdesi */}
          <path
            d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
            fill="url(#pinGradient)"
          />

          {/* Yatak silüeti (beyaz) */}
          <rect x="8" y="6.4" width="1.6" height="5.2" rx="0.6" fill="#ffffff" />
          <rect x="8" y="8.9" width="8.4" height="2.5" rx="0.9" fill="#ffffff" />
          <rect x="9.6" y="7.5" width="2.9" height="1.8" rx="0.8" fill="#ffffff" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
