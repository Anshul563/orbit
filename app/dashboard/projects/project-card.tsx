"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MessageSquare, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";
import { completeProject } from "./actions";
import { useTransition } from "react";

interface ProjectCardProps {
  project: any;
  currentUserId: string;
}

export function ProjectCard({ project, currentUserId }: ProjectCardProps) {
  const [isPending, startTransition] = useTransition();

  const isRequester = project.requesterId === currentUserId;
  const otherUser = isRequester ? project.provider : project.requester;
  const role = isRequester ? "Employer" : "Freelancer";

  const handleComplete = () => {
    startTransition(async () => {
      const res = await completeProject(project.id);
      if (res.error) {
        // Use toast.error(res.error) if you have Sonner, else:
        alert(res.error); 
      } else {
        // Use toast.success(...) if you have Sonner
        alert("Success! Payment transferred."); 
      }
    });
  };

  return (
    <Card className="flex flex-col h-full border hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <Badge 
            variant={project.status === "completed" ? "secondary" : "default"}
            className={project.status === "completed" ? "bg-green-100 text-green-700" : "bg-blue-600"}
          >
            {project.status === "completed" ? "Completed" : "In Progress"}
          </Badge>
          <span className="text-xs font-mono text-slate-400">ID: {project.id.slice(0,6)}</span>
        </div>
        <h3 className="font-bold text-lg line-clamp-1">{project.post.title}</h3>
        <p className="text-sm text-slate-500">
          Role: <span className="font-medium text-slate-400">{role}</span>
        </p>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        {/* Counterparty Info */}
        <div className="flex items-center gap-3 p-3 rounded-lg border">
          <Avatar className="h-10 w-10">
            <AvatarImage src={otherUser.image || ""} />
            <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="overflow-hidden">
            <p className="text-xs text-slate-500">Working with</p>
            <p className="font-medium text-sm truncate">{otherUser.name}</p>
          </div>
        </div>

        {/* Payment Details */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-500">Agreed Price</span>
          <span className="font-bold text-lg">{project.price} <span className="text-xs font-normal">Credits</span></span>
        </div>
      </CardContent>

      <CardFooter className="pt-0 flex gap-2 border-t p-4">
        <Link href="/dashboard/messages" className="flex-1">
          <Button variant="outline" className="w-full gap-2">
            <MessageSquare className="h-4 w-4" /> Chat
          </Button>
        </Link>
        
        {project.status !== "completed" && isRequester && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="flex-1 bg-green-600 hover:bg-green-700 gap-2">
                <CheckCircle className="h-4 w-4" /> Pay & Finish
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Release Payment?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will mark the project as complete and permanently transfer <span className="font-bold text-slate-900">{project.price} credits</span> to {otherUser.name}.
                  <br /><br />
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleComplete} disabled={isPending} className="bg-green-600 hover:bg-green-700">
                  {isPending ? "Processing..." : "Confirm Transfer"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {project.status !== "completed" && !isRequester && (
          <Button variant="secondary" className="flex-1 cursor-not-allowed opacity-70" disabled>
            <Clock className="h-4 w-4 mr-2" /> Awaiting Payment
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}