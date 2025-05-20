"use client";

import { useRef, useState } from "react";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { differenceInDays } from "date-fns";

import {
  type CalendarEvent,
  EventItem,
  useCalendarDnd,
} from "@/components/event-calendar";

interface DraggableEventProps {
  event: CalendarEvent;
  view: "day" | "month" | "week";
  "aria-hidden"?: boolean | "false" | "true";
  height?: number;
  isFirstDay?: boolean;
  isLastDay?: boolean;
  isMultiDay?: boolean;
  multiDayWidth?: number;
  showTime?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

export function DraggableEvent({
  "aria-hidden": ariaHidden,
  event,
  height,
  isFirstDay = true,
  isLastDay = true,
  isMultiDay,
  multiDayWidth,
  showTime,
  view,
  onClick,
}: DraggableEventProps) {
  const { activeId } = useCalendarDnd();
  const elementRef = useRef<HTMLDivElement>(null);
  const [dragHandlePosition, setDragHandlePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // Check if this is a multi-day event
  const eventStart = new Date(event.start);
  const eventEnd = new Date(event.end);
  const isMultiDayEvent =
    isMultiDay || event.allDay || differenceInDays(eventEnd, eventStart) >= 1;

  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useDraggable({
      id: `${event.id}-${view}`,
      data: {
        dragHandlePosition,
        event,
        height: height || elementRef.current?.offsetHeight || null,
        isFirstDay,
        isLastDay,
        isMultiDay: isMultiDayEvent,
        multiDayWidth: multiDayWidth,
        view,
      },
    });

  // Handle mouse down to track where on the event the user clicked
  const handleMouseDown = (e: React.MouseEvent) => {
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      setDragHandlePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  // Don't render if this event is being dragged
  if (isDragging || activeId === `${event.id}-${view}`) {
    return (
      <div
        ref={setNodeRef}
        className="opacity-0"
        style={{ height: height || "auto" }}
      />
    );
  }

  const style = transform
    ? {
        height: height || "auto",
        transform: CSS.Translate.toString(transform),
        width:
          isMultiDayEvent && multiDayWidth ? `${multiDayWidth}%` : undefined,
      }
    : {
        height: height || "auto",
        width:
          isMultiDayEvent && multiDayWidth ? `${multiDayWidth}%` : undefined,
      };

  // Handle touch start to track where on the event the user touched
  const handleTouchStart = (e: React.TouchEvent) => {
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      if (touch) {
        setDragHandlePosition({
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top,
        });
      }
    }
  };

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        if (elementRef) elementRef.current = node;
      }}
      className="touch-none"
      style={style}
    >
      <EventItem
        onClick={onClick}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        aria-hidden={ariaHidden}
        dndAttributes={attributes}
        dndListeners={listeners}
        event={event}
        isDragging={isDragging}
        isFirstDay={isFirstDay}
        isLastDay={isLastDay}
        showTime={showTime}
        view={view}
      />
    </div>
  );
}
