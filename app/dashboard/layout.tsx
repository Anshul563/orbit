import { AppSidebar } from "@/components/app-sidebar";
import { UserButton } from "@/components/user-button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { user } from "@/db/schema";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return redirect("/");

  // Fetch credits for the top bar
  const currentUser = await db.query.user.findFirst({
    where: eq(user.id, session.user.id),
  });

  return (
    <div className="flex h-screen overflow-hidden">
      {/* 1. Fixed Sidebar */}
      <aside className="hidden md:block">
        <AppSidebar user={session.user} />
      </aside>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* <header className="h-16 border-b bg-white flex items-center justify-between px-6 shrink-0">
           
           <div className="md:hidden font-display font-bold text-blue-600">Orbit</div>
           
           <div className="ml-auto flex items-center gap-4">
              <span className="text-sm font-medium text-slate-600 hidden md:block">
                Balance: <span className="text-blue-600">{currentUser?.credits ?? 0} Credits</span>
              </span>
              <UserButton 
                user={session.user} 
                credits={currentUser?.credits ?? 0} 
              />
           </div>
        </header> */}

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
