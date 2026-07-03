import Link from 'next/link';
import { getSiteUrl } from '@/src/lib/supabase';

export async function generateMetadata() {
  const siteUrl = getSiteUrl();
  return {
    title: 'State-wise Jhumka Collections | Jhumkas by Malti',
    description: 'Explore traditional Indian earrings styled uniquely by state, including heritage collections from Rajasthan, Gujarat, Tamil Nadu, and Kashmir.',
    openGraph: {
      title: 'State-wise Jhumka Collections | Jhumkas by Malti',
      description: 'Explore traditional Indian earrings styled uniquely by state, including heritage collections from Rajasthan, Gujarat, Tamil Nadu, and Kashmir.',
      url: `${siteUrl}/state-collections`,
      siteName: 'Jhumkas by Malti',
      type: 'website',
      images: [
        {
          url: `${siteUrl}/images/collections/1.svg`,
          width: 800,
          height: 800,
          alt: 'Rajasthan Jhumka Collection'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: 'State-wise Jhumka Collections | Jhumkas by Malti',
      description: 'Explore traditional Indian earrings styled uniquely by state, including heritage collections from Rajasthan, Gujarat, Tamil Nadu, and Kashmir.',
      images: [`${siteUrl}/images/collections/1.svg`]
    }
  };
}

export default function StateCollections() {
  const stateCollections = [
    {
      id: 'rajasthan',
      name: 'Rajasthan',
      image: '/images/collections/1.svg',
      description: 'Known for vibrant colors and intricate meenakari work',
    },
    {
      id: 'gujarat',
      name: 'Gujarat',
      image: '/images/collections/2.svg',
      description: 'Features delicate filigree work and colorful beads',
    },
    {
      id: 'tamilnadu',
      name: 'Tamil Nadu',
      image: '/images/collections/3.svg',
      description: 'Characterized by temple-inspired designs',
    },
    {
      id: 'karnataka',
      name: 'Karnataka',
      image: '/images/collections/4.svg',
      description: 'Famous for traditional Kasuti embroidery-inspired designs',
    },
    {
      id: 'bengal',
      name: 'West Bengal',
      image: '/images/collections/5.svg',
      description: 'Renowned for intricate filigree work and Dokra art',
    },
    {
      id: 'kashmir',
      name: 'Kashmir',
      image: '/images/collections/6.svg',
      description: 'Celebrated for delicate enamel work and nature motifs',
    },
    {
      id: 'kerala',
      name: 'Kerala',
      image: '/images/collections/7.svg',
      description: 'Known for traditional temple jewelry designs',
    },
    {
      id: 'up',
      name: 'Uttar Pradesh',
      image: '/images/collections/8.svg',
      description: 'Famous for Kundan and Polki work from Varanasi',
    },
  ];

  return (
    <div className="bg-gray-50 py-12">
      <div className="container-custom">
        <div className="text-center mb-12">
          <nav className="flex justify-center mb-4 text-sm">
            <Link href="/" className="text-gray-500 hover:text-jewelry-600">
              Home
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-jewelry-600">State Collections</span>
          </nav>
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
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between border border-gray-100"
            >
              <div>
                <div className="h-48 bg-jewelry-50/50 flex items-center justify-center p-4 border-b border-gray-50">
                  <img
                    src={state.image}
                    alt={state.name}
                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-jewelry-800 mb-2">
                    {state.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {state.description}
                  </p>
                </div>
              </div>
              <div className="px-6 pb-6 pt-0">
                <Link
                  href={`/products?search=${encodeURIComponent(state.name)}`}
                  className="inline-block bg-jewelry-600 hover:bg-jewelry-700 text-white py-2.5 px-5 rounded font-bold transition-all text-sm shadow-sm hover:shadow active:scale-95 text-center w-full"
                >
                  Explore Collection
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
