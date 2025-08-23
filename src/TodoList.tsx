import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { toast } from "sonner";

interface Todo {
  _id: Id<"todos2">;
  text: string;
  completed: boolean;
  deadline: string;
  important: boolean;
  userId: Id<"users">;
}

interface TodoListProps {
  todos: Todo[];
  selectedDate: string | null;
  compact?: boolean;
}

export function TodoList({
  todos,
  selectedDate,
  compact = false,
}: TodoListProps) {
  const toggleTodo = useMutation(api.todos.toggle);
  const removeTodo = useMutation(api.todos.remove);
  const toggleImportant = useMutation(api.todos.toggleImportant);

  const handleToggle = async (id: Id<"todos2">) => {
    try {
      await toggleTodo({ id });
    } catch (error) {
      toast.error("Failed to update todo");
    }
  };

  const handleRemove = async (id: Id<"todos2">) => {
    try {
      await removeTodo({ id });
      toast.success("Todo removed! 🗑️");
    } catch (error) {
      toast.error("Failed to remove todo");
    }
  };

  const handleToggleImportant = async (id: Id<"todos2">) => {
    try {
      await toggleImportant({ id });
    } catch (error) {
      toast.error("Failed to update importance");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (dateString === today.toISOString().split("T")[0]) {
      return "Today";
    } else if (dateString === tomorrow.toISOString().split("T")[0]) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year:
          date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  const isOverdue = (deadline: string) => {
    const today = new Date().toISOString().split("T")[0];
    return deadline < today;
  };

  const filteredTodos = selectedDate
    ? todos.filter((todo) => todo.deadline === selectedDate)
    : todos;

  if (filteredTodos.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-8 text-center">
        <div className="text-6xl mb-4">🌸</div>
        <h3 className="text-lg font-medium text-purple-800 mb-2">
          {selectedDate ? "No todos for this date" : "No todos yet"}
        </h3>
        <p className="text-purple-600">
          {selectedDate
            ? "This day is free!"
            : "Add your first todo to get started!"}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6 w-1/2">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-purple-800 flex items-center gap-2">
          <span className="text-2xl">📋</span>
          {selectedDate
            ? `Todos for ${formatDate(selectedDate)}`
            : "Your Todos"}
        </h2>
        {selectedDate && (
          <button
            onClick={() => window.location.reload()}
            className="text-purple-600 hover:text-purple-800 text-sm font-medium"
          >
            Show All
          </button>
        )}
      </div>

      <div className="space-y-3">
        {filteredTodos.map((todo) => (
          <div
            key={todo._id}
            className={`group p-4 rounded-xl border transition-all ${
              selectedDate === todo.deadline
                ? "border-purple-300 bg-purple-50 shadow-md"
                : "border-purple-100 hover:border-purple-200 hover:shadow-md"
            } ${todo.completed ? "opacity-60" : ""}`}
          >
            <div className="flex items-start gap-3">
              <button
                onClick={() => handleToggle(todo._id)}
                className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  todo.completed
                    ? "bg-green-500 border-green-500 text-white"
                    : "border-purple-300 hover:border-purple-500"
                }`}
              >
                {todo.completed && <span className="text-xs">✓</span>}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p
                    className={`font-medium ${
                      todo.completed
                        ? "line-through text-gray-500"
                        : "text-gray-800"
                    } ${compact ? "text-sm" : ""}`}
                  >
                    {todo.text}
                  </p>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleToggleImportant(todo._id)}
                      className={`text-lg transition-all ${
                        todo.important
                          ? "text-yellow-500 hover:text-yellow-600"
                          : "text-gray-300 hover:text-yellow-400"
                      }`}
                      title={
                        todo.important
                          ? "Remove from important"
                          : "Mark as important"
                      }
                    >
                      ⭐
                    </button>
                    <button
                      onClick={() => handleRemove(todo._id)}
                      className="text-red-400 hover:text-red-600 transition-colors text-lg"
                      title="Delete todo"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  {todo.important && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                      ⭐ Important
                    </span>
                  )}
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                      isOverdue(todo.deadline) && !todo.completed
                        ? "bg-red-100 text-red-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    📅 {formatDate(todo.deadline)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
