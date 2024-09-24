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
    isPublic: boolean('is_public').default(true).notNull(), // Visibility control
    authorId:uuid("authorId").references(() => UserTable.id).notNull()
});



export const userFav = pgTable('userFav',{
    id:serial('id').primaryKey(),
    templateId:serial("templateId").references(() => blogTools.id).notNull(),
    userId:uuid("userId").references(() => UserTable.id).notNull()


})



export const userFavorites = pgTable('user_favorites', {
    id: serial('id').primaryKey(),
    userId: varchar('user_id', { length: 255 }).notNull(),  // Clerk's user ID
    blogToolId: integer('blog_tool_id').notNull(),  // Change this to match blogTools.id type (serial, i.e., integer)
    favoritedAt: timestamp('favorited_at').defaultNow(), // When the user favorited this blog tool
});




//Testing



export const UserRole = pgEnum("userRole", ["ADMIN", "BASIC"])

export const UserTable = pgTable("user", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    role: UserRole("UserRole").default("BASIC").notNull()
}, table => {
    return {
        emailImdex: uniqueIndex("emailIndex").on(table.email)
    }
})


export const UserPrefernces = pgTable("UserPrefernces", {
    id: uuid("id").primaryKey().defaultRandom(),
    emailUpdates:boolean("emailUpdates").notNull().default(false),
    userId: uuid("userId").references(() => UserTable.id).notNull()
})

export const PostTable = pgTable("post",{
    id:uuid("id").primaryKey().defaultRandom(),
    title:varchar("title",{length:255}).notNull(),
    averageRating:real("averageRating").notNull().default(0),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt').defaultNow().notNull(),
    authorId:uuid("authorId").references(() => UserTable.id).notNull()

})

export const PostCategoryTable = pgTable("PostCategory",{
    postId:uuid("postId").references(() => PostTable.id).notNull(),
    categoryId:uuid("categoryId").references(() => CategoryTable.id).notNull()
}, table => {
    return {
        pk: primaryKey({columns:[table.postId, table.categoryId]})
    }
})

export const CategoryTable = pgTable("category",{
    id:uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
}) 

//Testing--<


//Relation

export const UserTemplateTableRelation = relations(UserTable, ({ many}) =>{
    return{
        fav:many(userFavorites),
        templates:many(blogTools)
    }
})





export const UserTableRelation = relations(UserTable, ({ one, many}) =>{
    return{
        prefernces:one(UserPrefernces),
        posts:many(PostTable)
    }
})

export const UserPreferncesTableRelations = relations(UserPrefernces,({ one})=>{
    return{
        user:one(UserTable,{
            fields:[UserPrefernces.userId],
            references:[UserTable.id]
        })
    }
})

export const PostTableRelation = relations(PostTable, ({ one, many}) =>{
    return{
        auththor:one(UserTable,{
            fields:[PostTable.authorId],
            references:[UserTable.id]
        }),
        postCategories:many(PostCategoryTable)
        // prefernces:one(UserPrefernces),
        // posts:many(PostTable)
    }
})

export const CategoryTableRelation = relations(CategoryTable, ({ many}) =>{
    return{
        postsCategories:many(PostCategoryTable)
    }
})


export const PostCategoryTableRelation = relations(PostCategoryTable, ({ one}) =>{
    return{
        post:one(PostTable,{
            fields:[PostCategoryTable.postId],
            references:[PostTable.id]
        }),
        category:one(CategoryTable,{
            fields:[PostCategoryTable.categoryId],
            references:[CategoryTable.id]
        })
    }
})








//old

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
