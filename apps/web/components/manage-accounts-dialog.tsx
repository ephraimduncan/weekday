"use client";

import { useState } from "react";

import { RiDeleteBinLine } from "@remixicon/react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/trpc/react";

interface ManageAccountsDialogProps {
  open: boolean;
  onAddAccount: (provider: "google" | "microsoft") => Promise<void>;
  onOpenChange: (open: boolean) => void;
}

export function ManageAccountsDialog({
  open,
  onAddAccount,
  onOpenChange,
}: ManageAccountsDialogProps) {
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: accounts, isLoading } = api.account.list.useQuery();
  const { data: defaultAccount } = api.account.getDefault.useQuery();
  const deleteAccountMutation = api.account.delete.useMutation();
  const utils = api.useUtils();

  const handleDeleteAccount = async () => {
    if (!accountToDelete) return;

    setIsDeleting(true);
    try {
      await deleteAccountMutation.mutateAsync({ accountId: accountToDelete });
      toast.success("Account unlinked successfully");
      await Promise.all([
        utils.account.list.refetch(),
        utils.account.getDefault.refetch(),
        utils.calendar.getAllAccountsCalendars.refetch(),
        utils.calendar.getCalendars.invalidate(),
        utils.calendar.getEvents.invalidate(),
      ]);

      setAccountToDelete(null);
    } catch (error) {
      toast.error("Failed to unlink account");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddAccountClick = async () => {
    onOpenChange(false);
    await onAddAccount("google");
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Accounts</DialogTitle>
            <DialogDescription>
              View and manage your connected Google accounts
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
              </div>
            ) : accounts &&
              accounts.accounts &&
              accounts.accounts.length > 0 ? (
              accounts.accounts.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        alt={account.name ?? ""}
                        src={account.image ?? ""}
                      />
                      <AvatarFallback>
                        {account.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("") ?? "??"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {account.name}
                        </span>
                        {defaultAccount?.account?.id === account.id && (
                          <Badge variant="secondary" className="text-xs">
                            Default
                          </Badge>
                        )}
                      </div>
                      <span className="text-muted-foreground text-xs">
                        {account.email}
                      </span>
                    </div>
                  </div>

                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-muted-foreground hover:text-destructive h-8 w-8"
                    disabled={accounts.accounts.length === 1}
                    onClick={() => setAccountToDelete(account.id)}
                    title={
                      accounts.accounts.length === 1
                        ? "Cannot remove the last account"
                        : "Remove account"
                    }
                  >
                    <RiDeleteBinLine className="h-4 w-4" />
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-muted-foreground py-8 text-center text-sm">
                No accounts connected
              </div>
            )}
          </div>

          <div className="mt-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleAddAccountClick}
            >
              Add Another Account
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!accountToDelete}
        onOpenChange={() => setAccountToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unlink Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to unlink this account? You'll lose access
              to all calendars and events from this account. You can always link
              it again later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90 text-white"
              disabled={isDeleting}
              onClick={handleDeleteAccount}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Unlinking...
                </>
              ) : (
                "Unlink Account"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
