
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SessionProvider } from "./context/SessionContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Schedule from "./pages/Schedule";
import Objectives from "./pages/Objectives";
import ConnectWhatsapp from "./pages/ConnectWhatsapp";
import Progress from "./pages/Progress";
import Account from "./pages/Account";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Support from "./pages/Support";
import Onboarding from "./pages/Onboarding";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCanceled from "./pages/PaymentCanceled";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SessionProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth/:view" element={<Auth />} />
            <Route path="/auth/update-password" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/custom-instructions" element={<Objectives />} />
            <Route path="/connect-whatsapp" element={<ConnectWhatsapp />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/account" element={<Account />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/support" element={<Support />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-canceled" element={<PaymentCanceled />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SessionProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
