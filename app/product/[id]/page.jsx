import { notFound } from 'next/navigation';
import { unstable_cache } from 'next/cache';
import { supabasePublic, getSiteUrl } from '@/src/lib/supabase';
import ProductDetailClient from './product-detail-client';
import { parseProductId } from '@/src/lib/slug';

function mapStockStatusToFrontend(status) {
  if (status === 'in_stock') return 'In Stock';
  if (status === 'low_stock') return 'Low Stock';
  if (status === 'out_of_stock') return 'Out of Stock';
  return status || 'In Stock';
}

const getCachedProduct = (id) => unstable_cache(
  async () => {
    const { data } = await supabasePublic
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    return data;
  },
  [`product-detail-${id}`],
  { revalidate: 60, tags: [`product-${id}`] }
)();

const getCachedRelatedProducts = (id, category) => unstable_cache(
  async () => {
    let related = [];
    if (category) {
      const { data: catProducts } = await supabasePublic
        .from('products')
        .select('*')
        .neq('id', id)
        .eq('category', category)
        .limit(4);
      related = catProducts || [];
    }

    if (related.length < 4) {
      const { data: fillProducts } = await supabasePublic
        .from('products')
        .select('*')
        .neq('id', id)
        .limit(4 - related.length);
      related = [...related, ...(fillProducts || [])];
    }
    return related;
  },
  [`product-related-${id}`],
  { revalidate: 60, tags: [`product-related-${id}`] }
)();

export async function generateMetadata({ params }) {
  const { id: rawId } = await params;   // ✅ awaited
  const id = parseProductId(rawId);
  const product = await getCachedProduct(id);

  if (!product) {
    return {
      title: 'Product Not Found | Jhumkas by Malti',
      description: 'The requested product could not be found.'
    };
  }

  const siteUrl = getSiteUrl();
  const rawImage = product.images?.[0] || '/images/products/one.jpeg';
  const imageUrl = rawImage.startsWith('http') ? rawImage : `${siteUrl}${rawImage}`;

  return {
    title: `${product.name} - Handcrafted Indian Earrings | Jhumkas by Malti`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: `${product.description} - Price: ₹${product.price}`,
      url: `${siteUrl}/product/${id}`,
      siteName: 'Jhumkas by Malti',
      type: 'website',
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
  const { id: rawId } = await params;   // ✅ awaited
  const id = parseProductId(rawId);
  const product = await getCachedProduct(id);   // ← add this back

  if (!product) {
    notFound();
  }

  // Get cached similar products
  const relatedProducts = await getCachedRelatedProducts(product.id, product.category);

  const similar = relatedProducts.map(p => ({
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


