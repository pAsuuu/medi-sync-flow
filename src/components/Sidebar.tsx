
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  LayoutDashboard,
  FileStack,
  GraduationCap,
  Users,
  Settings,
  Menu,
  X,
} from 'lucide-react';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  isActive: boolean;
  onClick?: () => void;
}

const SidebarItem = ({ icon: Icon, label, to, isActive, onClick }: SidebarItemProps) => {
  return (
    <Link to={to} onClick={onClick}>
      <Button
        variant="ghost"
        className={cn(
          'w-full justify-start gap-2 px-3 py-6',
          isActive
            ? 'bg-sidebar-accent text-sidebar-accent-foreground'
            : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
        )}
      >
        <Icon size={20} />
        <span>{label}</span>
      </Button>
    </Link>
  );
};

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="relative">
      <div
        className={cn(
          'fixed left-0 top-0 z-40 h-full bg-sidebar transition-all duration-300 ease-in-out',
          collapsed ? 'w-[60px]' : 'w-[250px]'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header/Logo */}
          <div className="flex h-16 items-center justify-between px-4">
            {!collapsed && (
              <div className="flex items-center">
                <span className="text-xl font-bold text-sidebar-foreground">MediSync</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              onClick={toggleSidebar}
            >
              {collapsed ? <Menu size={20} /> : <X size={20} />}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-2 py-4">
            {!collapsed ? (
              <>
                <SidebarItem
                  icon={LayoutDashboard}
                  label="Dashboard"
                  to="/"
                  isActive={isActive('/')}
                />
                <SidebarItem
                  icon={FileStack}
                  label="Onboardings"
                  to="/onboardings"
                  isActive={isActive('/onboardings')}
                />
                <SidebarItem
                  icon={Calendar}
                  label="Calendar"
                  to="/calendar"
                  isActive={isActive('/calendar')}
                />
                <SidebarItem
                  icon={GraduationCap}
                  label="Training"
                  to="/training"
                  isActive={isActive('/training')}
                />
                <SidebarItem
                  icon={Users}
                  label="Team"
                  to="/team"
                  isActive={isActive('/team')}
                />
                <SidebarItem
                  icon={Settings}
                  label="Settings"
                  to="/settings"
                  isActive={isActive('/settings')}
                />
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full justify-center px-2 py-6',
                    isActive('/') ? 'bg-sidebar-accent' : 'hover:bg-sidebar-accent'
                  )}
                  asChild
                >
                  <Link to="/">
                    <LayoutDashboard size={20} />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full justify-center px-2 py-6',
                    isActive('/onboardings') ? 'bg-sidebar-accent' : 'hover:bg-sidebar-accent'
                  )}
                  asChild
                >
                  <Link to="/onboardings">
                    <FileStack size={20} />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full justify-center px-2 py-6',
                    isActive('/calendar') ? 'bg-sidebar-accent' : 'hover:bg-sidebar-accent'
                  )}
                  asChild
                >
                  <Link to="/calendar">
                    <Calendar size={20} />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full justify-center px-2 py-6',
                    isActive('/training') ? 'bg-sidebar-accent' : 'hover:bg-sidebar-accent'
                  )}
                  asChild
                >
                  <Link to="/training">
                    <GraduationCap size={20} />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full justify-center px-2 py-6',
                    isActive('/team') ? 'bg-sidebar-accent' : 'hover:bg-sidebar-accent'
                  )}
                  asChild
                >
                  <Link to="/team">
                    <Users size={20} />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full justify-center px-2 py-6',
                    isActive('/settings') ? 'bg-sidebar-accent' : 'hover:bg-sidebar-accent'
                  )}
                  asChild
                >
                  <Link to="/settings">
                    <Settings size={20} />
                  </Link>
                </Button>
              </>
            )}
          </nav>

          {/* Footer (Profile) */}
          {!collapsed && (
            <div className="border-t border-sidebar-border px-4 py-3">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-sidebar-accent" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-sidebar-foreground">User Name</p>
                  <Link to="/profile" className="text-xs text-sidebar-foreground/70 hover:text-sidebar-foreground">
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
