
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Building, User, Mail } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { UserAvatar } from '@/components/UserAvatar';
import { cn } from '@/lib/utils';
import { useSignUp } from '@/hooks/useSignUp';

const Auth = () => {
  const {
    step,
    invitationCode,
    setInvitationCode,
    loading,
    companyData,
    profileData,
    setProfileData,
    verifyInvitationCode,
    handleProfileSubmit
  } = useSignUp();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/50 px-4 py-6">
      <Card className={cn(
        "w-full max-w-md shadow-xl transition-all duration-300",
        "border-primary/10 bg-card/95 backdrop-blur-sm",
        "transform hover:shadow-2xl hover:-translate-y-1"
      )}>
        <CardHeader className="space-y-3">
          <div className="flex justify-center">
            {step === 'company' ? (
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Building className="h-6 w-6 text-primary" />
              </div>
            ) : (
              <UserAvatar 
                name={`${profileData.firstName} ${profileData.lastName}`} 
                size="lg"
                className="h-16 w-16 transform transition-all duration-300"
              />
            )}
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            {step === 'company' ? 'Bienvenue' : `Rejoindre ${companyData?.name}`}
          </CardTitle>
          <CardDescription className="text-center text-base">
            {step === 'company' 
              ? 'Entrez le code d\'invitation de votre entreprise'
              : 'Complétez votre profil pour continuer'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'company' ? (
            <form onSubmit={verifyInvitationCode} className="space-y-8">
              <div className="space-y-4">
                <Label htmlFor="invitationCode" className="text-center block text-base">
                  Code d'invitation
                </Label>
                <div className="flex justify-center">
                  <InputOTP 
                    maxLength={8} 
                    value={invitationCode} 
                    onChange={setInvitationCode}
                    className="gap-2"
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="border-primary/20" />
                      <InputOTPSlot index={1} className="border-primary/20" />
                      <InputOTPSlot index={2} className="border-primary/20" />
                      <InputOTPSlot index={3} className="border-primary/20" />
                      <InputOTPSlot index={4} className="border-primary/20" />
                      <InputOTPSlot index={5} className="border-primary/20" />
                      <InputOTPSlot index={6} className="border-primary/20" />
                      <InputOTPSlot index={7} className="border-primary/20" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full h-11 text-base font-medium transition-all"
                disabled={loading || invitationCode.length !== 8}
              >
                {loading ? 'Vérification...' : 'Continuer'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label htmlFor="firstName" className="text-base">Prénom</Label>
                  <div className="relative">
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
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
                      onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
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
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      className="pl-10 h-11 text-base"
                      required
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 text-base font-medium transition-all"
                disabled={loading}
              >
                {loading ? 'Création du compte...' : 'Créer mon compte'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
