"use server";

import { db } from "@/db";
import { swipe, match, user, notification } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, and, ne, notInArray, sql } from "drizzle-orm";
import Pusher from "pusher"; 

const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

// 1. Get Potential Matches (Users I haven't swiped on yet)
export async function getMatchQueue() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return [];

  // Get IDs of people I already swiped on
  const swipedList = await db.select({ targetId: swipe.targetId })
    .from(swipe)
    .where(eq(swipe.swiperId, session.user.id));

  const swipedIds = swipedList.map(s => s.targetId);
  // Always exclude self
  swipedIds.push(session.user.id);

  // Fetch users NOT in that list
  const queue = await db.query.user.findMany({
    where: notInArray(user.id, swipedIds),
    limit: 10,
    columns: {
      id: true,
      name: true,
      image: true,
      // bio: true, // Assuming you have a bio/skills column
      // skills: true 
    }
  });

  return queue;
}

// 2. Process Swipe
export async function processSwipe(targetId: string, action: "like" | "pass") {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  // A. Record the swipe
  await db.insert(swipe).values({
    swiperId: session.user.id,
    targetId,
    action,
  });

  let isMatch = false;

  // B. If LIKE, check for Mutual Match
  if (action === "like") {
    const existingSwipe = await db.query.swipe.findFirst({
      where: and(
        eq(swipe.swiperId, targetId), // They are the swiper
        eq(swipe.targetId, session.user.id), // I am the target
        eq(swipe.action, "like") // They liked me
      )
    });

    if (existingSwipe) {
      isMatch = true;

      // 1. Create Match Record
      await db.insert(match).values({
        user1Id: session.user.id,
        user2Id: targetId,
      });

      // 2. Notify User 1 (Me) - Trigger UI Confetti or Modal
      // (Handled by return value)

      // 3. Notify User 2 (Them) - They are offline/elsewhere, so send Notification
      await db.insert(notification).values({
        userId: targetId,
        title: "It's a Match! 🎉",
        message: `You and ${session.user.name} want to collaborate!`,
        type: "system", // or 'match'
        link: `/dashboard/messages`, // Or a specific match page
      });

      // Realtime trigger
      await pusherServer.trigger(`user-${targetId}`, "notification", {
         title: "It's a Match! 🎉",
         message: `You and ${session.user.name} want to collaborate!`
      });
    }
  }

  return { success: true, isMatch };
}