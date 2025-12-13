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
import { Users, LogIn } from "lucide-react";
import { joinCommunity } from "./actions";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface CommunityProps {
  id: string;
  name: string;
  description: string;
  color: string | null;
  memberCount: number;
  members: { user: { image: string | null; name: string } }[];
  isMember: boolean;
}

export function CommunityCard({ community }: { community: CommunityProps }) {
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    setLoading(true);
    await joinCommunity(community.id);
    setLoading(false); // Page will revalidate via server action
  };

  return (
    <Card className="flex flex-col h-full border hover:border-blue-300 transition-colors">

      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-start">
          <span className="text-xl font-bold line-clamp-1">
            {community.name}
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 pb-4">
        <p className="text-sm text-slate-500 line-clamp-3 mb-4 h-[60px]">
          {community.description}
        </p>

        {/* Member Preview Avatars */}
        <div className="flex items-center -space-x-2 overflow-hidden py-1">
          {community.members.slice(0, 5).map((m, i) => (
            <Avatar
              key={i}
              className="inline-block border-2 border-white h-8 w-8"
            >
              <AvatarImage src={m.user.image || ""} />
              <AvatarFallback className="text-[10px] bg-slate-200">
                {m.user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          ))}
          {community.memberCount > 5 && (
            <div className="h-8 w-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-xs font-medium text-slate-500 z-10">
              +{community.memberCount - 5}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0 flex justify-between items-center text-sm border-t p-4 ">
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4" />
          <span>{community.memberCount} members</span>
        </div>

        {community.isMember ? (
          <Link
            href={`/dashboard/community/${community.id}`}
            className="w-full"
          >
            <Button
              variant="secondary"
              className="w-full bg-green-100 text-green-700 hover:bg-green-200"
            >
              Open Chat
            </Button>
          </Link>
        ) : (
          <Button
            size="sm"
            onClick={handleJoin}
            disabled={loading}
            variant="outline"
            className="gap-2"
          >
            <LogIn className="h-4 w-4" /> Join
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
