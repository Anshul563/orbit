"use server";

import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth"; // Your auth config
import { headers } from "next/headers";

export async function updateProfile(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const university = formData.get("university") as string;
  const bio = formData.get("bio") as string;

  // Parse comma-separated tags back into arrays
  const skillsOffered = (formData.get("skillsOffered") as string)
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const skillsWanted = (formData.get("skillsWanted") as string)
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  await db
    .update(user)
    .set({
      name,
      university,
      bio,
      skillsOffered,
      skillsWanted,
      updatedAt: new Date(),
    })
    .where(eq(user.id, session.user.id));

  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard/settings");

  return { success: true };
}

export async function updateUserImages({
  image,
  coverImage,
}: {
  image?: string;
  coverImage?: string;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  await db
    .update(user)
    .set({
      ...(image && { image }),
      ...(coverImage && { coverImage }),
    })
    .where(eq(user.id, session.user.id));

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard/user/" + session.user.id);
  return { success: true };
}
