import Link from 'next/link';

export const metadata = {
  title: 'Shipping Policy | Jhumkas by Malti',
  description: 'Learn about our shipping times, delivery rates, and standard free shipping parameters at Jhumkas by Malti.',
};

export default function ShippingPolicy() {
  return (
    <div className="bg-gray-50 py-16 min-h-screen">
      <div className="container-custom max-w-4xl mx-auto px-4">
        <nav className="mb-6 text-sm">
          <Link href="/" className="text-gray-500 hover:text-jewelry-600">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-jewelry-600">Shipping Policy</span>
        </nav>

        <div className="bg-white p-8 md:p-12 rounded-xl shadow-sm border border-gray-100">
          <h1 className="text-4xl font-display font-bold text-jewelry-900 mb-6 border-b border-gray-100 pb-4">
            Shipping Policy
          </h1>
          <p className="text-gray-400 text-xs mb-8">Last Updated: July 3, 2026</p>

          <div className="space-y-6 text-gray-700 leading-relaxed font-sans">
            <p>
              At <strong>Jhumkas by Malti</strong>, we aim to dispatch and deliver your handcrafted jewelry packages safely and efficiently. Below are the details of our delivery operations, times, and shipping fees.
            </p>

            <h2 className="text-xl font-bold text-jewelry-800 pt-4">1. Shipping Fees & Free Shipping</h2>
            <p>
              We calculate shipping fees at checkout based on your order subtotal:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Orders under ₹5,000</strong>: A flat shipping fee of <strong>₹99</strong> is added.</li>
              <li><strong>Orders of ₹5,000 or more</strong>: You receive <strong>Free Shipping</strong> automatically!</li>
            </ul>

            <h2 className="text-xl font-bold text-jewelry-800 pt-4">2. Processing & Delivery Timelines</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Order Processing</strong>: Handcrafted orders are processed and packed within <strong>1-3 business days</strong> from the purchase confirmation date.</li>
              <li><strong>Delivery Times</strong>: Packages are sent via standard courier partners and typically arrive within:
                <ul className="list-circle pl-6 space-y-1 mt-1">
                  <li><strong>Metro Cities</strong>: 3-5 business days.</li>
                  <li><strong>Other Locations / Regions</strong>: 5-8 business days.</li>
                </ul>
              </li>
            </ul>

            <h2 className="text-xl font-bold text-jewelry-800 pt-4">3. Delivery Tracking</h2>
            <p>
              Once your shipment is handed over to our courier partners, we will send you order updates and invoice details via WhatsApp (+91 8238672255) or email. Feel free to reach out to us at any time to check on the delivery progress of your order.
            </p>

            <h2 className="text-xl font-bold text-jewelry-800 pt-4">4. Delivery Failures & Incorrect Addresses</h2>
            <p>
              Please review your shipping details (address, pincode, and phone number) carefully before submitting checkouts. Jhumkas by Malti cannot be held responsible for delayed or failed deliveries caused by incorrect or incomplete addresses provided by the customer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
