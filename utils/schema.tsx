import { pgTable, serial, text, varchar, json, timestamp, boolean } from "drizzle-orm/pg-core";

export const AIOutput = pgTable('aiOutput',{
    id:serial('id').primaryKey(),
    aiResponse:text('aiResponse'),
    templateSlug:varchar('templateSlug').notNull(),
    createdBy:varchar('createdBy'),
    createdAt:varchar('createdAt')


})

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
    createdBy: varchar('createdBy', { length: 255 }).notNull(), // Clerk's user ID for ownership
    isPublic: boolean('is_public').default(false).notNull(), // Visibility control
});


export const copiedBlogTools = pgTable('copied_blog_tools', {
    id: serial('id').primaryKey(),
    originalBlogToolId: serial('original_blog_tool_id').references(() => blogTools.id), // Reference to the original blog tool
    name: varchar('name', { length: 255 }).notNull(), // Copied name (user can edit later)
    desc: text('desc').notNull(), // Copied description (user can edit later)
    category: varchar('category', { length: 255 }).notNull(),
    icon: varchar('icon', { length: 255 }).default(''),
    aiPrompt: text('ai_prompt').notNull(),
    form: json('form').notNull(), // Form data
    copiedByUserId: varchar('copied_by_user_id', { length: 255 }).notNull(), // Clerk user ID who made the copy
    copiedAt: timestamp('copied_at').defaultNow(), // When the copy was made
    createdAt: timestamp('createdAt').defaultNow(), // When this new copy was created
    isPublic: boolean('is_public').default(false).notNull(), // Default private, user can later make it public
});

// export const blogTools = pgTable('blog_tools', {
//     id: serial('id').primaryKey(),
//     name: varchar('name', { length: 255 }).notNull(),
//     desc: text('desc').notNull(),
//     category: varchar('category', { length: 255 }).notNull(),
//     icon: varchar('icon', { length: 255 }).default(''),
//     aiPrompt: text('ai_prompt').notNull(),
//     slug: varchar('slug', { length: 255 }).notNull(),
//     form: json('form').notNull(), 
//     createdAt: timestamp('created_at').defaultNow(),
//     createdBy:varchar('createdBy')
// });
  