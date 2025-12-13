"use client";

import { useEffect, useRef, useState } from "react";
import Pusher from "pusher-js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2, Paperclip, X, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCommunityMessages, sendCommunityMessage } from "./actions";
import { format } from "date-fns";
import { UploadButton } from "@/lib/uploadthing"; // Ensure you created this file
import Image from "next/image";

interface ChatProps {
  communityId: string;
  currentUserId: string;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  attachmentUrl?: string | null;
  attachmentType?: string | null;
  createdAt: Date | null;
  sender: { name: string; image: string | null };
}

export function CommunityChat({ communityId, currentUserId }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Staging state for file uploads before sending
  const [attachment, setAttachment] = useState<{ url: string; type: string; name: string } | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. Initial Fetch
  useEffect(() => {
    getCommunityMessages(communityId)
      .then((data) => {
        setMessages(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, [communityId]);

  // 2. Realtime Subscription
  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe(`community-${communityId}`);

    channel.bind("new-message", (data: any) => {
      setMessages((prev) => {
        if (prev.find((m) => m.id === data.id)) return prev;
        return [...prev, { ...data, createdAt: new Date(data.createdAt) }];
      });
    });

    return () => {
      pusher.unsubscribe(`community-${communityId}`);
    };
  }, [communityId]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    // Don't send if both input and attachment are empty
    if (!input.trim() && !attachment) return;

    const tempContent = input;
    const tempAttachment = attachment;

    // Reset UI immediately (Optimistic reset)
    setInput("");
    setAttachment(null);

    await sendCommunityMessage(
      communityId, 
      tempContent, 
      tempAttachment?.url, 
      tempAttachment?.type
    );
  };

  return (
    <div className="flex flex-col h-[600px] border rounded-lg bg-slate-50 overflow-hidden">
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-slate-400 mt-20">
            <p>No messages yet. Say hello! 👋</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUserId;
            return (
              <div key={msg.id} className={cn("flex gap-3", isMe ? "flex-row-reverse" : "flex-row")}>
                {!isMe && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarImage src={msg.sender.image || ""} />
                    <AvatarFallback>{msg.sender.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                
                <div className={cn("flex flex-col max-w-[70%]", isMe && "items-end")}>
                  {!isMe && <span className="text-[10px] text-slate-500 ml-1">{msg.sender.name}</span>}
                  
                  <div className={cn(
                    "p-3 rounded-2xl text-sm shadow-sm overflow-hidden",
                    isMe ? "bg-blue-600 text-white rounded-tr-none" : "bg-white text-slate-800 rounded-tl-none"
                  )}>
                    
                    {/* ATTACHMENT RENDERING */}
                    {msg.attachmentUrl && (
                      <div className="mb-2">
                        {msg.attachmentType === "image" ? (
                          <div className="relative w-48 h-32 rounded-lg overflow-hidden border bg-black/10">
                             <Image 
                               src={msg.attachmentUrl} 
                               alt="attachment" 
                               fill 
                               className="object-cover" 
                             />
                          </div>
                        ) : msg.attachmentType === "video" ? (
                          <video src={msg.attachmentUrl} controls className="w-64 rounded-lg bg-black" />
                        ) : (
                          <a 
                            href={msg.attachmentUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-slate-100 text-slate-800 p-2 rounded-md hover:bg-slate-200 transition border"
                          >
                            <FileText className="h-4 w-4 text-blue-500" />
                            <span className="underline decoration-blue-500 underline-offset-2">Download PDF</span>
                          </a>
                        )}
                      </div>
                    )}

                    {/* TEXT CONTENT */}
                    {msg.content && <p>{msg.content}</p>}
                  </div>

                  <span className="text-[10px] text-slate-400 mt-1 mx-1">
                     {msg.createdAt ? format(new Date(msg.createdAt), "h:mm a") : "..."}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white border-t p-3">
        
        {/* Attachment Staging (Preview) */}
        {attachment && (
           <div className="flex items-center gap-2 mb-2 p-2 bg-slate-50 rounded-md border w-fit">
              <span className="text-xs text-blue-600 font-medium truncate max-w-[200px]">
                {attachment.name}
              </span>
              <button 
                type="button"
                onClick={() => setAttachment(null)} 
                className="text-slate-400 hover:text-red-500 transition"
              >
                <X className="h-4 w-4" />
              </button>
           </div>
        )}

        <form onSubmit={handleSend} className="flex gap-2 items-center">
          
          {/* UPLOAD BUTTON */}
          <div className="shrink-0">
             <UploadButton
                endpoint="chatAttachment"
                appearance={{
                  button: "bg-slate-100 text-slate-600 hover:bg-slate-200 h-9 px-3 text-sm font-medium rounded-md ut-uploading:cursor-not-allowed",
                  allowedContent: "hidden" 
                }}
                content={{
                  button({ ready }) {
                    if (ready) return <Paperclip className="h-4 w-4" />;
                    return <Loader2 className="h-3 w-3 animate-spin" />
                  }
                }}
                onClientUploadComplete={(res) => {
                  if (res && res[0]) {
                    const file = res[0];
                    let type = "file";
                    if (file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)) type = "image";
                    else if (file.name.match(/\.(mp4|webm)$/i)) type = "video";
                    else if (file.name.match(/\.pdf$/i)) type = "pdf";

                    setAttachment({ url: file.url, type, name: file.name });
                  }
                }}
                onUploadError={(error: Error) => {
                  alert(`Upload failed: ${error.message}`);
                }}
             />
          </div>

          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={attachment ? "Add a caption..." : "Message the group..."}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!input.trim() && !attachment}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}