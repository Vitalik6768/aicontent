import { pgTable, serial, text, varchar, json, timestamp } from "drizzle-orm/pg-core";

export const AIOutput = pgTable('aiOutput',{
    id:serial('id').primaryKey(),
    formData:varchar('formData').notNull(),
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
    createdBy:varchar('createdBy')
});
  