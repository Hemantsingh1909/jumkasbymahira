import { Suspense } from 'react';
import { unstable_cache } from 'next/cache';
import { supabasePublic, getSiteUrl } from '@/src/lib/supabase';
import ProductsContent from '../products/products-content';

function mapStockStatusToFrontend(status) {
  if (status === 'in_stock') return 'In Stock';
  if (status === 'low_stock') return 'Low Stock';
  if (status === 'out_of_stock') return 'Out of Stock';
  return status || 'In Stock';
}

const getCachedBestSellers = unstable_cache(
  async () => {
    const { data } = await supabasePublic
      .from('products')
      .select('*')
      .order('created_at', { ascending: true });
    return data || [];
  },
  ['best-sellers-list'],
  { revalidate: 60, tags: ['products'] }
);

export async function generateMetadata() {
  const siteUrl = getSiteUrl();
  return {
    title: 'Best Sellers | Handcrafted Jhumkas & Earrings | Jhumkas by Malti',
    description: 'Browse our most popular and bestselling traditional gold Jhumkas, designer Chandbalis, and exquisite handcrafted earrings.',
    openGraph: {
      title: 'Best Sellers | Handcrafted Jhumkas & Earrings | Jhumkas by Malti',
      description: 'Browse our most popular and bestselling traditional gold Jhumkas, designer Chandbalis, and exquisite handcrafted earrings.',
      url: `${siteUrl}/best-sellers`,
      siteName: 'Jhumkas by Malti',
      type: 'website',
    }
  };
}

export default async function BestSellersPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const data = await getCachedBestSellers();

  const products = data.map((p) => ({
    ...p,
    stockStatus: mapStockStatusToFrontend(p.stock_status),
    images: p.images || [],
    tags: p.tags || [],
    image: p.images?.[0] || '/images/products/one.jpeg'
  }));

  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center text-gray-500">Loading catalog...</div>}>
      <ProductsContent initialProducts={products} searchParams={resolvedSearchParams} title="Best Sellers" />
    </Suspense>
  );
}
