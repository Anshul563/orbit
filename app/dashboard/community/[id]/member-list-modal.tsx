"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Search, Crown } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Member {
  userId: string;
  joinedAt: Date | null;
  user: {
    id: string;
    name: string;
    image: string | null;
    email: string;
  };
}

interface MemberListModalProps {
  members: Member[];
  ownerId: string;
}

export function MemberListModal({ members, ownerId }: MemberListModalProps) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  // Filter members based on search input
  const filteredMembers = members.filter((m) =>
    m.user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Users className="h-4 w-4" />{members.length} Members
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Community Members ({members.length})</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Search members..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Member List */}
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-3">
              {filteredMembers.length === 0 ? (
                <p className="text-center text-sm text-slate-500 py-4">
                  No members found.
                </p>
              ) : (
                filteredMembers.map((member) => {
                  const isOwner = member.user.id === ownerId;
                  
                  return (
                    <div
                      key={member.userId}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border">
                          <AvatarImage src={member.user.image || ""} />
                          <AvatarFallback>
                            {member.user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <span className="font-medium text-sm text-slate-900">
                              {member.user.name}
                            </span>
                            {/* Admin Badge */}
                            {isOwner && (
                              <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-yellow-100 text-[10px] font-bold text-yellow-700 border border-yellow-200">
                                <Crown className="h-3 w-3" /> Admin
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-500">
                            {member.user.email}
                          </span>
                        </div>
                      </div>
                      
                      <span className="text-[10px] text-slate-400">
                        {new Date(member.joinedAt || new Date()).toLocaleDateString()}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}