import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/db";

// We accept the user prop to pass it down to AppSidebar
export async function MobileSidebar({ user }: { user: any }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return redirect("/");

  // Fetch credits for the top bar
  const currentUser = await db.query.user.findFirst({
    where: eq(user.id, session.user.id),
  });
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden mr-2">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      {/* side="left" makes it slide from the left */}
      <SheetContent side="left" className="p-0 w-72">
        {/* Render the sidebar inside the sheet */}
        <AppSidebar
          user={{
            name: session.user.name,
            email: session.user.email,
            image: session.user.image,
          }}
        />
        {/* Note: If AppSidebar requires props (like user), pass them: <AppSidebar user={user} /> */}
      </SheetContent>
    </Sheet>
  );
}
