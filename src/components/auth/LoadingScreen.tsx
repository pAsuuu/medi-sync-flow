
import { Loader2 } from 'lucide-react';

export const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/50">
      <div className="text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
        <p className="text-muted-foreground">Authentification en cours...</p>
      </div>
    </div>
  );
};
