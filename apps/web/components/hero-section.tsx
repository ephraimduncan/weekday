import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import { Header } from "./header";

export const HeroSection = () => {
  return (
    <>
      <Header />
      <main className="overflow-hidden">
        <section>
          <div className="relative pt-20">
            <div className="mx-auto max-w-5xl px-6">
              <div className="sm:mx-auto lg:mt-0 lg:mr-auto">
                <h1 className="mt-8 max-w-2xl text-5xl font-medium text-balance md:text-6xl lg:mt-16">
                  Your calendar, reimagined with AI
                </h1>
                <p className="mt-8 max-w-2xl text-lg text-pretty">
                  The open-source Google Calendar alternative with AI features.
                  Privacy-focused, client-first, and completely under your
                  control.
                </p>

                <div className="mt-12 flex items-center gap-2">
                  <div className="bg-foreground/10 rounded-[calc(var(--radius-xl)+0.125rem)] border p-0.5">
                    <Button
                      asChild
                      size="lg"
                      className="rounded-xl px-5 text-base"
                    >
                      <Link href="/login">
                        <span className="text-nowrap">Get Started</span>
                      </Link>
                    </Button>
                  </div>
                  <Button
                    asChild
                    size="lg"
                    variant="ghost"
                    className="h-10.5 rounded-xl px-5 text-base"
                  >
                    <Link href="/privacy">
                      <span className="text-nowrap">Learn More</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            <div className="relative mt-8 -mr-56 overflow-hidden px-2 sm:mt-12 sm:mr-0 md:mt-20">
              <div
                className="to-background absolute inset-0 z-10 bg-linear-to-b from-transparent from-35%"
                aria-hidden
              />
              <div className="mx-auto max-w-5xl overflow-hidden">
                <Image
                  className="relative z-2 rounded-2xl"
                  alt="Weekday Calendar Interface"
                  height="2240"
                  src="/calendar.png"
                  width="1376"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};
