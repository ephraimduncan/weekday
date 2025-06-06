import { type ToolInvocation } from "ai";
import { differenceInMinutes, format, parseISO } from "date-fns";
import { Clock } from "lucide-react";

interface TimeSlot {
  end: string;
  start: string;
}

export function GetFreeSlotsCall() {
  return (
    <div className="flex items-center gap-2 p-2">
      <Clock className="h-4 w-4 text-gray-500" />
      <p className="font-medium text-gray-700 dark:text-gray-300">
        Checking available time slots...
      </p>
    </div>
  );
}

export function GetFreeSlotsResult({
  toolInvocation,
}: {
  toolInvocation: ToolInvocation & { result?: any };
}) {
  const result = toolInvocation.result;

  if (
    !result ||
    result.error ||
    !result.freeBusyData ||
    !Array.isArray(result.freeBusyData) ||
    result.freeBusyData.length === 0
  ) {
    return (
      <div className="flex flex-col gap-2 px-2 py-3">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-500" />
          <p className="font-medium text-gray-700 dark:text-gray-300">
            Available Time Slots
          </p>
        </div>
        <p className="pl-6 text-sm text-gray-500 dark:text-gray-400">
          No available time slots found.
        </p>
      </div>
    );
  }

  const slots = result.freeBusyData as TimeSlot[];

  if (!slots || slots.length === 0) {
    return (
      <div className="flex flex-col gap-2 px-2 py-3">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-500" />
          <p className="font-medium text-gray-700 dark:text-gray-300">
            Available Time Slots
          </p>
        </div>
        <p className="pl-6 text-sm text-gray-500 dark:text-gray-400">
          No available time slots found.
        </p>
      </div>
    );
  }

  const firstSlot = slots[0];
  const dateDisplay =
    firstSlot && firstSlot.start
      ? format(parseISO(firstSlot.start), "EEEE, MMMM d, yyyy")
      : "";

  return (
    <div className="flex flex-col gap-2 px-2 py-3">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-gray-500" />
        <p className="font-medium text-gray-700 dark:text-gray-300">
          Available on {dateDisplay}
        </p>
      </div>

      <div className="mt-2 flex flex-col gap-2">
        {slots.map((slot, index) => {
          const startTime = parseISO(slot.start);
          const endTime = parseISO(slot.end);
          const durationMinutes = differenceInMinutes(endTime, startTime);
          const durationHours = Math.floor(durationMinutes / 60);
          const remainingMinutes = durationMinutes % 60;

          const durationText =
            durationHours > 0
              ? `${durationHours}h${remainingMinutes > 0 ? ` ${remainingMinutes}m` : ""}`
              : `${durationMinutes}m`;

          return (
            <div
              key={index}
              className="cursor-pointer overflow-hidden rounded-md border transition-all hover:bg-gray-100"
            >
              <div className="flex items-center justify-between px-3 py-2">
                <div className="font-medium text-gray-800">
                  {format(startTime, "h:mm")} - {format(endTime, "h:mm")}
                  {format(endTime, "a").toLowerCase()}
                </div>
                <div className="rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-500">
                  {durationText}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
