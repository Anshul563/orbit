"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, LogIn, Settings, Image as ImageIcon } from "lucide-react";
import { joinCommunity } from "./actions";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface CommunityProps {
  id: string;
  name: string;
  description: string;
  color: string | null;
  image: string | null; // Added image prop
  memberCount: number;
  members: { user: { image: string | null; name: string } }[];
  isMember: boolean;
  ownerId?: string;
}

export function CommunityCard({ 
  community, 
  currentUserId 
}: { 
  community: CommunityProps,
  currentUserId?: string 
}) {
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    setLoading(true);
    await joinCommunity(community.id);
    setLoading(false);
  };

  const canEdit = currentUserId ? community.ownerId === currentUserId : community.isMember;

  return (
    <Card className="flex flex-col h-full border overflow-hidden group hover:shadow-md transition-all duration-300">
      
      {/* 1. COVER IMAGE SECTION */}
      <div className="relative h-32 w-full overflow-hidden">
        {community.image ? (
          <img 
            src={community.image} 
            alt={community.name} 
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105" 
          />
        ) : (
          <div className={cn("h-full w-full flex items-center justify-center", community.color || "bg-blue-500")}>
             <ImageIcon className="h-10 w-10 text-white/50" />
          </div>
        )}

        {/* 2. OVERLAY SETTINGS BUTTON */}
        {canEdit && (
          <Link href={`/dashboard/community/${community.id}/settings`}>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-2 right-2 h-8 w-8 text-white hover:text-white bg-black/20 hover:bg-black/40 backdrop-blur-sm transition-all rounded-full"
            >
              <Settings className="h-4 w-4" />
              <span className="sr-only">Settings</span>
            </Button>
          </Link>
        )}
      </div>

      {/* HEADER */}
      <CardHeader className="pt-4 pb-2 px-4">
        <CardTitle className="text-lg font-bold line-clamp-1">
          {community.name}
        </CardTitle>
      </CardHeader>

      {/* CONTENT */}
      <CardContent className="flex-1 px-4 pb-4">
        <p className="text-sm text-slate-500 line-clamp-2 mb-4 min-h-[40px]">
          {community.description}
        </p>

        {/* Member Preview Avatars */}
        <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center -space-x-2 overflow-hidden py-1 pl-1">
            {community.members.slice(0, 5).map((m, i) => (
                <Avatar
                key={i}
                className="inline-block border-2 border-white h-7 w-7 ring-1 ring-slate-100"
                >
                <AvatarImage src={m.user.image || ""} />
                <AvatarFallback className="text-[9px] bg-slate-100 text-slate-500 font-bold">
                    {m.user.name.charAt(0)}
                </AvatarFallback>
                </Avatar>
            ))}
            {community.memberCount > 5 && (
                <div className="h-7 w-7 rounded-full border-2 border-white bg-slate-50 flex items-center justify-center text-[9px] font-bold text-slate-500 z-10 ring-1 ring-slate-100">
                +{community.memberCount - 5}
                </div>
            )}
            </div>
        </div>
      </CardContent>

      {/* FOOTER */}
      <CardFooter className="px-4 py-3 border-t flex justify-between items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <Users className="h-3.5 w-3.5" />
          <span>{community.memberCount} members</span>
        </div>

        {community.isMember ? (
          <Link
            href={`/dashboard/community/${community.id}`}
            className="flex-1 max-w-[120px]"
          >
            <Button variant="secondary" size="sm" className="w-full text-xs font-semibold">
              Open Chat
            </Button>
          </Link>
        ) : (
          <Button
            size="sm"
            onClick={handleJoin}
            disabled={loading}
            className="flex-1 max-w-[120px] bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
          >
            <LogIn className="h-3.5 w-3.5 mr-1.5" /> Join
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}