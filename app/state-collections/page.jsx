'use client';

import Link from 'next/link';

export default function StateCollections() {
  const stateCollections = [
    {
      id: 'rajasthan',
      name: 'Rajasthan',
      description: 'Known for vibrant colors and intricate meenakari work',
    },
    {
      id: 'gujarat',
      name: 'Gujarat',
      description: 'Features delicate filigree work and colorful beads',
    },
    {
      id: 'tamilnadu',
      name: 'Tamil Nadu',
      description: 'Characterized by temple-inspired designs',
    },
    {
      id: 'karnataka',
      name: 'Karnataka',
      description: 'Famous for traditional Kasuti embroidery-inspired designs',
    },
    {
      id: 'bengal',
      name: 'West Bengal',
      description: 'Renowned for intricate filigree work and Dokra art',
    },
    {
      id: 'kashmir',
      name: 'Kashmir',
      description: 'Celebrated for delicate enamel work and nature motifs',
    },
    {
      id: 'kerala',
      name: 'Kerala',
      description: 'Known for traditional temple jewelry designs',
    },
    {
      id: 'up',
      name: 'Uttar Pradesh',
      description: 'Famous for Kundan and Polki work from Varanasi',
    },
  ];

  return (
    <div className="bg-gray-50 py-12">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-jewelry-900 mb-4">
            Jhumkas Across India
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore the rich diversity of jhumka styles from different states
            of India, each with its unique cultural heritage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stateCollections.map((state) => (
            <div
              key={state.id}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="h-48 bg-gradient-to-br from-jewelry-50 to-jewelry-100 flex items-center justify-center text-6xl">
                🏛️
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-jewelry-800 mb-2">
                  {state.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {state.description}
                </p>
                <Link
                  href="/products"
                  className="inline-block bg-jewelry-600 text-white py-2 px-4 rounded hover:bg-jewelry-700 transition-colors text-sm font-medium"
                >
                  Explore
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
