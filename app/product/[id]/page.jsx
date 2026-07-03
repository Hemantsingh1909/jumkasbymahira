import { notFound } from 'next/navigation';
import { supabasePublic, getSiteUrl } from '@/src/lib/supabase';
import ProductDetailClient from './product-detail-client';

function mapStockStatusToFrontend(status) {
  if (status === 'in_stock') return 'In Stock';
  if (status === 'low_stock') return 'Low Stock';
  if (status === 'out_of_stock') return 'Out of Stock';
  return status || 'In Stock';
}

export async function generateMetadata({ params }) {
  const { id } = params;
  
  const { data: product } = await supabasePublic
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (!product) {
    return {
      title: 'Product Not Found | Jhumkas by Malti',
      description: 'The requested product could not be found.'
    };
  }

  const siteUrl = getSiteUrl();
  const imageUrl = `${siteUrl}${product.images?.[0] || '/images/products/one.jpeg'}`;

  return {
    title: `${product.name} - Handcrafted Indian Earrings | Jhumkas by Malti`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: `${product.description} - Price: ₹${product.price}`,
      url: `${siteUrl}/product/${id}`,
      siteName: 'Jhumkas by Malti',
      type: 'og:product',
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: product.name
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description,
      images: [imageUrl]
    }
  };
}

export default async function ProductDetailPage({ params }) {
  const { id } = params;
  
  const { data: product } = await supabasePublic
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (!product) {
    notFound();
  }

  // Get similar products based on category or price similarity
  const { data: allProducts } = await supabasePublic
    .from('products')
    .select('*');

  const similar = (allProducts || [])
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.category === product.category || Math.abs(p.price - product.price) < 4000)
    )
    .slice(0, 4)
    .map(p => ({
      ...p,
      stockStatus: mapStockStatusToFrontend(p.stock_status),
      images: p.images || [],
      tags: p.tags || [],
      image: p.images?.[0] || '/images/products/one.jpeg'
    }));

  const normalizedProduct = {
    ...product,
    stockStatus: mapStockStatusToFrontend(product.stock_status),
    images: product.images || [],
    tags: product.tags || [],
    image: product.images?.[0] || '/images/products/one.jpeg'
  };

  return (
    <ProductDetailClient 
      product={normalizedProduct} 
      relatedProducts={similar} 
    />
  );
}
