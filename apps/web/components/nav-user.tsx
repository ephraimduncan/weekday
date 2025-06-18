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
import { linkSocial, signOut } from "@weekday/auth/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
import { api } from "@/trpc/react";

export function NavUser({ session }: { session: Session }) {
  const router = useRouter();
  const utils = api.useUtils();

  const { data: accounts } = api.account.list.useQuery(undefined, {
    gcTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 15,
  });
  const { data: defaultAccount } = api.account.getDefault.useQuery(undefined, {
    gcTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });
  const setDefaultAccount = api.account.setDefault.useMutation({
    onError: (error) => {
      toast.error("Failed to switch account: " + error.message);
    },
    onSuccess: () => {
      utils.account.list.invalidate();
      utils.account.getDefault.invalidate();
      utils.calendar.getCalendars.invalidate();
      utils.calendar.getEvents.invalidate();
      router.refresh();
      toast.success("Account switched successfully");
    },
  });

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      router.push("/");
    } catch (error) {
      console.error("Failed to sign out:", error);
      toast.error("Failed to sign out");
    }
  };

  const handleAccountSwitch = (accountId: string) => {
    if (accountId === defaultAccount?.account?.id) {
      return;
    }

    setDefaultAccount.mutate({ accountId });
  };

  const handleAddAccount = async (provider: "google" | "microsoft") => {
    try {
      const { data } = await linkSocial({
        callbackURL: "/calendar",
        provider,
      });

      toast.success(
        `${provider.charAt(0).toUpperCase() + provider.slice(1)} account added successfully`,
      );
      utils.account.list.invalidate();
      utils.account.getDefault.invalidate();
    } catch (error) {
      console.error("Failed to add account:", error);
      toast.error("Failed to add account");
    }
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
                  alt={defaultAccount?.account?.name || session.user.name}
                  src={
                    defaultAccount?.account?.image || (session.user.image ?? "")
                  }
                />
                <AvatarFallback className="rounded-lg">
                  {(defaultAccount?.account?.name || session.user.name)?.charAt(
                    0,
                  )}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {defaultAccount?.account?.name || session.user.name}
                </span>
                <span className="text-muted-foreground truncate text-xs">
                  {defaultAccount?.account?.email || session.user.email}
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
              {accounts?.accounts?.map((account) => (
                <DropdownMenuItem
                  key={account.id}
                  className="cursor-pointer gap-3"
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
                      {account.email && account.email.length > 18
                        ? `${account.email.slice(0, 18)}...`
                        : account.email}
                    </div>
                  </div>

                  {account.id === defaultAccount?.account?.id && (
                    <RiCheckLine className="text-primary size-4" />
                  )}
                </DropdownMenuItem>
              ))}

              <DropdownMenuItem
                className="cursor-pointer gap-3"
                onClick={() => handleAddAccount("google")}
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
