"use server";

import { db } from "@/db";
import { community, communityMember } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { eq, and, desc } from "drizzle-orm";

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
  const randomColor = TAILWIND_COLORS[Math.floor(Math.random() * TAILWIND_COLORS.length)];

  // 1. Create the Community
  const [newCommunity] = await db.insert(community).values({
    name,
    description,
    ownerId: session.user.id,
    color: randomColor,
  }).returning();

  // 2. Auto-add the creator as a member
  await db.insert(communityMember).values({
    communityId: newCommunity.id,
    userId: session.user.id,
  });

  revalidatePath("/dashboard/community");
  return { success: true };
}

export async function joinCommunity(communityId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  // Check if already joined
  const existing = await db.query.communityMember.findFirst({
    where: and(
      eq(communityMember.communityId, communityId),
      eq(communityMember.userId, session.user.id)
    )
  });

  if (existing) return { success: false, message: "Already joined" };

  await db.insert(communityMember).values({
    communityId,
    userId: session.user.id,
  });

  revalidatePath("/dashboard/community");
  return { success: true };
}

export async function getCommunities() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { myCommunities: [], otherCommunities: [] };

  // Fetch all communities with member counts
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

  // Separate into "My" vs "Discover"
  const myCommunities = allCommunities.filter(c => 
    c.members.some(m => m.user.id === session.user.id)
  );
  
  const otherCommunities = allCommunities.filter(c => 
    !c.members.some(m => m.user.id === session.user.id)
  );

  return { myCommunities, otherCommunities };
}