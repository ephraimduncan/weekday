import {
  RiBrainLine,
  RiCalendarLine,
  RiCodeLine,
  RiShieldKeyholeLine,
} from "@remixicon/react";

const features = [
  {
    description:
      "Smart suggestions and automatic event optimization powered by advanced AI algorithms.",
    icon: RiBrainLine,
    name: "AI-Powered Scheduling",
  },
  {
    description:
      "Your data stays yours. End-to-end encryption and complete control over your information.",
    icon: RiShieldKeyholeLine,
    name: "Privacy First",
  },
  {
    description:
      "Fully transparent codebase you can inspect, modify, and contribute to.",
    icon: RiCodeLine,
    name: "Open Source",
  },
  {
    description:
      "Seamless integration with your existing Google Calendar while maintaining privacy.",
    icon: RiCalendarLine,
    name: "Google Calendar Sync",
  },
];

export const FeaturesSection = () => {
  return (
    <>
      <div className="mx-auto w-full max-w-5xl px-3 py-20">
        <dl className="grid grid-cols-4 gap-5">
          {features.map((item) => (
            <div
              key={item.name}
              className="col-span-full sm:col-span-2 lg:col-span-1"
            >
              <div className="bg-foreground/10 w-fit rounded-[calc(var(--radius-lg)+0.125rem)] border p-px">
                <div className="bg-background ring-border w-fit rounded-lg p-2">
                  <item.icon
                    className="text-primary size-6"
                    aria-hidden="true"
                  />
                </div>
              </div>
              <dt className="text-foreground mt-6 font-semibold">
                {item.name}
              </dt>
              <dd className="text-muted-foreground mt-2 leading-7">
                {item.description}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </>
  );
};
