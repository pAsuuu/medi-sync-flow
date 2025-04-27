
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { ProfileFormData } from '@/hooks/useSignUp';

interface ProfileFormProps {
  profileData: ProfileFormData;
  setProfileData: (data: ProfileFormData) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

export const ProfileForm = ({
  profileData,
  setProfileData,
  loading,
  onSubmit,
  onBack,
}: ProfileFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-3">
          <Label htmlFor="firstName" className="text-base">Prénom</Label>
          <div className="relative">
            <Input
              id="firstName"
              value={profileData.firstName}
              onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
              className="pl-10 h-11 text-base"
              required
              autoFocus
            />
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="lastName" className="text-base">Nom</Label>
          <div className="relative">
            <Input
              id="lastName"
              value={profileData.lastName}
              onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
              className="pl-10 h-11 text-base"
              required
            />
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="email" className="text-base">Email professionnel</Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              className="pl-10 h-11 text-base"
              required
            />
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
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

        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" /> Retour
        </Button>
      </div>
    </form>
  );
};
