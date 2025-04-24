
import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from "@/components/ui/badge";

type StatusType = 'pending' | 'inprogress' | 'scheduled' | 'completed' | 'rejected';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig: Record<StatusType, { label: string, colorClass: string }> = {
  pending: {
    label: 'Pending',
    colorClass: 'bg-status-pending text-white',
  },
  inprogress: {
    label: 'In Progress',
    colorClass: 'bg-status-inprogress text-white',
  },
  scheduled: {
    label: 'Scheduled',
    colorClass: 'bg-status-scheduled text-white',
  },
  completed: {
    label: 'Completed',
    colorClass: 'bg-status-completed text-white',
  },
  rejected: {
    label: 'Rejected',
    colorClass: 'bg-status-rejected text-white',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <Badge className={cn(config.colorClass, className)}>
      {config.label}
    </Badge>
  );
}
