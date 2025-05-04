
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/StatusBadge';

export interface OnboardingData {
  id: string;
  clientName: string;
  itrCompany: string;
  products: string[];
  createdDate: string;
  scheduledDate?: string;
  status: string; // Changed from strict union type to string to accommodate all possible values
  contactPerson: string;
  assignedTo?: string;
}

interface OnboardingCardProps {
  onboarding: OnboardingData;
  onClick: () => void;
}

export const OnboardingCard: React.FC<OnboardingCardProps> = ({ onboarding, onClick }) => {
  return (
    <Card className="cursor-pointer transition-shadow hover:shadow-md" onClick={onClick}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{onboarding.clientName}</CardTitle>
        <p className="text-sm text-muted-foreground">{onboarding.itrCompany}</p>
      </CardHeader>
      
      <CardContent className="py-2">
        <div className="flex flex-col space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">Date de création</span>
            <span className="text-xs">{onboarding.createdDate}</span>
          </div>
          
          {onboarding.scheduledDate && (
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Date planifiée</span>
              <span className="text-xs">{onboarding.scheduledDate}</span>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">Contact</span>
            <span className="text-xs">{onboarding.contactPerson}</span>
          </div>
          
          <div className="flex flex-wrap gap-1 pt-2">
            {onboarding.products.slice(0, 3).map((product) => (
              <span 
                key={product} 
                className="whitespace-nowrap rounded-full bg-sky-100 px-2 py-0.5 text-xs text-sky-700"
              >
                {product}
              </span>
            ))}
            {onboarding.products.length > 3 && (
              <span className="whitespace-nowrap rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                +{onboarding.products.length - 3}
              </span>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex items-center justify-between pt-2">
        <StatusBadge status={onboarding.status as any} />
        {onboarding.assignedTo && (
          <span className="text-xs text-muted-foreground">
            Assigné à {onboarding.assignedTo}
          </span>
        )}
      </CardFooter>
    </Card>
  );
};
