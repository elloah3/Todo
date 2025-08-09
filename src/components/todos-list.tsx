/* eslint-disable @typescript-eslint/no-misused-promises */
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";
import { Fragment } from "react/jsx-runtime";
import { differenceInDays } from "date-fns";
import { Button } from "./ui/button";
import { StarIcon } from "lucide-react";

type TodoListParams = {
  todos: Doc<"todos">[];
};

export default function TodosList({ todos }: TodoListParams) {
  const deleteTodo = useMutation(api.todos.deleteTodo);
  const toggleStar = useMutation(api.todos.toggleStar);

  function handleDelete(todo : Doc<"todos">) {
    deleteTodo({todoId: todo._id}).catch(()=>{});
  }

  const handleToggle = async (todo: Doc<"todos">) =>{
    await toggleStar({
      todoId: todo._id, newValue: !todo.starred
    })
  }


  return (
    <div
      className="inline-grid todo-list-grid"
      style={{
        gridTemplateColumns: "auto auto auto auto auto",
      }}
    >
      {todos?.map((t) => (
        <Fragment key={t._id}>
          <div className="cursor-pointer"><button className={getColor(t.deadline)} onClick={() => handleToggle(t)}><StarIcon fill={t.starred ? "yellow" : ""} /></button></div>
          
          <div className={getColor(t.deadline)}>{t.text}</div>
          <div className={getColor(t.deadline)}>{t.deadline}</div>
          <div className={getColor(t.deadline)}>
            <Button size={"sm"} variant={"destructive"} onClick={() => handleDelete(t)}>x</Button>
          </div>
          <div className={getColor(t.deadline)}>
            {isOverDue(t.deadline) > 1? "overdue":""}
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
  return "bg-green-50";
}
