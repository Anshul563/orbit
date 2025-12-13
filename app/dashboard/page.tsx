import { auth } from "@/lib/auth"; // Your auth config
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Zap, Search, Plus, CreditCard, LayoutDashboard } from "lucide-react";
import { UserButton } from "@/components/user-button";

export default async function Dashboard() {
  // 1. Get Session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/");
  }

  // 2. Fetch User Data (Sync Credits)
  // We fetch fresh from DB to ensure credit balance is up-to-date
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
            <span className="font-semibold text-blue-600">
              {currentUser?.credits} Orbit Credits
            </span>{" "}
            available to trade.
          </p>
        </section>

        {/* QUICK ACTIONS (The "Intent Toggle" from PRD) */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="bg-blue-600/20 text-white border-none hover:bg-blue-700 transition cursor-pointer">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Plus className="h-5 w-5" /> Request Help
                </h3>
                <p className="text-blue-100 opacity-90">
                  Post a job and offer credits.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card hover:border-blue-300 transition cursor-pointer">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800">
                  <Search className="h-5 w-5" /> Find Work
                </h3>
                <p className="text-slate-500">
                  Browse requests to earn credits.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ACTIVE SWAPS & STATS GRID */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Col: Active Swaps */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" /> Active Swaps
              </CardTitle>
              <CardDescription>Your ongoing collaborations.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Empty State for MVP */}
              <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed rounded-lg">
                <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                  <LayoutDashboard className="h-5 w-5 text-slate-400" />
                </div>
                <h4 className="font-medium text-slate-900">No active swaps</h4>
                <p className="text-sm text-slate-500 max-w-xs mx-auto mt-1">
                  You are not working on anything right now. Post a request to
                  get started!
                </p>
                <Button variant="link" className="text-blue-600 mt-2">
                  Browse Marketplace &rarr;
                </Button>
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
                <span className="font-bold">5.0 ★</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Completed</span>
                <span className="font-bold">0 Swaps</span>
              </div>
              <div className="pt-4 border-t">
                <Button className="w-full" variant="outline">
                  View Public Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
