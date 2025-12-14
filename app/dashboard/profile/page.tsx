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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { MapPin, Calendar, Mail, Edit, Zap, Target, ImageIcon } from "lucide-react";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/arrow-right";
import Image from "next/image";

export default async function ProfilePage() {
  // 1. Authenticate
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return redirect("/");

  // 2. Fetch Full User Profile
  const profile = await db.query.user.findFirst({
    where: eq(user.id, session.user.id),
  });

  if (!profile) return <div>User not found</div>;

  // Helper to format dates
  const joinedDate = new Date(profile.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* HEADER SECTION WITH BANNER */}
      <div className="overflow-hidden bg-card rounded-xl border shadow-md">
        
        {/* BANNER IMAGE AREA (4:1 Aspect Ratio) */}
        <div className="relative h-48 md:h-64 w-full bg-slate-100">
          {profile.coverImage ? (
            <Image
              width={1920}
              height={480}
              src={profile.coverImage}
              alt="Cover"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex flex-col bg-card items-center justify-center bg-linear-to-t dark:from-primary/60 dark:to-primary/10 from-primary to-primary/10">
              <ImageIcon className="h-12 w-12 opacity-20" />
              <p className="opacity-20 text-2xl font-bold">No cover image</p>
            </div>
          )}
        </div>

        {/* PROFILE INFO AREA */}
        <div className="px-6 pt-3 pb-6">
          <div className="relative flex flex-col md:flex-row gap-6 items-start -mt-12 md:-mt-16">
            
            {/* AVATAR (Overlapping) */}
            <Avatar className="h-32 w-32 border-4 border-white shadow-lg bg-white">
              <AvatarImage src={profile.image || ""} className="object-cover" />
              <AvatarFallback className="text-4xl font-bold bg-slate-100 text-slate-500">
                {profile.name.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2 mt-2 md:mt-16 w-full">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{profile.name}</h1>
                  <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">
                    {profile.university || "University Student"}
                  </p>
                </div>
                
                <Link href="/dashboard/settings">
                  <Button variant="outline" className="gap-2">
                    <Edit className="h-4 w-4" /> Edit Profile
                  </Button>
                </Link>
              </div>

              <div className="flex flex-wrap gap-6 text-sm text-slate-600 dark:text-slate-300 mt-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-slate-400" />
                  {profile.email}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  Joined {joinedDate}
                </div>
                <div className="flex items-center gap-2 text-green-600 font-medium">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  Online Now
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* LEFT COLUMN: BIO & STATS */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">About Me</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="dark:text-slate-300 text-slate-600 leading-relaxed whitespace-pre-wrap">
                {profile.bio || "This user hasn't written a bio yet."}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Orbit Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="dark:text-slate-300 text-slate-600">
                  Credits
                </span>
                <span className="flex items-center gap-1 font-bold text-blue-600">
                  {profile.credits}
                  <Link href="/dashboard/wallet">
                    <ArrowRightIcon className="h-4 w-4 ml-1" />
                  </Link>
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="dark:text-slate-300 text-slate-600">
                  Reputation
                </span>
                <span className="font-bold flex items-center gap-1">
                  5.0 <span className="text-yellow-400">★</span>
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="dark:text-slate-300 text-slate-600">
                  Completed Swaps
                </span>
                <span className="font-bold">0</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: SKILLS & NEEDS (The "Marketplace Engine") */}
        <div className="md:col-span-2 space-y-6">
          {/* SKILLS OFFERED (Superpowers) */}
          <Card className="">
            <CardHeader className="flex flex-row justify-between items-center space-y-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-500" />
                  <CardTitle>Superpowers (Offering)</CardTitle>
                </div>
                <CardDescription>
                  Skills I can trade to earn credits.
                </CardDescription>
              </div>
              <Link href="/dashboard/settings">
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4 text-slate-400" />
                  </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.skillsOffered && profile.skillsOffered.length > 0 ? (
                  profile.skillsOffered.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="px-3 py-1 text-sm"
                    >
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-slate-400 italic">
                    No skills listed yet.
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* SKILLS WANTED (Needs) */}
          <Card className="">
            <CardHeader className="flex flex-row justify-between items-center space-y-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-orange-500" />
                  <CardTitle>Needs (Looking For)</CardTitle>
                </div>
                <CardDescription>
                  Skills I am willing to pay credits for.
                </CardDescription>
              </div>
              <Link href="/dashboard/settings">
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4 text-slate-400" />
                  </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.skillsWanted && profile.skillsWanted.length > 0 ? (
                  profile.skillsWanted.map((skill) => (
                    <Badge key={skill} variant="outline" className="px-3 py-1 text-sm border-dashed border-slate-400 text-slate-600">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-slate-400 italic">
                    No needs listed yet.
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* PORTFOLIO SECTION */}
          <Card>
            <CardHeader>
              <CardTitle>Portfolio</CardTitle>
              <CardDescription>
                Recent projects and case studies.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 bg-slate-50 border-2 border-dashed rounded-lg">
                <p className="text-slate-500 mb-2">No projects uploaded yet.</p>
                <Button variant="link" className="text-blue-600 h-auto p-0">
                  Upload Project
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}