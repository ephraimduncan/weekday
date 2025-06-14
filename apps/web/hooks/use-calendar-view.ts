import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"

import type { CalendarView } from "@/components/event-calendar"

type CalendarViewConfig = {
  view: CalendarView
}

const calendarViewAtom = atomWithStorage<CalendarViewConfig>("calendar-view", {
  view: "week",
})

export function useCalendarView() {
  return useAtom(calendarViewAtom)
}