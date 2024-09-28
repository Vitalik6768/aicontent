import { NextResponse, NextRequest } from "next/server";
import { db } from '@/utils/db';
import { UserTable } from '@/utils/schema';

export const POST = async (req: NextRequest) => {
    try {
        // Parse the incoming JSON body
        const eventData = await req.json();

        // Extract the relevant data from the received object
        const userData = eventData.data;
        const email = userData.email_addresses?.[0]?.email_address; // Extract the first email if available

        // Ensure necessary fields are present
        if (!userData.id || !userData.first_name || !email) {
            return new NextResponse(JSON.stringify({
                message: "Required user data is missing",
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Insert the new user into your database
        const insertedUser = await db.insert(UserTable).values({
            id: userData.id, // User's ID from Clerk
            name: `${userData.first_name} ${userData.last_name}`, // Combine first and last name
            email: email // User's primary email address
        }).returning();

        // Return a success response with inserted data
        return new NextResponse(JSON.stringify({
            message: "User data inserted successfully",
            data: insertedUser
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error("Error inserting user:", error);
        return new NextResponse(JSON.stringify({
            message: "Error inserting user data",
          
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}