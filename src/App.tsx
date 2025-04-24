
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/providers/AuthProvider";
import { useAuth } from "@/providers/AuthProvider";
import { Sidebar } from "@/components/Sidebar";
import Dashboard from "@/pages/Dashboard";
import Onboardings from "@/pages/Onboardings";
import Calendar from "@/pages/Calendar";
import Training from "@/pages/Training";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import { OnboardingForm } from "@/components/OnboardingForm";
import Auth from "@/pages/Auth";

const queryClient = new QueryClient();

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();
  
  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Chargement...</div>;
  }
  
  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  const { session } = useAuth();

  return (
    <Routes>
      <Route path="/auth" element={
        session ? <Navigate to="/" replace /> : <Auth />
      } />
      
      <Route path="/" element={
        <ProtectedRoute>
          <div className="flex min-h-screen w-full">
            <Sidebar />
            <main className="flex-1 overflow-y-auto pl-[60px] md:pl-[250px]">
              <Routes>
                <Route index element={<Dashboard />} />
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
        </ProtectedRoute>
      } />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
