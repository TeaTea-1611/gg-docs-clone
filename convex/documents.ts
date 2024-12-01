import { ConvexError, v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";

export const get = query({
  args: { paginationOpts: paginationOptsValidator },
  async handler(ctx, args_0) {
    return await ctx.db.query("documents").paginate(args_0.paginationOpts);
  },
});

export const create = mutation({
  args: {
    title: v.optional(v.string()),
    initialContent: v.optional(v.string()),
  },
  async handler(ctx, args_0) {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new ConvexError("Unauthorized");
    }

    return await ctx.db.insert("documents", {
      title: args_0.title ?? "Untitled",
      ownerId: user.subject,
      initialContent: args_0.initialContent,
    });
  },
});

export const removeById = mutation({
  args: {
    id: v.id("documents"),
  },
  async handler(ctx, args_0) {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new ConvexError("Unauthorized");
    }

    const doc = await ctx.db.get(args_0.id);

    if (!doc) {
      throw new ConvexError("Document not found");
    }

    if (doc.ownerId !== user.subject) {
      throw new ConvexError("Unauthorized");
    }

    return await ctx.db.delete(args_0.id);
  },
});

export const updateById = mutation({
  args: {
    id: v.id("documents"),
    title: v.string(),
  },
  async handler(ctx, args_0) {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new ConvexError("Unauthorized");
    }

    const doc = await ctx.db.get(args_0.id);

    if (!doc) {
      throw new ConvexError("Document not found");
    }

    if (doc.ownerId !== user.subject) {
      throw new ConvexError("Unauthorized");
    }

    return await ctx.db.patch(args_0.id, { title: args_0.title });
  },
});
