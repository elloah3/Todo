import { useMutation, useQuery } from "convex/react";
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

export default function ArchiveView({
  todos,
  selectedDate,
  compact = false,
}: TodoListProps) {
  const allItems = useQuery(api.todos.list); // null -> []
  const removeTodos = useMutation(api.todos.remove);
  const removeCompleted = useMutation(api.todos.removeAllCompleted);

  if (!allItems) return <div>loading...</div>;
  const completeItems = allItems.filter((v) => v.completed);

  const handleRemoveAll = async () => {
    await removeCompleted();
  };

  const handleRemove = async (id: Id<"todos2">) => {
    try {
      await removeTodos({ id: id });
      toast.success("Todo removed! 🗑️");
    } catch (error) {
      toast.error("Failed to remove todo");
    }
  };

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-purple-800 flex items-center gap-2">
          Archive
          <button
            className="text-sm text-purple-800 hover:text-purple-400"
            onClick={() => handleRemoveAll}
          >
            Clear All
          </button>
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
        {completeItems.map((todo) => (
          <div
            key={todo._id}
            className={`group p-4 rounded-xl border transition-all ${
              selectedDate === todo.deadline
                ? "border-purple-300 bg-purple-50 shadow-md"
                : "border-purple-100 hover:border-purple-200 hover:shadow-md"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`font-medium  ${compact ? "text-sm" : ""}`}>
                    {todo.text}
                  </p>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  {todo.important && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                      ⭐ Important
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
