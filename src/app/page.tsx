"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ScheduleSection from "@/components/ScheduleSection";
import HowItWorks from "@/components/HowItWorks";
import TestimoniSection from "@/components/TestimoniSection";
import Footer from "@/components/Footer";
import type { Port } from "@/types";
import { getTodayString } from "@/lib/utils";

export interface SearchParams {
  from: Port | "";
  to: Port | "";
  date: string;
  passengers: number;
}

export default function Home() {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    from: "",
    to: "",
    date: getTodayString(),
    passengers: 1,
  });

  const handleSearch = (params: SearchParams) => {
    setSearchParams(params);
    document.getElementById("schedules")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen" style={{ background: "#f0f9ff" }}>
      <Navbar />
      <HeroSection onSearch={handleSearch} searchParams={searchParams} />
      <ScheduleSection searchParams={searchParams} />
<HowItWorks />
      <TestimoniSection />
      <Footer />
    </main>
  );
}
