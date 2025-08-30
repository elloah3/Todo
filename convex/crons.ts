import { cronJobs } from "convex/server";
import { api } from "./_generated/api";

const crons = cronJobs();

crons.daily(
  "clear old completed todos",
  {
    hourUTC: 1,
    minuteUTC: 0,
  },
  api.todos.ClearHistory,
);

export default crons;
