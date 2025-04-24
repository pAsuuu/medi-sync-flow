
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { UserAvatar } from "@/components/UserAvatar";
import { Calendar, Building, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface OnboardingData {
  id: string;
  clientName: string;
  itrCompany: string;
  products: string[];
  createdDate: string;
  scheduledDate?: string;
  status: 'pending' | 'inprogress' | 'scheduled' | 'completed' | 'rejected';
  contactPerson?: string;
  assignedTo?: string;
}

interface OnboardingCardProps {
  onboarding: OnboardingData;
  onClick?: () => void;
  className?: string;
}

export function OnboardingCard({ onboarding, onClick, className }: OnboardingCardProps) {
  return (
    <Card 
      className={cn("cursor-pointer transition-all hover:shadow-md", className)}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>{onboarding.clientName}</CardTitle>
          <StatusBadge status={onboarding.status} />
        </div>
        <CardDescription className="flex items-center gap-1">
          <Building size={14} />
          {onboarding.itrCompany}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid gap-2">
          <div className="flex items-center gap-1 text-sm">
            <Calendar size={14} className="text-muted-foreground" />
            <span>Created: {onboarding.createdDate}</span>
          </div>
          {onboarding.scheduledDate && (
            <div className="flex items-center gap-1 text-sm">
              <Calendar size={14} className="text-muted-foreground" />
              <span>Scheduled: {onboarding.scheduledDate}</span>
            </div>
          )}
          <div className="mt-2">
            <div className="text-xs font-medium text-muted-foreground">Products</div>
            <div className="mt-1 flex flex-wrap gap-1">
              {onboarding.products.map((product, idx) => (
                <span
                  key={idx}
                  className="inline-flex rounded-full bg-medisync-50 px-2 py-0.5 text-xs font-medium text-medisync-700"
                >
                  {product}
                </span>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users size={14} />
            <span>ID: {onboarding.id}</span>
          </div>
          {onboarding.assignedTo && (
            <div className="flex items-center">
              <UserAvatar name={onboarding.assignedTo} size="sm" />
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
