"use server";

import { db } from "@/db";
import { post, swap, notification } from "@/db/schema"; // Added 'notification'
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { desc, eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Pusher from "pusher"; // Import Pusher

// Initialize Pusher Server-Side
const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

export async function createPost(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const budget = parseInt(formData.get("budget") as string) || 0;
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

  // 1. Fetch the Post to get Budget AND Title (for notification)
  const targetPost = await db.query.post.findFirst({
    where: eq(post.id, postId),
    columns: { 
        budget: true,
        title: true // Added title
    }
  });

  const startingPrice = targetPost?.budget || 0;
  const postTitle = targetPost?.title || "your post";

  // 2. Check if swap already exists
  const existingSwap = await db.query.swap.findFirst({
    where: and(
      eq(swap.postId, postId),
      eq(swap.providerId, session.user.id)
    )
  });

  if (existingSwap) {
    redirect("/dashboard/messages");
  }

  // 3. Create new Swap
  await db.insert(swap).values({
    postId,
    requesterId: authorId,
    providerId: session.user.id,
    status: "pending",
    price: startingPrice,
  });

  // --- NOTIFICATION LOGIC START ---
  
  // A. Create Database Record
  const [notif] = await db.insert(notification).values({
    userId: authorId, // Notify the post author
    title: "New Swap Request 🚀",
    message: `${session.user.name} applied to "${postTitle}"`,
    type: "credit", // or 'info'
    link: `/dashboard/messages`, // Redirect them to chat to accept/discuss
  }).returning();

  // B. Trigger Real-time Event
  await pusherServer.trigger(`user-${authorId}`, "notification", {
    ...notif,
    createdAt: notif.createdAt?.toISOString(),
  });

  // --- NOTIFICATION LOGIC END ---

  redirect("/dashboard/messages");
}