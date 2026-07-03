import { supabasePublic } from '@/src/lib/supabase';
import HomepageClient from './homepage-client';

function mapStockStatusToFrontend(status) {
  if (status === 'in_stock') return 'In Stock';
  if (status === 'low_stock') return 'Low Stock';
  if (status === 'out_of_stock') return 'Out of Stock';
  return status || 'In Stock';
}

export async function generateMetadata() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001';
  return {
    title: 'Jhumkas by Malti - Handcrafted Traditional Indian Jewelry',
    description: 'Exquisite handcrafted traditional Indian earrings and designer jhumkas. Discover our signature gold plated, Meenakari, Kundan, and Chandbali collections.',
    openGraph: {
      title: 'Jhumkas by Malti - Handcrafted Traditional Indian Jewelry',
      description: 'Exquisite handcrafted traditional Indian earrings and designer jhumkas. Discover our signature gold plated, Meenakari, Kundan, and Chandbali collections.',
      url: siteUrl,
      siteName: 'Jhumkas by Malti',
      type: 'website',
      images: [
        {
          url: `${siteUrl}/images/products/one.jpeg`,
          width: 800,
          height: 800,
          alt: 'Jhumkas by Malti Signature Collection'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Jhumkas by Malti - Handcrafted Traditional Indian Jewelry',
      description: 'Exquisite handcrafted traditional Indian earrings and designer jhumkas. Discover our signature gold plated, Meenakari, Kundan, and Chandbali collections.',
      images: [`${siteUrl}/images/products/one.jpeg`]
    }
  };
}

export default async function Home() {
  const { data } = await supabasePublic
    .from('products')
    .select('*')
    .order('id', { ascending: true });

  const products = (data || []).map((p) => ({
    ...p,
    stockStatus: mapStockStatusToFrontend(p.stock_status),
    images: p.images || [],
    tags: p.tags || [],
    image: p.images?.[0] || '/images/products/one.jpeg'
  }));

  return (
    <HomepageClient initialProducts={products} />
  );
}
