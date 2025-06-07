import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import Authform from "./components/auth-form";
import { useAuthActions } from "@convex-dev/auth/react";
import TodosForm from "./components/todos-form";
import TodosList from "./components/todos-list";
import { useState } from "react";
import Calender from "./components/calender";
import { api } from "../convex/_generated/api";
import { isSameDay } from "date-fns";

export default function App() {
  let { signOut } = useAuthActions();
  let [menu, setMenu] = useState("todos");
  const todos = useQuery(api.todos.readTodos);
  const [d, setD] = useState(new Date());

  if (!todos) return <div>loading</div>;

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <header className="bg-black text-white p-4 flex">
        <div className="mr-2">Logo</div>
        <button onClick={() => setMenu("todos")} className="mr-2">
          To-Do
        </button>
        <button onClick={() => setMenu("about us")} className="mr-2">
          About
        </button>
        <Authenticated>
          <button onClick={signOut} className="text-white bg-black rounded">
            {" "}
            Sign Out
          </button>
        </Authenticated>
      </header>
      <main className="p-4 flex-1 flex flex-col">
        <Authenticated>
          {menu === "todos" ? (
            <div>
              <Calender todos={todos} d={d} setD={setD} />
              <div className="bg-gray-300 rounded-2xl p-4">
                <TodosForm d={d} />
                <TodosList
                  todos={todos.filter((v) => isSameDay(v.deadline, d))}
                />
              </div>
            </div>
          ) : menu === "about us" ? (
            <div>about us</div>
          ) : (
            <div>404</div>
          )}
        </Authenticated>
        <Unauthenticated>
          <Authform />
        </Unauthenticated>
      </main>
      <footer className="bg-black text-white p-4">footer</footer>
    </div>
  );
}
