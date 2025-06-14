"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  addDays,
  addMonths,
  addWeeks,
  endOfWeek,
  format,
  isSameMonth,
  startOfWeek,
  subMonths,
  subWeeks,
} from "date-fns";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { toast } from "sonner";
import { match, P } from "ts-pattern";

import { ChatButton } from "@/components/chat/chat-button";
import {
  type CalendarEvent,
  type CalendarView,
  addHoursToDate,
  AgendaDaysToShow,
  AgendaView,
  CalendarDndProvider,
  DayView,
  EventDialog,
  EventGap,
  EventHeight,
  MonthView,
  WeekView,
} from "@/components/event-calendar";
import ThemeToggle from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { useCalendarView } from "@/hooks/use-calendar-view";
import { cn } from "@/lib/utils";

import { useCalendarContext } from "./calendar-context";

export interface EventCalendarProps {
  className?: string;
  events?: CalendarEvent[];
  isCreatingEvent?: boolean;
  isDeletingEvent?: boolean;
  isUpdatingEvent?: boolean;
  onEventAdd?: (event: CalendarEvent) => void;
  onEventDelete?: (eventId: string) => void;
  onEventUpdate?: (event: CalendarEvent) => void;
  onResponseUpdate?: (
    eventId: string,
    response: "accepted" | "declined" | "tentative",
  ) => void;
}

