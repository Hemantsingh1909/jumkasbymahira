'use client';

import Link from 'next/link';
import { ArrowRight } from "lucide-react";

const collections = [
  {
    name: "Gold Collection",
    description: "Timeless gold jhumkas for every occasion",
    gradient: "from-amber-200 via-yellow-100 to-amber-50",
    accent: "text-amber-700 hover:text-amber-800",
    border: "border-amber-200",
  },
  {
    name: "Kundan Collection",
    description: "Traditional kundan designs with modern aesthetics",
    gradient: "from-sky-200 via-blue-50 to-white",
    accent: "text-sky-700 hover:text-sky-800",
    border: "border-sky-200",
  },
  {
    name: "Pearl Collection",
    description: "Elegant pearl earrings for a sophisticated look",
    gradient: "from-rose-100 via-pink-50 to-white",
    accent: "text-rose-700 hover:text-rose-800",
    border: "border-rose-200",
  },
  {
    name: "Silver Collection",
    description: "Contemporary silver designs with minimalist elegance",
    gradient: "from-slate-200 via-gray-100 to-white",
    accent: "text-slate-700 hover:text-slate-800",
    border: "border-slate-300",
  },
];

const CollectionCard = ({ collection }) => (
  <div className="group relative bg-white rounded-2xl overflow-hidden border border-rose-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 flex flex-col h-full">
    {/* Image area with layered gradient + subtle pattern instead of emoji */}
    <div className={`relative h-64 bg-gradient-to-br ${collection.gradient} overflow-hidden`}>
      {/* Decorative concentric rings to suggest jewelry */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`absolute w-16 h-16 rounded-full border-2 ${collection.border} opacity-40`} />
      </div>

      {/* Soft shimmer overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Preview tag */}
      <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/70 backdrop-blur-sm text-[10px] tracking-widest uppercase text-gray-500 font-semibold select-none">
        Preview
      </div>
    </div>

    {/* Content */}
    <div className="p-6 space-y-3 flex flex-col flex-grow">
      <h3 className="font-serif text-xl font-bold text-jewelry-900 transition-colors group-hover:text-jewelry-800">
        {collection.name}
      </h3>
      <p className="text-sm text-gray-500 leading-relaxed min-h-[40px] flex-grow">
        {collection.description}
      </p>
      <Link 
        href="/products" 
        className={`group/btn inline-flex items-center gap-2 text-sm font-semibold ${collection.accent} pt-2 transition-colors`}
      >
        Explore Now
        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
      </Link>
    </div>
  </div>
);

export default function CollectionsSection() {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-rose-50/40 to-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-xs tracking-[0.3em] uppercase text-rose-500 font-semibold block">
            Curated For You
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-jewelry-900 tracking-wide">
            Our Collections
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
            Explore our carefully curated collections, each designed to celebrate
            your unique style and personality.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map((c) => (
            <CollectionCard key={c.name} collection={c} />
          ))}
        </div>
      </div>
    </section>
  );
}