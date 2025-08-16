import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { toast } from "sonner";

export function AddTodoForm() {
  const [text, setText] = useState("");
  const [deadline, setDeadline] = useState("");
  const [important, setImportant] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const createTodo = useMutation(api.todos.create);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !deadline) return;

    try {
      await createTodo({
        text: text.trim(),
        deadline,
        important,
      });
      setText("");
      setDeadline("");
      setImportant(false);
      setIsOpen(false);
      toast.success("Todo added! ✨");
    } catch (error) {
      toast.error("Failed to add todo");
    }
  };

  if (!isOpen) {
    return (
      <div className="text-center">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center gap-2 mx-auto"
        >
          <span className="text-xl">✨</span>
          Add New Todo
          <span className="text-xl">✨</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-purple-800 flex items-center gap-2">
          <span className="text-xl">📝</span>
          Add New Todo
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-gray-600 text-xl"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What needs to be done? 🤔"
            className="w-full px-4 py-3 rounded-xl border border-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-2">
              📅 Deadline
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
              required
            />
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-3 cursor-pointer bg-purple-50 px-4 py-3 rounded-xl border border-purple-200 hover:bg-purple-100 transition-colors w-full">
              <input
                type="checkbox"
                checked={important}
                onChange={(e) => setImportant(e.target.checked)}
                className="w-5 h-5 text-purple-500 rounded focus:ring-purple-400"
              />
              <span className="text-purple-700 font-medium flex items-center gap-2">
                <span className="text-lg">⭐</span>
                Important
              </span>
            </label>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!text.trim() || !deadline}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            Add Todo ✨
          </button>
        </div>
      </form>
    </div>
  );
}
