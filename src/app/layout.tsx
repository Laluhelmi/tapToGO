import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CompareProvider } from "@/contexts/CompareContext";
import CompareBar from "@/components/CompareBar";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const BASE_URL = "https://taptogo-rouge.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "tapToGo · Tiket Fastboat Lombok ke Bali (Gili → Padang Bai, Sanur, Nusa Penida)",
    template: "%s | tapToGo",
  },
  description: "Pesan tiket fastboat dari Lombok (Gili Trawangan, Gili Meno, Gili Air, Bangsal, Senggigi) ke Bali (Padang Bai, Sanur, Nusa Penida, Nusa Lembongan, Serangan). 145 jadwal harian dari 21 operator resmi. Mulai Rp 300K.",
  keywords: [
    "tiket fastboat",
    "fastboat lombok ke bali",
    "fastboat gili trawangan",
    "tiket kapal bali lombok",
    "fastboat sanur padang bai",
    "fastboat nusa penida",
    "kapal bangsal padang bai",
    "fastboat senggigi",
    "tapToGo",
  ],
  openGraph: {
    type: "website",
    siteName: "tapToGo",
    locale: "id_ID",
    url: BASE_URL,
    title: "tapToGo · Tiket Fastboat Lombok ke Bali",
    description: "145 jadwal harian dari 21 operator resmi. Booking online instant. Mulai Rp 300K.",
  },
  twitter: {
    card: "summary_large_image",
    title: "tapToGo · Fastboat Lombok ke Bali",
    description: "Pesan tiket fastboat online — operator resmi, harga transparan.",
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={plusJakarta.variable}>
      <body style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
        <LanguageProvider>
          <CompareProvider>
            {children}
            <CompareBar />
          </CompareProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
