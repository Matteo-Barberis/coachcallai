
import React from 'react';
import { Button } from "@/components/ui/button";
import { useSessionContext } from '@/context/SessionContext';
import { useToast } from "@/components/ui/use-toast";
import { UserRound } from 'lucide-react';

const UserMenu = () => {
  const { session, signOut } = useSessionContext();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
  };

  if (!session) {
    return (
      <div className="flex space-x-2">
        <Button variant="outline" onClick={() => window.location.href = "/auth/sign-in"}>
          Sign In
        </Button>
        <Button className="bg-brand-primary hover:bg-brand-primary/90" onClick={() => window.location.href = "/auth/sign-up"}>
          Sign Up
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <Button 
        variant="ghost" 
        size="icon" 
        className="rounded-full" 
        onClick={() => window.location.href = "/dashboard"}
      >
        <UserRound className="h-5 w-5 text-gray-600" />
      </Button>
      <Button variant="outline" onClick={handleSignOut}>
        Sign Out
      </Button>
    </div>
  );
};

export default UserMenu;
