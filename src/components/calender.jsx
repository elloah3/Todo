import { useEffect, useState } from "react";
import { addDays, format, isSameDay } from "date-fns";

function getDates(d) {
  let dates = [addDays(d, -2), addDays(d, -1), d, addDays(d, 1), addDays(d, 2)];
  return dates;
}

export default function Calender({ todos, d, setD }) {
  let dates = getDates(d);

  function handleDateChange(event) {
    let dateObj = new Date(event.target.value + "T00:00:00");
    setD(dateObj);
  }

  return (
    <div>
      <input
        type="date"
        className="my-2"
        onChange={handleDateChange}
        //value={format(d, "yyyy-MM-dd")}
      />
      <div className="flex flex-col justify-evenly mb-5">
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
