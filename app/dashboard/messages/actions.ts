"use server";

import { db } from "@/db";
import { message, post, swap, user } from "@/db/schema";
import { eq, or, and, desc, asc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Pusher from "pusher";
import { revalidatePath } from "next/cache";
import { AccessToken } from "livekit-server-sdk";

// Initialize Pusher Server-Side
const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

export async function getConversations() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return [];

  // Find all swaps where the user is either the Requester OR Provider
  const mySwaps = await db.query.swap.findMany({
    where: or(
      eq(swap.requesterId, session.user.id),
      eq(swap.providerId, session.user.id)
    ),
    with: {
      post: true, // To get the project title
    },
  });

  // Enrich with the "Other User" details manually
  // (In a real app, you'd use a more complex join, but this is clearer for learning)
  const enrichedSwaps = await Promise.all(
    mySwaps.map(async (s) => {
      const otherUserId =
        s.requesterId === session.user.id ? s.providerId : s.requesterId;
      const otherUser = await db.query.user.findFirst({
        where: eq(user.id, otherUserId),
        columns: { name: true, image: true },
      });

      return {
        ...s,
        otherUser: otherUser || { name: "Unknown", image: null },
        lastMessage: "Start chatting...", // Placeholder until we fetch messages
      };
    })
  );

  return enrichedSwaps;
}

export async function getMessages(swapId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  return await db.query.message.findMany({
    where: eq(message.swapId, swapId),
    orderBy: [asc(message.createdAt)], // Oldest first for chat log
    with: {
      sender: {
        columns: { id: true, name: true, image: true },
      }, // Fetch sender details
    },
  });
}

export async function sendMessage(swapId: string, content: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  // 1. Save to DB
  const [newMessage] = await db
    .insert(message)
    .values({
      swapId,
      senderId: session.user.id,
      content,
    })
    .returning();

  // 2. Trigger Real-time Event (Pusher)
  // Channel: "swap-{swapId}" | Event: "incoming-message"
  await pusherServer.trigger(`swap-${swapId}`, "incoming-message", {
    id: newMessage.id,
    content: newMessage.content,
    senderId: session.user.id,
    createdAt: newMessage.createdAt,
    senderName: session.user.name,
    senderImage: session.user.image,
  });

  return { success: true };
}

export async function createTestConversation() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  // 1. Create (or find) a Demo Bot User
  const botId = "orbit-demo-bot";

  // Check if bot exists, if not create it
  // (We use a raw insert/ignore logic or just try-catch for simplicity)
  try {
    await db
      .insert(user)
      .values({
        id: botId,
        name: "Orbit Bot 🤖",
        email: "bot@orbit.local",
        emailVerified: true,
        image: "https://api.dicebear.com/7.x/bottts/svg?seed=orbit",
        createdAt: new Date(),
        updatedAt: new Date(),
        credits: 999,
      })
      .onConflictDoNothing(); // If bot exists, do nothing
  } catch (e) {
    // Ignore error if bot exists
  }

  // 2. Create a Fake "Help Wanted" Post
  const [newPost] = await db
    .insert(post)
    .values({
      authorId: botId,
      title: "Debug: Test Chat Integration",
      description: "This is a generated post to test the messaging system.",
      type: "request",
      budget: 500,
    })
    .returning();

  // 3. Create the Swap (The Connection)
  await db.insert(swap).values({
    postId: newPost.id,
    requesterId: botId, // Bot needs help
    providerId: session.user.id, // You are helping
    price: 500,
    status: "active",
  });

  revalidatePath("/dashboard/messages");
  return { success: true };
}

export async function getCallToken(swapId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const roomName = `call-${swapId}`;
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
    room: roomName,
    canPublish: true,
    canSubscribe: true,
  });

  return await at.toJwt();
}

// Update sendMessage to allow "system" messages for calls
export async function sendCallNotification(swapId: string, type: "audio" | "video") {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new Error("Unauthorized");

    const content = type === "video" ? "📹 Started a Video Call" : "📞 Started a Voice Call";
    
    // Save to DB so it persists in history
    const [newMessage] = await db.insert(message).values({
        swapId,
        senderId: session.user.id,
        content: content,
        // We can use a flag or specific text pattern to identify call messages
        // For now, simple text is fine. In a real app, add a 'type' column to message table.
    }).returning();

    // Trigger Pusher with a special event type
    await pusherServer.trigger(`swap-${swapId}`, "incoming-call", {
        id: newMessage.id,
        content: content,
        senderId: session.user.id,
        createdAt: newMessage.createdAt,
        callType: type, // Custom payload
        senderName: session.user.name,
        senderImage: session.user.image,
    });

    return { success: true };
}