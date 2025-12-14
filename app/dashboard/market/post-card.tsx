"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  GraduationCap,
  ArrowRight,
  Share2,
  Eye,
  Check,
} from "lucide-react";
import { initiateSwap } from "./actions";
import { formatDistanceToNow } from "date-fns";
import { useTransition, useState } from "react";
import Link from "next/link";
// Optional: Use alert if you don't have sonner

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
  const [copied, setCopied] = useState(false);
  const isMyPost = post.authorId === currentUserId;

  const handleApply = () => {
    startTransition(async () => {
      await initiateSwap(post.id, post.authorId);
    });
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link click if wrapped
    const url = `${window.location.origin}/dashboard/market/${post.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    // toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card
      className="
        group relative flex flex-col h-full
        border border-border/50
        bg-card/80 backdrop-blur-sm
        shadow-sm hover:shadow-lg
        hover:-translate-y-0.5 transition-all duration-300 ease-in-out
        rounded-xl overflow-hidden
      "
    >
      {/* Subtle hover overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 rounded-xl pointer-events-none" />

      <CardHeader className="relative z-10 flex flex-row items-start gap-4 pb-3">
        <Avatar className="h-12 w-12 border border-border shadow-sm">
          <AvatarImage src={post.author.image || ""} />
          <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground font-semibold">
            {post.author.name.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent break-words leading-snug line-clamp-1">
              {post.title}
            </h3>
            <Badge
              variant={post.type === "request" ? "default" : "secondary"}
              className={`text-xs px-2 py-1 rounded-full shrink-0 ${
                post.type === "request"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {post.type === "request" ? "Request" : "Offer"}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center text-xs text-muted-foreground gap-2">
            <Link
              href={`/dashboard/user/${post.authorId}`}
              className="hover:underline"
            >
              <span className="font-medium">{post.author.name}</span>
            </Link>
            <span>•</span>
            <span className="flex items-center gap-1">
              <GraduationCap className="h-3 w-3" />
              {post.author.university || "Student"}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {post.createdAt
                ? formatDistanceToNow(new Date(post.createdAt))
                : "Just now"}{" "}
              ago
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative z-10 flex-1 text-sm text-muted-foreground pb-4">
        <p className="line-clamp-3 leading-relaxed">{post.description}</p>
      </CardContent>

      <CardFooter
        className="
          relative z-10 pt-3 flex flex-col gap-3
          border-t border-border/50 
          px-4 py-3
        "
      >
        {/* Top Row: Budget */}
        <div className="w-full flex justify-between items-center">
          <div className="font-semibold text-base bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-1">
            {post.budget ?? "0"}{" "}
            <span className="text-xs font-normal text-muted-foreground">
              Credits
            </span>
          </div>
        </div>

        {/* Bottom Row: Actions */}
        <div className="w-full flex items-center gap-2">
          {/* Share Button */}
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={handleShare}
            title="Share Post"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Share2 className="h-4 w-4" />
            )}
          </Button>

          {/* View Details Button */}
          <Link href={`/dashboard/market/${post.id}`} className="flex-1">
            <Button variant="secondary" className="w-full gap-2 h-9">
              <Eye className="h-4 w-4" /> View
            </Button>
          </Link>

          {/* Apply Button */}
          {isMyPost ? (
            <Button
              variant="ghost"
              size="sm"
              disabled
              className="cursor-not-allowed opacity-70 flex-1 h-9"
            >
              My Post
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleApply}
              disabled={isPending}
              className="
                flex-1 h-9
                gap-2 bg-primary text-primary-foreground 
                hover:bg-primary/90 transition-all duration-200 
                shadow-sm hover:shadow-md
                "
            >
              {isPending ? "..." : "Apply"} <ArrowRight className="h-3 w-3" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
