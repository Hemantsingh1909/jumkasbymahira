import CartClient from './cart-client';
import { getSiteUrl } from '@/src/lib/supabase';

export async function generateMetadata() {
  const siteUrl = getSiteUrl();
  return {
    title: 'Shopping Cart | Jhumkas by Malti',
    description: 'Review the exquisite handcrafted Indian earrings in your shopping cart and proceed to secure checkout.',
    openGraph: {
      title: 'Shopping Cart | Jhumkas by Malti',
      description: 'Review the exquisite handcrafted Indian earrings in your shopping cart and proceed to secure checkout.',
      url: `${siteUrl}/cart`,
      siteName: 'Jhumkas by Malti',
      type: 'website',
      images: [
        {
          url: `${siteUrl}/images/products/one.jpeg`,
          width: 800,
          height: 800,
          alt: 'Jhumkas by Malti'
        }
      ]
    }
  };
}

export default function CartPage() {
  return <CartClient />;
}
