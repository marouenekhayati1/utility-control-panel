import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/** Save a completed check-list relevé. */
export const saveEntry = mutation({
  args: {
    checklistId: v.string(),
    values: v.any(),
    anomaliesCount: v.number(),
    totalFields: v.number(),
    technicien: v.string(),
    poste: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("checklistEntries", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

/** List recent entries, optionally filtered by check-list id (most recent first). */
export const listEntries = query({
  args: { checklistId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    if (args.checklistId) {
      return await ctx.db
        .query("checklistEntries")
        .withIndex("by_checklistId", (q) => q.eq("checklistId", args.checklistId as string))
        .order("desc")
        .take(500);
    }
    return await ctx.db
      .query("checklistEntries")
      .withIndex("by_createdAt")
      .order("desc")
      .take(500);
  },
});
