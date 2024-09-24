import { NextResponse, NextRequest } from "next/server";
import { db } from '@/utils/db';
import { blogTools, userFavorites } from '@/utils/schema';
import { eq } from 'drizzle-orm';


export const dynamic = 'force-dynamic';
export const revalidate = 0;



export const GET = async (req: NextRequest) => {
    // try {
    //     // Get the authenticated user's information
    //     const { userId } = getAuth(req);

    //     if (!userId) {
    //         return new NextResponse(JSON.stringify({ error: "User not authenticated" }), {
    //             status: 401,
    //             headers: { 'Content-Type': 'application/json' },
    //         });
    //     }

        // Fetch blog tools favorited by the user
        const userFavoritesList = await db
            .select({
                blogToolId: blogTools.id,
                name: blogTools.name,
                desc: blogTools.desc,
                category: blogTools.category,
                icon: blogTools.icon,
                aiPrompt: blogTools.aiPrompt,
                slug: blogTools.slug,
                form: blogTools.form,
                createdAt: blogTools.createdAt,
                createdBy: blogTools.createdBy,
                isPublic: blogTools.isPublic,
            })
            .from(userFavorites)
            .innerJoin(blogTools, eq(blogTools.id, userFavorites.blogToolId)) // Perform the join using a condition
            .where(eq(userFavorites.userId, 'vitaligreg1988@gmail.com')); // Filter by the current user's favorites

        // Return the blog tools that are favorited by the user
        return new NextResponse(JSON.stringify({ blogTools: userFavoritesList }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    // } catch (error) {
    //     console.error('Error fetching favorites:', error);
    //     return new NextResponse(JSON.stringify({ error: 'Failed to fetch blog tools' }), {
    //         status: 500,
    //         headers: { 'Content-Type': 'application/json' },
    //     });
    // }
};







// export const GET = async (req: NextRequest) => {
//     try {
//         const { searchParams } = new URL(req.url);
//         const id = searchParams.get("id");

//         let records;

//         if (id) {
//             records = await db.select().from(copiedBlogTools).where(eq(copiedBlogTools.createdBy, String(id)));
//         } 

//         // Set Cache-Control to prevent caching
//         return new NextResponse(JSON.stringify(records), {
//             status: 200,
//             headers: {
//                 'Cache-Control': 'no-store', // Disable caching
//             },
//         });
//     } catch (error) {
//         console.error("Error fetching records:", error);
//         return new NextResponse("Failed to fetch records", { status: 500 });
//     }
// };

