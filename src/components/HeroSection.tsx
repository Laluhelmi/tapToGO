"use client";
import SearchForm from "./SearchForm";
import type { SearchParams } from "@/app/page";

interface Props {
  onSearch: (params: SearchParams) => void;
  searchParams: SearchParams;
}

export default function HeroSection({ onSearch, searchParams }: Props) {
  return (
    <section className="relative overflow-hidden pt-16" style={{ minHeight: "48vh" }}>

      {/* Background photo */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1581420455310-e069c4d4529e?fm=jpg&q=85&w=1920&auto=format&fit=crop"
          alt="Pantai Sunset Tropis"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(160deg,rgba(0,0,0,0.35) 0%,rgba(0,0,0,0.1) 50%,rgba(0,0,0,0.2) 100%)" }} />
      </div>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ lineHeight: 0 }}>
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ width: "100%", height: "80px" }}>
          <path d="M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,120 L0,120 Z" fill="#f0f9ff"/>
        </svg>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-24">
        <div className="flex items-center justify-center">
          <div className="w-full max-w-3xl">
            <SearchForm onSearch={onSearch} initialValues={searchParams} />
          </div>
        </div>
      </div>
    </section>
  );
}
