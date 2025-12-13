"use server";

import { db } from "@/db";
import { post, swap } from "@/db/schema"; // Removed 'user' if not used, kept essential
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { desc, eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPost(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const budget = parseInt(formData.get("budget") as string) || 0; // Handle NaN safety
  const type = formData.get("type") as "request" | "offer";

  await db.insert(post).values({
    authorId: session.user.id,
    title,
    description,
    budget,
    type,
    status: "open",
  });

  revalidatePath("/dashboard/market");
  return { success: true };
}

export async function getPosts() {
  const session = await auth.api.getSession({ headers: await headers() });
  
  const posts = await db.query.post.findMany({
    orderBy: [desc(post.createdAt)],
    where: eq(post.status, "open"),
    with: {
      author: {
        columns: { name: true, image: true, university: true }
      }
    }
  });

  return posts;
}

export async function initiateSwap(postId: string, authorId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  if (session.user.id === authorId) {
    return { error: "You cannot swap with yourself." };
  }

  // 1. Fetch the Post to get the Budget
  const targetPost = await db.query.post.findFirst({
    where: eq(post.id, postId),
    columns: { budget: true }
  });

  const startingPrice = targetPost?.budget || 0;

  // 2. Check if swap already exists
  const existingSwap = await db.query.swap.findFirst({
    where: and(
      eq(swap.postId, postId),
      eq(swap.providerId, session.user.id)
    )
  });

  if (existingSwap) {
    // If swap exists, just go to chat
    redirect("/dashboard/messages");
  }

  // 3. Create new Swap using the Post's budget
  await db.insert(swap).values({
    postId,
    requesterId: authorId, // The person who made the post
    providerId: session.user.id, // YOU (the one clicking "Apply")
    status: "pending",
    price: startingPrice, // <--- FIXED: Uses the actual budget now
  });

  redirect("/dashboard/messages");
}