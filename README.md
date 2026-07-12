# Jhumkas by Malti

A premium e-commerce platform for handcrafted jhumkas and traditional Indian earrings, built with **Next.js 16**, **React 19**, **Redux Toolkit**, **Supabase**, and **Tailwind CSS**.

---

## Features

- 🛍️ **Browse & Filter Products**: Dynamic catalog page with granular sidebar filters for Price Range, Categories, Materials, Occasions, and Colors.
- 🔍 **Expanded search indexing**: Search matches against product name, SKU, tags, description, category, material, occasion, and color.
- 🎡 **Dynamic Hero Banner**: An automatic sliding carousel featuring top-anchored banner images, smooth ease-in-out zoom-out animations, and a left-aligned typography layout with gradient overlays.
- 🛒 **Shopping Cart & Wishlist**: Fully persistent, client-side cart and wishlist state management using Redux Toolkit and `localStorage`.
- 🔐 **Secure Admin Dashboard**: Administrative interfaces authenticated and verified via Supabase session validation.
- 🎨 **Premium Visual Branding**: Custom brand favicon (`favicon.ico`) and high-resolution logo (`icon.png`) integrated seamlessly with Next.js App Router metadata.
- ⚡ **Optimized Asset Performance**: Compressed media assets (91% file size reduction) for enhanced Largest Contentful Paint (LCP) performance.

---

## Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Core Library**: [React 19](https://react.dev/)
- **Backend Database**: [Supabase JS Client](https://supabase.com/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Font Awesome](https://fontawesome.com/) & [Lucide React](https://lucide.dev/)
- **Client Client**: [Axios](https://axios-http.com/)

---

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Hemantsingh1909/jumkasbymahira.git
   cd jumkasbymahira
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
npm run build
npm start
```

---

## Project Structure

```text
├── app/                    # Next.js App Router Pages & Routes
│   ├── layout.jsx          # Root layout and brand metadata
│   ├── page.jsx            # Home page (Server Component)
│   ├── homepage-client.jsx # Home page (Client Component, sliding banner)
│   ├── products/           # Catalog list and filter view
│   ├── product/[id]/       # Product detail page
│   ├── cart/               # Cart page
│   ├── checkout/           # Checkout flow
│   ├── collections/        # Collections listing
│   └── wishlist/           # Wishlist page
├── src/
│   ├── components/         # Reusable React components (Navbar, Footer, ProductCard)
│   ├── store/              # Redux store slice configuration (cart, products)
│   ├── assets/             # Brand logos and vector assets
│   └── index.css           # Custom CSS animations and Tailwind rules
├── public/                 # Static images, assets, and robots configurations
│   ├── favicon.ico         # Generated favicon file
│   └── images/
│       ├── hero/           # Optimized slider images (.jpg)
│       └── products/       # Product gallery photos
```

---

## License

This project is private and proprietary to **Jhumkas by Malti**.

MIT License.
