import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  documents: defineTable({
    title: v.string(),
    description:v.string(),
    tokenIdentifier: v.string(),
    fileId: v.id("_storage"),
  }).index("by_tokenIdentifier", ["tokenIdentifier"]),
  notes: defineTable({
    text: v.string(),
    embedding: v.optional(v.array(v.float64())),
    tokenIdentifier: v.string(),
  })
  .index("by_tokenIdentifier", ["tokenIdentifier"])
  .vectorIndex("by_embedding", {
    vectorField: "embedding",
    dimensions: 1536,
    filterFields: ["tokenIdentifier"],
  }),

  chats: defineTable({
    documentId: v.id("documents"),
    tokenIdentifier: v.string(),
    isHuman:v.boolean(),
    text:v.string(),
  }).index("by_documentId_tokenIdentifier", ["documentId","tokenIdentifier"]),
});