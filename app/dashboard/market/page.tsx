import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getPosts } from "./actions";
import { CreatePostModal } from "./create-post-modal";
import { PostCard } from "./post-card";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default async function MarketPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return redirect("/");

  const posts = await getPosts();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display ">Marketplace</h1>
          <p className="text-slate-500">Find help, earn credits, and build your portfolio.</p>
        </div>
        <CreatePostModal />
      </div>

      {/* SEARCH & FILTERS (Visual only for now) */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input placeholder="Search for Python, Design, etc..." className="pl-9 bg-white" />
        </div>
      </div>

      {/* POSTS GRID */}
      {posts.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 border-2 border-dashed rounded-xl">
          <p className="text-slate-500">No active listings found.</p>
          <p className="text-sm text-slate-400">Be the first to create a request!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard 
              key={post.id} 
              post={post} 
              currentUserId={session.user.id} 
            />
          ))}
        </div>
      )}
    </div>
  );
}