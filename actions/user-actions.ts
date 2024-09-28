import { db } from "@/utils/db";
import { eq } from "drizzle-orm";
import { UserTable } from "@/utils/schema";
import bcryptjs from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function getUserFromDb(email: string, password: string) {
  try {
    const existedUser = await db.query.UserTable.findFirst({
      where: eq(UserTable.email, email),
    });

    if (!existedUser) {
      return {
        success: false,
        message: "User not found.",
      };
    }

    if (!existedUser.password) {
      return {
        success: false,
        message: "Password is required.",
      };
    }

    const isPasswordMatches = await bcryptjs.compare(
      password,
      existedUser.password
    );

    if (!isPasswordMatches) {
      return {
        success: false,
        message: "Password is incorrect.",
      };
    }

    // Optional: If you want to revalidate the cache for a specific path
    revalidatePath("/your-path-here");

    return {
      success: true,
      data: existedUser,
    };
  } catch (error: any) {
    console.error("Error fetching user from database:", error); // Logging for debugging
    return {
      success: false,
      message: error.message || "An unexpected error occurred.",
    };
  }
}
