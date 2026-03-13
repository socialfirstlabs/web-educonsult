"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/lib/actions/auth.action";

export function LogoutButton() {
  const handleLogout = async () => {
    await logoutAction();
  };

  return (
    <Button 
      variant="ghost" 
      className="w-full justify-start gap-3" 
      onClick={handleLogout}
    >
      <LogOut size={20} /> Logout
    </Button>
  );
}
