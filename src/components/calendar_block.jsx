import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useState } from "react";

export default function CalendarBlock({ d, setDate, todos }) {
  return (
    <div>
      <Calendar
        mode="single"
        selected={d}
        onSelect={setDate}
        className="rounded-md border shadow-sm [--cell-size:--spacing(11)] md:[--cell-size:--spacing(10))]"
        captionLayout="dropdown"
        numberofMonths={1}
        buttonVariant="ghost"
        components={{
          DayButton: ({ children, modifiers, day, ...props }) => {
            return (
              <CalendarDayButton day={day} modifiers={modifiers} {...props}>
                {children}
                {!modifiers.outside && (
                  //Number of todos due on this day

                  //currently filter works for present day only but the span is mapped to every calender day
                  <span>
                    {
                      todos.filter(
                        (t) => format(d, "yyyy-MM-dd") === t.deadline,
                      ).length
                    }
                  </span>
                )}
              </CalendarDayButton>
            );
          },
        }}
      />
    </div>
  );
}
