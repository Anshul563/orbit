import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { MatchDeck } from "@/components/match-deck";
import { getMatchQueue } from "./actions";

export default async function MatchPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return redirect("/");

  const queue = await getMatchQueue();

  return (
    <div className="min-h-screen p-4 md:p-10 flex flex-col items-center">
      
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold font-display mb-2">Find your Partner 🚀</h1>
        <p className="text-slate-500">Swipe right to connect with students working on cool things.</p>
      </div>

      <MatchDeck initialQueue={queue} />
      
    </div>
  );
}