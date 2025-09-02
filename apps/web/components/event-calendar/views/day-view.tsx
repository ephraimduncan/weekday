"use client";

import type React from "react";
import { useMemo } from "react";

import {
  addHours,
  areIntervalsOverlapping,
  differenceInMinutes,
  eachHourOfInterval,
  format,
  getHours,
  getMinutes,
  isSameDay,
  startOfDay,
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

interface DayViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventCreate: (startTime: Date) => void;
  onEventSelect: (event: CalendarEvent) => void;
}

interface PositionedEvent {
  event: CalendarEvent;
  height: number;
  left: number;
  top: number;
  width: number;
  zIndex: number;
}

export const DayView = ({
  currentDate,
  events,
  onEventCreate,
  onEventSelect,
}: DayViewProps) => {
  const dayEvents = useMemo(() => {
    return events
      .filter((event) => {
        const eventStart = new Date(event.start);
        const eventEnd = new Date(event.end);
        return (
          isSameDay(currentDate, eventStart) ||
          isSameDay(currentDate, eventEnd) ||
          (currentDate > eventStart && currentDate < eventEnd)
        );
      })
      .sort(
        (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
      );
  }, [currentDate, events]);

  const allDayEvents = useMemo(() => {
    return dayEvents.filter((event) => {
      return event.allDay || isMultiDayEvent(event);
    });
  }, [dayEvents]);

  const timeEvents = useMemo(() => {
    return dayEvents.filter((event) => {
      return !event.allDay && !isMultiDayEvent(event);
    });
  }, [dayEvents]);

  const showAllDaySection = allDayEvents.length > 0;
  const dynamicWeekCellsHeight = useDynamicWeekCellHeight(showAllDaySection);

  const hours = useMemo(() => {
    const dayStart = startOfDay(currentDate);
    return eachHourOfInterval({
      end: addHours(dayStart, EndHour - 1),
      start: addHours(dayStart, StartHour),
    });
  }, [currentDate]);

  const positionedEvents = useMemo(() => {
    const result: PositionedEvent[] = [];
    const dayStart = startOfDay(currentDate);

    const sortedEvents = [...timeEvents].sort((a, b) => {
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

    const columns: { end: Date; event: CalendarEvent }[][] = [];

    sortedEvents.forEach((event) => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);

      const adjustedStart = isSameDay(currentDate, eventStart)
        ? eventStart
        : dayStart;
      const adjustedEnd = isSameDay(currentDate, eventEnd)
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
              { end: new Date(c.event.end), start: new Date(c.event.start) },
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

      result.push({
        event,
        height,
        left,
        top,
        width,
        zIndex: 10 + columnIndex,
      });
    });

    return result;
  }, [currentDate, timeEvents, dynamicWeekCellsHeight]);

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    onEventSelect(event);
  };

  const { currentTimePosition, currentTimeVisible } = useCurrentTimeIndicator(
    currentDate,
    "day",
  );

  return (
    <div
      className="contents"
      style={
        {
          "--week-cells-height": `${dynamicWeekCellsHeight}px`,
        } as React.CSSProperties
      }
      data-slot="day-view"
    >
      {showAllDaySection && (
        <div className="border-border/70 bg-muted/50 border-t">
          <div className="grid grid-cols-[3rem_1fr] sm:grid-cols-[4rem_1fr]">
            <div className="relative">
              <span className="text-muted-foreground/70 absolute bottom-0 left-0 h-6 w-16 max-w-full pe-2 text-right text-[10px] sm:pe-4 sm:text-xs">
                All day
              </span>
            </div>
            <div className="border-border/70 relative border-r p-1 last:border-r-0">
              {allDayEvents.map((event) => {
                const eventStart = new Date(event.start);
                const eventEnd = new Date(event.end);
                const isFirstDay = isSameDay(currentDate, eventStart);
                const isLastDay = isSameDay(currentDate, eventEnd);

                return (
                  <EventItem
                    key={`spanning-${event.id}`}
                    onClick={(e) => handleEventClick(event, e)}
                    event={event}
                    isFirstDay={isFirstDay}
                    isLastDay={isLastDay}
                    view="month"
                  >
                    <div>{event.title}</div>
                  </EventItem>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="border-border/70 grid flex-1 grid-cols-[3rem_1fr] overflow-hidden border-t sm:grid-cols-[4rem_1fr]">
        <div>
          {hours.map((hour, index) => (
            <div
              key={hour.toString()}
              className="border-border/70 relative h-(--week-cells-height) border-b last:border-b-0"
            >
              {index > 0 && (
                <span className="bg-background text-muted-foreground/70 absolute -top-3 left-0 flex h-6 w-16 max-w-full items-center justify-end pe-2 text-[10px] sm:pe-4 sm:text-xs">
                  {format(hour, "h a")}
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="relative">
          {positionedEvents.map((positionedEvent) => (
            <div
              key={positionedEvent.event.id}
              className="absolute z-10 px-0.5"
              style={{
                height: `${positionedEvent.height}px`,
                left: `${positionedEvent.left * 100}%`,
                top: `${positionedEvent.top + 1}px`,
                width: `${positionedEvent.width * 100}%`,
                zIndex: positionedEvent.zIndex,
              }}
            >
              <div className="h-full w-full">
                <DraggableEvent
                  onClick={(e) => handleEventClick(positionedEvent.event, e)}
                  event={positionedEvent.event}
                  height={positionedEvent.height}
                  view="day"
                  showTime
                />
              </div>
            </div>
          ))}

          {currentTimeVisible && (
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

          {hours.map((hour) => {
            const hourValue = getHours(hour);
            return (
              <div
                key={hour.toString()}
                className="border-border/70 relative h-(--week-cells-height) border-b last:border-b-0"
              >
                {[0, 1, 2, 3].map((quarter) => {
                  const quarterHourTime = hourValue + quarter * 0.25;
                  return (
                    <DroppableCell
                      id={`day-cell-${currentDate.toISOString()}-${quarterHourTime}`}
                      key={`${hour.toString()}-${quarter}`}
                      className={cn(
                        "absolute h-[calc(var(--week-cells-height)/4)] w-full",
                        quarter === 0 && "top-0",
                        quarter === 1 &&
                          "top-[calc(var(--week-cells-height)/4)]",
                        quarter === 2 &&
                          "top-[calc(var(--week-cells-height)/4*2)]",
                        quarter === 3 &&
                          "top-[calc(var(--week-cells-height)/4*3)]",
                      )}
                      onEventCreate={onEventCreate}
                      baseDate={currentDate}
                      hourInDay={hourValue}
                      quarterInHour={quarter}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
