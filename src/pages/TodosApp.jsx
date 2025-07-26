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

export default function TodosApp() {
  const todos = useQuery(api.todos.readTodos);
  const createTodo = useMutation(api.todos.createTodo);
  const today = new Date();
  if (!todos) return <div>loading</div>;

  return (
    <div>
      <TodosList todos={todos} />
      <div className="fixed bottom-16 right-2">
        <Dialog>
          <form
            onSubmit={(e) => {
              alert(123);
              e.preventDefault();
              const form = e.currentTarget;
              console.log("triggered", form);

              createTodo({
                deadline: form.deadline.value,
                text: form.text.value,
              });
              console.log("done");
            }}
          >
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
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>
      </div>
    </div>
  );
}
