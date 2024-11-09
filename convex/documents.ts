import { title } from "process";
import {
  MutationCtx,
  QueryCtx,
  action,
  internalAction,
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { useId } from "react";
import { Id } from "./_generated/dataModel";
import { api, internal } from "./_generated/api";
import OpenAI from "openai";


const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export async function hasAccessToDocument(
  ctx: MutationCtx | QueryCtx,
  documentId: Id<"documents">
) {
  const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

  if (!userId) {
    return null;
  }

  const document = await ctx.db.get(documentId);

  if (!document) {
    return null;
  }

  return { document, userId };
}

export const getDocuments = query({
  async handler(ctx) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!userId) {
      return [];
    }

    return await ctx.db
      .query("documents")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", userId))
      .collect();
  },
});

export const getDocument = query({
  args: {
    documentId: v.id("documents"),
  },
  async handler(ctx, args) {
    const accessObj = await hasAccessToDocument(ctx, args.documentId);

    if (!accessObj) {
      return null;
    }

    return {
      ...accessObj.document,
      documentUrl: await ctx.storage.getUrl(accessObj.document.fileId),
    };
  },
});

export const createDocument = mutation({
  args: {
    title: v.string(),
    fileId: v.id("_storage"),
  },
  async handler(ctx, args) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    console.log(userId);

    if (!userId) {
      throw new ConvexError("No OUTH");
    }

    const documentId = await ctx.db.insert("documents", {
      title: args.title,
      tokenIdentifier: userId,
      fileId: args.fileId,
      description:""
    });

    await ctx.scheduler.runAfter(
      0,
      internal.documents.generateDocumentDescription,
      {
        fileId:args.fileId,
        documentId,
      }
    );
  },
});


export const generateDocumentDescription  = internalAction({
  args: {
    fileId: v.id("_storage"),
    documentId: v.id("documents"),
  },
  async handler(ctx, args) {

    // const document = await ctx.runQuery
    const file = await ctx.storage.get(args.fileId);

    // Check if the file exists
    if (!file) {
      throw new ConvexError("File not found");
    }

    const text =  await file.text();

    // Further logic here (e.g., process the file, save the question, etc.)
    const chatCompletion:any = await client.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `here is the text file: ${text}`
        
        },
        {
          role: "user",
          content: `please generate 1 sentence description for this document`
        
        },
      ],
      model: "gpt-3.5-turbo",
    });

   
    const response = chatCompletion.choices[0].message.content ??
    "could not figure the discription"

    await ctx.runMutation(internal.documents.updateDocumentDescription,{

      documentId: args.documentId,
      description:response,
    })

    //return response;
  },
});




export const updateDocumentDescription = internalMutation({
  args: {
    documentId: v.id("documents"),
    description: v.string(),
    
  },
  async handler(ctx, args) {
    await ctx.db.patch(args.documentId, {
      description: args.description,
      
    });
  },
});











export const askQuestion = action({
  args: {
    question: v.string(),
    documentId: v.id("documents"),
  },
  async handler(ctx, args) {
    // Get the user's identity token
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    console.log(userId);

    // Check if the user is authenticated
    if (!userId) {
      throw new ConvexError("No AUTH");
    }

    // Query the document based on the provided documentId
    const document = await ctx.runQuery(api.documents.getDocument, {
      documentId: args.documentId,
    });

    // Check if the document was found
    if (!document) {
      throw new ConvexError("Document not found");
    }

    // Get the file associated with the document
    const file = await ctx.storage.get(document.fileId);

    // Check if the file exists
    if (!file) {
      throw new ConvexError("File not found");
    }

    const text =  await file.text();

    // Further logic here (e.g., process the file, save the question, etc.)
    const chatCompletion:any = await client.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `here is the text file: ${text}`
        
        },
        {
          role: "user",
          content: `please answer the question: ${args.question}`
        
        },
      ],
      model: "gpt-3.5-turbo",
    });

    await ctx.runMutation(internal.chats.createChatRecord,{

      documentId: args.documentId,
      text: args.question,
      isHuman: true,
      tokenIdentifier: userId,

    })

    const response = chatCompletion.choices[0].message.content;

    await ctx.runMutation(internal.chats.createChatRecord,{

      documentId: args.documentId,
      text: response,
      isHuman: false,
      tokenIdentifier: userId,

    })

    return response;
  },
});


export const deleteDocument = mutation({
  args: {
    documentId: v.id("documents"),
  },
  async handler(ctx, args) {
    const accessObj = await hasAccessToDocument(ctx, args.documentId);

    if (!accessObj) {
      throw new ConvexError("You do not have access to this document");
    }

    await ctx.storage.delete(accessObj.document.fileId);
    await ctx.db.delete(args.documentId);
  },
});


