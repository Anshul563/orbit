import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { community } from "@/db/schema";
import { eq } from "drizzle-orm";
import { CommunitySettingsForm } from "@/components/community-settings-form";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const communityId = resolvedParams.id;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return redirect("/");

  // 1. Fetch Community
  const comm = await db.query.community.findFirst({
    where: eq(community.id, communityId),
    with: {
      members: {
        with: {
          user: true,
        },
      },
    },
  });

  if (!comm) {
    return <div>Community not found</div>;
  }

  // 2. SECURITY CHECK: Only Owner can access settings
  if (comm.ownerId !== session.user.id) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6">
        <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
        <p className="text-slate-500">
          Only the community owner can access settings.
        </p>
        <a
          href={`/dashboard/community/${communityId}`}
          className="mt-4 text-blue-600 hover:underline"
        >
          Return to Community
        </a>
      </div>
    );
  }

  // Transform members to match interface (handle nullable role)
  const formattedMembers = comm.members.map((m) => ({
    ...m,
    role: m.role || "member",
  }));

  // 3. Render Client Form
  return (
    <div className="p-6">
      <CommunitySettingsForm community={comm} members={formattedMembers} />
    </div>
  );
}
