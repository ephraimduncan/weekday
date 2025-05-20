"use client";

import React, { useCallback, useMemo } from "react";

import { useDroppable } from "@dnd-kit/core";

import { useCalendarDnd } from "@/components/event-calendar";
import { cn } from "@/lib/utils";

interface DroppableCellProps {
  id: string;
  baseDate: Date;
  hourInDay: number;
  quarterInHour: number;
  onEventCreate: (startTime: Date) => void;
  children?: React.ReactNode;
  className?: string;
}

// Separate component that consumes the context to prevent re-renders
const DroppableCellInner = React.memo(function DroppableCellInner({
  id,
  baseDate,
  children,
  className,
  hourInDay,
  isActiveEvent,
  quarterInHour,
  onEventCreate,
}: DroppableCellProps & { isActiveEvent: boolean }) {
  // Optimize data object to prevent unnecessary re-creation
  const dropData = useMemo(() => {
    return {
      date: baseDate,
      time: hourInDay + quarterInHour * 0.25,
    };
  }, [baseDate, hourInDay, quarterInHour]);

  const { isOver, setNodeRef } = useDroppable({
    id,
    data: dropData,
  });

  // Memoize the click handler to prevent recreation on each render
  const handleClick = useCallback(() => {
    const startTime = new Date(baseDate);
    startTime.setHours(hourInDay);
    startTime.setMinutes(quarterInHour * 15);
    onEventCreate(startTime);
  }, [baseDate, hourInDay, quarterInHour, onEventCreate]);

  // Only calculate classes once per render
  const cellClasses = useMemo(() => {
    return cn(
      "flex h-full flex-col px-0.5 py-1 sm:px-1",
      isOver && isActiveEvent ? "bg-accent" : "",
      className,
    );
  }, [className, isOver, isActiveEvent]);

  // Memoize title for consistency
  const title = useMemo(() => {
    return `${Math.floor(hourInDay)}:${Math.round(quarterInHour * 15)
      .toString()
      .padStart(2, "0")}`;
  }, [hourInDay, quarterInHour]);

  return (
    <div
      ref={setNodeRef}
      className={cellClasses}
      onClick={handleClick}
      title={title}
    >
      {children}
    </div>
  );
});

export const DroppableCell = React.memo(function DroppableCell(
  props: DroppableCellProps,
) {
  const { activeEvent } = useCalendarDnd();
  // Create a stable isActiveEvent value
  const isActiveEvent = useMemo(() => !!activeEvent, [activeEvent]);

  return <DroppableCellInner {...props} isActiveEvent={isActiveEvent} />;
});

DroppableCellInner.displayName = "DroppableCellInner";
DroppableCell.displayName = "DroppableCell";
