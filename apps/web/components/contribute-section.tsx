import {
  RiDiscordFill,
  RiGithubFill,
  RiLinkedinFill,
  RiTwitterXFill,
} from "@remixicon/react";
import { GitPullRequest, Star, Users } from "lucide-react";
import Link from "next/link";

import { Card, CardContent } from "./ui/card";

export default function ContributeSection() {
  const repoStats = [
    {
      icon: <Star className="size-4 text-yellow-400" />,
      label: "Stars",
      value: "41+",
    },
    {
      icon: <GitPullRequest className="size-4 text-gray-400" />,
      label: "Forks",
      value: "9",
    },
    {
      icon: <Users className="size-4 text-gray-400" />,
      label: "Contributors",
      value: "50+",
    },
  ];

  const socialLinks = [
    {
      href: "https://discord.gg/weekday",
      icon: <RiDiscordFill className="size-8 text-gray-300" />,
      label: "Discord",
    },
    {
      href: "https://twitter.com/weekdaycal",
      icon: <RiTwitterXFill className="size-8 text-gray-300" />,
      label: "Twitter",
    },
    {
      href: "https://www.linkedin.com/company/weekdaycal",
      icon: <RiLinkedinFill className="size-8 text-gray-300" />,
      label: "LinkedIn",
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center space-y-4 px-3 py-20">
      <div className="text-background flex w-fit items-center justify-center gap-2 rounded-sm bg-white px-2">
        <RiGithubFill className="size-4 text-black" />
        <p className="text-sm">GitHub Community</p>
      </div>
      <p className="text-xl font-medium sm:text-3xl">Contribute to weekday.</p>
      <p className="text-gray-400">
        Explore our codebase, make contributions, and become part of a vibrant
        weekday open-source community.
      </p>

      <Card className="my-6 w-full max-w-4xl border-neutral-900 shadow-lg">
        <CardContent className="grid grid-cols-1 gap-5 p-8 lg:grid-cols-3 lg:gap-16">
          <div className="space-y-2">
            <RiGithubFill className="size-14" />
            <p className="text-xl font-medium">weekday</p>
            <Link
              className="text-xs font-medium text-gray-400 underline hover:text-white"
              href="https://github.com/ephraimduncan/weekday"
            >
              https://github.com/ephraimduncan/weekday
            </Link>
          </div>

          <div className="w-full space-y-2 lg:col-span-2">
            <p className="text-sm text-gray-400 sm:text-base">
              Weekday is the modern, open-source Google Calendar alternative
              powered with AI
            </p>
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
              {repoStats.map((stat, index) => (
                <div key={index} className="flex items-center gap-2">
                  {stat.icon}
                  <p className="text-sm text-gray-400">
                    <span className="font-medium text-white">{stat.value}</span>{" "}
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex w-full max-w-5xl items-center justify-center gap-5">
        {socialLinks.map((social, index) => (
          <Link
            key={index}
            aria-label={social.label}
            className="hover:bg-background flex h-24 w-24 items-center justify-center rounded-full border border-neutral-700 bg-neutral-900 transition-all"
            href={social.href}
          >
            {social.icon}
          </Link>
        ))}
      </div>
    </div>
  );
}
