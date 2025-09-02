"use client";

import React, { useCallback, useMemo } from "react";

import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

import { differenceInMinutes, format, getMinutes, isPast } from "date-fns";

import {
  type CalendarEvent,
  getBorderRadiusClasses,
  getEventColorClasses,
} from "@/components/event-calendar";
import { cn } from "@/lib/utils";

// Using date-fns format with custom formatting:
// 'h' - hours (1-12)
// 'a' - am/pm
// ':mm' - minutes with leading zero (only if the token 'mm' is present)
const formatTimeWithOptionalMinutes = (date: Date) => {
  return format(date, getMinutes(date) === 0 ? "ha" : "h:mma").toLowerCase();
};

interface EventItemProps {
  event: CalendarEvent;
  view: "agenda" | "day" | "month" | "week";
  children?: React.ReactNode;
  className?: string;
  currentTime?: Date; // For updating time during drag
  dndAttributes?: DraggableAttributes;
  dndListeners?: SyntheticListenerMap;
  isDragging?: boolean;
  isFirstDay?: boolean;
  isLastDay?: boolean;
  showTime?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onMouseDown?: (e: React.MouseEvent) => void;
  onTouchStart?: (e: React.TouchEvent) => void;
}

// Create a memoized version of border and color classes to prevent recalculation
const useCachedClassNames = (
  event: CalendarEvent,
  isFirstDay: boolean = true,
  isLastDay: boolean = true,
) => {
  return useMemo(() => {
    return {
      borderClasses: getBorderRadiusClasses(isFirstDay, isLastDay),
      colorClasses: getEventColorClasses(event.color),
    };
  }, [event.color, isFirstDay, isLastDay]);
};

// Shared wrapper component for event styling with enhanced memoization
const EventWrapper = React.memo(
  function EventWrapper({
    children,
    className,
    currentTime,
    dndAttributes,
    dndListeners,
    event,
    isDragging,
    isFirstDay = true,
    isLastDay = true,
    onClick,
    onMouseDown,
    onTouchStart,
  }: EventWrapperProps) {
    // Get cached class names
    const { borderClasses, colorClasses } = useCachedClassNames(
      event,
      isFirstDay,
      isLastDay,
    );

    // Always use the currentTime (if provided) to determine if the event is in the past
    const displayEnd = useMemo(() => {
      if (!currentTime) return new Date(event.end);

      return new Date(
        new Date(currentTime).getTime() +
          (new Date(event.end).getTime() - new Date(event.start).getTime()),
      );
    }, [currentTime, event.end, event.start]);

    const isEventInPast = useMemo(() => isPast(displayEnd), [displayEnd]);

    // Memoize final className to avoid recalculations
    const buttonClassName = useMemo(() => {
      return cn(
        "flex h-full w-full overflow-hidden px-1 text-left font-medium backdrop-blur-md transition outline-none select-none focus-visible:ring-[3px] focus-visible:border-ring focus-visible:ring-ring/50 sm:px-2",
        colorClasses,
        borderClasses,
        className,
        {
          "cursor-grabbing": isDragging,
          "line-through opacity-90": isEventInPast,
        },
      );
    }, [colorClasses, borderClasses, className, isDragging, isEventInPast]);

    return (
      <button
        className={buttonClassName}
        onClick={onClick}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        {...dndListeners}
        {...dndAttributes}
      >
        {children}
      </button>
    );
  },
  // Custom comparison function to prevent unnecessary re-renders
  (prevProps, nextProps) => {
    return (
      prevProps.event.id === nextProps.event.id &&
      prevProps.event.color === nextProps.event.color &&
      prevProps.isFirstDay === nextProps.isFirstDay &&
      prevProps.isLastDay === nextProps.isLastDay &&
      prevProps.className === nextProps.className &&
      prevProps.isDragging === nextProps.isDragging &&
      prevProps.onClick === nextProps.onClick &&
      prevProps.onMouseDown === nextProps.onMouseDown &&
      prevProps.onTouchStart === nextProps.onTouchStart &&
      ((!prevProps.currentTime && !nextProps.currentTime) ||
        prevProps.currentTime?.getTime() === nextProps.currentTime?.getTime())
    );
  },
);

interface EventWrapperProps {
  children: React.ReactNode;
  event: CalendarEvent;
  className?: string;
  currentTime?: Date;
  dndAttributes?: DraggableAttributes;
  dndListeners?: SyntheticListenerMap;
  isDragging?: boolean;
  isFirstDay?: boolean;
  isLastDay?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onMouseDown?: (e: React.MouseEvent) => void;
  onTouchStart?: (e: React.TouchEvent) => void;
}

