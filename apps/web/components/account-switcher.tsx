"use client";

import * as React from "react";

import { RiAddLine, RiCheckLine, RiGoogleFill } from "@remixicon/react";
import { linkSocial, multiSession } from "@weekday/auth/auth-client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/trpc/react";

interface Account {
  id: string;
  createdAt: Date;
  email: string;
  providerId: string;
  name?: string;
}

interface AccountSwitcherProps {
  currentAccount?: Account;
  onAccountSwitch?: (accountId: string) => void;
}

export function AccountSwitcher({
  currentAccount,
  onAccountSwitch,
}: AccountSwitcherProps) {
  const { data: sessions } = api.account.listDeviceSessions.useQuery();
  const [isAddingAccount, setIsAddingAccount] = React.useState(false);

  const handleAddAccount = async () => {
    setIsAddingAccount(true);
    try {
      await linkSocial({
        callbackURL: "/calendar",
        provider: "google",
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
        <Button variant="ghost" className="w-full justify-start space-x-2 px-2">
          <Avatar className="h-6 w-6">
            <AvatarImage
              src={
                currentAccount?.name
                  ? `https://ui-avatars.com/api/?name=${encodeURIComponent(currentAccount.name)}&background=random`
                  : undefined
              }
            />
            <AvatarFallback className="text-xs">
              {currentAccount?.email?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <span className="max-w-[120px] truncate text-sm font-medium">
              {currentAccount?.name || currentAccount?.email}
            </span>
            <span className="text-muted-foreground max-w-[120px] truncate text-xs">
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
            className="flex cursor-pointer items-center space-x-2"
            onClick={() => handleSwitchAccount(session.token)}
          >
            <Avatar className="h-6 w-6">
              <AvatarImage
                src={
                  session.user?.image ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user?.name || session.user?.email || "")}&background=random`
                }
              />
              <AvatarFallback className="text-xs">
                {session.user?.email?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-1 flex-col">
              <span className="truncate text-sm font-medium">
                {session.user?.name || session.user?.email}
              </span>
              <span className="text-muted-foreground truncate text-xs">
                {session.user?.email}
              </span>
            </div>
            {session.active && (
              <RiCheckLine className="h-4 w-4 text-green-500" />
            )}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex cursor-pointer items-center space-x-2"
          disabled={isAddingAccount}
          onClick={handleAddAccount}
        >
          <RiGoogleFill className="h-4 w-4" />
          <span className="text-sm">
            {isAddingAccount ? "Adding..." : "Add Google Account"}
          </span>
          <RiAddLine className="ml-auto h-4 w-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
