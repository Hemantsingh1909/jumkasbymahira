# Jhumkas by Mahira

A modern e-commerce platform for handcrafted jhumkas (traditional Indian earrings), built with **Next.js 14**, **React 18**, **Redux Toolkit**, and **Tailwind CSS**.

## Features

- 🛍️ Browse and filter products
- 🛒 Shopping cart with persistent storage
- ❤️ Wishlist functionality
- 📦 Checkout process
- 🎨 Beautiful, responsive design
- 📱 Mobile-friendly interface
- 🔍 Product search and filtering

## Tech Stack

- **Frontend Framework**: [Next.js 14](https://nextjs.org/)
- **React**: 18.3.1
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Font Awesome](https://fontawesome.com/) & [React Icons](https://react-icons.github.io/react-icons/)
- **HTTP Client**: [Axios](https://axios-http.com/)

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd jumkasbymahira
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── layout.jsx         # Root layout
│   ├── page.jsx           # Home page
│   ├── products/          # Products page
│   ├── product/[id]/      # Product detail page
│   ├── cart/              # Cart page
│   ├── checkout/          # Checkout page
│   ├── contact/           # Contact page
│   ├── collections/       # Collections page
│   ├── state-collections/ # State collections page
│   └── wishlist/          # Wishlist page
├── src/
│   ├── components/        # React components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── ProductCard.jsx
│   ├── store/             # Redux store configuration
│   │   ├── index.js
│   │   ├── cartSlice.js
│   │   └── productSlice.js
│   ├── assets/            # Images and static files
│   └── index.css          # Global styles
├── public/                # Static files
├── package.json
├── next.config.js         # Next.js configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── jsconfig.json          # JavaScript path configuration
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint

## Features

### Product Management
- Browse all products with filtering options
- Search products by name
- Filter by price range and categories
- Sort by price and name

### Shopping Cart
- Add/remove products from cart
- Update quantities
- Persistent storage using localStorage
- Real-time cart updates

### Wishlist
- Add/remove products from wishlist
- View all wishlist items
- Add wishlist items to cart
- Persistent storage using localStorage

### Checkout
- Form validation
- Order summary
- Multiple payment options
- Order confirmation

## Styling

The project uses Tailwind CSS with custom configurations for jewelry-themed colors:
- Custom color palette with jewelry tones
- Custom fonts (Poppins, Playfair Display, Cinzel)
- Responsive design with mobile-first approach

## Performance

- Next.js 14 App Router for optimal performance
- Image optimization
- Code splitting and lazy loading
- Fast refresh during development

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is private and proprietary to Jhumkas by Mahira.

1. Clone the repository:

   ```
   git clone https://github.com/Hemantsingh1909/jumkasbymahira.git
   cd jumkasbymahira
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Start the development server:

   ```
   npm run dev
   ```

4. Build for production:
   ```
   npm run build
   ```

## Deployment on Vercel

### Method 1: Using Vercel Dashboard

1. Push your code to GitHub (already done)
2. Go to [Vercel](https://vercel.com) and sign up/login
3. Click "Add New" > "Project"
4. Import your GitHub repository
5. Configure the project:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Click "Deploy"

### Method 2: Using Vercel CLI

1. Install Vercel CLI:

   ```
   npm install -g vercel
   ```

2. Deploy to Vercel:

   ```
   vercel --prod
   ```

3. Follow the interactive prompts to complete the deployment

## License

MIT

## Author

Hemant Singh
