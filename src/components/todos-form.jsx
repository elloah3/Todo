import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { format } from "date-fns";

export default function TodosForm({ d }) {
  const createTodo = useMutation(api.todos.createTodo);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        console.log(d);
        console.log(format(d, "yyyy-MM-dd"));
        const form = e.currentTarget;
        createTodo({
          text: form.text.value,
          deadline: format(d, "yyyy-MM-dd"),
        });
        form.reset();
      }}
    >
      <input type="text" name="text" placeholder="Add a todo..." />
      <button className="mx-2">Add Todo</button>
    </form>
  );
}
