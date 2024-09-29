import { NextResponse, NextRequest } from "next/server";
import { db } from '@/utils/db';
import { blogTools, userFav } from '@/utils/schema';
import { getAuth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const GET = async (req: NextRequest) => {
    try {
        // Get the authenticated user's information
        const { userId } = getAuth(req);

        if (!userId) {
            return new NextResponse(JSON.stringify({ error: "User not authenticated" }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Fetch the user's favorite templates
        const result = await db.query.userFav.findMany({
            where: (favTable, funcs) => funcs.eq(favTable.favoriteBy, userId), 
            with: {
                template: true, // Fetch the related template (blogTools) data
            }
        });

        // Check if any results were found
        if (!result.length) {
            return new NextResponse(JSON.stringify({ message: "No favorite templates found" }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Extract only the template data
        const templates = result.map(item => item.template);

        return new NextResponse(JSON.stringify({ templates }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error("Error fetching user's favorite templates:", error);
        return new NextResponse(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};



