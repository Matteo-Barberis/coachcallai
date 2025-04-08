
import React from 'react';
import { Button } from "@/components/ui/button";
import { useSessionContext } from '@/context/SessionContext';
import { useToast } from "@/components/ui/use-toast";
import { UserRound, LayoutDashboard, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate, useLocation } from 'react-router-dom';

const UserMenu = () => {
  const { session, signOut } = useSessionContext();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const isOnDashboard = location.pathname === '/dashboard';

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
    navigate('/');
  };

  const handleGetStarted = () => {
    navigate('/auth/sign-up');
  };

  if (!session) {
    return (
      <div className="flex space-x-2">
        <Button variant="outline" onClick={() => window.location.href = "/auth/sign-in"}>
          Sign In
        </Button>
        <Button className="bg-brand-primary hover:bg-brand-primary/90" onClick={handleGetStarted}>
          Get Started
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      {!isOnDashboard && (
        <Button variant="outline" onClick={() => navigate('/dashboard')}>
          Dashboard
        </Button>
      )}
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full" 
          >
            <UserRound className="h-5 w-5 text-gray-600" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 z-50 bg-white">
          <DropdownMenuItem asChild>
            <Link to="/dashboard" className="flex items-center gap-2 cursor-pointer">
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/account" className="flex items-center gap-2 cursor-pointer">
              <User className="h-4 w-4" />
              <span>Account</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserMenu;
