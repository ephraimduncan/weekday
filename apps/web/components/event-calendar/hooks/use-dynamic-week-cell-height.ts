import { useEffect, useState } from "react";

import { EndHour, StartHour } from "../constants";

const DEFAULT_CELL_HEIGHT = 75;
const HEADER_FOOTER_GUESS = 120;
const ALL_DAY_SECTION_GUESS = 50;

export function useDynamicWeekCellHeight(hasAllDaySection: boolean = false) {
  const [cellHeight, setCellHeight] = useState(DEFAULT_CELL_HEIGHT);

  useEffect(() => {
    const calculateHeight = () => {
      if (typeof window !== "undefined") {
        const windowHeight = window.innerHeight;
        const availableHeight =
          windowHeight -
          HEADER_FOOTER_GUESS -
          (hasAllDaySection ? ALL_DAY_SECTION_GUESS : 0);
        const hoursToShow = EndHour - StartHour;
        if (hoursToShow <= 0) {
          setCellHeight(DEFAULT_CELL_HEIGHT);
          return;
        }
        const calculatedHeight = Math.max(1, availableHeight / hoursToShow);
        setCellHeight(calculatedHeight);
      }
    };

    calculateHeight();
    window.addEventListener("resize", calculateHeight);
    return () => window.removeEventListener("resize", calculateHeight);
  }, [hasAllDaySection]);

  return cellHeight;
}
