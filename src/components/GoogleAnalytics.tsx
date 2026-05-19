"use client";
import Script from "next/script";

export default function GoogleAnalytics() {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
  const AW_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  if (!GA_ID && !AW_ID) return null;

  // Use whichever ID exists as the script loader; configs work together via gtag()
  const loaderId = GA_ID || AW_ID;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${loaderId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        ${GA_ID ? `gtag('config', '${GA_ID}', { page_path: window.location.pathname });` : ""}
        ${AW_ID ? `gtag('config', '${AW_ID}');` : ""}
      `}</Script>
    </>
  );
}
