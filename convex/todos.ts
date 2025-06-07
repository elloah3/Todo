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
    async handler(ctx){
      const userId = await getAuthUserId(ctx);
      if (!userId) return new Error("Unauthenticated");
      return await ctx.db.query("todos").withIndex("by_userid", q => q.eq("userId", userId)).collect();
    },
  });

  export const deleteTodo = mutation({
    args: { todoId: v.id("todos")},
    async handler(ctx, args) {
        await ctx.db.delete(args.todoId);
    }
  });


