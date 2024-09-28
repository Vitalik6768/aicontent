import { table } from "console";
import { relations } from "drizzle-orm";
import { pgTable, primaryKey, serial, text, varchar, json, timestamp, boolean, integer, uuid, pgEnum, index, uniqueIndex, real } from "drizzle-orm/pg-core";
import { title } from "process";

export const AIOutput = pgTable('aiOutput', {
    id: serial('id').primaryKey(),
    aiResponse: text('aiResponse'),
    templateSlug: varchar('templateSlug').notNull(),
    createdBy: varchar('createdBy'),
    createdAt: varchar('createdAt')


})

export const UserTable = pgTable("user", {
    id: varchar("id", { length: 255 }).primaryKey(), // Ensure this is varchar to match Clerk's IDs
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),

});

// Define blogTools next
export const blogTools = pgTable('blog_tools', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    desc: text('desc').notNull(),
    category: varchar('category', { length: 255 }).notNull(),
    icon: varchar('icon', { length: 255 }).default(''),
    aiPrompt: text('ai_prompt').notNull(),
    slug: varchar('slug', { length: 255 }).notNull(),
    form: json('form').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    image:varchar('image').notNull(),
    createdBy: varchar('createdBy', { length: 255 }).notNull(), // Clerk's user ID for ownership
    isPublic: boolean('is_public').default(true).notNull(), // Visibility control
    authorId: varchar("authorId", { length: 255 }).references(() => UserTable.id).notNull() // Make sure this is varchar
});

// Define userFav last
export const userFav = pgTable('userFav', {
    id: serial('id').primaryKey(),
    templateId: integer("templateId").references(() => blogTools.id).notNull(), // Changed to integer to match blogTools.id type
    userId: varchar("userId", { length: 255 }).references(() => UserTable.id).notNull(), // Ensure this is varchar
    favoriteBy: varchar("favoriteBy").notNull()
});

// Defining relations

export const UserTemplateTableRelation = relations(UserTable, ({ many }) => {
    return {
        fav: many(userFav),
        templates: many(blogTools),
    };
});

export const UserFavRelations = relations(userFav, ({ one }) => {
    return {
        user: one(UserTable, {
            fields: [userFav.userId],
            references: [UserTable.id],
        }),
        template: one(blogTools, {
            fields: [userFav.templateId],
            references: [blogTools.id],
        }),
    };
});

export const BlogToolsRelations = relations(blogTools, ({ one, many }) => {
    return {
        // Relation to the user who created the blog tool (author)
        author: one(UserTable, {
            fields: [blogTools.authorId],
            references: [UserTable.id],
        }),
    };
});