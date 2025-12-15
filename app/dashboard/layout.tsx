import { AppSidebar } from "@/components/app-sidebar";
import { UserButton } from "@/components/user-button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { user } from "@/db/schema";
import { MobileSidebar } from "@/components/mobile-sidebar"; // <--- Import this

import { SidebarProvider } from "@/components/sidebar-provider";
import { SidebarTrigger } from "@/components/sidebar-trigger";

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
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">
        {/* 1. Desktop Sidebar (Hidden on Mobile) */}
        <aside className="hidden md:block h-full bg-slate-50 border-r transition-all duration-300 ease-in-out">
          {/* Pass user prop if AppSidebar expects it, e.g. <AppSidebar user={session.user} /> */}
          <AppSidebar
            user={{
              name: session.user.name,
              email: session.user.email,
              image: session.user.image,
            }}
          />
        </aside>

        {/* 2. Main Content Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <header className="h-16 border-b flex items-center justify-between px-4 md:px-6 shrink-0">
            {/* LEFT SIDE: Hamburger (Mobile) + Logo */}
            <div className="flex items-center gap-2">
              {/* Mobile Sidebar Trigger (Visible only on mobile) */}
              <MobileSidebar user={session.user} />

              {/* Desktop Sidebar Trigger */}
              <SidebarTrigger />
            </div>

            {/* RIGHT SIDE: User Actions */}
            <div className="ml-auto flex items-center gap-4">
              <span className="text-sm font-medium text-slate-600 hidden md:block">
                Balance:{" "}
                <span className="text-blue-600 font-bold">
                  {currentUser?.credits ?? 0} Credits
                </span>
              </span>
              <UserButton
                user={session.user}
                credits={currentUser?.credits ?? 0}
              />
            </div>
          </header>

          {/* Scrollable Page Content */}
          <main className="flex-1 overflow-auto p-4 md:p-6 bg-slate-50/50">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
