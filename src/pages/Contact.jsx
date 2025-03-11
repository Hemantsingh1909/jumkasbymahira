import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid.";
    if (!formData.message) newErrors.message = "Message is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted", formData);
      setSubmitted(true);
      // Reset form after submission
      setFormData({
        name: "",
        email: "",
        message: "",
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-4 text-rose-700">
        Contact Us
      </h1>
      <p className="text-lg text-gray-600 mb-8 text-center">
        We'd love to hear from you! Send us a message and we'll get back to you
        as soon as possible.
      </p>

      {submitted ? (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative max-w-lg mx-auto mb-8"
          role="alert"
        >
          <strong className="font-bold">Thank you!</strong>
          <span className="block sm:inline">
            {" "}
            Your message has been sent successfully. We'll get back to you soon.
          </span>
        </div>
      ) : null}

      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md"
      >
        <div className="mb-6">
          <label
            htmlFor="name"
            className="block text-gray-700 font-medium mb-2"
          >
            Your Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-500"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div className="mb-6">
          <label
            htmlFor="email"
            className="block text-gray-700 font-medium mb-2"
          >
            Your Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-500"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div className="mb-6">
          <label
            htmlFor="message"
            className="block text-gray-700 font-medium mb-2"
          >
            Your Message
          </label>
          <textarea
            id="message"
            name="message"
            placeholder="Enter your message"
            value={formData.message}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-500"
            rows="5"
          ></textarea>
          {errors.message && (
            <p className="text-red-500 text-sm mt-1">{errors.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-rose-600 text-white py-3 px-4 rounded-md hover:bg-rose-700 transition-colors font-medium"
        >
          Send Message
        </button>
      </form>

      <div className="max-w-lg mx-auto mt-12 text-center">
        <h2 className="text-2xl font-semibold text-rose-700 mb-4">
          Visit Our Store
        </h2>
        <p className="text-gray-600 mb-2">123 Jewelry Lane, Fashion District</p>
        <p className="text-gray-600 mb-2">Mumbai, Maharashtra 400001</p>
        <p className="text-gray-600 mb-2">Email: info@jhumkasbymahira.com</p>
        <p className="text-gray-600">Phone: +91 98765 43210</p>
      </div>
    </div>
  );
}
