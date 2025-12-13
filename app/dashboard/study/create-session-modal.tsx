"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Copy, Check, Calendar, Mail } from "lucide-react";
import { createStudySession } from "./actions";
// Assuming you have sonner, else use alert

export function CreateSessionModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"form" | "success">("form");
  const [createdId, setCreatedId] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      const res = await createStudySession(formData);
      if (res.success) {
        setCreatedId(res.sessionId);
        setStep("success");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const shareLink = `${typeof window !== "undefined" ? window.location.origin : ""}/dashboard/study?room=${createdId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setOpen(false);
    // Reset state after transition ends
    setTimeout(() => {
        setStep("form");
        setCreatedId("");
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4" /> Create Room
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        {step === "form" ? (
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Create Study Session</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="topic">Topic / Room Name</Label>
                <Input id="topic" name="topic" placeholder="e.g. Calculus Final Prep" required />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="date">Schedule (Optional)</Label>
                <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-500"/>
                    <Input 
                        id="date" 
                        name="date" 
                        type="datetime-local" 
                        className="pl-9" 
                    />
                </div>
                <p className="text-[10px] text-slate-500">Leave blank to start immediately.</p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="emails">Invite Friends (Emails)</Label>
                <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500"/>
                    <Input 
                        id="emails" 
                        name="emails" 
                        placeholder="alice@mit.edu, bob@stanford.edu" 
                        className="pl-9"
                    />
                </div>
                <p className="text-[10px] text-slate-500">Comma separated emails.</p>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create & Get Link"}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="space-y-6 py-4">
             <div className="text-center space-y-2">
                <div className="h-12 w-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Check className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-bold">Room Created!</h2>
                <p className="text-slate-500 text-sm">Your session is ready. Share the link below.</p>
             </div>

             <div className="flex items-center space-x-2">
                <div className="grid flex-1 gap-2">
                    <Label htmlFor="link" className="sr-only">Link</Label>
                    <Input id="link" value={shareLink} readOnly className="bg-slate-50" />
                </div>
                <Button size="icon" onClick={copyToClipboard} variant="outline">
                    {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </Button>
             </div>

             <Button className="w-full" onClick={handleClose}>Done</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}