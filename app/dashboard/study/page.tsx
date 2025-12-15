"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Video, Calendar, Clock, Copy, ArrowRight } from "lucide-react";
import { StudyRoom } from "./study-room";
import { CreateSessionModal } from "./create-session-modal"; // New Modal
import { getUpcomingSessions } from "./actions"; // New Action
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default function StudyPage() {
  const searchParams = useSearchParams();
  const roomParam = searchParams.get("room");
  const [sessions, setSessions] = useState<any[]>([]);
  const router = useRouter();

  // 1. Fetch sessions on load
  useEffect(() => {
    getUpcomingSessions().then(setSessions);
  }, []);

  // 2. If Room ID exists, render the Video Room
  if (roomParam) {
    return <StudyRoom room={roomParam} />;
  }

  const joinRoom = (roomId: string) => {
    router.push(`/dashboard/study?room=${roomId}`);
  };

  const copyLink = (e: React.MouseEvent, roomId: string) => {
    e.stopPropagation(); // Don't trigger join
    const url = `${window.location.origin}/dashboard/study?room=${roomId}`;
    navigator.clipboard.writeText(url);
    alert("Link copied!");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-3xl font-bold font-display">Study Rooms</h1>
           <p className="text-slate-500">Scheduled sessions and live collaboration.</p>
        </div>
        <CreateSessionModal />
      </div>

      {/* UPCOMING SESSIONS GRID */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" /> Upcoming Sessions
        </h3>
        
        {sessions.length === 0 ? (
           <div className="text-center py-12 border border-dashed rounded-xl">
             <p className="text-slate-500">No scheduled sessions. Create one above!</p>
           </div>
        ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {sessions.map((session) => {
                const isLive = new Date(session.scheduledAt) <= new Date();
                
                return (
                  <Card key={session.id} className="hover:border-blue-300 transition cursor-pointer group" onClick={() => joinRoom(session.id)}>
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                            <Badge variant={isLive ? "default" : "outline"} className={isLive ? "bg-red-500 hover:bg-red-600" : ""}>
                                {isLive ? "LIVE NOW" : "Scheduled"}
                            </Badge>
                            <Button variant="ghost" size="icon" className="h-6 w-6 opacity-90 group-hover:opacity-100 transition" onClick={(e) => copyLink(e, session.id)}>
                                <Copy className="h-3 w-3 text-slate-400" />
                            </Button>
                        </div>
                        <CardTitle className="line-clamp-1 text-lg">{session.topic}</CardTitle>
                        <CardDescription className="flex items-center gap-2 text-xs">
                             Hosted by {session.host.name}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                            <Clock className="h-4 w-4" />
                            {format(new Date(session.scheduledAt), "MMM d, h:mm a")}
                        </div>
                        
                        <Button className="w-full gap-2" variant={isLive ? "default" : "secondary"}>
                           {isLive ? <Video className="h-4 w-4" /> : <Calendar className="h-4 w-4" />}
                           {isLive ? "Join Now" : "View Details"}
                        </Button>
                    </CardContent>
                  </Card>
                );
             })}
           </div>
        )}
      </div>

    </div>
  );
}