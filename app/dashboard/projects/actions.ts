"use server";

import { db } from "@/db";
import { swap, user, transaction } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, or, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getProjects() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return [];

  const mySwaps = await db.query.swap.findMany({
    where: or(
      eq(swap.requesterId, session.user.id),
      eq(swap.providerId, session.user.id)
    ),
    // Use createdAt for sorting (safest option)
    orderBy: [desc(swap.startedAt)], 
    with: {
      post: true,
      requester: true,
      provider: true,
    }
  });

  return mySwaps;
}

export async function completeProject(swapId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  // 1. Fetch the swap details
  const currentSwap = await db.query.swap.findFirst({
    where: eq(swap.id, swapId),
  });

  if (!currentSwap || currentSwap.status === "completed") {
    return { error: "Swap not found or already completed." };
  }

  // Security: Only the Requester (Employer) can mark complete
  if (currentSwap.requesterId !== session.user.id) {
    return { error: "Only the project owner can mark this as complete." };
  }

  const amount = currentSwap.price || 0;

  // 2. Balance Check (Prevent negative balance)
  const requesterCredits = await getUserCredits(currentSwap.requesterId);
  if (requesterCredits < amount) {
    return { error: "You do not have enough credits to complete this payment." };
  }

  // 3. Transaction Logic
  try {
    // A. Deduct from Requester
    await db.update(user)
      .set({ 
        credits: requesterCredits - amount,
        updatedAt: new Date()
      })
      .where(eq(user.id, currentSwap.requesterId));

    // B. Add to Provider
    await db.update(user)
      .set({ 
        credits: (await getUserCredits(currentSwap.providerId)) + amount,
        updatedAt: new Date()
      })
      .where(eq(user.id, currentSwap.providerId));

    // C. Record Transaction
    await db.insert(transaction).values({
      senderId: currentSwap.requesterId,
      receiverId: currentSwap.providerId,
      amount: amount,
      type: "payment", // Ensure this matches your Enum in schema.ts
      referenceId: swapId,
    });

    // D. Update Swap Status
    await db.update(swap)
      .set({ status: "completed" })
      .where(eq(swap.id, swapId));

    revalidatePath("/dashboard/projects");
    revalidatePath("/dashboard"); // Updates the navbar credit count
    return { success: true };

  } catch (error) {
    console.error("Transaction failed:", error);
    return { error: "Transaction failed. Please contact support." };
  }
}

// Helper to get fresh credits
async function getUserCredits(userId: string) {
  const u = await db.query.user.findFirst({ 
    where: eq(user.id, userId),
    columns: { credits: true } 
  });
  return u?.credits || 0;
}