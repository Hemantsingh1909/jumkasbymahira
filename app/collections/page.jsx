'use client';

import Link from 'next/link';

export default function Collections() {
  const collections = [
    {
      id: 'gold',
      name: 'Gold Collection',
      description: 'Timeless gold jhumkas for every occasion',
      image: '✨',
    },
    {
      id: 'kundan',
      name: 'Kundan Collection',
      description: 'Traditional kundan designs with modern aesthetics',
      image: '💎',
    },
    {
      id: 'pearl',
      name: 'Pearl Collection',
      description: 'Elegant pearl earrings for a sophisticated look',
      image: '🤍',
    },
    {
      id: 'silver',
      name: 'Silver Collection',
      description: 'Contemporary silver designs with minimalist elegance',
      image: '⚪',
    },
  ];

  return (
    <div className="bg-gray-50 py-12">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-jewelry-900 mb-4">
            Our Collections
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our carefully curated collections, each designed to celebrate
            your unique style and personality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map((collection) => (
            <div
              key={collection.id}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="h-48 bg-gradient-to-br from-jewelry-50 to-jewelry-100 flex items-center justify-center text-6xl">
                {collection.image}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-jewelry-800 mb-2">
                  {collection.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {collection.description}
                </p>
                <Link
                  href="/products"
                  className="inline-block bg-jewelry-600 text-white py-2 px-4 rounded hover:bg-jewelry-700 transition-colors text-sm font-medium"
                >
                  Explore Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
