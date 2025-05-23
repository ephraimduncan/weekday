"use client";

import type { JSX, SVGProps } from "react";

import { signIn } from "@weekday/auth/auth-client";
import Link from "next/link";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

const GoogleIcon = (
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) => (
  <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M3.06364 7.50914C4.70909 4.24092 8.09084 2 12 2C14.6954 2 16.959 2.99095 18.6909 4.60455L15.8227 7.47274C14.7864 6.48185 13.4681 5.97727 12 5.97727C9.39542 5.97727 7.19084 7.73637 6.40455 10.1C6.2045 10.7 6.09086 11.3409 6.09086 12C6.09086 12.6591 6.2045 13.3 6.40455 13.9C7.19084 16.2636 9.39542 18.0227 12 18.0227C13.3454 18.0227 14.4909 17.6682 15.3864 17.0682C16.4454 16.3591 17.15 15.3 17.3818 14.05H12V10.1818H21.4181C21.5364 10.8363 21.6 11.5182 21.6 12.2273C21.6 15.2727 20.5091 17.8363 18.6181 19.5773C16.9636 21.1046 14.7 22 12 22C8.09084 22 4.70909 19.7591 3.06364 16.4909C2.38638 15.1409 2 13.6136 2 12C2 10.3864 2.38638 8.85911 3.06364 7.50914Z" />
  </svg>
);

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50">
      <div className="flex flex-1 flex-col justify-center px-4 py-10 lg:px-6">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="flex items-center space-x-1.5">
            <Logo
              className="h-7 w-7 text-neutral-900 dark:text-neutral-50"
              aria-hidden={true}
            />
            <p className="text-lg font-medium text-neutral-900 dark:text-neutral-50">
              Weekday
            </p>
          </div>
          <h3 className="mt-6 text-lg font-semibold text-neutral-900 dark:text-neutral-50">
            Sign in to your account
          </h3>

          <div className="mt-4 flex flex-col items-center space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
            <Button
              variant="outline"
              className="mt-2 flex-1 items-center justify-center space-x-2 border-neutral-300 bg-white py-2 text-neutral-900 hover:bg-neutral-100 sm:mt-0 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-700"
              onClick={() => signIn.social({ provider: "google" })}
            >
              <GoogleIcon className="size-4" aria-hidden={true} />
              <span className="text-sm font-medium">Login with Google</span>
            </Button>
          </div>

          <p className="text-muted-foreground mt-4 text-xs">
            By signing in, you agree to our{" "}
            <Link className="underline underline-offset-4" href="/terms">
              terms of service
            </Link>{" "}
            and{" "}
            <Link className="underline underline-offset-4" href="/privacy">
              privacy policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
