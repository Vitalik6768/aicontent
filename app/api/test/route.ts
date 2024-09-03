import { NextResponse, NextRequest } from "next/server";
import { db } from '@/utils/db';
import { blogTools } from '@/utils/schema';


export const dynamic = 'force-dynamic';


export const GET = async () => {
    try {
      // Fetch all records from the blogTools table
      const records = await db.select().from(blogTools);
  
      // Return the records as JSON
      return NextResponse.json(records, { status: 200 });
    } catch (error) {
      console.error("Error fetching records:", error);
      return new NextResponse("Failed to fetch records", { status: 500 });
    }
  }

  export const POST = async (req: NextRequest) => {
    try {
        // Parse the JSON body from the request
        const data = await req.json();

        if(!data){
             return new NextResponse(JSON.stringify(500));
        }

        // Save in the database
        const result = await db.insert(blogTools).values({
            name: data.name,
            desc: data.desc,
            category: data.category,
            icon: data.icon,
            aiPrompt: data.aiPrompt,
            slug: data.slug,
            form: JSON.stringify(data.components), // Assuming form is an array or object
            createdAt: new Date(), // Automatically set the current date and time
            createdBy: data.createdBy,

        });

        return new NextResponse(JSON.stringify({ message: "Data received successfully", result }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error processing request:', error);
        return new NextResponse(JSON.stringify({ error: 'Failed to process request' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};