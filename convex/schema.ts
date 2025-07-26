import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,
  
  numbers: defineTable({
    value: v.number(),
  }),

  todos: defineTable({
    text: v.string(),
    userId: v.id("users"),
    deadline: v.string(),
    starred: v.optional(v.boolean())
  }).index("by_userid", ['userId'])
});
