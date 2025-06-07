import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { format } from "date-fns";

export default function TodosForm({ d }) {
  const createTodo = useMutation(api.todos.createTodo);
  const midnightDate = new Date(d + "T00:00:00");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        console.log(d);
        console.log(format(midnightDate, "yyyy-MM-ddT00:00:00"));
        const form = e.currentTarget;
        createTodo({
          text: form.text.value,
          deadline: format(midnightDate, "yyyy-MM-dd"),
        });
        form.reset();
      }}
    >
      <input type="text" name="text" placeholder="Add a todo..." />
      <button className="mx-2">Add Todo</button>
    </form>
  );
}
