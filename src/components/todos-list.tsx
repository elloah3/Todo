import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";
import { Fragment } from "react/jsx-runtime";
import { differenceInDays } from "date-fns";
import { Button } from "./ui/button";

type TodoListParams = {
  todos: Doc<"todos">[];
};

export default function TodosList({ todos }: TodoListParams) {
  const deleteTodo = useMutation(api.todos.deleteTodo);

  return (
    <div
      className="inline-grid todo-list-grid"
      style={{
        gridTemplateColumns: "auto auto auto auto auto",
      }}
    >
      {todos?.map((t) => (
        <Fragment key={t._id}>
          <div className={getColor(t.deadline)}>{t.starred ? "⭐️" : ""}</div>
          <div className={getColor(t.deadline)}>{t.text}</div>
          <div className={getColor(t.deadline)}>{t.deadline}</div>
          <div className={getColor(t.deadline)}>
            <Button size={"sm"} variant={"destructive"} onClick={() => deleteTodo({ todoId: t._id })}>x</Button>
          </div>
          <div className={getColor(t.deadline)}>
            {isOverDue(t.deadline) && "overdue"}
          </div>
        </Fragment>
      ))}
    </div>
  );
}

function isOverDue(deadline: string): number {
  const d = new Date(deadline);
  const dateDiff = differenceInDays(new Date(), d);
  return dateDiff;
}

function getColor(deadline: string): string {
  if (isOverDue(deadline) > 1 ) return "bg-red-100";
  if (isOverDue(deadline) < 0 ) return "bg-green-50";
  return "bg-gray-50";
}
