import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getCommunities } from "./actions";
import { CreateCommunityModal } from "./create-community-modal";
import { CommunityCard } from "./community-card";
import { Separator } from "@/components/ui/separator";

export default async function CommunityPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return redirect("/");

  const { myCommunities, otherCommunities } = await getCommunities();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display">Community Hub</h1>
          <p className="text-slate-500">Find your tribe, join study groups, or start your own club.</p>
        </div>
        <CreateCommunityModal />
      </div>

      {/* MY COMMUNITIES */}
      {myCommunities.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            My Communities <span className="text-sm font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{myCommunities.length}</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myCommunities.map((c) => (
              <CommunityCard 
                key={c.id} 
                community={{
                  ...c,
                  memberCount: c.members.length,
                  isMember: true
                }} 
              />
            ))}
          </div>
          <Separator className="mt-8" />
        </div>
      )}

      {/* DISCOVER COMMUNITIES */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Discover</h2>
        {otherCommunities.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-lg border border-dashed">
            <p className="text-slate-500">No new communities found. Be the first to create one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherCommunities.map((c) => (
              <CommunityCard 
                key={c.id} 
                community={{
                  ...c,
                  memberCount: c.members.length,
                  isMember: false
                }} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}