export function EventCalendar({
  className,
  events = [],
  isCreatingEvent = false,
  isDeletingEvent = false,
  isUpdatingEvent = false,
  onEventAdd,
  onEventDelete,
  onEventUpdate,
  onResponseUpdate,
}: EventCalendarProps) {
  const { currentDate, setCurrentDate } = useCalendarContext();
  const [calendarViewConfig, setCalendarViewConfig] = useCalendarView();
  const view = calendarViewConfig.view;
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );
  const { open } = useSidebar();

  const memoizedEvents = useMemo(() => events, [events]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        isEventDialogOpen ||
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target instanceof HTMLElement && e.target.isContentEditable)
      ) {
        return;
      }

      match(e.key.toLowerCase())
        .with("a", () => setCalendarViewConfig({ view: "agenda" }))
        .with("d", () => setCalendarViewConfig({ view: "day" }))
        .with("m", () => setCalendarViewConfig({ view: "month" }))
        .with("w", () => setCalendarViewConfig({ view: "week" }))
        .otherwise(() => {});
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isEventDialogOpen, setCalendarViewConfig]);

  const handlePrevious = useCallback(() => {
    match(view)
      .with("month", () => setCurrentDate(subMonths(currentDate, 1)))
      .with("week", () => setCurrentDate(subWeeks(currentDate, 1)))
      .with("day", () => setCurrentDate(addDays(currentDate, -1)))
      .with("agenda", () =>
        setCurrentDate(addDays(currentDate, -AgendaDaysToShow)),
      )
      .exhaustive();
  }, [view, setCurrentDate, currentDate]);

  const handleNext = useCallback(() => {
    match(view)
      .with("month", () => setCurrentDate(addMonths(currentDate, 1)))
      .with("week", () => setCurrentDate(addWeeks(currentDate, 1)))
      .with("day", () => setCurrentDate(addDays(currentDate, 1)))
      .with("agenda", () =>
        setCurrentDate(addDays(currentDate, AgendaDaysToShow)),
      )
      .exhaustive();
  }, [view, setCurrentDate, currentDate]);

  const handleToday = useCallback(() => {
    setCurrentDate(new Date());
  }, [setCurrentDate]);

  const handleEventSelect = useCallback((event: CalendarEvent) => {
    const update = () => {
      setSelectedEvent(event);
      setIsEventDialogOpen(true);
    };
    requestAnimationFrame(() => {
      requestAnimationFrame(update);
    });
  }, []);

  const handleEventCreate = useCallback((startTime: Date) => {
    const minutes = startTime.getMinutes();
    const remainder = minutes % 15;
    if (remainder !== 0) {
      if (remainder < 7.5) {
        startTime.setMinutes(minutes - remainder);
      } else {
        startTime.setMinutes(minutes + (15 - remainder));
      }
      startTime.setSeconds(0);
      startTime.setMilliseconds(0);
    }

    const newEvent: CalendarEvent = {
      id: "",
      allDay: false,
      end: addHoursToDate(startTime, 1),
      start: startTime,
      title: "",
    };
    setSelectedEvent(newEvent);
    setIsEventDialogOpen(true);
  }, []);

  const handleEventSave = useCallback(
    (event: CalendarEvent) => {
      if (event.id) {
        if (isUpdatingEvent) {
          return;
        }
        onEventUpdate?.(event);
        toast(`Event "${event.title}" updated`, {
          description: format(new Date(event.start), "MMM d, yyyy"),
          position: "bottom-left",
        });
      } else {
        if (isCreatingEvent) {
          return;
        }
        onEventAdd?.({
          ...event,
          id: Math.random().toString(36).substring(2, 11),
        });

        toast(`Event "${event.title}" added`, {
          description: format(new Date(event.start), "MMM d, yyyy"),
          position: "bottom-left",
        });
      }

      if (!isCreatingEvent && !isUpdatingEvent) {
        setIsEventDialogOpen(false);
        setSelectedEvent(null);
      }
    },
    [isCreatingEvent, isUpdatingEvent, onEventAdd, onEventUpdate],
  );

  const handleEventDelete = useCallback(
    (eventId: string) => {
      match(isDeletingEvent)
        .with(true, () => {})
        .with(false, () => {
          const deletedEvent = memoizedEvents.find((e) => e.id === eventId);
          onEventDelete?.(eventId);

          match(deletedEvent)
            .with(P.not(P.nullish), (evt) => {
              toast(`Event "${evt.title}" deleted`, {
                description: format(new Date(evt.start), "MMM d, yyyy"),
                position: "bottom-left",
              });
            })
            .otherwise(() => {});

          setIsEventDialogOpen(false);
          setSelectedEvent(null);
        })
        .exhaustive();
    },
    [isDeletingEvent, memoizedEvents, onEventDelete],
  );

  const handleEventUpdate = useCallback(
    (updatedEvent: CalendarEvent) => {
      if (isUpdatingEvent) {
        return;
      }

      onEventUpdate?.(updatedEvent);

      toast(`Event "${updatedEvent.title}" moved`, {
        description: format(new Date(updatedEvent.start), "MMM d, yyyy"),
        position: "bottom-left",
      });
    },
    [isUpdatingEvent, onEventUpdate],
  );

  const handleOpenNewEvent = useCallback(() => {
    setSelectedEvent(null);
    setIsEventDialogOpen(true);
  }, []);

  const handleCloseEventDialog = useCallback(() => {
    setIsEventDialogOpen(false);
    setSelectedEvent(null);
  }, []);

  const handleSetView = useCallback(
    (newView: CalendarView) => {
      setCalendarViewConfig({ view: newView });
    },
    [setCalendarViewConfig],
  );

  const viewTitle = useMemo(() => {
    if (view === "month") {
      return format(currentDate, "MMMM yyyy");
    } else if (view === "week") {
      const start = startOfWeek(currentDate, { weekStartsOn: 0 });
      const end = endOfWeek(currentDate, { weekStartsOn: 0 });
      if (isSameMonth(start, end)) {
        return format(start, "MMMM yyyy");
      } else {
        return `${format(start, "MMM")} - ${format(end, "MMM yyyy")}`;
      }
    } else if (view === "day") {
      return (
        <>
          <span className="min-sm:hidden" aria-hidden="true">
            {format(currentDate, "MMM d, yyyy")}
          </span>
          <span className="max-sm:hidden min-md:hidden" aria-hidden="true">
            {format(currentDate, "MMMM d, yyyy")}
          </span>
          <span className="max-md:hidden">
            {format(currentDate, "EEE MMMM d, yyyy")}
          </span>
        </>
      );
    } else if (view === "agenda") {
      const start = currentDate;
      const end = addDays(currentDate, AgendaDaysToShow - 1);

      if (isSameMonth(start, end)) {
        return format(start, "MMMM yyyy");
      } else {
        return `${format(start, "MMM")} - ${format(end, "MMM yyyy")}`;
      }
    } else {
      return format(currentDate, "MMMM yyyy");
    }
  }, [currentDate, view]);

  return (
    <div
      className="bg-background flex h-full flex-col rounded-lg has-data-[slot=month-view]:flex-1"
      style={
        {
          "--event-gap": `${EventGap}px`,
          "--event-height": `${EventHeight}px`,
        } as React.CSSProperties
      }
    >
      <CalendarDndProvider onEventUpdate={handleEventUpdate}>
        <div
          className={cn(
            "flex flex-col justify-between gap-2 py-5 sm:flex-row sm:items-center sm:px-4",
            className,
          )}
        >
          <div className="flex items-start justify-start">
            <div className="flex items-center gap-1.5 self-start">
              <SidebarTrigger
                className="peer text-muted-foreground/80 hover:text-foreground/80 size-7 transition-opacity duration-200 ease-in-out hover:bg-transparent! sm:-ms-1.5 lg:data-[state=invisible]:pointer-events-none lg:data-[state=invisible]:opacity-0"
                data-state={open ? "invisible" : "visible"}
                isOutsideSidebar
              />
              <h2 className="text-xl font-semibold transition-transform duration-300 ease-in-out lg:peer-data-[state=invisible]:-translate-x-7.5">
                {viewTitle}
              </h2>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center max-sm:order-1 sm:gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  className="max-sm:size-8"
                  onClick={handlePrevious}
                  aria-label="Previous"
                >
                  <ChevronLeftIcon size={16} aria-hidden="true" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="max-sm:size-8"
                  onClick={handleNext}
                  aria-label="Next"
                >
                  <ChevronRightIcon size={16} aria-hidden="true" />
                </Button>
              </div>
              <Button
                className="max-sm:h-8 max-sm:px-2.5!"
                onClick={handleToday}
              >
                Today
              </Button>
            </div>
            <div className="flex items-center justify-between gap-2">
              <Button
                variant="outline"
                className="max-sm:h-8 max-sm:px-2.5!"
                disabled={isCreatingEvent || isUpdatingEvent || isDeletingEvent}
                onClick={handleOpenNewEvent}
              >
                New Event
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="gap-1.5 max-sm:h-8 max-sm:gap-1 max-sm:px-2!"
                  >
                    <span className="capitalize">{view}</span>
                    <ChevronDownIcon
                      size={16}
                      className="-me-1 opacity-60"
                      aria-hidden="true"
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="min-w-32" align="end">
                  <DropdownMenuItem onClick={() => handleSetView("month")}>
                    Month <DropdownMenuShortcut>M</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSetView("week")}>
                    Week <DropdownMenuShortcut>W</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSetView("day")}>
                    Day <DropdownMenuShortcut>D</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSetView("agenda")}>
                    Agenda <DropdownMenuShortcut>A</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <ThemeToggle />

              <ChatButton />
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col">
          {match(view)
            .with("month", () => (
              <MonthView
                onEventCreate={handleEventCreate}
                onEventSelect={handleEventSelect}
                currentDate={currentDate}
                events={memoizedEvents}
              />
            ))
            .with("week", () => (
              <WeekView
                onEventCreate={handleEventCreate}
                onEventSelect={handleEventSelect}
                currentDate={currentDate}
                events={memoizedEvents}
              />
            ))
            .with("day", () => (
              <DayView
                onEventCreate={handleEventCreate}
                onEventSelect={handleEventSelect}
                currentDate={currentDate}
                events={memoizedEvents}
              />
            ))
            .with("agenda", () => (
              <AgendaView
                onEventSelect={handleEventSelect}
                currentDate={currentDate}
                events={memoizedEvents}
              />
            ))
            .exhaustive()}
        </div>

        <EventDialog
          onClose={handleCloseEventDialog}
          onDelete={handleEventDelete}
          onResponseUpdate={onResponseUpdate}
          onSave={handleEventSave}
          event={selectedEvent}
          isOpen={isEventDialogOpen}
        />
      </CalendarDndProvider>
    </div>
  );
}
