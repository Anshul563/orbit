import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { community } from "@/db/schema";
import { eq } from "drizzle-orm";
import { CommunityChat } from "./community-chat";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { joinCommunity } from "../actions";
import { MemberListModal } from "./member-list-modal"; // Ensure this matches your filename

// Note: params is a Promise in Next.js 15
export default async function CommunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const communityId = resolvedParams.id;
  
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return redirect("/");

  // 1. Fetch Community Details WITH User Info
  const comm = await db.query.community.findFirst({
    where: eq(community.id, communityId),
    with: {
      members: {
        // 👇 CRITICAL FIX: We must fetch the nested 'user' object
        // so the Modal can show names and avatars.
        with: {
          user: true 
        }
      }
    }
  });

  if (!comm) return <div>Community not found</div>;

  // 2. Check Membership
  const isMember = comm.members.some((m) => m.userId === session.user.id);

  if (!isMember) {
    // If not a member, show a "Gate" screen
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">{comm.name}</h1>
          <p className="text-slate-500 max-w-md">{comm.description}</p>
        </div>
        
        <form action={async () => {
          "use server";
          await joinCommunity(communityId);
        }}>
           <Button size="lg">Join to Chat</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto h-full flex flex-col gap-4">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/community">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              {comm.name}
              
            </h1>
            <p className="text-sm text-slate-500">{comm.description}</p>
          </div>
        </div>
        
        <div className="flex items-center">
           {/* Now passing the fully populated members list */}
           <MemberListModal 
             members={comm.members} 
             ownerId={comm.ownerId} 
           />
        </div>
      </div>

      {/* The Chat Room */}
      <CommunityChat communityId={communityId} currentUserId={session.user.id} />
    </div>
  );
}