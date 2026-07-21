import { ImageResponse } from "next/og";

// Ana sayfa ve genel sayfalar için markalı sosyal paylaşım görseli.
// Logo, favicon (icon.tsx) ile aynı görsel dili kullanır: konum pini + yatak
// silüeti = logomark, yanında "OtelKirala" wordmark'ı. Böylece sekme ikonu ve
// paylaşım kartı tek bir marka kimliği paylaşır.
// Otel detay sayfaları kendi generateMetadata'sında otelin fotoğrafını og:image
// olarak verip bunu geçersiz kılar.
export const alt = "OtelKirala - Helal konseptli oteller";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          background:
            "linear-gradient(135deg, #1e3a8a 0%, #2563eb 55%, #0891b2 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        {/* Dekoratif ışık lekeleri */}
        <div
          style={{
            position: "absolute",
            top: -170,
            right: -120,
            width: 520,
            height: 520,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.07)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -210,
            left: -150,
            width: 560,
            height: 560,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
          }}
        />

        {/* Logomark: beyaz app-tile içinde konum pini + yatak */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 200,
            height: 200,
            borderRadius: 46,
            background: "white",
            boxShadow: "0 26px 64px rgba(2, 20, 60, 0.35)",
          }}
        >
          <svg width="150" height="150" viewBox="0 0 24 24">
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

        {/* Wordmark */}
        <div
          style={{
            display: "flex",
            marginTop: 44,
            fontSize: 100,
            fontWeight: 800,
            letterSpacing: -4,
          }}
        >
          OtelKirala
        </div>

        {/* Slogan */}
        <div
          style={{
            display: "flex",
            marginTop: 16,
            fontSize: 34,
            opacity: 0.92,
          }}
        >
          Helal konseptli oteller · En uygun fiyatlar
        </div>
      </div>
    ),
    size
  );
}
