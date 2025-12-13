"use server";

import { AccessToken } from "livekit-server-sdk";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { studyInvite, studySession } from "@/db/schema";
import { desc, gte, eq } from "drizzle-orm";
import { db } from "@/db";
import { revalidatePath } from "next/cache";

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

  // Grant permissions: can publish data, listen, and join the specific room
  at.addGrant({
    roomJoin: true,
    room: room,
    canPublish: true,
    canSubscribe: true,
  });

  // Verify session exists and get topic
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
  const dateStr = formData.get("date") as string; // "2024-01-01T12:00"
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

  // 2. Save Invites
  if (emails.length > 0) {
    await db.insert(studyInvite).values(
      emails.map((email) => ({
        sessionId: newSession.id,
        email: email,
      }))
    );
    // TODO: Integrate an email service (e.g. Resend) here to actually send the email.
  }

  revalidatePath("/dashboard/study");
  return { success: true, sessionId: newSession.id };
}

export async function getUpcomingSessions() {
  const session = await auth.api.getSession({ headers: await headers() });

  // Fetch sessions scheduled for the future (or recent past)
  return await db.query.studySession.findMany({
    where: gte(studySession.scheduledAt, new Date(Date.now() - 1000 * 60 * 60)), // Hide sessions older than 1 hour
    orderBy: [desc(studySession.scheduledAt)],
    with: {
      host: { columns: { name: true, image: true } },
      invites: true,
    },
  });
}
