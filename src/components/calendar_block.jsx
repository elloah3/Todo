import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

export default function CalendarBlock() {
  let [date, setD] = useState(new Date());
  return (
    <div>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setD}
        className="rounded-md border shadow-sm"
        captionLayout="dropdown"
      />
    </div>
  );
}
