// src/App.jsx
// eslint-disable-next-line no-unused-vars
import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import CartPage from "./pages/CartPage";
import Checkout from "./pages/Checkout";
import Contact from "./pages/Contact";
import StateCollections from "./pages/StateCollections";
import Collections from "./pages/Collections";
import ProductDetail from "./pages/ProductDetail";
import Wishlist from "./pages/Wishlist";

// Layout component that includes Navbar and Footer
const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet /> {/* This is where the child routes will be rendered */}
      </main>
      <Footer />
    </div>
  );
};

// Create a router with future flags enabled
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true, // This makes it the default route for the parent
          element: <Home />,
        },
        {
          path: "products",
          element: <Products />,
        },
        {
          path: "product/:productId",
          element: <ProductDetail />,
        },
        {
          path: "cart",
          element: <CartPage />,
        },
        {
          path: "checkout",
          element: <Checkout />,
        },
        {
          path: "contact",
          element: <Contact />,
        },
        {
          path: "state-collections",
          element: <StateCollections />,
        },
        {
          path: "collections",
          element: <Collections />,
        },
        {
          path: "wishlist",
          element: <Wishlist />,
        },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
