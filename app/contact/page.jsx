'use client';

import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        alert('Failed to send message. Please try again.');
      }
    } catch (err) {
      console.error('Contact submit error:', err);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="bg-gray-50 py-12">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-jewelry-900 mb-4">
            Get in Touch
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have questions about our products? We&apos;d love to hear from you!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-jewelry-800 mb-4">
              Contact Information
            </h3>
            <div className="space-y-4">
              <div>
                <p className="font-medium text-gray-800 mb-1">Phone</p>
                <p className="text-gray-600">+91 8238672255</p>
              </div>
              <div>
                <p className="font-medium text-gray-800 mb-1">Email</p>
                <p className="text-gray-600">
                  <a href="mailto:sshreecollection593@gmail.com" className="hover:text-jewelry-600 transition-colors">
                    sshreecollection593@gmail.com
                  </a>
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-800 mb-1">Address</p>
                <p className="text-gray-600">India</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm">
            {submitted && (
              <div className="mb-4 bg-green-50 border border-green-200 text-green-800 p-4 rounded">
                Thank you for your message. We&apos;ll get back to you soon!
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-jewelry-400"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-jewelry-400"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-jewelry-400"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-jewelry-400"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-jewelry-400"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-jewelry-600 text-white py-3 rounded font-medium hover:bg-jewelry-700 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
