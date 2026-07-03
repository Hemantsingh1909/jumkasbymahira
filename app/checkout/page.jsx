import CheckoutClient from './checkout-client';
import { getSiteUrl } from '@/src/lib/supabase';

export async function generateMetadata() {
  const siteUrl = getSiteUrl();
  return {
    title: 'Checkout | Jhumkas by Malti',
    description: 'Provide your shipping address and complete your order for handcrafted jewelry.',
    openGraph: {
      title: 'Checkout | Jhumkas by Malti',
      description: 'Provide your shipping address and complete your order for handcrafted jewelry.',
      url: `${siteUrl}/checkout`,
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

export default function CheckoutPage() {
  return <CheckoutClient />;
}
