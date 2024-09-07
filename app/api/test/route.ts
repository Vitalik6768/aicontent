import { NextResponse, NextRequest } from "next/server";
import { db } from '@/utils/db';
import { blogTools } from '@/utils/schema';
import { eq } from 'drizzle-orm';


export const dynamic = 'force-dynamic';


function generateRandomString(length = 8) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}



// export const GET = async () => {
//     try {
//       // Fetch all records from the blogTools table
//       const records = await db.select().from(blogTools);
  
//       // Return the records as JSON
//       return NextResponse.json(records, { status: 200 });
//     } catch (error) {
//       console.error("Error fetching records:", error);
//       return new NextResponse("Failed to fetch records", { status: 500 });
//     }
//   }


export const GET = async (req: NextRequest) => {
    try {
        // Extract the ID from the query parameters if provided
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        let records;

        if (id) {
            // If an id is provided, fetch the specific record based on the createdBy field
            records = await db.select().from(blogTools).where(eq(blogTools.createdBy, String(id)));
        } else {
            // Otherwise, fetch all records
            records = await db.select().from(blogTools);
        }

        // Return the records as JSON
        return NextResponse.json(records, { status: 200 });
    } catch (error) {
        console.error("Error fetching records:", error);
        return new NextResponse("Failed to fetch records", { status: 500 });
    }
};




  export const POST = async (req: NextRequest) => {

    try {
        // Parse the JSON body from the request
        const data = await req.json();

            const updatedComponents = data.components.map((component: any) => ({
        ...component, // Spread the existing fields
        name: generateRandomString()  // Add the new field "name" with value "test"
    }));

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
            form: JSON.stringify(updatedComponents), // Assuming form is an array or object
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


export const DELETE = async (req: NextRequest) => {
  try {
      // Extract the ID from the request URL
      const { searchParams } = new URL(req.url);
      const id = searchParams.get("id");

      if (!id) {
          return new NextResponse("ID is required", { status: 400 });
      }

      // Delete the record from the blogTools table using query conditions
      await db.delete(blogTools).where(eq(blogTools.id, Number(id)));

      // Return a success response
      return new NextResponse("Record deleted successfully", { status: 200 });
  } catch (error) {
      console.error("Error deleting record:", error);
      return new NextResponse("Failed to delete record", { status: 500 });
  }
}