import { useEffect, useState } from "react";
import { addDays, format, isSameDay } from "date-fns";

function getDates(d) {
  let dates = [addDays(d, -2), addDays(d, -1), d, addDays(d, 1), addDays(d, 2)];
  return dates;
}

export default function Calender({ todos, d, setD }) {
  let [dates, setDates] = useState(getDates(d));

  function handleChange(delta) {
    let middleDate = dates[2];
    let nextMiddleDate = addDays(middleDate, delta);
    setDates(getDates(nextMiddleDate));
  }

  function handleDateChange(event) {
    let dateObj = new Date(event.target.value + "T00:00:00");
    setD(dateObj);
    setDates(getDates(dateObj));
  }

  return (
    <div>
      <input type="date" onChange={handleDateChange} />
      <div className="flex justify-evenly mb-5">
        <button onClick={() => handleChange(-5)}>prev</button>
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
        <button onClick={() => handleChange(5)}>next</button>
      </div>
    </div>
  );
}
