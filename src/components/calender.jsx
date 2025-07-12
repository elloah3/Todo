import { useCallback, useEffect, useRef, useState } from "react";
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
import InfiniteScroll from "react-infinite-scroll-component";

function getInitialDates(d) {
  const start = d;
  const end = addDays(d, 10);

  let dates = eachDayOfInterval({ start, end });
  return dates;
}

export default function Calender({ todos, d, setD }) {
  let [dates, setDates] = useState(getInitialDates(d));
  const [hasMore, setHasMore] = useState(true);

  function handleDateChange(event) {
    let dateObj = new Date(event.target.value + "T00:00:00");
    setD(dateObj);
    setDates(getInitialDates(dateObj));
    setHasMore(true);
  }

  const generateMoreDates = useCallback(() => {
    const lastDate = dates[dates.length - 1];
    const newDates = eachDayOfInterval({
      start: addDays(lastDate, 1),
      end: addDays(lastDate, 10),
    });
    return newDates;
  }, [dates]);

  function fetchMoreData() {
    setTimeout(() => {
      const moreDates = generateMoreDates();
      if (moreDates == 0) {
        setHasMore(false);
        return;
      }
      setDates((prevDates) => [...prevDates, ...moreDates]);
    }, 500);
  }

  return (
    <div>
      <input
        type="date"
        className="my-2"
        onChange={handleDateChange}
        value={format(d, "yyyy-MM-dd")}
      />

      <div>Testing Infinite Scroll</div>
      <div className="h-1/2 mb-5 overflow-y-scroll">
        <InfiniteScroll
          className="bg-blue-200 flex flex-col"
          height={300}
          dataLength={dates.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>You have seen it all</b>
            </p>
          }
        >
          {dates.map((dd) => (
            <button
              className="cursor-pointer"
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
        </InfiniteScroll>
      </div>
    </div>
  );
}
