import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";
import { internalMutation } from "./_generated/server";

const crons = cronJobs();

crons.daily(
  "clear old completed todos",
  {
    hourUTC: 1,
    minuteUTC: 0,
  },
  internal.crons.autoClear,
);

export default crons;

export const autoClear = internalMutation({
  args: {},
  handler: async (ctx) => {
    const cutOffTimestamp = Date.now() - 30 * 24 * 60 * 60 * 1000;

    const itemsToClear = await ctx.db
      .query("todos2")
      .filter((q) =>
        q.and(
          q.eq(q.field("completed"), true),
          q.lt(q.field("_creationTime"), cutOffTimestamp),
        ),
      )
      .collect();

    for (const items of itemsToClear) {
      await ctx.db.delete(items._id);
    }
  },
});
