import { NextResponse, NextRequest } from "next/server";
import { db } from '@/utils/db';
import { blogTools, userFav} from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { getAuth } from '@clerk/nextjs/server';


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
            records = await db.select().from(blogTools).where(eq(blogTools.isPublic, true));
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
        

        const { userId } = getAuth(req);


        // if(userId){
        //     console.log(userId)
        //     return new NextResponse(JSON.stringify({ error: "Invalid data" }), {
        //         status: 400,
        //         headers: { 'Content-Type': 'application/json' },
        //     });
        // }



        // Ensure data exists
        if (!data) {
            return new NextResponse(JSON.stringify({ error: "User not authenticated" }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Get the authenticated user's information
     

        // if (!userId) {
        //     return new NextResponse(JSON.stringify({ error: "User not authenticated" }), {
        //         status: 401,
        //         headers: { 'Content-Type': 'application/json' },
        //     });
        // }

        // Update components and add random name
        const updatedComponents = data.components.map((component: any) => ({
            ...component,
            name: generateRandomString()  // Add a random name to each component
        }));

        // Insert blog tool data into blogTools table
       
        const insertedBlogTool = await db.insert(blogTools).values({
            name: data.name,
            desc: data.desc,
            category: data.category,
            icon: data.icon,
            aiPrompt: data.aiPrompt,
            slug: data.slug,
            form: JSON.stringify(updatedComponents), // Assuming form is an array or object
            createdAt: new Date(), // Automatically set the current date and time
            createdBy: 'vitaligreg1988@gmail.com',
            isPublic:true,
            authorId:"userId"// Use the authenticated user's ID
        }).returning();
    

        // Get the blogToolId from the insertedBlogTool (ensure the insertion returns the id)
        const blogToolId = insertedBlogTool[0]?.id;

        if (!blogToolId) {
            return new NextResponse(JSON.stringify({ error: "Failed to insert blog tool" }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Insert into userFavorites table
        // const insertedFavorite = await db.insert(userFav).values({
        //     userId: 'vitalgreg1988@gmail.com', // Use the authenticated user's ID
        //     blogToolId: blogToolId, // Use the newly inserted blog tool's ID
        //     favoritedAt: new Date(), // Set current timestamp for when it was favorited
        // });

        // Return success response
        return new NextResponse(JSON.stringify({ message: "Data received successfully", blogToolId}), {
        // return new NextResponse(JSON.stringify({ message: "Data received successfully", blogToolId, insertedFavorite }), {
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