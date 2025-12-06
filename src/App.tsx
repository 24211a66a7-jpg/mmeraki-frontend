import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { LocationProvider } from "./context/LocationContext";

// Customer Pages
import Home from "./pages/Home";
import OccasionPage from "./pages/OccasionPage";
import EventDetail from "./pages/EventDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import HelpCenter from "./pages/HelpCenter";

// Category Pages

// Admin Pages
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/Dashboard";
import AdminEvents from "./admin/Events";
import AdminOrders from "./admin/Orders";
import AdminUsers from "./admin/Users";
import AdminReports from "./admin/Reports";
import AdminLogin from "./admin/AdminLogin";
import RequireAdmin from "./admin/RequireAdmin";


import NotFound from "./pages/NotFound";
import CategoryListing from "./pages/CategoryListing";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <LocationProvider>
          <CartProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
            <Routes>
              {/* Customer Routes */}
              <Route path="/" element={<Home />} />
              
              {/* Main Categories */}
              <Route path="/anniversary" element={<OccasionPage />} />
              <Route path="/birthdays" element={<OccasionPage />} />
              <Route path="/birthdays/:slug/*" element={<CategoryListing />} />
              <Route path="/gifts" element={<OccasionPage />} />
              <Route path="/candlelight" element={<OccasionPage />} />
              <Route path="/decorations" element={<OccasionPage />} />
              <Route path="/festivals" element={<OccasionPage />} />
              <Route path="/kids" element={<OccasionPage />} />
              <Route path="/corporate" element={<OccasionPage />} />
              
              {/* Subcategory listings (from mega menu): /experience/:subcategory */}
              <Route path="/experience/:slug" element={<CategoryListing />} />
              
              {/* Generic listing for deep dropdown links: /:category/:slug and deeper */}
              <Route path="/:category/:slug/*" element={<CategoryListing />} />
              
              {/* Event Details by slug */}
              <Route path="/event/:slug" element={<EventDetail />} />
              
              {/* Other Pages */}
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/help" element={<HelpCenter />} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
                <Route path="events" element={<AdminEvents />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="users" element={<RequireAdmin><AdminUsers /></RequireAdmin>} />
                <Route path="reports" element={<RequireAdmin><AdminReports /></RequireAdmin>} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
            </BrowserRouter>
            </CartProvider>
        </LocationProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
