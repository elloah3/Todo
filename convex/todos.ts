import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const todos = await ctx.db
      .query("todos2")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    // Sort by important flag first (important items at top), then by deadline
    return todos.sort((a, b) => {
      if (a.important && !b.important) return -1;
      if (!a.important && b.important) return 1;
      return a.deadline.localeCompare(b.deadline);
    });
  },
});

export const create = mutation({
  args: {
    text: v.string(),
    deadline: v.string(),
    important: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    await ctx.db.insert("todos2", {
      text: args.text,
      completed: false,
      deadline: args.deadline,
      important: args.important,
      userId,
    });
  },
});

export const toggle = mutation({
  args: { id: v.id("todos2") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const todo = await ctx.db.get(args.id);
    if (!todo || todo.userId !== userId) {
      throw new Error("Todo not found");
    }

    await ctx.db.patch(args.id, {
      completed: !todo.completed,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("todos2") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const todo = await ctx.db.get(args.id);
    if (!todo || todo.userId !== userId) {
      throw new Error("Todo not found");
    }

    await ctx.db.delete(args.id);
  },
});

export const removeAllCompleted = mutation({
  args: { },
  handler: async (ctx, _args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const completedTodos = await ctx.db.query("todos2").filter(q => q.eq(q.field("completed"), true)).collect();
    for(const todo of completedTodos) {
      await ctx.db.delete(todo._id);
    }
    return;

  },
});

export const toggleImportant = mutation({
  args: { id: v.id("todos2") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const todo = await ctx.db.get(args.id);
    if (!todo || todo.userId !== userId) {
      throw new Error("Todo not found");
    }

    await ctx.db.patch(args.id, {
      important: !todo.important,
    });
  },
});

export const getDeadlineDates = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const todos = await ctx.db
      .query("todos2")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("completed"), false))
      .collect();

    // Get unique deadline dates
    const deadlineDates = [...new Set(todos.map((todo) => todo.deadline))];
    return deadlineDates;
  },
});

export const getTodosByDate = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const todos = await ctx.db
      .query("todos2")
      .withIndex("by_user_and_deadline", (q) =>
        q.eq("userId", userId).eq("deadline", args.date),
      )
      .collect();

    return todos;
  },
});
