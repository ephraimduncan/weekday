"use client";

import { useEffect, useState } from "react";

import type {
  CalendarEvent,
  EventColor,
  RecurrenceType,
} from "@/components/event-calendar";

import { RiCalendarLine, RiDeleteBinLine } from "@remixicon/react";
import { format, isBefore } from "date-fns";

import {
  DefaultEndHour,
  DefaultStartHour,
  EndHour,
  StartHour,
} from "@/components/event-calendar/constants";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface EventDialogProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (eventId: string) => void;
  onSave: (event: CalendarEvent) => void;
}

// Pre-compute time options once outside of the component
const timeOptions = (() => {
  const options = [];
  for (let hour = StartHour; hour <= EndHour; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const formattedHour = hour.toString().padStart(2, "0");
      const formattedMinute = minute.toString().padStart(2, "0");
      const value = `${formattedHour}:${formattedMinute}`;
      // Use a fixed date to avoid unnecessary date object creations
      const date = new Date(2000, 0, 1, hour, minute);
      const label = format(date, "h:mm a");
      options.push({ label, value });
    }
  }
  return options;
})();

export function EventDialog({
  event,
  isOpen,
  onClose,
  onDelete,
  onSave,
}: EventDialogProps) {
  const [formState, setFormState] = useState({
    allDay: false,
    color: "blue" as EventColor,
    description: "",
    endDate: new Date(),
    endTime: `${DefaultEndHour}:00`,
    location: "",
    recurrence: "none" as RecurrenceType,
    startDate: new Date(),
    startTime: `${DefaultStartHour}:00`,
    title: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [uiState, setUiState] = useState({
    endDateOpen: false,
    startDateOpen: false,
  });

  // Initialize form with event data when it changes

  useEffect(() => {
    if (event) {
      const start = new Date(event.start);
      const end = new Date(event.end);

      setFormState({
        allDay: event.allDay || false,
        color: (event.color as EventColor) || "blue",
        description: event.description || "",
        endDate: end,
        endTime: formatTimeForInput(end),
        location: event.location || "",
        recurrence: event.recurrence || "none",
        startDate: start,
        startTime: formatTimeForInput(start),
        title: event.title || "",
      });
      setError(null);
    } else {
      resetForm();
    }
  }, [event]);

  const resetForm = () => {
    setFormState({
      allDay: false,
      color: "blue" as EventColor,
      description: "",
      endDate: new Date(),
      endTime: `${DefaultEndHour}:00`,
      location: "",
      recurrence: "none" as RecurrenceType,
      startDate: new Date(),
      startTime: `${DefaultStartHour}:00`,
      title: "",
    });
    setError(null);
  };

  const formatTimeForInput = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = Math.floor(date.getMinutes() / 15) * 15;
    return `${hours}:${minutes.toString().padStart(2, "0")}`;
  };

  const handleSave = () => {
    const start = new Date(formState.startDate);
    const end = new Date(formState.endDate);

    if (!formState.allDay) {
      const [startHours = 0, startMinutes = 0] = formState.startTime
        .split(":")
        .map(Number);
      const [endHours = 0, endMinutes = 0] = formState.endTime
        .split(":")
        .map(Number);

      if (
        startHours < StartHour ||
        startHours > EndHour ||
        endHours < StartHour ||
        endHours > EndHour
      ) {
        setError(
          `Selected time must be between ${StartHour}:00 and ${EndHour}:00`,
        );
        return;
      }

      start.setHours(startHours, startMinutes, 0);
      end.setHours(endHours, endMinutes, 0);
    } else {
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
    }

    // Validate that end date is not before start date
    if (isBefore(end, start)) {
      setError("End date cannot be before start date");
      return;
    }

    // Use generic title if empty
    const eventTitle = formState.title.trim() ? formState.title : "(no title)";

    onSave({
      id: event?.id || "",
      allDay: formState.allDay,
      color: formState.color,
      description: formState.description,
      end,
      location: formState.location,
      recurrence: formState.recurrence,
      start,
      title: eventTitle,
    });
  };

  const handleDelete = () => {
    if (event?.id) {
      onDelete(event.id);
    }
  };

  // Updated color options to match types.ts
  const colorOptions: Array<{
    bgClass: string;
    borderClass: string;
    label: string;
    value: EventColor;
  }> = [
    {
      bgClass: "bg-blue-400 data-[state=checked]:bg-blue-400",
      borderClass: "border-blue-400 data-[state=checked]:border-blue-400",
      label: "Blue",
      value: "blue",
    },
    {
      bgClass: "bg-violet-400 data-[state=checked]:bg-violet-400",
      borderClass: "border-violet-400 data-[state=checked]:border-violet-400",
      label: "Violet",
      value: "violet",
    },
    {
      bgClass: "bg-rose-400 data-[state=checked]:bg-rose-400",
      borderClass: "border-rose-400 data-[state=checked]:border-rose-400",
      label: "Rose",
      value: "rose",
    },
    {
      bgClass: "bg-emerald-400 data-[state=checked]:bg-emerald-400",
      borderClass: "border-emerald-400 data-[state=checked]:border-emerald-400",
      label: "Emerald",
      value: "emerald",
    },
    {
      bgClass: "bg-orange-400 data-[state=checked]:bg-orange-400",
      borderClass: "border-orange-400 data-[state=checked]:border-orange-400",
      label: "Orange",
      value: "orange",
    },
  ];

  const updateFormField = (field: string, value: any) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const setStartDateOpen = (open: boolean) => {
    setUiState((prev) => ({ ...prev, startDateOpen: open }));
  };

  const setEndDateOpen = (open: boolean) => {
    setUiState((prev) => ({ ...prev, endDateOpen: open }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{event?.id ? "Edit Event" : "Create Event"}</DialogTitle>
          <DialogDescription className="sr-only">
            {event?.id
              ? "Edit the details of this event"
              : "Add a new event to your calendar"}
          </DialogDescription>
        </DialogHeader>
        {error && (
          <div className="bg-destructive/15 text-destructive rounded-md px-3 py-2 text-sm">
            {error}
          </div>
        )}
        <div className="grid gap-4 py-4">
          <div className="*:not-first:mt-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formState.title}
              onChange={(e) => updateFormField("title", e.target.value)}
            />
          </div>

          <div className="*:not-first:mt-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formState.description}
              onChange={(e) => updateFormField("description", e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1 *:not-first:mt-1.5">
              <Label htmlFor="start-date">Start Date</Label>
              <Popover
                open={uiState.startDateOpen}
                onOpenChange={setStartDateOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    id="start-date"
                    variant="outline"
                    className={cn(
                      "group bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]",
                      !formState.startDate && "text-muted-foreground",
                    )}
                  >
                    <span
                      className={cn(
                        "truncate",
                        !formState.startDate && "text-muted-foreground",
                      )}
                    >
                      {formState.startDate
                        ? format(formState.startDate, "PPP")
                        : "Pick a date"}
                    </span>
                    <RiCalendarLine
                      size={16}
                      className="text-muted-foreground/80 shrink-0"
                      aria-hidden="true"
                    />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2" align="start">
                  <Calendar
                    selected={formState.startDate}
                    onSelect={(date) => {
                      if (date) {
                        const newEndDate = isBefore(formState.endDate, date)
                          ? date
                          : formState.endDate;
                        setFormState((prev) => ({
                          ...prev,
                          endDate: newEndDate,
                          startDate: date,
                        }));
                        setError(null);
                        setStartDateOpen(false);
                      }
                    }}
                    defaultMonth={formState.startDate}
                    mode="single"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {!formState.allDay && (
              <div className="min-w-28 *:not-first:mt-1.5">
                <Label htmlFor="start-time">Start Time</Label>
                <Select
                  value={formState.startTime}
                  onValueChange={(value) => updateFormField("startTime", value)}
                >
                  <SelectTrigger id="start-time">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <div className="flex-1 *:not-first:mt-1.5">
              <Label htmlFor="end-date">End Date</Label>
              <Popover open={uiState.endDateOpen} onOpenChange={setEndDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id="end-date"
                    variant="outline"
                    className={cn(
                      "group bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]",
                      !formState.endDate && "text-muted-foreground",
                    )}
                  >
                    <span
                      className={cn(
                        "truncate",
                        !formState.endDate && "text-muted-foreground",
                      )}
                    >
                      {formState.endDate
                        ? format(formState.endDate, "PPP")
                        : "Pick a date"}
                    </span>
                    <RiCalendarLine
                      size={16}
                      className="text-muted-foreground/80 shrink-0"
                      aria-hidden="true"
                    />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2" align="start">
                  <Calendar
                    disabled={{ before: formState.startDate }}
                    selected={formState.endDate}
                    onSelect={(date) => {
                      if (date) {
                        updateFormField("endDate", date);
                        setError(null);
                        setEndDateOpen(false);
                      }
                    }}
                    defaultMonth={formState.endDate}
                    mode="single"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {!formState.allDay && (
              <div className="min-w-28 *:not-first:mt-1.5">
                <Label htmlFor="end-time">End Time</Label>
                <Select
                  value={formState.endTime}
                  onValueChange={(value) => updateFormField("endTime", value)}
                >
                  <SelectTrigger id="end-time">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="all-day"
              checked={formState.allDay}
              onCheckedChange={(checked) =>
                updateFormField("allDay", checked === true)
              }
            />
            <Label htmlFor="all-day">All day</Label>
          </div>

          <div className="*:not-first:mt-1.5">
            <Label htmlFor="recurrence">Repeat</Label>
            <Select
              value={formState.recurrence}
              onValueChange={(value: RecurrenceType) =>
                updateFormField("recurrence", value)
              }
            >
              <SelectTrigger id="recurrence">
                <SelectValue placeholder="Does not repeat" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Does not repeat</SelectItem>
                <SelectItem value="daily">Every day</SelectItem>
                <SelectItem value="weekly">Every week</SelectItem>
                <SelectItem value="monthly">Every month</SelectItem>
                <SelectItem value="yearly">Every year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="*:not-first:mt-1.5">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formState.location}
              onChange={(e) => updateFormField("location", e.target.value)}
            />
          </div>
          <fieldset className="space-y-4">
            <legend className="text-foreground text-sm leading-none font-medium">
              Etiquette
            </legend>
            <RadioGroup
              className="flex gap-1.5"
              defaultValue={colorOptions[0]?.value}
              value={formState.color}
              onValueChange={(value: EventColor) =>
                updateFormField("color", value)
              }
            >
              {colorOptions.map((colorOption) => (
                <RadioGroupItem
                  id={`color-${colorOption.value}`}
                  key={colorOption.value}
                  className={cn(
                    "size-6 shadow-none",
                    colorOption.bgClass,
                    colorOption.borderClass,
                  )}
                  value={colorOption.value}
                  aria-label={colorOption.label}
                />
              ))}
            </RadioGroup>
          </fieldset>
        </div>
        <DialogFooter className="flex-row sm:justify-between">
          {event?.id && (
            <Button
              size="icon"
              variant="outline"
              className="text-destructive hover:text-destructive"
              onClick={handleDelete}
              aria-label="Delete event"
            >
              <RiDeleteBinLine size={16} aria-hidden="true" />
            </Button>
          )}
          <div className="flex flex-1 justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
