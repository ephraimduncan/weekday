import type { ReactNode } from "react";

import { auth } from "@weekday/auth";
import { redirect } from "next/navigation";

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (session) {
    redirect("/calendar");
  }

  return <>{children}</>;
}
