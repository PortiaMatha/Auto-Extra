import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { SupplierProvider } from "./context/SupplierContext";
import { ProductsProvider } from "./context/ProductsContext";
import { OrdersProvider } from "./context/OrdersContext";
import { AppLayout } from "./components/layout/AppLayout";
import { HomePage } from "./components/home";
import { ProductPage } from "./components/Product";
import { PortalLayout } from "./components/portal/PortalLayout";
import { ShopPage } from "./components/shop/ShopPage";
import { InteriorPage } from "./components/interior/InteriorPage";
import { ExteriorPage } from "./components/exterior/ExteriorPage";
import { BuilderPage } from "./components/builder/BuilderPage";
import { ContactPage } from "./components/contact/ContactPage";
import { SupplierPage } from "./components/supplier/SupplierPage";
import { CartPage } from "./components/cart/CartPage";
import { AccountPage } from "./components/account/AccountPage";
import { SignInPage } from "./components/account/SignInPage";
import { HelpPage } from "./components/help/HelpPage";
import { WishlistPage } from "./components/wishlist/WishlistPage";
import { CheckoutPage } from "./components/checkout/CheckoutPage";
import { CheckoutSuccess } from "./components/checkout/CheckoutSuccess";
import { CheckoutCancel } from "./components/checkout/CheckoutCancel";

function App() {
  return (
    <ProductsProvider>
    <OrdersProvider>
    <SupplierProvider>
    <WishlistProvider>
    <CartProvider>
    <Router>
      <Routes>
        {/* Retail Partner Portal — standalone layout */}
        <Route path="/portal/*" element={<PortalLayout />} />

        {/* Main storefront — all share AppLayout (header + footer) */}
        <Route
          path="/*"
          element={
            <AppLayout>
              <Routes>
                <Route path="/"              element={<HomePage />} />
                <Route path="/shop"          element={<ShopPage />} />
                <Route path="/interior"      element={<InteriorPage />} />
                <Route path="/exterior"      element={<ExteriorPage />} />
                <Route path="/builder"       element={<BuilderPage />} />
                <Route path="/contact"       element={<ContactPage />} />
                <Route path="/supplier"      element={<SupplierPage />} />
                <Route path="/product/:slug" element={<ProductPage />} />
                <Route path="/cart"          element={<CartPage />} />
                <Route path="/account"       element={<AccountPage />} />
                <Route path="/signin"        element={<SignInPage />} />
                <Route path="/help"              element={<HelpPage />} />
                <Route path="/wishlist"          element={<WishlistPage />} />
                <Route path="/checkout"          element={<CheckoutPage />} />
                <Route path="/checkout/success"  element={<CheckoutSuccess />} />
                <Route path="/checkout/cancel"   element={<CheckoutCancel />} />
              </Routes>
            </AppLayout>
          }
        />
      </Routes>
    </Router>
    </CartProvider>
    </WishlistProvider>
    </SupplierProvider>
    </OrdersProvider>
    </ProductsProvider>
  );
}

export default App;
