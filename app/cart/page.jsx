import CartClient from './cart-client';

export async function generateMetadata() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001';
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