// Main EventItem component with memoization
const EventItemComponent = function EventItem({
  children,
  className,
  currentTime,
  dndAttributes,
  dndListeners,
  event,
  isDragging,
  isFirstDay = true,
  isLastDay = true,
  showTime,
  view,
  onClick,
  onMouseDown,
  onTouchStart,
}: EventItemProps) {
  // Use the provided currentTime (for dragging) or the event's actual time
  const displayStart = useMemo(() => {
    return currentTime || new Date(event.start);
  }, [currentTime, event.start]);

  const displayEnd = useMemo(() => {
    return currentTime
      ? new Date(
          new Date(currentTime).getTime() +
            (new Date(event.end).getTime() - new Date(event.start).getTime()),
        )
      : new Date(event.end);
  }, [currentTime, event.start, event.end]);

  // Calculate event duration in minutes
  const durationMinutes = useMemo(() => {
    return differenceInMinutes(displayEnd, displayStart);
  }, [displayStart, displayEnd]);

  const getEventTime = useCallback(() => {
    if (event.allDay) return "All day";

    // For short events (less than 45 minutes), only show start time
    if (durationMinutes < 45) {
      return formatTimeWithOptionalMinutes(displayStart);
    }

    // For longer events, show both start and end time
    return `${formatTimeWithOptionalMinutes(displayStart)} - ${formatTimeWithOptionalMinutes(displayEnd)}`;
  }, [event.allDay, durationMinutes, displayStart, displayEnd]);

  // Memoize the agenda view button className - moved outside conditionals
  const agendaButtonClassName = useMemo(() => {
    if (view !== "agenda") return ""; // Only calculate for agenda view

    const isEventInPast = isPast(new Date(event.end));
    return cn(
      "focus-visible:border-ring focus-visible:ring-ring/50 flex w-full flex-col gap-1 rounded p-2 text-left transition outline-none focus-visible:ring-[3px]",
      getEventColorClasses(event.color),
      {
        "line-through opacity-90": isEventInPast,
      },
      className,
    );
  }, [event.color, event.end, className, view]);

  // Calculate if event is short - moved outside conditionals
  const isShortEvent = durationMinutes < 45;

  // Month view rendering
  if (view === "month") {
    return (
      <EventWrapper
        className={cn(
          "mt-(--event-gap) h-(--event-height) items-center text-[10px] sm:text-[13px]",
          className,
        )}
        onClick={onClick}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        currentTime={currentTime}
        dndAttributes={dndAttributes}
        dndListeners={dndListeners}
        event={event}
        isDragging={isDragging}
        isFirstDay={isFirstDay}
        isLastDay={isLastDay}
      >
        {children || (
          <span className="truncate">
            {!event.allDay && (
              <span className="truncate font-normal uppercase opacity-70 sm:text-xs">
                {formatTimeWithOptionalMinutes(displayStart)}{" "}
              </span>
            )}
            {event.title}
          </span>
        )}
      </EventWrapper>
    );
  }

  // Week/day view rendering
  if (view === "week" || view === "day") {
    return (
      <EventWrapper
        className={cn(
          "py-1",
          isShortEvent ? "items-center" : "flex-col",
          view === "week" ? "text-[10px] sm:text-[13px]" : "text-[13px]",
          className,
        )}
        onClick={onClick}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        currentTime={currentTime}
        dndAttributes={dndAttributes}
        dndListeners={dndListeners}
        event={event}
        isDragging={isDragging}
        isFirstDay={isFirstDay}
        isLastDay={isLastDay}
      >
        {isShortEvent ? (
          <div className="truncate">
            {event.title}{" "}
            {showTime && (
              <span className="opacity-70">
                {formatTimeWithOptionalMinutes(displayStart)}
              </span>
            )}
          </div>
        ) : (
          <>
            <div className="truncate font-medium">{event.title}</div>
            {showTime && (
              <div className="truncate font-normal uppercase opacity-70 sm:text-xs">
                {getEventTime()}
              </div>
            )}
          </>
        )}
      </EventWrapper>
    );
  }

  // Agenda view rendering
  return (
    <button
      className={agendaButtonClassName}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      {...dndListeners}
      {...dndAttributes}
    >
      <div className="text-sm font-medium">{event.title}</div>
      <div className="text-xs opacity-70">
        {event.allDay ? (
          <span>All day</span>
        ) : (
          <span className="uppercase">
            {formatTimeWithOptionalMinutes(new Date(event.start))} -{" "}
            {formatTimeWithOptionalMinutes(new Date(event.end))}
          </span>
        )}
        {event.location && (
          <>
            <span className="px-1 opacity-35"> · </span>
            <span>{event.location}</span>
          </>
        )}
      </div>
      {event.description && (
        <div className="my-1 text-xs opacity-90">{event.description}</div>
      )}
    </button>
  );
};

// Add custom comparison function for memoization
export const EventItem = React.memo(
  EventItemComponent,
  (prevProps, nextProps) => {
    // Only re-render if any of these props change
    return (
      // Event data equality checks
      prevProps.event.id === nextProps.event.id &&
      prevProps.event.title === nextProps.event.title &&
      prevProps.event.start === nextProps.event.start &&
      prevProps.event.end === nextProps.event.end &&
      prevProps.event.color === nextProps.event.color &&
      prevProps.event.allDay === nextProps.event.allDay &&
      prevProps.event.location === nextProps.event.location &&
      prevProps.event.description === nextProps.event.description &&
      // View props equality
      prevProps.view === nextProps.view &&
      prevProps.isFirstDay === nextProps.isFirstDay &&
      prevProps.isLastDay === nextProps.isLastDay &&
      prevProps.showTime === nextProps.showTime &&
      prevProps.isDragging === nextProps.isDragging &&
      // Handlers equality
      prevProps.onClick === nextProps.onClick &&
      prevProps.onMouseDown === nextProps.onMouseDown &&
      prevProps.onTouchStart === nextProps.onTouchStart &&
      // Current time check (for dragging)
      ((!prevProps.currentTime && !nextProps.currentTime) ||
        prevProps.currentTime?.getTime() === nextProps.currentTime?.getTime())
    );
  },
);

EventWrapper.displayName = "EventWrapper";
EventItem.displayName = "EventItem";
