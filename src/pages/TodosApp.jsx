import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";

import { useState } from "react";
import { api } from "../../convex/_generated/api";
import { format, isPast, isSameDay, startOfDay } from "date-fns";
import Calender from "../components/calender";
import TodosList from "../components/todos-list";
import TodosForm from "../components/todos-form";
import { v } from "convex/values";
import UpcomingTodos from "../components/upcoming-todos";
import { addDays, isWithinInterval } from "date-fns";
import Overdue from "../components/overdue-todos";

export default function TodosApp() {
  const todos = useQuery(api.todos.readTodos);
  const [d, setD] = useState(startOfDay(new Date()));

  const today = new Date();
  const tenFromNow = addDays(today, 10);

  if (!todos) return <div>loading</div>;

  return (
    <div>
      <div className="flex justify-around p-2">
        <div className="flex flex-col w-1/2">
          <div>d: {format(d, "yyyy-MM-dd HH:mm")}</div>
          <div className="flex w-full h-1/2">
            <UpcomingTodos
              todos={todos.filter((v) =>
                isWithinInterval(v.deadline, {
                  start: today,
                  end: tenFromNow,
                }),
              )}
              setD={setD}
            />
            <Overdue
              todos={todos.filter((v) => isPast(v.deadline))}
              setD={setD}
            />
          </div>
          <div className="bg-gray-300 rounded-2xl p-4 h-full">
            <TodosForm d={d} />
            <TodosList
              todos={todos.filter((v) =>
                isSameDay(v.deadline, format(d, "yyyy-MM-dd")),
              )}
            />
          </div>
        </div>
        <Calender todos={todos} d={d} setD={setD} />
      </div>
    </div>
  );
}
