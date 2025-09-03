"use client";

import type { ComponentProps, HTMLAttributes, ReactElement } from "react";
import { createContext, useContext, useEffect, useState } from "react";

import type { UIMessage } from "ai";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type BranchContextType = {
  branches: ReactElement[];
  currentBranch: number;
  totalBranches: number;
  goToNext: () => void;
  goToPrevious: () => void;
  setBranches: (branches: ReactElement[]) => void;
};

const BranchContext = createContext<BranchContextType | null>(null);

const useBranch = () => {
  const context = useContext(BranchContext);

  if (!context) {
    throw new Error("Branch components must be used within Branch");
  }

  return context;
};

export type BranchProps = HTMLAttributes<HTMLDivElement> & {
  defaultBranch?: number;
  onBranchChange?: (branchIndex: number) => void;
};

export const Branch = ({
  className,
  defaultBranch = 0,
  onBranchChange,
  ...props
}: BranchProps) => {
  const [currentBranch, setCurrentBranch] = useState(defaultBranch);
  const [branches, setBranches] = useState<ReactElement[]>([]);

  const handleBranchChange = (newBranch: number) => {
    setCurrentBranch(newBranch);
    onBranchChange?.(newBranch);
  };

  const goToPrevious = () => {
    const newBranch =
      currentBranch > 0 ? currentBranch - 1 : branches.length - 1;
    handleBranchChange(newBranch);
  };

  const goToNext = () => {
    const newBranch =
      currentBranch < branches.length - 1 ? currentBranch + 1 : 0;
    handleBranchChange(newBranch);
  };

  const contextValue: BranchContextType = {
    branches,
    currentBranch,
    goToNext,
    goToPrevious,
    setBranches,
    totalBranches: branches.length,
  };

  return (
    <BranchContext.Provider value={contextValue}>
      <div
        className={cn("grid w-full gap-2 [&>div]:pb-0", className)}
        {...props}
      />
    </BranchContext.Provider>
  );
};

export type BranchMessagesProps = HTMLAttributes<HTMLDivElement>;

export const BranchMessages = ({ children, ...props }: BranchMessagesProps) => {
  const { branches, currentBranch, setBranches } = useBranch();
  const childrenArray = Array.isArray(children) ? children : [children];

  // Use useEffect to update branches when they change
  useEffect(() => {
    if (branches.length !== childrenArray.length) {
      setBranches(childrenArray);
    }
  }, [childrenArray, branches, setBranches]);

  return childrenArray.map((branch, index) => (
    <div
      key={branch.key}
      className={cn(
        "grid gap-2 overflow-hidden [&>div]:pb-0",
        index === currentBranch ? "block" : "hidden",
      )}
      {...props}
    >
      {branch}
    </div>
  ));
};

export type BranchSelectorProps = HTMLAttributes<HTMLDivElement> & {
  from: UIMessage["role"];
};

export const BranchSelector = ({
  className,
  from,
  ...props
}: BranchSelectorProps) => {
  const { totalBranches } = useBranch();

  // Don't render if there's only one branch
  if (totalBranches <= 1) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex items-center gap-2 self-end px-10",
        from === "assistant" ? "justify-start" : "justify-end",
        className,
      )}
      {...props}
    />
  );
};

export type BranchPreviousProps = ComponentProps<typeof Button>;

export const BranchPrevious = ({
  children,
  className,
  ...props
}: BranchPreviousProps) => {
  const { goToPrevious, totalBranches } = useBranch();

  return (
    <Button
      size="icon"
      variant="ghost"
      className={cn(
        "text-muted-foreground size-7 shrink-0 rounded-full transition-colors",
        "hover:bg-accent hover:text-foreground",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      disabled={totalBranches <= 1}
      onClick={goToPrevious}
      aria-label="Previous branch"
      type="button"
      {...props}
    >
      {children ?? <ChevronLeftIcon size={14} />}
    </Button>
  );
};

export type BranchNextProps = ComponentProps<typeof Button>;

export const BranchNext = ({
  children,
  className,
  ...props
}: BranchNextProps) => {
  const { goToNext, totalBranches } = useBranch();

  return (
    <Button
      size="icon"
      variant="ghost"
      className={cn(
        "text-muted-foreground size-7 shrink-0 rounded-full transition-colors",
        "hover:bg-accent hover:text-foreground",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      disabled={totalBranches <= 1}
      onClick={goToNext}
      aria-label="Next branch"
      type="button"
      {...props}
    >
      {children ?? <ChevronRightIcon size={14} />}
    </Button>
  );
};

export type BranchPageProps = HTMLAttributes<HTMLSpanElement>;

export const BranchPage = ({ className, ...props }: BranchPageProps) => {
  const { currentBranch, totalBranches } = useBranch();

  return (
    <span
      className={cn(
        "text-muted-foreground text-xs font-medium tabular-nums",
        className,
      )}
      {...props}
    >
      {currentBranch + 1} of {totalBranches}
    </span>
  );
};
