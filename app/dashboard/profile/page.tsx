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
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  Calendar, 
  Mail, 
  Edit, 
  Zap, 
  Target 
} from "lucide-react";

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
  const joinedDate = new Date(profile.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* HEADER SECTION */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <Avatar className="h-24 w-24 border-4 border-slate-50">
              <AvatarImage src={profile.image || ""} />
              <AvatarFallback className="text-2xl font-bold bg-blue-100 text-blue-600">
                {profile.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">{profile.name}</h1>
                  <p className="text-slate-500 font-medium">
                    {profile.university || "University Student"}
                  </p>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Edit className="h-4 w-4" /> Edit Profile
                </Button>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-slate-500 mt-2">
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {profile.email}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Joined {joinedDate}
                </div>
                <div className="flex items-center gap-1 text-green-600 font-medium">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  Online Now
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: BIO & STATS */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">About Me</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 leading-relaxed">
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
                <span className="text-slate-500">Credits</span>
                <span className="font-bold text-blue-600">{profile.credits}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-slate-500">Reputation</span>
                <span className="font-bold flex items-center gap-1">
                  5.0 <span className="text-yellow-400">★</span>
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Completed Swaps</span>
                <span className="font-bold">0</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: SKILLS & NEEDS (The "Marketplace Engine") */}
        <div className="md:col-span-2 space-y-6">
          
          {/* SKILLS OFFERED (Superpowers) */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-500" />
                <CardTitle>Superpowers (Offering)</CardTitle>
              </div>
              <CardDescription>
                Skills I can trade to earn credits.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.skillsOffered && profile.skillsOffered.length > 0 ? (
                  profile.skillsOffered.map((skill) => (
                    <Badge key={skill} variant="secondary" className="px-3 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-slate-400 italic">No skills listed yet.</span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* SKILLS WANTED (Needs) */}
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-orange-500" />
                <CardTitle>Needs (Looking For)</CardTitle>
              </div>
              <CardDescription>
                Skills I am willing to pay credits for.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.skillsWanted && profile.skillsWanted.length > 0 ? (
                  profile.skillsWanted.map((skill) => (
                    <Badge key={skill} variant="outline" className="px-3 py-1 border-orange-200 text-orange-700">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-slate-400 italic">No needs listed yet.</span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* PORTFOLIO SECTION (Placeholder for Auto-Portfolio) */}
          <Card>
             <CardHeader>
                <CardTitle>Portfolio</CardTitle>
                <CardDescription>Recent projects and case studies.</CardDescription>
             </CardHeader>
             <CardContent>
                <div className="text-center py-8 text-slate-500 border-2 border-dashed rounded-lg">
                   <p>No projects uploaded yet.</p>
                   <Button variant="link" className="text-blue-600">Upload Project</Button>
                </div>
             </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}