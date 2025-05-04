
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
import Chatbot from "@/pages/Chatbot";
import { OnboardingForm } from "@/components/OnboardingForm";

const queryClient = new QueryClient();

// Layout component to wrap all pages with the sidebar
const AppLayout = ({ children }) => (
  <div className="flex min-h-screen w-full">
    <Sidebar />
    <main className="flex-1 overflow-y-auto pl-[60px] md:pl-[250px]">
      {children}
    </main>
  </div>
);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
            <Route path="/onboardings" element={<AppLayout><Onboardings /></AppLayout>} />
            <Route 
              path="/onboardings/create" 
              element={
                <AppLayout>
                  <div className="px-4 py-6 md:px-6 lg:px-8">
                    <h1 className="mb-6 text-3xl font-bold tracking-tight">Créer un Onboarding</h1>
                    <OnboardingForm onSubmit={(data) => console.log(data)} />
                  </div>
                </AppLayout>
              } 
            />
            <Route path="/calendar" element={<AppLayout><Calendar /></AppLayout>} />
            <Route path="/training" element={<AppLayout><Training /></AppLayout>} />
            <Route path="/profile" element={<AppLayout><Profile /></AppLayout>} />
            <Route path="/chatbot" element={<AppLayout><Chatbot /></AppLayout>} />
            <Route path="*" element={<AppLayout><NotFound /></AppLayout>} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
