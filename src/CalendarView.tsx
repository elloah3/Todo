import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useEffect, useState } from "react";

interface CalendarViewProps {
  deadlineDates: string[];
  selectedDate: string | null;
  setSelectedDate: (date: string | null) => void;
  expanded?: boolean;
}

export function CalendarView({
  deadlineDates,
  selectedDate,
  setSelectedDate,
  expanded = false,
}: CalendarViewProps) {
  if (expanded) {
    /* empty */
  }

  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    if (selectedDate) {
      setCurrentMonth(new Date(selectedDate));
    }
  }, [selectedDate]);

  const selectedDateTodos = useQuery(
    api.todos.getTodosByDate,
    selectedDate ? { date: selectedDate } : "skip",
  );

  const getDaysInMonth = (date: Date): (Date | null)[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days; //[D, D, D, D]
  };

  const formatDateString = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const hasDeadline = (date: Date) => {
    const dateString = formatDateString(date);
    return deadlineDates.includes(dateString);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return selectedDate === formatDateString(date);
  };

  const handleDateClick = (date: Date) => {
    const dateString = formatDateString(date);
    if (hasDeadline(date)) {
      setSelectedDate(selectedDate === dateString ? null : dateString);
    }
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prevMonth) => {
      const newMonth = new Date(prevMonth);
      if (direction === "prev") {
        newMonth.setMonth(prevMonth.getMonth() - 1);
      } else {
        newMonth.setMonth(prevMonth.getMonth() + 1);
      }
      return newMonth;
    });
  };
  //replace everything with selecteddate and its set
  const days = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-4">
      <div className="flex items-center justify-between  my-3 mb-4">
        <h2 className="text-xl font-semibold text-purple-800 flex items-center gap-2">
          <span className="text-2xl">📅</span>
          Calendar
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateMonth("prev")}
            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
          >
            ←
          </button>
          <span className="font-medium text-purple-800 min-w-[140px] text-center">
            {monthName}
          </span>
          <button
            onClick={() => navigateMonth("next")}
            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
          >
            →
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="p-2 text-center text-sm font-medium text-purple-600"
          >
            {day}
          </div>
        ))}

        {days.map((date, index) => (
          <div key={index} className="aspect-square">
            {date ? (
              <button
                onClick={() => handleDateClick(date)}
                disabled={!hasDeadline(date)}
                className={`w-full h-full rounded-lg text-sm font-medium transition-all ${
                  hasDeadline(date)
                    ? `cursor-pointer ${
                        isSelected(date)
                          ? "bg-purple-500 text-white shadow-md"
                          : "bg-purple-100 text-purple-800 hover:bg-purple-200"
                      }`
                    : "text-gray-400 cursor-not-allowed"
                } ${
                  isToday(date) && !isSelected(date)
                    ? "ring-2 ring-purple-300"
                    : ""
                }`}
              >
                <div className="flex flex-col items-center justify-center h-full">
                  <span>{date.getDate()}</span>
                  {hasDeadline(date) && <span className="text-xs">•</span>}
                </div>
              </button>
            ) : (
              <div className="w-full h-full"></div>
            )}
          </div>
        ))}
      </div>

      {/* Selected Date Info */}
      {selectedDate && selectedDateTodos && (
        <div className="mt-6 p-4 bg-purple-50 rounded-xl border border-purple-200">
          <h3 className="font-medium text-purple-800 mb-2 flex items-center gap-2">
            <span className="text-lg">📋</span>
            {new Date(selectedDate).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </h3>
          <div className="space-y-2">
            {selectedDateTodos.map((todo) => (
              <div key={todo._id} className="flex items-center gap-2 text-sm">
                <span
                  className={`w-2 h-2 rounded-full ${
                    todo.important ? "bg-yellow-400" : "bg-purple-400"
                  }`}
                ></span>
                <span
                  className={
                    todo.completed
                      ? "line-through text-gray-500"
                      : "text-gray-700"
                  }
                >
                  {todo.text}
                </span>
                {todo.important && <span className="text-yellow-500">⭐</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-purple-600">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-purple-100 rounded"></div>
          <span>Has deadlines</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-purple-500 rounded"></div>
          <span>Selected</span>
        </div>
      </div>
    </div>
  );
}
