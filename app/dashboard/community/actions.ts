"use server";

import { db } from "@/db";
import { community, communityMember } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { eq, and, desc } from "drizzle-orm";
import { nanoid } from "nanoid";

const TAILWIND_COLORS = [
  "bg-red-500", "bg-orange-500", "bg-amber-500", "bg-green-500", 
  "bg-emerald-500", "bg-teal-500", "bg-cyan-500", "bg-blue-500", 
  "bg-indigo-500", "bg-violet-500", "bg-purple-500", "bg-fuchsia-500", 
  "bg-pink-500", "bg-rose-500"
];

export async function createCommunity(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  
  // 1. Capture New Fields
  const isPrivate = formData.get("isPrivate") === "on"; 
  const image = formData.get("image") as string;      // Profile Image
  const coverImage = formData.get("coverImage") as string; // Cover Image
  
  const randomColor = TAILWIND_COLORS[Math.floor(Math.random() * TAILWIND_COLORS.length)];
  const inviteCode = nanoid(10); 

  // 2. Create the Community
  const [newCommunity] = await db.insert(community).values({
    name,
    description,
    ownerId: session.user.id,
    color: randomColor,
    isPrivate,   
    image,       
    coverImage,  // Added: Save cover image
    inviteCode,  
  }).returning();

  // 3. Auto-add the creator as a member (ADMIN)
  await db.insert(communityMember).values({
    communityId: newCommunity.id,
    userId: session.user.id,
    role: "admin", 
  });

  revalidatePath("/dashboard/community");
  return { success: true };
}

export async function joinCommunity(communityId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  // 1. Fetch Community to check privacy
  const targetComm = await db.query.community.findFirst({
    where: eq(community.id, communityId)
  });

  if (!targetComm) return { success: false, message: "Community not found" };

  if (targetComm.isPrivate) {
    return { success: false, message: "Cannot join private community without invite." };
  }

  // 2. Check if already joined
  const existing = await db.query.communityMember.findFirst({
    where: and(
      eq(communityMember.communityId, communityId),
      eq(communityMember.userId, session.user.id)
    )
  });

  if (existing) return { success: false, message: "Already joined" };

  // 3. Add Member
  await db.insert(communityMember).values({
    communityId,
    userId: session.user.id,
    role: "member",
  });

  revalidatePath("/dashboard/community");
  return { success: true };
}

export async function getCommunities() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { myCommunities: [], otherCommunities: [] };

  const allCommunities = await db.query.community.findMany({
    orderBy: [desc(community.createdAt)],
    with: {
      members: {
        with: {
            user: { columns: { id: true, image: true, name: true } }
        }
      }
    }
  });

  const userId = session.user.id;

  const myCommunities = allCommunities.filter(c => 
    c.members.some(m => m.userId === userId)
  );
  
  const otherCommunities = allCommunities.filter(c => {
    const isMember = c.members.some(m => m.userId === userId);
    if (c.isPrivate) return false; 
    return !isMember;
  });

  return { myCommunities, otherCommunities };
}

export async function generateInviteLink(communityId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  // Verify Ownership
  const comm = await db.query.community.findFirst({
    where: and(
      eq(community.id, communityId),
      eq(community.ownerId, session.user.id)
    )
  });

  if (!comm) throw new Error("Not authorized");

  let code = comm.inviteCode;
  
  if (!code) {
    code = nanoid(10);
    await db.update(community)
      .set({ inviteCode: code })
      .where(eq(community.id, communityId));
  }

  const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
  return { inviteLink: `${baseUrl}/join/${code}` };
}

export async function joinByInviteCode(code: string) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return { success: false, message: "Login required" };
  
    const comm = await db.query.community.findFirst({
        where: eq(community.inviteCode, code)
    });
  
    if (!comm) return { success: false, message: "Invalid invite link" };
  
    const existing = await db.query.communityMember.findFirst({
        where: and(
            eq(communityMember.communityId, comm.id),
            eq(communityMember.userId, session.user.id)
        )
    });

    if (existing) {
        return { success: true, communityId: comm.id, message: "Already a member" };
    }

    await db.insert(communityMember).values({
        communityId: comm.id,
        userId: session.user.id,
        role: "member"
    });

    revalidatePath("/dashboard/community");
    return { success: true, communityId: comm.id };
}

// --- UPDATED: HANDLE IMAGES & PRIVATE TOGGLE ---
export async function updateCommunity(communityId: string, formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  // 1. Verify Ownership
  const comm = await db.query.community.findFirst({
    where: and(
        eq(community.id, communityId), 
        eq(community.ownerId, session.user.id)
    ),
  });

  if (!comm) throw new Error("Unauthorized");

  // 2. Extract Data
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const isPrivate = formData.get("isPrivate") === "true"; 
  const image = formData.get("image") as string;
  const coverImage = formData.get("coverImage") as string; // Capture cover

  // 3. Update DB
  await db.update(community).set({
    name,
    description,
    isPrivate,
    image: image || comm.image,           // Keep old if empty
    coverImage: coverImage || comm.coverImage, // Keep old if empty
  }).where(eq(community.id, communityId));

  revalidatePath(`/dashboard/community/${communityId}`);
  revalidatePath(`/dashboard/community/${communityId}/settings`);
  
  return { success: true };
}

// --- NEW FUNCTION: PROMOTE MEMBER ---
export async function promoteMember(communityId: string, memberId: string) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new Error("Unauthorized");
  
    // 1. Verify Requester is Owner
    const comm = await db.query.community.findFirst({
      where: and(
          eq(community.id, communityId), 
          eq(community.ownerId, session.user.id)
      ),
    });
  
    if (!comm) throw new Error("Unauthorized: Only the owner can promote members");
  
    // 2. Update Role
    await db.update(communityMember)
      .set({ role: "admin" })
      .where(and(
          eq(communityMember.communityId, communityId),
          eq(communityMember.userId, memberId)
      ));
  
    revalidatePath(`/dashboard/community/${communityId}/settings`);
    return { success: true };
}