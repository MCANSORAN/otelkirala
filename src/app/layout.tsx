import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const SITE_TITLE = "OtelKirala - Tatil için En İyi Oteller";
const SITE_DESCRIPTION =
  "Türkiye'nin dört bir yanındaki binlerce oteli en uygun fiyatlarla karşılaştır, gerçek misafir yorumlarını incele ve tatilin için ideal odayı dakikalar içinde güvenle rezerve et. Antalya, Bodrum ve Kapadokya'da fırsatlar seni bekliyor.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: "OtelKirala",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: "tr_TR",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
