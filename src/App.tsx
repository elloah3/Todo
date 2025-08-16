import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { TodoApp } from "./TodoApp";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm h-16 flex justify-between items-center border-b border-purple-100 shadow-sm px-4">
        <h2 className="text-xl font-semibold text-purple-700 flex items-center gap-2">
          <span className="text-2xl">📝</span>
          Todo Magic
        </h2>
        <Authenticated>
          <SignOutButton />
        </Authenticated>
      </header>
      <main className="flex-1 p-4">
        <Content />
      </main>
      <Toaster />
    </div>
  );
}

function Content() {
  const loggedInUser = useQuery(api.auth.loggedInUser);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Authenticated>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-800 mb-2 flex items-center justify-center gap-3">
            <span className="text-5xl">✨</span>
            Welcome back, {loggedInUser?.email?.split('@')[0] ?? "friend"}!
            <span className="text-5xl">✨</span>
          </h1>
          <p className="text-purple-600">Let's make today productive and magical!</p>
        </div>
        <TodoApp />
      </Authenticated>
      
      <Unauthenticated>
        <div className="flex flex-col items-center justify-center min-h-[500px] gap-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-purple-800 mb-4 flex items-center justify-center gap-3">
              <span className="text-6xl">🌟</span>
              Todo Magic
              <span className="text-6xl">🌟</span>
            </h1>
            <p className="text-xl text-purple-600 mb-8">
              Organize your tasks with deadlines and priorities
            </p>
          </div>
          <div className="w-full max-w-md">
            <SignInForm />
          </div>
        </div>
      </Unauthenticated>
    </div>
  );
}
