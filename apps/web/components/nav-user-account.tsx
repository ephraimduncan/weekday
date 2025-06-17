"use client";

import type { Session } from "@weekday/auth";

import {
  RiAddLine,
  RiCheckLine,
  RiExpandUpDownLine,
  RiGroupLine,
  RiLogoutCircleLine,
  RiSparklingLine,
  RiUserLine,
} from "@remixicon/react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Account {
  id: string;
  createdAt: Date;
  email: string;
  providerId: string;
  name?: string | undefined;
}

interface NavUserProps {
  accounts: Account[];
  user: Session["user"];
  onAccountSwitch: (accountId: string) => void;
  onAddAccount: () => void;
  onSignOut?: () => void;
}

export function NavUserAccount({
  accounts,
  user,
  onAccountSwitch,
  onAddAccount,
  onSignOut,
}: NavUserProps) {
  const activeAccount = accounts.find((account) => account.isActive);
  const currentUser = activeAccount || {
    email: user.email,
    image: user.image,
    name: user.name,
  };

  const handleSignOut = async () => {
    try {
      if (onSignOut) {
        await onSignOut();
      }
      toast("Logged out successfully");
      console.log("User signed out");
    } catch (error) {
      toast("Error signing out");
      console.error("Sign out error:", error);
    }
  };

  const handleAccountSwitch = (accountId: string) => {
    onAccountSwitch(accountId);
    const switchedAccount = accounts.find((acc) => acc.id === accountId);
    if (switchedAccount) {
      toast(`Switched to ${switchedAccount.name}`);
    }
  };

  const handleAddAccount = () => {
    onAddAccount();
    toast("New account added");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="data-[state=open]:bg-accent h-auto w-full justify-start gap-3 px-3 py-2"
        >
          <Avatar className="size-8">
            <AvatarImage alt={currentUser.name} src={currentUser.image ?? ""} />
            <AvatarFallback className="rounded-lg">
              {currentUser.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-col items-start text-left text-sm">
            <span className="truncate font-medium">{currentUser.name}</span>
            <span className="text-muted-foreground truncate text-xs">
              {currentUser.email}
            </span>
          </div>
          <RiExpandUpDownLine className="text-muted-foreground ml-auto size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[280px]"
        align="end"
        side="bottom"
        sideOffset={4}
      >
        <DropdownMenuGroup>
          <div className="text-muted-foreground px-2 py-1.5 text-xs font-medium">
            Accounts
          </div>
          {accounts.map((account) => (
            <DropdownMenuItem
              key={account.id}
              className="cursor-pointer gap-3 p-3"
              onClick={() => handleAccountSwitch(account.id)}
            >
              <Avatar className="size-6">
                <AvatarImage alt={account.name} src={account.image ?? ""} />
                <AvatarFallback className="rounded-lg text-xs">
                  {account.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <div className="truncate text-sm font-medium">
                  {account.name}
                </div>
                <div className="text-muted-foreground truncate text-xs">
                  {account.email}
                </div>
              </div>
              {account.isActive && (
                <RiCheckLine className="text-primary size-4" />
              )}
            </DropdownMenuItem>
          ))}

          <DropdownMenuItem
            className="cursor-pointer gap-3 p-3"
            onClick={handleAddAccount}
          >
            <div className="border-muted-foreground/50 flex size-6 items-center justify-center rounded-lg border border-dashed">
              <RiAddLine className="text-muted-foreground size-4" />
            </div>
            <span className="text-sm">Add Account</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer gap-3">
            <RiUserLine className="text-muted-foreground size-5" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer gap-3">
            <RiGroupLine className="text-muted-foreground size-5" />
            Manage Accounts
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer gap-3">
            <RiSparklingLine className="text-muted-foreground size-5" />
            Upgrade
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            className="text-destructive focus:text-destructive cursor-pointer gap-3"
            onClick={handleSignOut}
          >
            <RiLogoutCircleLine className="size-5" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
