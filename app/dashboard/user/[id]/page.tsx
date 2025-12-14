import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Calendar,
  GraduationCap,
  MessageSquare,
  Briefcase,
  Star,
  Mail,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import Image from "next/image";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const targetUserId = resolvedParams.id;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return redirect("/");

  // 1. Fetch Target User
  const targetUser = await db.query.user.findFirst({
    where: eq(user.id, targetUserId),
  });

  if (!targetUser) return notFound();

  const isMe = session.user.id === targetUser.id;

  // Mock Data for now (You can add these columns to your DB later)
  const stats = {
    rating: 5.0,
    reviews: 0,
    completedProjects: 0,
    responseTime: "1 hour",
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* HEADER SECTION */}
      <div className="overflow-hidden bg-card rounded-xl mb-6 border shadow-md">
        <div className="">
          <Image
            width={1920}
            height={480}
            src={targetUser.coverImage || ""}
            alt="Cover"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
              <AvatarImage src={targetUser.image || ""} />
              <AvatarFallback className="text-4xl bg-slate-200">
                {targetUser.name.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="flex gap-3 mb-2">
              {isMe ? (
                <Link href="/dashboard/settings">
                  <Button variant="outline">Edit Profile</Button>
                </Link>
              ) : (
                <>
                  <Button variant="outline" className="gap-2">
                    <MessageSquare className="h-4 w-4" /> Message
                  </Button>
                  <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                    <Briefcase className="h-4 w-4" /> Hire / Swap
                  </Button>
                </>
              )}
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {targetUser.name}
            </h1>
            <p className="text-slate-500 font-medium">
              {targetUser.university || "Orbit Member"}
            </p>

            <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-600">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-slate-400" />
                <span>Campus User</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span>
                  Joined {format(new Date(targetUser.createdAt), "MMMM yyyy")}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4 text-slate-400" />
                <span>{targetUser.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* LEFT COLUMN: ABOUT & SKILLS */}
        <div className="md:col-span-2 space-y-8">
          {/* About */}
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 leading-relaxed">
                {targetUser.bio || "This user hasn't written a bio yet."}
              </p>
            </CardContent>
          </Card>

          {/* Skills (Mocked for UI visualization) */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Offering Help In</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {/* If you add skills column later, map them here. Using placeholders. */}
                <Badge variant="secondary">React</Badge>
                <Badge variant="secondary">Design</Badge>
                <Badge variant="secondary">Calculus</Badge>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Looking For</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Badge variant="outline">Video Editing</Badge>
                <Badge variant="outline">Python</Badge>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* RIGHT COLUMN: STATS */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Reputation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Rating</span>
                <span className="font-bold flex items-center gap-1">
                  {stats.rating}{" "}
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Projects Done</span>
                <span className="font-bold">{stats.completedProjects}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Response Time</span>
                <span className="font-bold">{stats.responseTime}</span>
              </div>
            </CardContent>
          </Card>

          {/* University Verification Badge */}
          <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-start gap-3">
            <div className="p-2 bg-green-100 rounded-full text-green-600">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-green-800 text-sm">
                Student Verified
              </h4>
              <p className="text-xs text-green-700 mt-1">
                Verified member of {targetUser.university || "their university"}
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
