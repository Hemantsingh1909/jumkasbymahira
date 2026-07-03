import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | Jhumkas by Malti',
  description: 'Learn how Jhumkas by Malti handles, collects, and protects your personal shipping and purchase information.',
};

export default function PrivacyPolicy() {
  return (
    <div className="bg-gray-50 py-16 min-h-screen">
      <div className="container-custom max-w-4xl mx-auto px-4">
        <nav className="mb-6 text-sm">
          <Link href="/" className="text-gray-500 hover:text-jewelry-600">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-jewelry-600">Privacy Policy</span>
        </nav>

        <div className="bg-white p-8 md:p-12 rounded-xl shadow-sm border border-gray-100">
          <h1 className="text-4xl font-display font-bold text-jewelry-900 mb-6 border-b border-gray-100 pb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-400 text-xs mb-8">Last Updated: July 3, 2026</p>

          <div className="space-y-6 text-gray-700 leading-relaxed font-sans">
            <p>
              At <strong>Jhumkas by Malti</strong>, we prioritize the privacy and security of our customers. This Privacy Policy details how we collect, use, and safeguard the information you provide when visiting our website or ordering from us.
            </p>

            <h2 className="text-xl font-bold text-jewelry-800 pt-4">1. Information We Collect</h2>
            <p>
              To complete your order, you must provide us with certain details during checkout. This includes your:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Name (First and Last name)</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Delivery address (Street address, City, State, and Pincode)</li>
              <li>Purchased item details and quantities</li>
            </ul>

            <h2 className="text-xl font-bold text-jewelry-800 pt-4">2. How We Use Your Information</h2>
            <p>
              We use your personal data specifically for store operations, including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Processing, completing, and shipping your orders.</li>
              <li>Providing invoice confirmations via WhatsApp or email.</li>
              <li>Communicating with you regarding delivery statuses or customer support queries.</li>
              <li>Sending occasional marketing newsletters (only if you explicitly opt-in).</li>
            </ul>

            <h2 className="text-xl font-bold text-jewelry-800 pt-4">3. Data Sharing & Retention</h2>
            <p>
              We do not sell, rent, or trade your personal information. Your delivery data is shared strictly with trusted shipping courier partners to deliver your packages. We retain order logs securely in our database as required for accounting, tax, and customer history lookup purposes.
            </p>

            <h2 className="text-xl font-bold text-jewelry-800 pt-4">4. Security</h2>
            <p>
              We use secure industry-standard connections (HTTPS) and store customer order lists in a protected Supabase environment with Row Level Security (RLS) policies to defend against unauthorized data leaks.
            </p>

            <h2 className="text-xl font-bold text-jewelry-800 pt-4">5. Your Rights & Contacts</h2>
            <p>
              You have the right to access, edit, or request deletion of your personal details at any time. For privacy inquiries, please contact us on WhatsApp at <strong>+91 8238672255</strong> or email us at <strong>sshreecolllection593@gmail.com</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
