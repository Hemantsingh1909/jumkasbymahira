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
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) {
      setServerError(null);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name?.trim()) {
      newErrors.name = 'Please enter your full name';
    }
    if (!formData.email?.trim()) {
      newErrors.email = 'Please enter your email address';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    if (!formData.subject?.trim()) {
      newErrors.subject = 'Please enter a message subject';
    }
    if (!formData.message?.trim()) {
      newErrors.message = 'Please write your message';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || submitting) return;

    setSubmitting(true);
    setServerError(null);

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
        setTimeout(() => setSubmitted(false), 6000);
      } else {
        const data = await res.json().catch(() => ({}));
        setServerError(data.error || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      console.error('Contact submit error:', err);
      setServerError('A network error occurred. Please check your connection.');
    } finally {
      setSubmitting(false);
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
            Have questions about our handcrafted jewelry? We&apos;d love to hear from you!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-fit">
            <h3 className="text-xl font-bold text-jewelry-800 mb-4 font-serif">
              Contact Information
            </h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-semibold text-gray-800 mb-0.5">Phone / WhatsApp</p>
                <p className="text-gray-600">
                  <a href="tel:+918238672255" className="hover:text-jewelry-700 font-medium">
                    +91 8238672255
                  </a>
                </p>
              </div>
              <div>
                <p className="font-semibold text-gray-800 mb-0.5">Email</p>
                <p className="text-gray-600">
                  <a href="mailto:sshreecollection593@gmail.com" className="hover:text-jewelry-700 transition-colors">
                    sshreecollection593@gmail.com
                  </a>
                </p>
              </div>
              <div>
                <p className="font-semibold text-gray-800 mb-0.5">Studio Location</p>
                <p className="text-gray-600">India</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-100">
            {submitted && (
              <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-3">
                <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-sm font-medium">
                  Thank you for your message! Our team will get back to you promptly.
                </p>
              </div>
            )}

            {serverError && (
              <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl text-sm font-medium">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Malti Sharma"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-jewelry-500/20 transition-all ${
                    errors.name ? 'border-red-500 bg-red-50/20' : 'border-gray-300'
                  }`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-jewelry-500/20 transition-all ${
                      errors.email ? 'border-red-500 bg-red-50/20' : 'border-gray-300'
                    }`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="phone" className="block text-gray-700 text-sm font-medium mb-1">
                    Phone Number (Optional)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400 text-sm font-medium">+91</span>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      maxLength="10"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="9876543210"
                      className={`w-full pl-12 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-jewelry-500/20 transition-all ${
                        errors.phone ? 'border-red-500 bg-red-50/20' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-gray-700 text-sm font-medium mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g. Order Inquiry / Custom Design"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-jewelry-500/20 transition-all ${
                    errors.subject ? 'border-red-500 bg-red-50/20' : 'border-gray-300'
                  }`}
                />
                {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
              </div>

              <div>
                <label htmlFor="message" className="block text-gray-700 text-sm font-medium mb-1">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Please write your inquiry or message here..."
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-jewelry-500/20 transition-all ${
                    errors.message ? 'border-red-500 bg-red-50/20' : 'border-gray-300'
                  }`}
                ></textarea>
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-jewelry-800 hover:bg-jewelry-900 text-white py-3.5 rounded-xl font-bold transition-all shadow-sm hover:shadow-md disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {submitting ? 'Sending Message...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

