import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | Jhumkas by Malti',
  description: 'Understand the terms and guidelines for purchasing handcrafted jewelry from Jhumkas by Malti.',
};

export default function TermsOfService() {
  return (
    <div className="bg-gray-50 py-16 min-h-screen">
      <div className="container-custom max-w-4xl mx-auto px-4">
        <nav className="mb-6 text-sm">
          <Link href="/" className="text-gray-500 hover:text-jewelry-600">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-jewelry-600">Terms of Service</span>
        </nav>

        <div className="bg-white p-8 md:p-12 rounded-xl shadow-sm border border-gray-100">
          <h1 className="text-4xl font-display font-bold text-jewelry-900 mb-6 border-b border-gray-100 pb-4">
            Terms of Service
          </h1>
          <p className="text-gray-400 text-xs mb-8">Last Updated: July 3, 2026</p>

          <div className="space-y-6 text-gray-700 leading-relaxed font-sans">
            <p>
              Welcome to <strong>Jhumkas by Malti</strong>. By accessing our storefront or purchasing products from us, you agree to comply with and be bound by the following Terms of Service. Please review them carefully before placing an order.
            </p>

            <h2 className="text-xl font-bold text-jewelry-800 pt-4">1. Order Placement and Processing</h2>
            <p>
              By submitting a checkout order form on our website, you make an offer to purchase handcrafted earrings. All orders require:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>A valid shipping address and customer name.</li>
              <li>A valid phone number for confirmation and delivery coordination.</li>
            </ul>
            <p>
              We reserve the right to decline or cancel any order if the shipping details are incomplete or if the items are temporarily out of stock.
            </p>

            <h2 className="text-xl font-bold text-jewelry-800 pt-4">2. Pricing and Availability</h2>
            <p>
              All prices listed on the site are in Indian Rupees (INR) and are subject to change without notice. While we strive to maintain accurate catalog information, database errors may occur. In the event of a listing error, we will contact you to confirm the correct details before processing the shipment.
            </p>

            <h2 className="text-xl font-bold text-jewelry-800 pt-4">3. Payments and COD</h2>
            <p>
              We currently offer **Cash on Delivery (COD)** as our primary payment method. 
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You agree to pay the complete order invoice value in cash or standard local digital modes (if supported by the courier agent) upon package delivery.</li>
              <li>Refusal of delivery on confirmed COD orders without a valid reason may result in suspension of future checkout privileges.</li>
            </ul>

            <h2 className="text-xl font-bold text-jewelry-800 pt-4">4. Intellectual Property</h2>
            <p>
              All content, logo graphics, product names, images, descriptions, and designs featured on this website are the property of Jhumkas by Malti and are protected under copyright laws. Unauthorized reproduction or use is strictly prohibited.
            </p>

            <h2 className="text-xl font-bold text-jewelry-800 pt-4">5. Governing Law</h2>
            <p>
              These Terms of Service are governed by and construed in accordance with the laws of India. Any disputes arising out of these terms shall be subject to the exclusive jurisdiction of the competent courts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
