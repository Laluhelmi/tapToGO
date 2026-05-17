import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  findRouteBySlug,
  getSchedulesForRoute,
  getRelatedRoutes,
  getAllRouteSlugs,
} from "@/lib/routes";
import RouteContent from "./RouteContent";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// SSG: pre-build every route page at deploy time
export function generateStaticParams() {
  return getAllRouteSlugs().map(slug => ({ slug }));
}

// SEO metadata — bilingual via alternate languages
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const route = findRouteBySlug(slug);
  if (!route) {
    return { title: "Route not found · tapToGo" };
  }

  // Default metadata in English (site default)
  const title = `Fastboat ${route.from} to ${route.to} · From Rp ${route.minPrice}K | tapToGo`;
  const description = `Book fastboat tickets ${route.from} → ${route.to} online. ${route.scheduleCount} daily schedules from ${route.operators.length} official operators. ${route.duration} duration. From Rp ${route.minPrice}K. Fast & secure booking with tapToGo.`;

  // Indonesian description for SEO alternate
  const titleId = `Fastboat ${route.from} ke ${route.to} · Mulai Rp ${route.minPrice}K | tapToGo`;

  return {
    title,
    description,
    keywords: [
      `fastboat ${route.from}`,
      `fastboat ${route.from} to ${route.to}`,
      `boat ticket ${route.from} ${route.to}`,
      `kapal ${route.from} ${route.to}`,
      `fastboat lombok bali`,
      `fastboat tickets online`,
      "tapToGo",
    ].join(", "),
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://taptogo.id/rute/${slug}`,
      siteName: "tapToGo",
      locale: "en_US",
      alternateLocale: ["id_ID"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `https://taptogo.id/rute/${slug}`,
      languages: {
        "en-US": `https://taptogo.id/rute/${slug}`,
        "id-ID": `https://taptogo.id/rute/${slug}`,
        "x-default": `https://taptogo.id/rute/${slug}`,
      },
    },
    other: {
      "title:id": titleId,
    },
  };
}

export default async function RoutePage({ params }: PageProps) {
  const { slug } = await params;
  const route = findRouteBySlug(slug);
  if (!route) notFound();

  const schedules = getSchedulesForRoute(route.from, route.to);
  const related = getRelatedRoutes(route, 4);
  const cheapest = schedules.reduce((min, s) => (s.price < min.price ? s : min), schedules[0]);
  const earliestTime = schedules[0]?.departureTime ?? "—";
  const latestTime = schedules[schedules.length - 1]?.departureTime ?? "—";

  // JSON-LD structured data — keep in English for primary Google indexing
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TouristTrip",
        "@id": `https://taptogo.id/rute/${slug}#trip`,
        name: `Fastboat ${route.from} to ${route.to}`,
        description: `Fastboat ticket service from ${route.from} to ${route.to}, duration ${route.duration}. ${route.scheduleCount} daily schedules.`,
        touristType: "Tourist",
        itinerary: {
          "@type": "ItemList",
          itemListElement: [
            { "@type": "ListItem", position: 1, item: { "@type": "Place", name: route.from, address: { "@type": "PostalAddress", addressCountry: "ID" } } },
            { "@type": "ListItem", position: 2, item: { "@type": "Place", name: route.to, address: { "@type": "PostalAddress", addressCountry: "ID" } } },
          ],
        },
        offers: {
          "@type": "AggregateOffer",
          lowPrice: route.minPrice * 1000,
          highPrice: route.maxPrice * 1000,
          priceCurrency: "IDR",
          offerCount: route.scheduleCount,
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: `How long is the fastboat from ${route.from} to ${route.to}?`,
            acceptedAnswer: { "@type": "Answer", text: `The fastboat ride from ${route.from} to ${route.to} takes about ${route.duration}.` },
          },
          {
            "@type": "Question",
            name: `How much is a ticket from ${route.from} to ${route.to}?`,
            acceptedAnswer: { "@type": "Answer", text: `Tickets start from Rp ${route.minPrice}K up to Rp ${route.maxPrice}K per person, depending on operator and class.` },
          },
          {
            "@type": "Question",
            name: `How many operators serve the ${route.from} to ${route.to} route?`,
            acceptedAnswer: { "@type": "Answer", text: `${route.operators.length} official operators serve this route with ${route.scheduleCount} daily schedules in total.` },
          },
          {
            "@type": "Question",
            name: `Is harbour tax included?`,
            acceptedAnswer: { "@type": "Answer", text: `No. Harbour Tax (Rp 20,000 per person) is collected at the departure port ${route.from}. You can pay via the app or in cash at the port.` },
          },
          {
            "@type": "Question",
            name: `What are the departure times?`,
            acceptedAnswer: { "@type": "Answer", text: `Schedules run from ${earliestTime} to ${latestTime}. The cheapest operator is ${cheapest?.operator} starting at Rp ${cheapest?.price ?? route.minPrice}K.` },
          },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <RouteContent route={route} schedules={schedules} related={related} />
    </>
  );
}

// SSG with hourly revalidation
export const dynamic = "force-static";
export const revalidate = 3600;
