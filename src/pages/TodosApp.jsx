import { useMutation, useQuery } from "convex/react";

import { api } from "../../convex/_generated/api";
import TodosList from "../components/todos-list";
import { Button } from "../components/ui/button";

import CalendarBlock from "../components/calendar_block";
import PriorityTodos from "../components/priority";
import AddButton from "../components/addButton";
import { addDays, format, isWithinInterval } from "date-fns";
import { useState } from "react";

export default function TodosApp() {
  const todos = useQuery(api.todos.readTodos);
  const today = new Date();
  let [d, setDate] = useState(today);

  if (!todos) return <div>loading</div>;

  return (
    <div className="flex flex-row gap-3">
      <div className="h-auto">
        <PriorityTodos todos={todos.filter((v) => v.starred)} />
        <div className="my-2">
          <TodosList todos={todos} />
        </div>
      </div>
      <CalendarBlock d={d} setDate={setDate} todos={todos} />
      <AddButton d={d} />
    </div>
  );
}
