"use client";

import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  type UniqueIdentifier,
  DndContext,
  DragOverlay,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { addMinutes, differenceInMinutes } from "date-fns";

import { type CalendarEvent, EventItem } from "@/components/event-calendar";

// Define the context type
type CalendarDndContextType = {
  activeEvent: CalendarEvent | null;
  activeId: UniqueIdentifier | null;
  activeView: "day" | "month" | "week" | null;
  currentTime: Date | null;
  dragHandlePosition: {
    data?: {
      isFirstDay?: boolean;
      isLastDay?: boolean;
    };
    x?: number;
    y?: number;
  } | null;
  eventHeight: number | null;
  isMultiDay: boolean;
  multiDayWidth: number | null;
};

// Create the context
const CalendarDndContext = createContext<CalendarDndContextType>({
  activeEvent: null,
  activeId: null,
  activeView: null,
  currentTime: null,
  dragHandlePosition: null,
  eventHeight: null,
  isMultiDay: false,
  multiDayWidth: null,
});

// Hook to use the context
export const useCalendarDnd = () => useContext(CalendarDndContext);

// Props for the provider
interface CalendarDndProviderProps {
  children: ReactNode;
  onEventUpdate: (event: CalendarEvent) => void;
}

export function CalendarDndProvider({
  children,
  onEventUpdate,
}: CalendarDndProviderProps) {
  const [activeEvent, setActiveEvent] = useState<CalendarEvent | null>(null);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [activeView, setActiveView] = useState<"day" | "month" | "week" | null>(
    null,
  );
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [eventHeight, setEventHeight] = useState<number | null>(null);
  const [isMultiDay, setIsMultiDay] = useState(false);
  const [multiDayWidth, setMultiDayWidth] = useState<number | null>(null);
  const [dragHandlePosition, setDragHandlePosition] = useState<{
    data?: {
      isFirstDay?: boolean;
      isLastDay?: boolean;
    };
    x?: number;
    y?: number;
  } | null>(null);

  // Store original event dimensions
  const eventDimensions = useRef<{ height: number }>({ height: 0 });

  // Use a ref to track the last update time to throttle updates
  const lastUpdateRef = useRef<number>(0);

  // Use a stable reference for context to prevent frequent context changes
  const stableActiveEvent = useRef(activeEvent);
  stableActiveEvent.current = activeEvent;

  // Use a stable reference for the onEventUpdate callback
  const onEventUpdateRef = useRef(onEventUpdate);
  onEventUpdateRef.current = onEventUpdate;

  // Configure sensors for better drag detection at component level
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 5,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 5,
    },
  });

  // Use the useSensors hook at component level
  const sensors = useSensors(mouseSensor, touchSensor, pointerSensor);

  // Create a stable context value
  const contextValue = useMemo(
    () => ({
      activeEvent,
      activeId,
      activeView,
      currentTime,
      dragHandlePosition,
      eventHeight,
      isMultiDay,
      multiDayWidth,
    }),
    [
      activeEvent,
      activeId,
      activeView,
      currentTime,
      dragHandlePosition,
      eventHeight,
      isMultiDay,
      multiDayWidth,
    ],
  );

  // Generate a stable ID for the DndContext
  const dndContextId = useId();

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;

    // Add safety check for data.current
    if (!active.data.current) {
      console.error("Missing data in drag start event", event);
      return;
    }

    const {
      dragHandlePosition: eventDragHandlePosition,
      event: calendarEvent,
      height,
      isMultiDay: eventIsMultiDay,
      multiDayWidth: eventMultiDayWidth,
      view,
    } = active.data.current as {
      event: CalendarEvent;
      view: "day" | "month" | "week";
      dragHandlePosition?: {
        data?: {
          isFirstDay?: boolean;
          isLastDay?: boolean;
        };
        x?: number;
        y?: number;
      };
      height?: number;
      isMultiDay?: boolean;
      multiDayWidth?: number;
    };

    setActiveEvent(calendarEvent);
    setActiveId(active.id);
    setActiveView(view);
    setCurrentTime(new Date(calendarEvent.start));
    setIsMultiDay(eventIsMultiDay || false);
    setMultiDayWidth(eventMultiDayWidth || null);
    setDragHandlePosition(eventDragHandlePosition || null);

    // Store event height if provided
    if (height) {
      eventDimensions.current.height = height;
      setEventHeight(height);
    }
  }, []);

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { over } = event;

      // Throttle updates to every 60ms (approx 16 fps) to reduce overhead
      const now = Date.now();
      if (now - lastUpdateRef.current < 60) {
        return;
      }
      lastUpdateRef.current = now;

      if (over && over.data.current) {
        const { date, time } = over.data.current as {
          date: Date;
          time?: number;
        };

        // Update time for week/day views
        if (time !== undefined && activeView !== "month") {
          const newTime = new Date(date);

          // Calculate hours and minutes with 15-minute precision
          const hours = Math.floor(time);

          // Simplified calculation for minutes - map time fractions to fixed 15-min increments
          let minutes = 0;
          const fractionalHour = time - hours;
          if (fractionalHour >= 0.125 && fractionalHour < 0.375) minutes = 15;
          else if (fractionalHour >= 0.375 && fractionalHour < 0.625)
            minutes = 30;
          else if (fractionalHour >= 0.625) minutes = 45;

          newTime.setHours(hours, minutes, 0, 0);

          // Only update if significant time change (reduces state updates)
          setCurrentTime((prev) => {
            if (!prev) return newTime;
            if (
              newTime.getHours() !== prev.getHours() ||
              newTime.getMinutes() !== prev.getMinutes() ||
              newTime.getDate() !== prev.getDate() ||
              newTime.getMonth() !== prev.getMonth()
            ) {
              return newTime;
            }
            return prev;
          });
        } else if (activeView === "month") {
          // For month view, just update the date but preserve time
          setCurrentTime((prev) => {
            if (!prev) return date;

            const newTime = new Date(date);
            newTime.setHours(
              prev.getHours(),
              prev.getMinutes(),
              prev.getSeconds(),
              prev.getMilliseconds(),
            );

            // Only update if date has changed
            if (
              newTime.getDate() !== prev.getDate() ||
              newTime.getMonth() !== prev.getMonth()
            ) {
              return newTime;
            }
            return prev;
          });
        }
      }
    },
    [activeView],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      // Use local variables for component state
      const localActiveEvent = stableActiveEvent.current;
      const localCurrentTime = currentTime;

      // Add robust error checking
      if (!over || !localActiveEvent || !localCurrentTime) {
        // Reset state and exit early
        setActiveEvent(null);
        setActiveId(null);
        setActiveView(null);
        setCurrentTime(null);
        setEventHeight(null);
        setIsMultiDay(false);
        setMultiDayWidth(null);
        setDragHandlePosition(null);
        return;
      }

      try {
        // Safely access data with checks
        if (!active.data.current || !over.data.current) {
          throw new Error("Missing data in drag event");
        }

        const activeData = active.data.current as {
          event?: CalendarEvent;
          view?: string;
        };
        const overData = over.data.current as { date?: Date; time?: number };

        // Verify we have all required data
        if (!activeData.event || !overData.date) {
          throw new Error("Missing required event data");
        }

        const calendarEvent = activeData.event;
        const date = overData.date;
        const time = overData.time;

        // Calculate new start time
        const newStart = new Date(date);

        // If time is provided (for week/day views), set the hours and minutes
        if (time !== undefined) {
          const hours = Math.floor(time);
          let minutes = 0;
          const fractionalHour = time - hours;
          if (fractionalHour >= 0.125 && fractionalHour < 0.375) minutes = 15;
          else if (fractionalHour >= 0.375 && fractionalHour < 0.625)
            minutes = 30;
          else if (fractionalHour >= 0.625) minutes = 45;

          newStart.setHours(hours, minutes, 0, 0);
        } else {
          // For month view, preserve the original time from currentTime
          newStart.setHours(
            localCurrentTime.getHours(),
            localCurrentTime.getMinutes(),
            localCurrentTime.getSeconds(),
            localCurrentTime.getMilliseconds(),
          );
        }

        // Calculate new end time based on the original duration
        const originalStart = new Date(calendarEvent.start);
        const originalEnd = new Date(calendarEvent.end);
        const durationMinutes = differenceInMinutes(originalEnd, originalStart);
        const newEnd = addMinutes(newStart, durationMinutes);

        // Only update if the start time has actually changed
        const hasStartTimeChanged =
          originalStart.getFullYear() !== newStart.getFullYear() ||
          originalStart.getMonth() !== newStart.getMonth() ||
          originalStart.getDate() !== newStart.getDate() ||
          originalStart.getHours() !== newStart.getHours() ||
          originalStart.getMinutes() !== newStart.getMinutes();

        if (hasStartTimeChanged) {
          // Use the stable reference to the callback to avoid dependency changes
          onEventUpdateRef.current({
            ...calendarEvent,
            end: newEnd,
            start: newStart,
          });
        }
      } catch (error) {
        console.error("Error in drag end handler:", error);
      } finally {
        // Always reset state
        setActiveEvent(null);
        setActiveId(null);
        setActiveView(null);
        setCurrentTime(null);
        setEventHeight(null);
        setIsMultiDay(false);
        setMultiDayWidth(null);
        setDragHandlePosition(null);
      }
    },
    [currentTime], // Only depends on currentTime, using refs for other values
  );

  // Only render the overlay if there's an active drag
  const showDragOverlay = !!activeEvent && !!activeView;

  // Memoize the overlay content to prevent unnecessary re-renders
  const dragOverlayContent = useMemo(() => {
    if (!showDragOverlay) return null;

    return (
      <div
        style={{
          height: eventHeight ? `${eventHeight}px` : "auto",
          width: isMultiDay && multiDayWidth ? `${multiDayWidth}%` : "100%",
        }}
      >
        <EventItem
          currentTime={currentTime || undefined}
          event={activeEvent!}
          isDragging={true}
          isFirstDay={dragHandlePosition?.data?.isFirstDay !== false}
          isLastDay={dragHandlePosition?.data?.isLastDay !== false}
          showTime={activeView !== "month"}
          view={activeView!}
        />
      </div>
    );
  }, [
    showDragOverlay,
    activeEvent,
    activeView,
    currentTime,
    eventHeight,
    isMultiDay,
    multiDayWidth,
    dragHandlePosition,
  ]);

  return (
    <DndContext
      id={dndContextId}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
      sensors={sensors}
    >
      <CalendarDndContext.Provider value={contextValue}>
        {children}

        {showDragOverlay && (
          <DragOverlay adjustScale={false} dropAnimation={null}>
            {dragOverlayContent}
          </DragOverlay>
        )}
      </CalendarDndContext.Provider>
    </DndContext>
  );
}
