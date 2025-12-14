"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useTransition } from "react";
import { initiateSwap } from "../actions"; // Import from the parent actions file

export function ApplyButton({ postId, authorId, currentUserId }: { postId: string, authorId: string, currentUserId: string }) {
  const [isPending, startTransition] = useTransition();
  const isMyPost = authorId === currentUserId;

  const handleApply = () => {
    startTransition(async () => {
      await initiateSwap(postId, authorId);
    });
  };

  if (isMyPost) {
    return <Button disabled variant="outline">This is your post</Button>;
  }

  return (
    <Button 
      size="lg" 
      onClick={handleApply} 
      disabled={isPending}
      className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto"
    >
      {isPending ? "Connecting..." : "Apply & Chat Now"} <ArrowRight className="h-4 w-4 ml-2" />
    </Button>
  );
}