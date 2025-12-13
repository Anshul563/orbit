import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { user } from "@/db/schema";
import { ProfileForm } from "./profile-form";
import { Separator } from "@/components/ui/separator";

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return redirect("/");

  // Fetch current data to pre-fill the form
  const currentUser = await db.query.user.findFirst({
    where: eq(user.id, session.user.id),
  });

  if (!currentUser) return <div>User not found</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your public profile and your "Skill Swap" preferences.
        </p>
      </div>
      <Separator />
      
      <ProfileForm 
        initialData={{
          name: currentUser.name,
          university: currentUser.university,
          bio: currentUser.bio,
          skillsOffered: currentUser.skillsOffered,
          skillsWanted: currentUser.skillsWanted
        }} 
      />
    </div>
  );
}