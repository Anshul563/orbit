"use server";

import { db } from "@/db";
import { communityMessage, communityMember } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, and, asc } from "drizzle-orm";
import Pusher from "pusher";

const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

export async function getCommunityMessages(communityId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  // Verify membership before showing messages
  const isMember = await db.query.communityMember.findFirst({
    where: and(
      eq(communityMember.communityId, communityId),
      eq(communityMember.userId, session.user.id)
    )
  });

  if (!isMember) throw new Error("You must join this community to view messages.");

  return await db.query.communityMessage.findMany({
    where: eq(communityMessage.communityId, communityId),
    orderBy: [asc(communityMessage.createdAt)],
    with: {
      sender: {
        columns: { id: true, name: true, image: true }
      }
    }
  });
}

// ... imports
// Update the function signature
export async function sendCommunityMessage(
  communityId: string, 
  content: string, 
  attachmentUrl?: string, 
  attachmentType?: string
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  // 1. Save to DB
  const [msg] = await db.insert(communityMessage).values({
    communityId,
    senderId: session.user.id,
    content: content || "", // Allow empty content if there is an attachment
    attachmentUrl,
    attachmentType
  }).returning();

  // 2. Trigger Pusher
  await pusherServer.trigger(`community-${communityId}`, "new-message", {
    id: msg.id,
    content: msg.content,
    attachmentUrl: msg.attachmentUrl,  // <--- Send to Pusher
    attachmentType: msg.attachmentType, // <--- Send to Pusher
    senderId: session.user.id,
    createdAt: msg.createdAt,
    sender: {
      name: session.user.name,
      image: session.user.image
    }
  });

  return { success: true };
}