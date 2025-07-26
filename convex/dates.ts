import { v } from "convex/values";
import { query } from "./_generated/server";
import { addDays, subDays, eachDayOfInterval, format } from "date-fns";
import { paginationOptsValidator } from "convex/server";


export const getFutureDates =   query({
   args: {
    startDate: v.string(),
    paginationOpts: paginationOptsValidator,
   },
   handler: async (ctx, { startDate, paginationOpts }) => {
    const start = new Date(startDate);
    const numItems = paginationOpts.numItems || 10;

    const dates = eachDayOfInterval({
        start: addDays(start, 1),
        end: addDays(start, numItems),
    });

    const isDone = dates.length < numItems;

    const result = {
        page: dates.map((d) => format(d, "yyyy-MM-dd")),
        continueCursor: paginationOpts.cursor,
        isDone: isDone,
    }
    console.log("startDate (future): ", start);
    console.log("numItems (future): ", numItems);
    console.log("getFutureDates returned:", result);
    return result;

   },
});

export const getPastDates = query({
    args: {
        endDate: v.string(),
        paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, {endDate, paginationOpts}) => {
        const end = new Date(endDate);
        const numItems = paginationOpts.numItems || 10;

        const dates = eachDayOfInterval({
            start: subDays(end, numItems),
            end: subDays(end, 1),
        }).reverse();

        const result ={
            page: dates.map((d) => format(d, "yyyy-MM-dd")),
            continueCursor: paginationOpts.cursor,
            isDone: dates.length < numItems,
        }
        console.log("endDate (past): ", end);
        console.log("numItems (past): ", numItems);
        console.log("getPastDates returned; ", result);
        return result;
    }, 
});