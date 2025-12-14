import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { db } from "@/db";
import { post } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Clock,
  GraduationCap,
  DollarSign,
  Briefcase,
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ApplyButton } from "./apply-button";

export default async function PostDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const postId = resolvedParams.id;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return redirect("/");

  const postData = await db.query.post.findFirst({
    where: eq(post.id, postId),
    with: {
      author: true,
    },
  });

  if (!postData) return notFound();

  return (
    <div className="max-w-3xl mx-auto overflow-hidden">
      {/* Header Section */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-border/50">
        <Link href="/dashboard/market" className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="gap-2 pl-0 hover:bg-transparent hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Market
          </Button>
        </Link>

        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Badge
            variant={postData.type === "request" ? "default" : "secondary"}
            className="text-xs px-2 py-1"
          >
            {postData.type === "request" ? "Requesting Help" : "Offering Help"}
          </Badge>
          <span>
            • Posted{" "}
            {formatDistanceToNow(new Date(postData.createdAt || new Date()))}{" "}
            ago
          </span>
        </div>
      </div>

      {/* Main Content */}
      <CardHeader className="pb-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <h1 className="text-2xl font-bold text-foreground break-words flex-1">
            {postData.title}
          </h1>

          <div className="text-right min-w-[120px]">
            <div className="text-2xl font-bold text-primary flex items-center justify-end gap-1">
              {postData.budget}{" "}
              <span className="text-sm font-normal text-muted-foreground">
                Credits
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-4">
          <Avatar className="h-10 w-10 border border-border">
            <AvatarImage src={postData.author.image || ""} />
            <AvatarFallback>{postData.author.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div>
            <p className="text-sm font-medium text-foreground">
              {postData.author.name}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <GraduationCap className="h-3 w-3" />
              {postData.author.university || "University Student"}
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Description */}
      <CardContent className="px-6 md:px-8 py-6 space-y-6">
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-muted-foreground" /> Description
          </h3>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {postData.description}
          </p>
        </div>

        <Separator />

        {/* Additional Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground block mb-1">
              Budget / Price
            </span>
            <span className="font-medium flex items-center gap-1">
              <DollarSign className="h-4 w-4 text-primary" /> {postData.budget}{" "}
              Credits
            </span>
          </div>

          <div>
            <span className="text-muted-foreground block mb-1">Timeline</span>
            <span className="font-medium flex items-center gap-1">
              <Clock className="h-4 w-4 text-secondary" /> Open / Active
            </span>
          </div>
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="border-t border-border/50 px-6 py-4 flex justify-end">
        <ApplyButton
          postId={postData.id}
          authorId={postData.authorId}
          currentUserId={session.user.id}
        />
      </CardFooter>
    </div>
  );
}
