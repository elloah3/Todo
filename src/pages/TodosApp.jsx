import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";

import { useState } from "react";
import { api } from "../../convex/_generated/api";
import { isSameDay } from "date-fns";
import Calender from "../components/calender";
import TodosList from "../components/todos-list";
import TodosForm from "../components/todos-form";

export default function TodosApp() {
  const todos = useQuery(api.todos.readTodos);
  const [d, setD] = useState(new Date());

  if (!todos) return <div>loading</div>;

  return (
    <div>
      <Calender todos={todos} d={d} setD={setD} />
      <div className="bg-gray-300 rounded-2xl p-4">
        <TodosForm d={d} />
        <TodosList todos={todos.filter((v) => isSameDay(v.deadline, d))} />
      </div>
    </div>
  );
}
