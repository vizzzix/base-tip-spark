import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from 'next-themes';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import Index from "./pages/Index";
import ForCreators from "./pages/ForCreators";
import Create from "./pages/Create";
import Creator from "./pages/Creator";
import Leaderboard from "./pages/Leaderboard";
import DonorProfilePage from "./pages/DonorProfile";
import NotFound from "./pages/NotFound";

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <div className="flex min-h-screen flex-col">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Navbar />
        <main id="main-content" className="flex-1">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/for-creators" element={<ForCreators />} />
            <Route path="/create" element={<Create />} />
            <Route path="/creator/:slug" element={<Creator />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/profile" element={<DonorProfilePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </TooltipProvider>
  </ThemeProvider>
);

export default App;
