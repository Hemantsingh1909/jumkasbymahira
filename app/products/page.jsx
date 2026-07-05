import { Suspense } from 'react';
import { unstable_cache } from 'next/cache';
import { supabasePublic, getSiteUrl } from '@/src/lib/supabase';
import ProductsContent from './products-content';

function mapStockStatusToFrontend(status) {
  if (status === 'in_stock') return 'In Stock';
  if (status === 'low_stock') return 'Low Stock';
  if (status === 'out_of_stock') return 'Out of Stock';
  return status || 'In Stock';
}

const getCachedProducts = unstable_cache(
  async () => {
    const { data } = await supabasePublic
      .from('products')
      .select('*')
      .order('id', { ascending: true });
    return data || [];
  },
  ['products-list'],
  { revalidate: 60, tags: ['products'] }
);

export async function generateMetadata() {
  const siteUrl = getSiteUrl();
  return {
    title: 'Handcrafted Jhumkas & Earrings Collection | Jhumkas by Malti',
    description: 'Explore the ultimate collection of handcrafted luxury Indian earrings, traditional Gold Jhumkas, Chandbali, Kundan, and designer wedding jewelry sets.',
    openGraph: {
      title: 'Handcrafted Jhumkas & Earrings Collection | Jhumkas by Malti',
      description: 'Explore the ultimate collection of handcrafted luxury Indian earrings, traditional Gold Jhumkas, Chandbali, Kundan, and designer wedding jewelry sets.',
      url: `${siteUrl}/products`,
      siteName: 'Jhumkas by Malti',
      type: 'website',
      images: [
        {
          url: `${siteUrl}/images/products/one.jpeg`,
          width: 800,
          height: 800,
          alt: 'Jhumkas by Malti Catalog'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Handcrafted Jhumkas & Earrings Collection | Jhumkas by Malti',
      description: 'Explore the ultimate collection of handcrafted luxury Indian earrings, traditional Gold Jhumkas, Chandbali, Kundan, and designer wedding jewelry sets.',
      images: [`${siteUrl}/images/products/one.jpeg`]
    }
  };
}

export default async function ProductsPage({ searchParams }) {
  const data = await getCachedProducts();

  const products = data.map((p) => ({
    ...p,
    stockStatus: mapStockStatusToFrontend(p.stock_status),
    images: p.images || [],
    tags: p.tags || [],
    image: p.images?.[0] || '/images/products/one.jpeg'
  }));

  return (
    <ProductsContent initialProducts={products} searchParams={searchParams} />
  );
}

