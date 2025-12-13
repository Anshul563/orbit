"use server";

import { db } from "@/db";
import { transaction, user } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, desc, or } from "drizzle-orm";

export async function getWalletData() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  // 1. Get Current Balance
  const currentUser = await db.query.user.findFirst({
    where: eq(user.id, session.user.id),
    columns: { credits: true }
  });

  // 2. Get Transaction History (Sent OR Received)
  const history = await db.query.transaction.findMany({
    where: or(
      eq(transaction.senderId, session.user.id),
      eq(transaction.receiverId, session.user.id)
    ),
    orderBy: [desc(transaction.createdAt)],
    with: {
      sender: { columns: { name: true, image: true } },
      receiver: { columns: { name: true, image: true } }
    }
  });

  return {
    balance: currentUser?.credits || 0,
    transactions: history
  };
}