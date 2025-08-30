import { useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../convex/_generated/api";
import { AddTodoForm } from "./AddTodoForm";
import ArchiveView from "./ArchiveView";
import { CalendarView } from "./CalendarView";
import { TodoList } from "./TodoList";

export function TodoApp() {
  const [activeView, setActiveView] = useState<"list" | "calendar" | "archive">(
    "list",
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const todos = useQuery(api.todos.list) || [];
  const deadlineDates = useQuery(api.todos.getDeadlineDates) || [];

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="flex justify-center">
        <div className="bg-white rounded-full p-1 shadow-lg border border-purple-100 flex justify-center">
          <button
            onClick={() => setActiveView("list")}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              activeView === "list"
                ? "bg-purple-500 text-white shadow-md"
                : "text-purple-600 hover:bg-purple-50"
            }`}
          >
            📋 Todo List
          </button>
          <button
            onClick={() => setActiveView("calendar")}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              activeView === "calendar"
                ? "bg-purple-500 text-white shadow-md"
                : "text-purple-600 hover:bg-purple-50"
            }`}
          >
            📅 Calendar
          </button>
          <button
            onClick={() => setActiveView("archive")}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              activeView === "archive"
                ? "bg-purple-500 text-white shadow-md"
                : "text-purple-600 hover:bg-purple-50"
            }`}
          >
            📋 Archive
          </button>
        </div>
      </div>

      {/* Add Todo Form */}
      <div className="max-w-2xl mx-auto">
        <AddTodoForm />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {activeView === "list" ? (
          <>
            <div className="lg:col-span-2">
              <TodoList todos={todos} selectedDate={selectedDate} />
            </div>
            <div className="lg:col-span-1">
              <CalendarView
                deadlineDates={deadlineDates}
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
              />
            </div>
          </>
        ) : activeView === "calendar" ? (
          <>
            <div className="lg:col-span-2">
              <CalendarView
                deadlineDates={deadlineDates}
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                expanded={true}
              />
            </div>
          </>
        ) : (
          <div>
            <ArchiveView archivedTodos={todos.filter((t) => t.completed)} />
          </div>
        )}
      </div>
    </div>
  );
}
