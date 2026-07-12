'use client';

import { Suspense } from 'react';
import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';

export default function LayoutWrapper({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Suspense fallback={<div className="h-16 bg-[#FAF6F0]" />}>
        <Navbar />
      </Suspense>
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
