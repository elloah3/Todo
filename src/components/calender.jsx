import { useEffect, useState } from "react";
import { addDays, format, isSameDay } from "date-fns";

function getDates(d) {
  let dates = [addDays(d, -2), addDays(d, -1), d, addDays(d, 1), addDays(d, 2)];
  return dates;
}

export default function Calender({ todos, d, setD }) {
  let [dates, setDates] = useState(getDates(new Date()));

  function handleChange(delta) {
    let middleDate = dates[2];
    let nextMiddleDate = addDays(middleDate, delta);
    setDates(getDates(nextMiddleDate));
  }

  function handleDateChange(event) {
    console.log("changed value", event.target.value); // 2025-06-06 LT
    let dateObj = new Date(event.target.value + "T00:00:00");
    console.log("dateObj", dateObj);  // 2025-06-05 PST
    setD(dateObj);
    setDates(getDates(dateObj));
  }

  return (
    <div>
      <input type="date" onChange={handleDateChange} />
      <div className="flex justify-evenly mb-5">
        <button onClick={() => handleChange(-5)}>prev</button>
        {dates.map((d) => (
          <button
            className="bg-amber-200 p-2 cursor-pointer "
            key={d.getTime()}
            onClick={() => setD(format(d, "yyyy-MM-dd"))}
          >
            <div>{format(d, "EEE")}</div>
            <div>{format(d, "dd")}</div>
            <div>
              {todos.filter((t) => isSameDay(d, t._creationTime)).length}
            </div>
          </button>
        ))}
        <button onClick={() => handleChange(5)}>next</button>
      </div>
    </div>
  );
}
