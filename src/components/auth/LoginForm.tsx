
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface LoginFormProps {
  onModeChange: () => void;
}

export const LoginForm = ({ onModeChange }: LoginFormProps) => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: loginEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/auth?redirect=/`,
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Email envoyé",
        description: "Veuillez vérifier votre boîte de réception et cliquer sur le lien pour vous connecter.",
      });
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Erreur de connexion",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-3">
        <Label htmlFor="loginEmail" className="text-base">Email</Label>
        <div className="relative">
          <Input
            id="loginEmail"
            type="email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            className="pl-10 h-11 text-base"
            placeholder="votre@email.com"
            required
          />
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
      </div>

      <div className="space-y-4">
        <Button 
          type="submit" 
          className="w-full h-11 text-base font-medium transition-all"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Envoi en cours...
            </>
          ) : 'Recevoir un lien de connexion'}
        </Button>

        <div className="text-center">
          <Button 
            variant="link" 
            type="button"
            onClick={onModeChange}
            className="text-sm"
          >
            Nouvelle inscription avec code d'invitation
          </Button>
        </div>
      </div>
    </form>
  );
};
