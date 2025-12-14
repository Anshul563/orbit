import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { user } from "@/db/schema";
import { ProfileForm } from "./profile-form";
import { ProfileImages } from "./profile-images"; // <--- Import the new component
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
    <div className="max-w-3xl mx-auto pb-10">
      
      {/* HEADER TEXT */}
      <div className="mb-6 space-y-1">
        <h3 className="text-2xl font-bold tracking-tight">Profile Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your public profile, cover photo, and skill preferences.
        </p>
      </div>

      {/* NEW: IMAGES SECTION (Cover + Avatar) */}
      <ProfileImages 
        initialData={{
            id: currentUser.id,
            name: currentUser.name,
            image: currentUser.image,
            coverImage: currentUser.coverImage,
        }}
      />

      <div className="mt-16"> {/* Margin top to account for the overlapping avatar */}
        <Separator className="my-6" />
        
        {/* EXISTING FORM */}
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
    </div>
  );
}