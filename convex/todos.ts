import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";

export const createTodo = mutation({
  args: { text: v.string(), deadline: v.string() },
  async handler(ctx, args) {
    const userId = await getAuthUserId(ctx);
    if (!userId) return new Error("Unauthenticated");

    await ctx.db.insert("todos", {
      text: args.text,
      deadline: args.deadline,
      userId,
    });
  },
});

export const readTodos = query({
  args: {},
  async handler(ctx) {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthenticated");
    let data = await ctx.db
      .query("todos")
      .withIndex("by_userid", (q) => q.eq("userId", userId))
      .collect();
    data = data.sort((a, b) => (a.deadline < b.deadline ? -1 : 1));
    return data;
  },
});

export const deleteTodo = mutation({
  args: { todoId: v.id("todos") },
  async handler(ctx, args) {
    return await ctx.db.delete(args.todoId);
  },
});


export const toggleStar = mutation({
  args: {todoId: v.id("todos"), newValue: v.boolean(),},
  handler: async (ctx, {todoId, newValue}) => {
    await ctx.db.patch(todoId, {starred: newValue});
  },
})

