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

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface NavUserProps {
  session: Session;
  sessions: Session[];
  onAccountSwitch: (accountId: string) => void;
  onAddAccount: () => void;
  onSignOut?: () => void;
}

export function NavUser({
  session,
  sessions,
  onAccountSwitch,
  onAddAccount,
  onSignOut,
}: NavUserProps) {
  const handleSignOut = async () => {
    // todo: implement sign out
  };

  const handleAccountSwitch = (accountId: string) => {
    // todo: implement account switch
  };

  const handleAddAccount = () => {
    // todo: implement add account
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground [&>svg]:size-5"
            >
              <Avatar className="size-8">
                <AvatarImage
                  alt={session.user.name}
                  src={session.user.image ?? ""}
                />
                <AvatarFallback className="rounded-lg">
                  {session.user.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {session.user.name}
                </span>
              </div>
              <RiExpandUpDownLine className="text-muted-foreground/80 ml-auto size-5" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="dark bg-sidebar w-(--radix-dropdown-menu-trigger-width)"
            align="end"
            side="bottom"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <div className="text-muted-foreground px-2 py-1.5 text-xs font-medium">
                Accounts
              </div>
              {sessions.map((account) => (
                <DropdownMenuItem
                  key={account.session.id}
                  className="cursor-pointer gap-3"
                  onClick={() => handleAccountSwitch(account.session.id)}
                >
                  <Avatar className="size-6">
                    <AvatarImage
                      alt={account.user.name}
                      src={account.user.image ?? ""}
                    />
                    <AvatarFallback className="rounded-lg text-xs">
                      {account.user.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <div className="truncate text-sm font-medium">
                      {account.user.name}
                    </div>
                    <div className="text-muted-foreground truncate text-xs">
                      {account.user.email && account.user.email.length > 18
                        ? `${account.user.email.slice(0, 18)}...`
                        : account.user.email}
                    </div>
                  </div>

                  {account.session.token === session.session.token && (
                    <RiCheckLine className="text-primary size-4" />
                  )}
                </DropdownMenuItem>
              ))}

              <DropdownMenuItem
                className="cursor-pointer gap-3"
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
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
