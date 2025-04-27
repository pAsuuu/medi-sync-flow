
import { Building, User, Mail } from 'lucide-react';
import { UserAvatar } from '@/components/UserAvatar';
import { CardDescription, CardTitle } from '@/components/ui/card';

interface AuthHeaderProps {
  mode: 'login' | 'signup';
  step: 'company' | 'profile';
  profileData?: {
    firstName: string;
    lastName: string;
  };
  companyName?: string;
}

export const AuthHeader = ({ mode, step, profileData, companyName }: AuthHeaderProps) => {
  const getHeaderIcon = () => {
    if (mode === 'login') {
      return (
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Mail className="h-6 w-6 text-primary" />
        </div>
      );
    }
    if (step === 'company') {
      return (
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Building className="h-6 w-6 text-primary" />
        </div>
      );
    }
    return (
      <UserAvatar 
        name={`${profileData?.firstName || ''} ${profileData?.lastName || ''}`} 
        size="lg"
        className="h-16 w-16 transform transition-all duration-300"
      />
    );
  };

  const getHeaderTitle = () => {
    if (mode === 'login') return 'Connexion';
    if (step === 'company') return 'Bienvenue';
    return `Rejoindre ${companyName}`;
  };

  const getHeaderDescription = () => {
    if (mode === 'login') return 'Entrez votre email pour recevoir un lien de connexion';
    if (step === 'company') return 'Entrez le code d\'invitation de votre entreprise';
    return 'Complétez votre profil pour continuer';
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-center">
        {getHeaderIcon()}
      </div>
      <CardTitle className="text-2xl font-bold text-center">
        {getHeaderTitle()}
      </CardTitle>
      <CardDescription className="text-center text-base">
        {getHeaderDescription()}
      </CardDescription>
    </div>
  );
};

