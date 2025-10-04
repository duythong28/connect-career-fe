import { useState } from 'react';
import { UserRole } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { User, Building2, Shield, ChevronDown } from 'lucide-react';

interface RoleSwitcherProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const roleConfig = {
  candidate: {
    label: 'Candidate',
    icon: User,
    color: 'bg-brand-primary',
    description: 'Job seeker view'
  },
  employer: {
    label: 'Employer',
    icon: Building2,
    color: 'bg-brand-accent',
    description: 'Company recruiter view'
  },
  admin: {
    label: 'Admin',
    icon: Shield,
    color: 'bg-brand-secondary',
    description: 'Platform administrator'
  }
};

export function RoleSwitcher({ currentRole, onRoleChange }: RoleSwitcherProps) {
  const currentConfig = roleConfig[currentRole];
  const CurrentIcon = currentConfig.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 h-10">
          <div className={`w-2 h-2 rounded-full ${currentConfig.color}`} />
          <CurrentIcon className="w-4 h-4" />
          <span className="font-medium">{currentConfig.label}</span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {Object.entries(roleConfig).map(([role, config]) => {
          const Icon = config.icon;
          const isActive = role === currentRole;
          
          return (
            <DropdownMenuItem
              key={role}
              onClick={() => onRoleChange(role as UserRole)}
              className="flex items-center gap-3 p-3 cursor-pointer"
            >
              <div className={`w-2 h-2 rounded-full ${config.color}`} />
              <Icon className="w-4 h-4" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{config.label}</span>
                  {isActive && <Badge variant="secondary" className="text-xs">Current</Badge>}
                </div>
                <p className="text-xs text-muted-foreground">{config.description}</p>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}