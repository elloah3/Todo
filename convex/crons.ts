import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.daily(
    "clear old completed todos",
    {
        hourUTC: 1,
        minuteUTC: 0
    },
    internal.todos.ClearHistory
);

export default crons;