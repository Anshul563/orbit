import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getProjects } from "./actions";
import { ProjectCard } from "./project-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase } from "lucide-react";

export default async function ProjectsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return redirect("/");

  const projects = await getProjects();

  const activeProjects = projects.filter(p => p.status !== "completed");
  const completedProjects = projects.filter(p => p.status === "completed");

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold font-display flex items-center gap-2">
          <Briefcase className="h-8 w-8 text-blue-600" /> My Projects
        </h1>
        <p className="text-slate-500">Manage your ongoing work and past collaborations.</p>
      </div>

      {/* TABS (Active vs History) */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2">
          <TabsTrigger value="active">Active ({activeProjects.length})</TabsTrigger>
          <TabsTrigger value="completed">History ({completedProjects.length})</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="active" className="space-y-4">
            {activeProjects.length === 0 ? (
              <div className="text-center py-16 bg-slate-50 border-2 border-dashed rounded-xl">
                <p className="text-slate-500">No active projects.</p>
                <p className="text-sm text-slate-400">Visit the Marketplace to find work!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeProjects.map((p) => (
                  <ProjectCard key={p.id} project={p} currentUserId={session.user.id} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed">
            {completedProjects.length === 0 ? (
              <div className="text-center py-16 bg-slate-50 border-2 border-dashed rounded-xl">
                 <p className="text-slate-500">No completed projects yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedProjects.map((p) => (
                  <ProjectCard key={p.id} project={p} currentUserId={session.user.id} />
                ))}
              </div>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}