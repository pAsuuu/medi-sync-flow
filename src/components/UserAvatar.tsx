
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  name: string;
  imageSrc?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function UserAvatar({ 
  name, 
  imageSrc, 
  size = 'md',
  className 
}: UserAvatarProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-lg',
  };

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      {imageSrc && <AvatarImage src={imageSrc} alt={name} />}
      <AvatarFallback className="bg-medisync-100 text-medisync-700">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
