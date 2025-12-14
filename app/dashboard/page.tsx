import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { user } from "@/db/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Search, Plus, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { LayoutPanelTopIcon } from "@/components/icons/LayoutPanelTopIcon";
import { MagicCard } from "@/components/ui/magic-card";

export default async function Dashboard() {
  // 1. Get Session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/");
  }

  // 2. Fetch User Data (Sync Credits)
  const currentUser = await db.query.user.findFirst({
    where: eq(user.id, session.user.id),
  });

  return (
    <div className="min-h-screen">
      <main className="max-w-6xl mx-auto p-6 space-y-8">
        {/* WELCOME SECTION */}
        <section className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Welcome back, {session.user.name.split(" ")[0]}! 👋
          </h2>
          <p className="text-slate-500">
            You have{" "}
            <span className="font-semibold text-primary">
              {currentUser?.credits ?? 0} Orbit Credits
            </span>{" "}
            available to trade.
          </p>
        </section>

        {/* QUICK ACTIONS */}
        <div className="grid md:grid-cols-2 gap-4">
          <Link href="/dashboard/market?type=request">
            <MagicCard className=" cursor-pointer h-full">
              <CardContent className="p-6 flex mx-auto items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Plus className="h-5 w-5" /> Request Help
                  </h3>
                  <p className="opacity-90">Post a job and offer credits.</p>
                </div>
              </CardContent>
            </MagicCard>
          </Link>

          <Link href="/dashboard/market">
            <Card className="bg-primary/20 transition cursor-pointer h-full">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Search className="h-5 w-5" /> Find Work
                  </h3>
                  <p className="text-slate-500">
                    Browse requests to earn credits.
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* ACTIVE SWAPS & STATS GRID */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Col: Active Swaps */}
          <Card className="md:col-span-2 bg-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" /> Active Swaps
              </CardTitle>
              <CardDescription>Your ongoing collaborations.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Empty State for MVP */}
              <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed rounded-lg">
                <div className="h-10 w-10 rounded-full flex items-center justify-center mb-3">
                  <LayoutPanelTopIcon className="h-5 w-5 text-slate-400" />
                </div>
                <h4 className="font-medium">No active swaps</h4>
                <p className="text-sm text-slate-500 max-w-xs mx-auto mt-1">
                  You are not working on anything right now. Post a request to
                  get started!
                </p>
                <Link href="/dashboard/market">
                  <Button variant="link" className="text-blue-600 mt-2">
                    Browse Marketplace &rarr;
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Right Col: Mini Stats */}
          <Card>
            <CardHeader>
              <CardTitle>My Reputation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Rating</span>
                <span className="font-bold text-lg">5.0 ★</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Completed</span>
                <span className="font-bold text-lg">0 Swaps</span>
              </div>
              <div className="pt-4 border-t">
                <Link href="/dashboard/settings">
                  <Button className="w-full" variant="outline">
                    View Public Profile
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
