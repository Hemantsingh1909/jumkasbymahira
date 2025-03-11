import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import store from "./store";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Collections from "./pages/Collections";
import StateCollections from "./pages/StateCollections";
import CartPage from "./pages/CartPage";
import Contact from "./pages/Contact";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
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
          path: "collections",
          element: <Collections />,
        },
        {
          path: "state-collections",
          element: <StateCollections />,
        },
        {
          path: "cart",
          element: <CartPage />,
        },
        {
          path: "contact",
          element: <Contact />,
        },
        {
          path: "product/:productId",
          element: <ProductDetail />,
        },
        {
          path: "checkout",
          element: <Checkout />,
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

const AppWrapper = () => {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
};

export default AppWrapper;
