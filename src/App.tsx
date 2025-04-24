
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import Dashboard from "@/pages/Dashboard";
import Onboardings from "@/pages/Onboardings";
import Calendar from "@/pages/Calendar";
import Training from "@/pages/Training";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import { OnboardingForm } from "@/components/OnboardingForm";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex min-h-screen w-full">
            <Sidebar />
            <main className="flex-1 overflow-y-auto pl-[60px] md:pl-[250px]">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/onboardings" element={<Onboardings />} />
                <Route path="/onboardings/create" element={
                  <div className="px-4 py-6 md:px-6 lg:px-8">
                    <h1 className="mb-6 text-3xl font-bold tracking-tight">Créer un Onboarding</h1>
                    <OnboardingForm onSubmit={(data) => console.log(data)} />
                  </div>
                } />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/training" element={<Training />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
