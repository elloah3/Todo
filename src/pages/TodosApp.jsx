import { useMutation, useQuery } from "convex/react";

import { api } from "../../convex/_generated/api";
import TodosList from "../components/todos-list";
import { Button } from "../components/ui/button";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRef } from "react";
import CalendarBlock from "../components/calendar_block";

export default function TodosApp() {
  const todos = useQuery(api.todos.readTodos);
  const createTodo = useMutation(api.todos.createTodo);
  const today = new Date();
  const formRef = useRef(null);
  const closeRef = useRef(null);
  if (!todos) return <div>loading</div>;

  return (
    <div>
      <TodosList todos={todos} />
      <div className="fixed bottom-16 right-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Add</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>
            <form
              ref={formRef}
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;

                await createTodo({
                  deadline: form.deadline.value,
                  text: form.text.value,
                });

                // Close the dialog after successful submission
                if (closeRef.current) {
                  closeRef.current.click();
                }
              }}
            >
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="name-1">Name</Label>
                  <Input id="name-1" name="text" defaultValue="" />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="username-1">Deadline</Label>
                  <Input
                    id="username-1"
                    name="deadline"
                    defaultValue="2025-04-05"
                  />
                </div>
              </div>
            </form>
            <DialogFooter>
              <DialogClose asChild>
                <Button ref={closeRef} variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="button"
                onClick={() => {
                  if (formRef.current) {
                    formRef.current.requestSubmit();
                  }
                }}
              >
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <CalendarBlock />
    </div>
  );
}
