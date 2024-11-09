import { ConvexError, v } from "convex/values";
import { internalAction, internalMutation, mutation, query } from "./_generated/server";
import OpenAI from "openai";
import { internal } from "./_generated/api";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const getNotes = query({
  //   args: {
  //     orgId: v.optional(v.string()),
  //   },
  async handler(ctx) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!userId) {
      return null;
    }

    // if (args.orgId) {
    // const hasAccess = await hasOrgAccess(ctx, args.orgId);

    // if (!hasAccess) {
    //   return null;
    // }

    // const notes = await ctx.db
    //   .query("notes")
    //   .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
    //   .collect();

    // return notes;

    const notes = await ctx.db
      .query("notes")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", userId))
      .order("desc")
      .collect();

    return notes;
    //}
  },
});

export const getNote = query({
  args: {
    noteId: v.id("notes"),
  },
  async handler(ctx, args) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!userId) {
      return null;
    }
    const note = await ctx.db.get(args.noteId);

    if (note?.tokenIdentifier !== userId) {
      return null;
    }

    return note;
    //}
  },
});

export async function embed(text: string) {
  const embadding = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: text,
  });
  return embadding.data[0].embedding;
}


export const setNoteEmbadding = internalMutation({
    args: {
      noteId:v.id('notes'),
      embedding: v.array(v.number()),
    },
    async handler(ctx, args) {
  

      const note = await ctx.db.patch(args.noteId,{
        embedding:args.embedding
      })

    },
  });







export const createNoteEmbedding = internalAction({
    args: {
        noteId:v.id('notes'),
        text: v.string(),
    },
    async handler(ctx, args) {
  
      const embedding = await embed(args.text);
  
      await ctx.runMutation(internal.notes.setNoteEmbadding,{
        noteId:args.noteId,
        embedding
      })

  
 
    },
  });
  


export const createNote = mutation({
  args: {
    text: v.string(),
  },
  async handler(ctx, args) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!userId) {
      return null;
    }

    // const embedding = await embed(args.text);

    const noteId = await ctx.db.insert("notes", {
      text: args.text,
      tokenIdentifier: userId,
    //   embedding
    });

    await ctx.scheduler.runAfter(0, internal.notes.createNoteEmbedding, {
        noteId,
        text: args.text,
      });

    // return note;
  },
});




export const deleteNote = mutation({
  args: {
    noteId: v.id("notes"),
  },
  async handler(ctx, args) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!userId) {
      throw new ConvexError("You must be logged in to create a note");
    }

    const note = await ctx.db.get(args.noteId);

    if (!note) {
      throw new ConvexError("Note not found");
    }

    //   await assertAccessToNote(ctx, note);

    await ctx.db.delete(args.noteId);
  },
});
