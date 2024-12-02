import { ConvexError, v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";

export const get = query({
  args: {
    paginationOpts: paginationOptsValidator,
    search: v.optional(v.string()),
  },
  async handler(ctx, { paginationOpts, search }) {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new ConvexError("Unauthorized");
    }

    const organizationId = (user.organization_id ?? undefined) as
      | string
      | undefined;

    if (search && organizationId) {
      return await ctx.db
        .query("documents")
        .withSearchIndex("search_title", (q) =>
          q.search("title", search).eq("organizationId", organizationId),
        )
        .paginate(paginationOpts);
    }

    if (search) {
      return await ctx.db
        .query("documents")
        .withSearchIndex("search_title", (q) =>
          q.search("title", search).eq("ownerId", user.subject),
        )
        .paginate(paginationOpts);
    }

    if (organizationId) {
      return await ctx.db
        .query("documents")
        .withIndex("by_organization_id", (q) =>
          q.eq("organizationId", organizationId),
        )
        .paginate(paginationOpts);
    }

    return await ctx.db
      .query("documents")
      .withIndex("by_owner_id", (q) => q.eq("ownerId", user.subject))
      .paginate(paginationOpts);
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

    const organizationId = (user.organization_id ?? undefined) as
      | string
      | undefined;

    return await ctx.db.insert("documents", {
      title: args_0.title ?? "Untitled",
      ownerId: user.subject,
      organizationId,
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

    const organizationId = (user.organization_id ?? undefined) as
      | string
      | undefined;

    const isOwner = doc.ownerId === user.id;
    const isOrganizationMember = !!(
      doc.organizationId && doc.organizationId === organizationId
    );

    if (!isOwner && !isOrganizationMember) {
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

    const organizationId = (user.organization_id ?? undefined) as
      | string
      | undefined;

    const isOwner = doc.ownerId === user.id;
    const isOrganizationMember = !!(
      doc.organizationId && doc.organizationId === organizationId
    );

    if (!isOwner && !isOrganizationMember) {
      throw new ConvexError("Unauthorized");
    }

    return await ctx.db.patch(args_0.id, { title: args_0.title });
  },
});

export const getById = query({
  args: { id: v.id("documents") },
  async handler(ctx, { id }) {
    const doc = await ctx.db.get(id);

    if (!doc) {
      throw new Error("Document not found");
    }

    return doc;
  },
});

export const getByIds = query({
  args: { ids: v.array(v.id("documents")) },
  async handler(ctx, { ids }) {
    const docs = [];

    for (const id of ids) {
      const doc = await ctx.db.get(id);

      if (doc) {
        docs.push({ id: doc._id, name: doc.title });
      } else {
        docs.push({ id, name: "[Removed]" });
      }
    }

    return docs;
  },
});
