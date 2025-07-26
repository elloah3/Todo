import { useCallback, useEffect, useRef, useState } from "react";
import { addDays, eachDayOfInterval, format, subDays } from "date-fns";
import InfiniteScroll from "react-infinite-scroll-component";
import { api } from "../../convex/_generated/api";
import { usePaginatedQuery } from "convex/react";

function getInitialDates(d) {
  const start = subDays(d, 10);
  const end = addDays(d, 10);

  let dates = eachDayOfInterval({ start, end });
  return dates;
}

export default function Calender({ todos, d, setD }) {
  let [dates, setDates] = useState(getInitialDates(d));
  const selectedDateRef = useRef(null);

  //Fetch past dates
  const {
    results: pastDatesResults,
    status: pastDatesStatus,
    loadMore: loadMorePastConvexDates,
    hasMore: hasMorePastConvex,
  } = usePaginatedQuery(
    api.dates.getPastDates,
    {
      endDate:
        dates.length > 0
          ? format(dates[0], "yyyy-MM-dd")
          : format(d, "yyyy-MM-dd"),
    },
    { initialNumItems: 0 },
  );
  console.log("Initial hasMorePastConvex:", hasMorePastConvex);

  //Fetch future dates
  const {
    results: futureDatesResults,
    status: futureDatesStatus,
    loadMore: loadMoreFutureConvexDates,
    hasMore: hasMoreFutureConvex,
  } = usePaginatedQuery(
    api.dates.getFutureDates,
    {
      startDate:
        dates.length > 0
          ? format(dates[dates.length - 1], "yyyy-MM-dd")
          : format(d, "yyyy-MM-dd"),
    },
    { initialNumItems: 0 },
  );
  console.log("Initial hasMoreFutureConvex:", hasMoreFutureConvex);

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
  }

  useEffect(() => {
    if (futureDatesStatus === "success" && futureDatesResults.length > 0) {
      console.log(
        "futureDatesResults received. length:",
        futureDatesResults.length,
        "hasMoreFutureConvex:",
        hasMoreFutureConvex,
      );
      setDates((prevDates) => {
        const newDates = [
          ...prevDates.map((date) => format(date, "yyyy-MM-dd")),
          ...futureDatesResults,
        ];
        console.log("Merging useEffect running. Results:", futureDatesResults);
        return Array.from(new Set(newDates))
          .map((dateString) => new Date(dateString))
          .sort((a, b) => a.getTime() - b.getTime());
      });
    }
  }, [futureDatesResults, futureDatesStatus]);

  useEffect(() => {
    if (pastDatesStatus === "success" && pastDatesResults.length > 0) {
      console.log(" past useEffect has been called");
      setDates((prevDates) => {
        const newDates = [
          ...pastDatesResults,
          ...prevDates.map((date) => format(date, "yyyy-MM-dd")),
        ];
        console.log("Merging useEffect running. Results:", pastDatesResults);
        return Array.from(new Set(newDates))
          .map((dateString) => new Date(dateString))
          .sort((a, b) => a.getTime() - b.getTime());
      });
    }
  }, [pastDatesResults, pastDatesStatus]);

  if (futureDatesStatus === "loading" || hasMoreFutureConvex === undefined) {
    console.log("hasMore is undefined or query is loading");
  } else {
    console.log("hasMoreFutureConvex:", hasMoreFutureConvex);
  }

  const fetchMoreFutureData = useCallback(() => {
    console.log(
      "fetchMoreFutureData called. hasMoreFutureConvex:",
      hasMoreFutureConvex,
    );
    console.log("Fetching more data (future): ", hasMoreFutureConvex);
    if (hasMoreFutureConvex) {
      console.log("Calling loadMore");
      loadMoreFutureConvexDates();
    }
  }, [loadMoreFutureConvexDates, hasMoreFutureConvex]);

  const fetchMorePastData = useCallback(() => {
    console.log("Fetching more data (past): ", hasMorePastConvex);
    if (hasMorePastConvex) {
      console.log("Calling loadMore");
      loadMorePastConvexDates();
    }
  }, [loadMorePastConvexDates, hasMorePastConvex]);

  return (
    <div>
      <input
        type="date"
        className="my-2"
        onChange={handleDateChange}
        value={format(d, "yyyy-MM-dd")}
      />
      <div id="calender-container" className="h-1/2 mb-5 overflow-y-scroll">
        <InfiniteScroll
          dataLength={dates.length}
          next={fetchMorePastData}
          hasMore={hasMorePastConvex}
          loader={pastDatesStatus === "loading" && <h4>Loading past...</h4>}
          scrollableTarget="calender-container"
          inverse={true}
          className="flex flex-col-reverse"
        >
          <InfiniteScroll
            className="bg-blue-200 flex flex-col "
            dataLength={dates.length}
            next={fetchMoreFutureData}
            hasMore={hasMoreFutureConvex}
            loader={futureDatesStatus === "loading" && <h4>Loading...</h4>}
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
