import { useMutation } from "convex/react";
import { format } from "date-fns";
import { api } from "../convex/_generated/api";
import { Doc, Id } from "../convex/_generated/dataModel";
import { toast } from "sonner";

interface TodoListProps {
  archivedTodos: Doc<"todos2">[];
}

export default function ArchiveView({ archivedTodos }: TodoListProps) {
  const removeCompleted = useMutation(api.todos.removeAllCompleted);
  const remove = useMutation(api.todos.remove);

  if (!archivedTodos) return <div>loading...</div>;
  const completeItems = archivedTodos.filter((v) => v.completed);

  const handleRemoveAll = async () => {
    await removeCompleted();
    return;
  };

  const handleRemove = async (id: Id<"todos2">) => {
    try {
      await remove({ id });
      toast.success("Todo removed! 🗑️");
    } catch (error) {
      toast.error("Failed to remove todo");
    }
  };

  const isOverdue = (deadline: string) => {
    const today = new Date().toISOString().split("T")[0];
    return deadline < today;
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
            onClick={() => handleRemoveAll()}
          >
            Clear All
          </button>
        </h2>
      </div>

      <div className="space-y-3">
        {completeItems.map((todo) => (
          <div
            key={todo._id}
            className={`group p-4 rounded-xl border transition-all border-purple-300 bg-purple-50 shadow-md`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`font-medium text-sm`}>{todo.text}</p>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
                    📅 {format(todo.deadline, "yyyy-MM-dd")}
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
