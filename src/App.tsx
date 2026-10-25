
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import Index from "./pages/Index";
import About from "./pages/About";
import Itineraries from "./pages/Itineraries";
import TourDetails from "./pages/TourDetails";
import Gallery from "./pages/Gallery";
import Testimonials from "./pages/Testimonials";
import Map from "./pages/Map";
import Contact from "./pages/Contact us";
import SavedTours from "./pages/SavedTours";
import Footer from "./components/Footer";


import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/Admin";



const queryClient = new QueryClient();

const MainLayout = () => (
  <div className="flex min-h-screen flex-col">
    <div className="flex-1">
      <Outlet />
    </div>
    <Footer />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <BrowserRouter>
        <Routes>

            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<Admin />} />


            <Route element={<MainLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/itineraries" element={<Itineraries />} />
            <Route path="/itineraries/:id" element={<TourDetails />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/map" element={<Map />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/saved" element={<SavedTours />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
