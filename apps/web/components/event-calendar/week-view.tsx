"use client";

import React, { useCallback, useMemo } from "react";

import {
  addHours,
  areIntervalsOverlapping,
  differenceInMinutes,
  eachDayOfInterval,
  eachHourOfInterval,
  endOfWeek,
  format,
  getHours,
  getMinutes,
  isBefore,
  isSameDay,
  isToday,
  startOfDay,
  startOfWeek,
} from "date-fns";

import {
  type CalendarEvent,
  DraggableEvent,
  DroppableCell,
  EventItem,
  isMultiDayEvent,
  useCurrentTimeIndicator,
  useDynamicWeekCellHeight,
} from "@/components/event-calendar";
import { EndHour, StartHour } from "@/components/event-calendar/constants";
import { cn } from "@/lib/utils";

interface PositionedEvent {
  event: CalendarEvent;
  height: number;
  left: number;
  top: number;
  width: number;
  zIndex: number;
}

interface WeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventCreate: (startTime: Date) => void;
  onEventSelect: (event: CalendarEvent) => void;
}

export const WeekView = React.memo(function WeekView({
  currentDate,
  events,
  onEventCreate,
  onEventSelect,
}: WeekViewProps) {
  const days = useMemo(() => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
    return eachDayOfInterval({ end: weekEnd, start: weekStart });
  }, [currentDate]);

  const weekStart = useMemo(
    () => startOfWeek(currentDate, { weekStartsOn: 0 }),
    [currentDate],
  );

  const hours = useMemo(() => {
    const dayStart = startOfDay(currentDate);
    return eachHourOfInterval({
      end: addHours(dayStart, EndHour - 1),
      start: addHours(dayStart, StartHour),
    });
  }, [currentDate]);

  const allDayEvents = useMemo(() => {
    return events
      .filter((event) => {
        return event.allDay || isMultiDayEvent(event);
      })
      .filter((event) => {
        const eventStart = new Date(event.start);
        const eventEnd = new Date(event.end);
        return days.some(
          (day) =>
            isSameDay(day, eventStart) ||
            isSameDay(day, eventEnd) ||
            (day > eventStart && day < eventEnd),
        );
      });
  }, [events, days]);

  const showAllDaySection = useMemo(
    () => allDayEvents.length > 0,
    [allDayEvents],
  );
  const dynamicWeekCellsHeight = useDynamicWeekCellHeight(showAllDaySection);

  const processedDayEvents = useMemo(() => {
    const result = days.map((day) => {
      const dayEvents = events.filter((event) => {
        if (event.allDay || isMultiDayEvent(event)) return false;

        const eventStart = new Date(event.start);
        const eventEnd = new Date(event.end);

        return (
          isSameDay(day, eventStart) ||
          isSameDay(day, eventEnd) ||
          (eventStart < day && eventEnd > day)
        );
      });

      const sortedEvents = [...dayEvents].sort((a, b) => {
        const aStart = new Date(a.start);
        const bStart = new Date(b.start);
        const aEnd = new Date(a.end);
        const bEnd = new Date(b.end);

        if (aStart < bStart) return -1;
        if (aStart > bStart) return 1;

        const aDuration = differenceInMinutes(aEnd, aStart);
        const bDuration = differenceInMinutes(bEnd, bStart);
        return bDuration - aDuration;
      });

      const positionedEvents: PositionedEvent[] = [];
      const dayStart = startOfDay(day);

      const columns: { end: Date; event: CalendarEvent }[][] = [];

      sortedEvents.forEach((event) => {
        const eventStart = new Date(event.start);
        const eventEnd = new Date(event.end);

        const adjustedStart = isSameDay(day, eventStart)
          ? eventStart
          : dayStart;
        const adjustedEnd = isSameDay(day, eventEnd)
          ? eventEnd
          : addHours(dayStart, 24);

        const startHour =
          getHours(adjustedStart) + getMinutes(adjustedStart) / 60;
        const endHour = getHours(adjustedEnd) + getMinutes(adjustedEnd) / 60;

        const top = (startHour - StartHour) * dynamicWeekCellsHeight;
        const height = (endHour - startHour) * dynamicWeekCellsHeight - 3;

        let columnIndex = 0;
        let placed = false;

        while (!placed) {
          const col = columns[columnIndex] || [];
          if (col.length === 0) {
            columns[columnIndex] = col;
            placed = true;
          } else {
            const overlaps = col.some((c) =>
              areIntervalsOverlapping(
                { end: adjustedEnd, start: adjustedStart },
                {
                  end: new Date(c.event.end),
                  start: new Date(c.event.start),
                },
              ),
            );
            if (!overlaps) {
              placed = true;
            } else {
              columnIndex++;
            }
          }
        }

        const currentColumn = columns[columnIndex] || [];
        columns[columnIndex] = currentColumn;
        currentColumn.push({ end: adjustedEnd, event });

        const width = columnIndex === 0 ? 1 : 0.9;
        const left = columnIndex === 0 ? 0 : columnIndex * 0.1;

        positionedEvents.push({
          event,
          height,
          left,
          top,
          width,
          zIndex: 10 + columnIndex,
        });
      });

      return positionedEvents;
    });

    return result;
  }, [days, events, dynamicWeekCellsHeight]);

  const handleEventClick = useCallback(
    (event: CalendarEvent, e: React.MouseEvent) => {
      e.stopPropagation();
      onEventSelect(event);
    },
    [onEventSelect],
  );

  const getEventClickHandler = useCallback(
    (event: CalendarEvent) => {
      return (e: React.MouseEvent) => handleEventClick(event, e);
    },
    [handleEventClick],
  );

  const memoizedEventCreate = useCallback(
    (startTime: Date) => {
      onEventCreate(startTime);
    },
    [onEventCreate],
  );

  const { currentTimePosition, currentTimeVisible } = useCurrentTimeIndicator(
    currentDate,
    "week",
  );

  const renderCellQuarters = useCallback(
    (hour: Date, day: Date) => {
      const hourValue = getHours(hour);

      return [0, 1, 2, 3].map((quarter) => {
        const quarterHourTime = hourValue + quarter * 0.25;
        const cellId = `week-cell-${day.toISOString()}-${quarterHourTime}`;
        const cellClassName = cn(
          "absolute h-[calc(var(--week-cells-height)/4)] w-full",
          quarter === 0 && "top-0",
          quarter === 1 && "top-[calc(var(--week-cells-height)/4)]",
          quarter === 2 && "top-[calc(var(--week-cells-height)/4*2)]",
          quarter === 3 && "top-[calc(var(--week-cells-height)/4*3)]",
        );

        return (
          <DroppableCell
            id={cellId}
            key={`${hour.toString()}-${quarter}`}
            className={cellClassName}
            onEventCreate={memoizedEventCreate}
            baseDate={day}
            hourInDay={hourValue}
            quarterInHour={quarter}
          />
        );
      });
    },
    [memoizedEventCreate],
  );

  const renderPositionedEvents = useCallback(
    (dayIndex: number, day: Date) => {
      return (processedDayEvents[dayIndex] ?? []).map((positionedEvent) => (
        <div
          key={positionedEvent.event.id}
          className="absolute z-10 px-px"
          style={{
            height: `${positionedEvent.height}px`,
            left: `${positionedEvent.left * 100}%`,
            top: `${positionedEvent.top + 1}px`,
            width: `${positionedEvent.width * 100}%`,
            zIndex: positionedEvent.zIndex,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-full w-full">
            <DraggableEvent
              onClick={getEventClickHandler(positionedEvent.event)}
              event={positionedEvent.event}
              height={positionedEvent.height}
              view="week"
              showTime
            />
          </div>
        </div>
      ));
    },
    [processedDayEvents, getEventClickHandler],
  );

  const renderAllDayEvents = useCallback(
    (day: Date, dayIndex: number) => {
      const dayAllDayEvents = allDayEvents.filter((event) => {
        const eventStart = new Date(event.start);
        const eventEnd = new Date(event.end);
        return (
          isSameDay(day, eventStart) ||
          (day > eventStart && day < eventEnd) ||
          isSameDay(day, eventEnd)
        );
      });

      return dayAllDayEvents.map((event) => {
        const eventStart = new Date(event.start);
        const eventEnd = new Date(event.end);
        const isFirstDay = isSameDay(day, eventStart);
        const isLastDay = isSameDay(day, eventEnd);
        const isFirstVisibleDay =
          dayIndex === 0 && isBefore(eventStart, weekStart);
        const shouldShowTitle = isFirstDay || isFirstVisibleDay;

        return (
          <EventItem
            key={`spanning-${event.id}`}
            onClick={getEventClickHandler(event)}
            event={event}
            isFirstDay={isFirstDay}
            isLastDay={isLastDay}
            view="month"
          >
            <div
              className={cn("truncate", !shouldShowTitle && "invisible")}
              aria-hidden={!shouldShowTitle}
            >
              {event.title}
            </div>
          </EventItem>
        );
      });
    },
    [allDayEvents, getEventClickHandler, weekStart],
  );

  const droppableCellsGrid = useMemo(() => {
    return days.map((day, dayIndex) => (
      <div
        key={day.toString()}
        className="border-border/70 relative border-r last:border-r-0"
        data-today={isToday(day) || undefined}
      >
        {renderPositionedEvents(dayIndex, day)}

        {currentTimeVisible && isToday(day) && (
          <div
            className="pointer-events-none absolute right-0 left-0 z-20"
            style={{ top: `${currentTimePosition}%` }}
          >
            <div className="relative flex items-center">
              <div className="absolute -left-1 h-2 w-2 rounded-full bg-red-500"></div>
              <div className="h-[2px] w-full bg-red-500"></div>
            </div>
          </div>
        )}

        {hours.map((hour) => (
          <div
            key={hour.toString()}
            className="border-border/70 relative h-[var(--week-cells-height)] border-b last:border-b-0"
          >
            {renderCellQuarters(hour, day)}
          </div>
        ))}
      </div>
    ));
  }, [
    days,
    hours,
    currentTimeVisible,
    currentTimePosition,
    renderPositionedEvents,
    renderCellQuarters,
  ]);

  const allDaySectionContent = useMemo(() => {
    if (!showAllDaySection) return null;

    return (
      <div className="border-border/70 bg-muted/50 border-b">
        <div className="grid grid-cols-8">
          <div className="border-border/70 relative border-r">
            <span className="text-muted-foreground/70 absolute bottom-0 left-0 h-6 w-16 max-w-full pe-2 text-right text-[10px] sm:pe-4 sm:text-xs">
              All day
            </span>
          </div>
          {days.map((day, dayIndex) => (
            <div
              key={day.toString()}
              className="border-border/70 relative border-r p-1 last:border-r-0"
              data-today={isToday(day) || undefined}
            >
              {renderAllDayEvents(day, dayIndex)}
            </div>
          ))}
        </div>
      </div>
    );
  }, [days, showAllDaySection, renderAllDayEvents]);

  return (
    <div
      className="flex h-full flex-col"
      style={
        {
          "--week-cells-height": `${dynamicWeekCellsHeight}px`,
        } as React.CSSProperties
      }
      data-slot="week-view"
    >
      <div className="bg-background/80 border-border/70 sticky top-0 z-30 grid grid-cols-8 border-y uppercase backdrop-blur-md">
        <div className="text-muted-foreground/70 py-2 text-center text-xs">
          <span className="max-[479px]:sr-only">{format(new Date(), "O")}</span>
        </div>
        {days.map((day) => (
          <div
            key={day.toString()}
            className="data-today:text-foreground text-muted-foreground/70 py-2 text-center text-xs data-today:font-medium"
            data-today={isToday(day) || undefined}
          >
            <span className="sm:hidden" aria-hidden="true">
              {format(day, "E")[0]} {format(day, "d")}
            </span>
            <span className="max-sm:hidden">{format(day, "EEE dd")}</span>
          </div>
        ))}
      </div>

      {allDaySectionContent}

      <div className="grid flex-1 grid-cols-8 overflow-hidden">
        <div className="border-border/70 border-r">
          {hours.map((hour, index) => (
            <div
              key={hour.toString()}
              className="border-border/70 relative h-[var(--week-cells-height)] border-b last:border-b-0"
            >
              {index > 0 && (
                <span className="bg-background text-muted-foreground/70 absolute -top-3 left-0 flex h-6 w-16 max-w-full items-center justify-end pe-2 text-[10px] sm:pe-4 sm:text-xs">
                  {format(hour, "h a")}
                </span>
              )}
            </div>
          ))}
        </div>

        {droppableCellsGrid}
      </div>
    </div>
  );
});

WeekView.displayName = "WeekView";
