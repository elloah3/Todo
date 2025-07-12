import { useCallback, useEffect, useRef, useState } from "react";
import { addDays, eachDayOfInterval, format, subDays } from "date-fns";
import InfiniteScroll from "react-infinite-scroll-component";

function getInitialDates(d) {
  const start = subDays(d, 10);
  const end = addDays(d, 10);

  let dates = eachDayOfInterval({ start, end });
  return dates;
}

export default function Calender({ todos, d, setD }) {
  let [dates, setDates] = useState(getInitialDates(d));
  const selectedDateRef = useRef(null);
  const [hasMore, setHasMore] = useState(true);
  const [hasMorePast, setHasMorePast] = useState(true);

  useEffect(() => {
    if (selectedDateRef.current) {
      selectedDateRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [d, dates]);

  function handleDateChange(event) {
    let dateObj = new Date(event.target.value + "T00:00:00");
    setD(dateObj);
    setDates(getInitialDates(dateObj));
    setHasMore(true);
    setHasMorePast(true);
  }

  const generateMorePastDates = useCallback(() => {
    const firstDate = dates[0];
    const newDates = eachDayOfInterval({
      start: subDays(firstDate, 10),
      end: subDays(firstDate, 1),
    });
    return newDates;
  }, [dates]);

  const generateMoreFutureDates = useCallback(() => {
    const lastDate = dates[dates.length - 1];
    const newDates = eachDayOfInterval({
      start: addDays(lastDate, 1),
      end: addDays(lastDate, 10),
    });
    return newDates;
  }, [dates]);

  function fetchMoreFutureData() {
    setTimeout(() => {
      const moreDates = generateMoreFutureDates();
      if (moreDates.length === 0) {
        setHasMore(false);
        return;
      }
      setDates((prevDates) => [...prevDates, ...moreDates]);
    }, 500);
  }

  function fetchMorePastData() {
    setTimeout(() => {
      const moreDates = generateMorePastDates();
      if (moreDates.length === 0) {
        setHasMorePast(false);
        return;
      }
      setDates((prevDates) => [...moreDates, ...prevDates]);
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
      <div id="calender-container" className="h-1/2 mb-5 overflow-y-scroll">
        <>{/*fetchMorePastData isn't generating correctly*/}</>
        <InfiniteScroll
          dataLength={dates.length}
          next={fetchMorePastData}
          hasMore={hasMorePast}
          loader={<h4>Loading past...</h4>}
          scrollableTarget="calender-container"
          inverse={true}
        >
          <InfiniteScroll
            className="bg-blue-200 flex flex-col"
            dataLength={dates.length}
            next={fetchMoreFutureData}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
            scrollableTarget="calender-container"
          >
            {dates.map((dd) => (
              <button
                className="cursor-pointer"
                key={dd.getTime()}
                ref={
                  format(dd, "yyyy-MM-dd") === format(d, "yyyy-MM-dd")
                    ? selectedDateRef
                    : null
                }
                style={{
                  backgroundColor:
                    format(dd, "yyyy-MM-dd") === format(d, "yyyy-MM-dd")
                      ? "lightblue"
                      : "lightgray",
                }}
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
        </InfiniteScroll>
      </div>
    </div>
  );
}
