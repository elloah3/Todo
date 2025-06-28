import { useEffect, useRef, useState } from "react";
import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDate,
  isSameDay,
  startOfMonth,
  subDays,
} from "date-fns";

function getDates(d) {
  const start = d;
  const end = addDays(d, 10);

  let dates = eachDayOfInterval({ start, end });
  return dates;
}

export default function Calender({ todos, d, setD }) {
  let [dates, setDates] = useState(getDates(d));
  const calenderRef = useRef(null);

  function handleDateChange(event) {
    let dateObj = new Date(event.target.value + "T00:00:00");
    setD(dateObj);
    setDates(getDates(dateObj));
  }

  return (
    <div>
      <input
        type="date"
        className="my-2"
        onChange={handleDateChange}
        //value={format(d, "yyyy-MM-dd")}
      />
      <div
        className="flex flex-col justify-evenly mb-5 h-1/2 overflow-y-scroll"
        id="calender-container"
      >
        {dates.map((dd) => (
          <button
            className="bg-amber-200 p-2 cursor-pointer "
            key={dd.getTime()}
            onClick={() => {
              setD(dd);
            }}
          >
            <div>{format(dd, "MM-dd HH:mm")}</div>
            {/* <div>{format(dd, "EEE")}</div>
            <div>{format(dd, "dd")}</div> */}
            <div>
              {
                todos.filter((t) => format(dd, "yyyy-MM-dd") === t.deadline)
                  .length
              }
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
