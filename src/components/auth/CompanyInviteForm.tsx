
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

interface CompanyInviteFormProps {
  invitationCode: string;
  setInvitationCode: (code: string) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onModeChange: () => void;
}

export const CompanyInviteForm = ({
  invitationCode,
  setInvitationCode,
  loading,
  onSubmit,
  onModeChange,
}: CompanyInviteFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-8">
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
      <div className="space-y-4">
        <Button 
          type="submit" 
          className="w-full h-11 text-base font-medium transition-all"
          disabled={loading || invitationCode.length !== 8}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Vérification...
            </>
          ) : 'Continuer'}
        </Button>

        <div className="text-center">
          <Button 
            variant="link" 
            type="button"
            onClick={onModeChange}
            className="text-sm"
          >
            Déjà inscrit ? Se connecter
          </Button>
        </div>
      </div>
    </form>
  );
};
