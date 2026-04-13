import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

function App() {
  return (
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
                <Route path="/"           element={<HomePage />} />
                <Route path="/shop"       element={<ShopPage />} />
                <Route path="/interior"   element={<InteriorPage />} />
                <Route path="/exterior"   element={<ExteriorPage />} />
                <Route path="/builder"    element={<BuilderPage />} />
                <Route path="/contact"    element={<ContactPage />} />
                <Route path="/supplier"  element={<SupplierPage />} />
                <Route path="/product/:slug" element={<ProductPage />} />
              </Routes>
            </AppLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
