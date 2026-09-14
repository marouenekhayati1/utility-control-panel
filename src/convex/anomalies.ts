import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/** Count of open (non resolved) anomalies — used on the dashboard. */
export const openCount = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return 0;
    const ouvertes = await ctx.db
      .query("anomalies")
      .withIndex("by_status", (q) => q.eq("status", "ouverte"))
      .collect();
    const enCours = await ctx.db
      .query("anomalies")
      .withIndex("by_status", (q) => q.eq("status", "en cours"))
      .collect();
    return ouvertes.length + enCours.length;
  },
});

/** List anomalies, optionally filtered by status (most recent first). */
export const list = query({
  args: { status: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    if (args.status) {
      return await ctx.db
        .query("anomalies")
        .withIndex("by_status", (q) => q.eq("status", args.status as string))
        .order("desc")
        .take(200);
    }
    return await ctx.db
      .query("anomalies")
      .withIndex("by_createdAt")
      .order("desc")
      .take(200);
  },
});

/** Declare a new anomaly. */
export const declare = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    checklistId: v.optional(v.string()),
    priority: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    const declaredBy = user?.name ?? "Technicien";

    return await ctx.db.insert("anomalies", {
      title: args.title,
      description: args.description,
      checklistId: args.checklistId || undefined,
      priority: args.priority,
      status: "ouverte",
      declaredBy,
      createdAt: Date.now(),
    });
  },
});

/** Change the status of an anomaly (en cours / resolue). */
export const setStatus = mutation({
  args: { id: v.id("anomalies"), status: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    await ctx.db.patch(args.id, {
      status: args.status,
      ...(args.status === "resolue" ? { resolvedAt: Date.now() } : {}),
    });
  },
});
