import { NextResponse, NextRequest } from "next/server";
import { db } from '@/utils/db';
import { blogTools } from '@/utils/schema';
import { eq } from "drizzle-orm";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const GET = async (req: NextRequest) => {
  try {
    // Extract search parameters
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    // Validate slug
    if (!slug) {
      return new NextResponse("Missing slug parameter", { status: 400 });
    }

    // Fetch records from the database
    const records = await db
      .select()
      .from(blogTools)
      .where(eq(blogTools.slug, slug))
      .limit(1);

    // Check if records were found
    if (records.length === 0) {
      return new NextResponse("Record not found", { status: 404 });
    }

    // Return the records as JSON
    return NextResponse.json(records[0], { status: 200 });
  } catch (error) {
    console.error("Error fetching records:", error);
    return new NextResponse("Failed to fetch records", { status: 500 });
  }
};