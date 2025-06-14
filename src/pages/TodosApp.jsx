import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";

import { useState } from "react";
import { api } from "../../convex/_generated/api";
import { format, isSameDay, startOfDay } from "date-fns";
import Calender from "../components/calender";
import TodosList from "../components/todos-list";
import TodosForm from "../components/todos-form";
import { v } from "convex/values";

export default function TodosApp() {
  const todos = useQuery(api.todos.readTodos);
  const [d, setD] = useState(startOfDay(new Date()));

  if (!todos) return <div>loading</div>;

  //todos.filter((v) => isSameDay(v.deadline, d))

  return (
    <div>
      <div className="text-center text-2xl">
        d: {format(d, "yyyy-MM-dd HH:mm")}
        <div>{console.log(d)}</div>
      </div>
      <Calender todos={todos} d={d} setD={setD} />
      <div className="bg-gray-300 rounded-2xl p-4">
        <TodosForm d={d} />
        <TodosList
          todos={todos.filter((v) =>
            isSameDay(v.deadline, format(d, "yyyy-MM-dd")),
          )}
        />
      </div>
    </div>
  );
}
