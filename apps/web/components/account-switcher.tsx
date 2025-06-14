"use client";

import * as React from "react";

import { linkSocial, multiSession } from "@weekday/auth/auth-client";
import { RiAddLine, RiCheckLine, RiGoogleFill } from "@remixicon/react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { api } from "@/trpc/react";

interface Account {
  id: string;
  email: string;
  name?: string;
  providerId: string;
  createdAt: Date;
}

interface AccountSwitcherProps {
  currentAccount?: Account;
  onAccountSwitch?: (accountId: string) => void;
}

export function AccountSwitcher({ currentAccount, onAccountSwitch }: AccountSwitcherProps) {
  const { data: sessions } = api.account.listDeviceSessions.useQuery();
  const [isAddingAccount, setIsAddingAccount] = React.useState(false);

  const handleAddAccount = async () => {
    setIsAddingAccount(true);
    try {
      await linkSocial({
        provider: "google",
        callbackURL: "/calendar",
      });
    } catch (error) {
      console.error("Failed to add account:", error);
    } finally {
      setIsAddingAccount(false);
    }
  };

  const handleSwitchAccount = async (sessionToken: string) => {
    try {
      await multiSession.setActive(sessionToken);
      if (onAccountSwitch) {
        // You might need to extract account ID from session
        onAccountSwitch(sessionToken);
      }
      // Refresh the page to load the new account data
      window.location.reload();
    } catch (error) {
      console.error("Failed to switch account:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start space-x-2 px-2"
        >
          <Avatar className="h-6 w-6">
            <AvatarImage src={currentAccount?.name ? `https://ui-avatars.com/api/?name=${encodeURIComponent(currentAccount.name)}&background=random` : undefined} />
            <AvatarFallback className="text-xs">
              {currentAccount?.email?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium truncate max-w-[120px]">
              {currentAccount?.name || currentAccount?.email}
            </span>
            <span className="text-xs text-muted-foreground truncate max-w-[120px]">
              {currentAccount?.email}
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="start">
        <DropdownMenuLabel>Accounts</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {sessions?.map((session: any) => (
          <DropdownMenuItem
            key={session.id}
            onClick={() => handleSwitchAccount(session.token)}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <Avatar className="h-6 w-6">
              <AvatarImage src={session.user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user?.name || session.user?.email || "")}&background=random`} />
              <AvatarFallback className="text-xs">
                {session.user?.email?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col flex-1">
              <span className="text-sm font-medium truncate">
                {session.user?.name || session.user?.email}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {session.user?.email}
              </span>
            </div>
            {session.active && <RiCheckLine className="h-4 w-4 text-green-500" />}
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleAddAccount}
          disabled={isAddingAccount}
          className="flex items-center space-x-2 cursor-pointer"
        >
          <RiGoogleFill className="h-4 w-4" />
          <span className="text-sm">
            {isAddingAccount ? "Adding..." : "Add Google Account"}
          </span>
          <RiAddLine className="h-4 w-4 ml-auto" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}