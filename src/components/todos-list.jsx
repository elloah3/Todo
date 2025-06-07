import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function TodosList({ todos }) {
  const deleteTodo = useMutation(api.todos.deleteTodo);

  return (
    <div>
      {todos?.map((t) => (
        <div className="my-2" key={t._id}>
          {t.text}
          <button
            className="mx-2 px-2 rounded bg-red-500 text-white hover:bg-red-400 cursor-pointer"
            onClick={() => deleteTodo({ todoId: t._id })}
          >
            x
          </button>
        </div>
      ))}
    </div>
  );
}
