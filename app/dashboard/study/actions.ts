"use server";

import { AccessToken } from "livekit-server-sdk";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { studyInvite, studySession, notification, user } from "@/db/schema"; // Added notification & user
import { desc, gte, eq } from "drizzle-orm";
import { db } from "@/db";
import { revalidatePath } from "next/cache";
import Pusher from "pusher"; // Or import { pusherServer } from "@/lib/pusher";

// Initialize Pusher (If you don't have a shared lib/pusher.ts)
const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

export async function getToken(room: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const participantName = session.user.name;
  const participantIdentity = session.user.id;

  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    {
      identity: participantIdentity,
      name: participantName,
    }
  );

  at.addGrant({
    roomJoin: true,
    room: room,
    canPublish: true,
    canSubscribe: true,
  });

  const sessionData = await db.query.studySession.findFirst({
    where: eq(studySession.id, room),
  });

  if (!sessionData) throw new Error("Session not found");

  return {
    token: await at.toJwt(),
    topic: sessionData.topic,
  };
}

export async function createStudySession(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const topic = formData.get("topic") as string;
  const dateStr = formData.get("date") as string;
  const emails = (formData.get("emails") as string)
    .split(",")
    .map((e) => e.trim())
    .filter((e) => e);

  // 1. Create Session
  const [newSession] = await db
    .insert(studySession)
    .values({
      hostId: session.user.id,
      topic,
      scheduledAt: dateStr ? new Date(dateStr) : new Date(),
    })
    .returning();

  // 2. Handle Invites & Notifications
  if (emails.length > 0) {
    // A. Save Invite Records (Status tracking)
    await db.insert(studyInvite).values(
      emails.map((email) => ({
        sessionId: newSession.id,
        email: email,
      }))
    );

    // B. Send Notifications to Registered Users
    // Iterate through emails to find matches in our DB
    for (const email of emails) {
        const targetUser = await db.query.user.findFirst({
            where: eq(user.email, email)
        });

        if (targetUser) {
            // 1. Create Notification Record
            const [notif] = await db.insert(notification).values({
                userId: targetUser.id,
                title: "Study Room Invite 📚",
                message: `${session.user.name} invited you to join "${topic}"`,
                type: "info",
                link: `/dashboard/study?room=${newSession.id}`,
            }).returning();

            // 2. Trigger Real-time Bell (Pusher)
            await pusherServer.trigger(`user-${targetUser.id}`, "notification", {
                ...notif,
                createdAt: notif.createdAt?.toISOString()
            });
        }
        // TODO: Else, send an actual email invite for non-registered users
    }
  }

  revalidatePath("/dashboard/study");
  return { success: true, sessionId: newSession.id };
}

export async function getUpcomingSessions() {
  const session = await auth.api.getSession({ headers: await headers() });

  return await db.query.studySession.findMany({
    where: gte(studySession.scheduledAt, new Date(Date.now() - 1000 * 60 * 60)),
    orderBy: [desc(studySession.scheduledAt)],
    with: {
      host: { columns: { name: true, image: true } },
      invites: true,
    },
  });
}