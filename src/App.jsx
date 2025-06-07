import { useAuthActions } from "@convex-dev/auth/react";
import { Authenticated, Unauthenticated } from "convex/react";
import Authform from "./components/auth-form";
import TodosApp from "./pages/TodosApp";

export default function App() {
  let { signOut } = useAuthActions();

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <header className="bg-black text-white p-4 flex">
        <div className="mr-2">Logo</div>

        <Authenticated>
          <button onClick={signOut} className="text-white bg-black rounded">
            Sign Out
          </button>
        </Authenticated>
      </header>
      <main className="p-4 flex-1 flex flex-col">
        <Authenticated>
          <TodosApp />
        </Authenticated>
        <Unauthenticated>
          <Authform />
        </Unauthenticated>
      </main>
      <footer className="bg-black text-white p-4">footer</footer>
    </div>
  );
}
