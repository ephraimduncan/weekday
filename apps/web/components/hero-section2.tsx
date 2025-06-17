import { Button } from "@/components/ui/button";
import { auth } from "@weekday/auth";
import { Calendar, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "./header";

export const Hero= async ()=> {
      const session = await auth();
      const user = session?.user;
  return (
    <>
         <Header user={user} />
    <section className="overflow-hidden py-32">
      <div className="container">
        <div className="flex flex-col gap-5">
          <div className="relative flex flex-col gap-5">
            <div
              className="absolute top-1/2 left-1/2 -z-10 mx-auto size-[800px] rounded-full border [mask-image:linear-gradient(to_top,transparent,transparent,white,white,white,transparent,transparent)] p-16 md:size-[1300px] md:p-32"
              style={{
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="size-full rounded-full border p-16 md:p-32">
                <div className="size-full rounded-full border"></div>
              </div>
            </div>
            <span className="mx-auto flex size-16 items-center justify-center rounded-full border md:size-20">
              <Calendar className="size-6" />
            </span>
            <h2 className="mx-auto max-w-5xl text-center text-3xl font-medium text-balance md:text-6xl">
            <span className="text-green-300">Your calendar</span>, reimagined with <span className="text-amber-300">AI</span>
            </h2>
            <p className="text-muted-foreground mx-auto max-w-3xl text-center md:text-lg">
              The open-source Google Calendar alternative with AI features.
              Privacy-focused, client-first, and completely under your control.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 pt-3 pb-12">
              <Button asChild size="lg">
                <Link href="/login">
                  Get Started
                  <Zap className="ml-2 size-4" />
                </Link>
              </Button>
              <div className="text-muted-foreground text-xs">
                Trusted by 25.000+ Businesses Worldwide
              </div>
            </div>
          </div>
                      <div className="relative mt-8 -mr-56 overflow-hidden px-2 sm:mt-12 sm:mr-0 md:mt-20">
                                      <div
                className="to-background absolute inset-0 z-10 bg-linear-to-b from-transparent from-35%"
                aria-hidden
              />
          <Image
            className="mx-auto h-full max-h-[524px] w-full max-w-5xl rounded-2xl object-cover"
            alt="placeholder"
            height="2240"
            src="/calendar.png"
            width="1376"
          />
        </div>
        </div>
      </div>
    </section>
    </>
  );
}
