'use client';

import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';

export default function LayoutWrapper({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
