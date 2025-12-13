"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, GraduationCap, ArrowRight } from "lucide-react";
import { initiateSwap } from "./actions";
import { formatDistanceToNow } from "date-fns";
import { useTransition } from "react";

interface PostProps {
  post: {
    id: string;
    title: string;
    description: string;
    budget: number | null;
    type: "request" | "offer" | string;
    createdAt: Date | null;
    author: {
      name: string;
      image: string | null;
      university: string | null;
    };
    authorId: string;
  };
  currentUserId: string;
}

export function PostCard({ post, currentUserId }: PostProps) {
  const [isPending, startTransition] = useTransition();
  const isMyPost = post.authorId === currentUserId;

  const handleApply = () => {
    startTransition(async () => {
      await initiateSwap(post.id, post.authorId);
    });
  };

  return (
    <Card className="flex flex-col h-full hover:border-blue-300 transition-colors">
      <CardHeader className="flex flex-row items-start gap-4 pb-3">
        <Avatar className="h-10 w-10 border">
          <AvatarImage src={post.author.image || ""} />
          <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-base line-clamp-1">{post.title}</h3>
            <Badge variant={post.type === "request" ? "default" : "secondary"}>
              {post.type === "request" ? "Request" : "Offer"}
            </Badge>
          </div>
          <div className="flex items-center text-xs text-slate-500 gap-2">
            <span>{post.author.name}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <GraduationCap className="h-3 w-3" />
              {post.author.university || "Student"}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {post.createdAt ? formatDistanceToNow(new Date(post.createdAt)) : "Just now"} ago
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 text-sm text-slate-600 pb-4">
        <p className="line-clamp-3">{post.description}</p>
      </CardContent>

      <CardFooter className="pt-0 flex items-center justify-between border-t p-4 bg-card">
        <div className="font-bold text-blue-600 flex items-center gap-1">
          {post.budget} <span className="text-xs font-normal text-slate-500">Credits</span>
        </div>
        
        {isMyPost ? (
          <Button variant="outline" size="sm" disabled>
            My Post
          </Button>
        ) : (
          <Button 
            size="sm" 
            onClick={handleApply} 
            disabled={isPending}
            className="gap-2 bg-card text-white hover:bg-slate-800"
          >
            {isPending ? "Connecting..." : "Apply / Chat"} <ArrowRight className="h-3 w-3" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}