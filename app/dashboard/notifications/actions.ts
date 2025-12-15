"use server";

import { db } from "@/db";
import { notification } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, desc, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getNotifications() {
  // Await headers() for Next.js 15 compatibility
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return [];

  return await db.query.notification.findMany({
    where: eq(notification.userId, session.user.id),
    orderBy: [desc(notification.createdAt)],
    limit: 20,
  });
}

export async function markAsRead(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return;

  await db
    .update(notification)
    .set({ read: true })
    .where(
      and(
        eq(notification.id, id),
        eq(notification.userId, session.user.id) // Security: Ensure user owns notif
      )
    );

  // Use "layout" to ensure the Header (where the bell is) updates on all pages
  revalidatePath("/", "layout");
}

export async function markAllRead() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return;

  await db
    .update(notification)
    .set({ read: true })
    .where(
      and(
        eq(notification.userId, session.user.id),
        eq(notification.read, false) // Optimization: Only update pending notifications
      )
    );

  revalidatePath("/", "layout");
}