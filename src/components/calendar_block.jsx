import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

export default function CalendarBlock({ d, setDate }) {
  return (
    <div>
      <Calendar
        mode="single"
        selected={d}
        onSelect={setDate}
        className="rounded-md border shadow-sm"
        captionLayout="dropdown"
        numberofMonths={2}
      />
    </div>
  );
}
