import { NextResponse, NextRequest } from "next/server";
import { db } from '@/utils/db';
import { blogTools, userFav } from '@/utils/schema';
import { eq, and } from 'drizzle-orm';
import { getAuth } from '@clerk/nextjs/server';

// Add To favorite
export const GET = async (req: NextRequest) => {
    const { userId } = await getAuth(req);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!userId || !id) {
        return new NextResponse(JSON.stringify({ error: "Invalid data" }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        // Check if the record already exists
        const existingFavorite = await db
            .select()
            .from(userFav)
            .where(and(eq(userFav.userId, userId), eq(userFav.templateId, Number(id))))
            .limit(1);

        if (existingFavorite.length > 0) {
            return new NextResponse(JSON.stringify({ message: "Already added to favorites" }), {
                status: 409, // Conflict status code
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Insert the new favorite if it doesn't already exist
        const insertedFavorite = await db.insert(userFav).values({
            userId: userId, 
            templateId: Number(id),
            favoriteBy: userId, 
            
        }) 

        return new NextResponse(JSON.stringify({ message: "Added to favorites", data: insertedFavorite }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error inserting favorite:', error);
        return new NextResponse(JSON.stringify({ error: "Failed to add to favorites" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};