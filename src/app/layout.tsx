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

export const metadata: Metadata = {
  title: "tapToGo — Tiket Fastboat Bali, Lombok & Gili",
  description: "Pesan tiket fastboat terbaik Bali–Lombok–Nusa Penida–Gili. Harga transparan, konfirmasi instan, operator resmi.",
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
