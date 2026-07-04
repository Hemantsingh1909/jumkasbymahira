import { supabasePublic, getSiteUrl } from '@/src/lib/supabase';

export default async function sitemap() {
  const siteUrl = getSiteUrl();

  // Base routes
  const routes = [
    '', 
    '/products', 
    '/collections', 
    '/contact', 
    '/wishlist', 
    '/cart', 
    '/checkout', 
    '/admin',
    '/privacy-policy',
    '/terms-of-service',
    '/shipping-policy'
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Dynamic product routes from Supabase
  let productRoutes = [];
  try {
    const { data: products } = await supabasePublic
      .from('products')
      .select('id');
    
    if (products) {
      productRoutes = products.map((product) => ({
        url: `${siteUrl}/product/${product.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
      }));
    }
  } catch (error) {
    console.error('Error generating sitemap products:', error);
  }

  return [...routes, ...productRoutes];
}
