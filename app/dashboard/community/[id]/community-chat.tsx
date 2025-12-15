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
import { UploadButton } from "@/lib/uploadthing";
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
  const [attachment, setAttachment] = useState<{
    url: string;
    type: string;
    name: string;
  } | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getCommunityMessages(communityId)
      .then((data) => {
        setMessages(data);
        setLoading(false);
      })
      .catch(console.error);
  }, [communityId]);

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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !attachment) return;

    const tempContent = input;
    const tempAttachment = attachment;

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
    <div className="flex flex-col flex-1 min-h-0 border border-border rounded-lg overflow-hidden bg-background">
      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-muted-foreground mt-20">
            <p>No messages yet. Say hello! 👋</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUserId;
            return (
              <div
                key={msg.id}
                className={cn("flex gap-3", isMe && "flex-row-reverse")}
              >
                {!isMe && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarImage src={msg.sender.image || ""} />
                    <AvatarFallback>{msg.sender.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={cn(
                    "flex flex-col max-w-[70%]",
                    isMe && "items-end"
                  )}
                >
                  {!isMe && (
                    <span className="text-[10px] text-muted-foreground ml-1">
                      {msg.sender.name}
                    </span>
                  )}

                  <div
                    className={cn(
                      "p-3 rounded-2xl text-sm shadow-sm overflow-hidden border",
                      isMe
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "bg-muted text-foreground rounded-tl-none"
                    )}
                  >
                    {/* Attachment */}
                    {msg.attachmentUrl && (
                      <div className="mb-2">
                        {msg.attachmentType === "image" ? (
                          <div className="relative w-full max-w-[240px] aspect-video rounded-md overflow-hidden border border-border/50">
                            <Image
                              src={msg.attachmentUrl}
                              alt="attachment"
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : msg.attachmentType === "video" ? (
                          <video
                            src={msg.attachmentUrl}
                            controls
                            className="w-full max-w-[240px] rounded-md border border-border"
                          />
                        ) : (
                          <a
                            href={msg.attachmentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-2 rounded-md bg-background/20 backdrop-blur-sm border border-white/10 hover:bg-background/30 transition-colors w-full max-w-[240px]"
                          >
                            <div className="p-2 rounded-full bg-white/20">
                              <FileText className="h-4 w-4" />
                            </div>
                            <div className="flex flex-col overflow-hidden">
                              <span className="text-xs font-medium truncate">
                                Attachment
                              </span>
                              <span className="text-[10px] opacity-80 uppercase">
                                {msg.attachmentType || "FILE"}
                              </span>
                            </div>
                          </a>
                        )}
                      </div>
                    )}

                    {msg.content && <p>{msg.content}</p>}
                  </div>

                  <span className="text-[10px] text-muted-foreground mt-1 mx-1">
                    {msg.createdAt
                      ? format(new Date(msg.createdAt), "h:mm a")
                      : "..."}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input */}
      <div className="border-t border-border p-3 bg-background">
        {attachment && (
          <div className="flex items-center gap-2 mb-2 p-2 rounded-md border border-border bg-muted w-fit">
            <span className="text-xs text-primary font-medium truncate max-w-[200px]">
              {attachment.name}
            </span>
            <button
              type="button"
              onClick={() => setAttachment(null)}
              className="text-muted-foreground hover:text-destructive transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <form onSubmit={handleSend} className="flex gap-2 items-center">
          <UploadButton
            endpoint="chatAttachment"
            appearance={{
              button:
                "text-muted-foreground bg-muted hover:bg-muted/70 h-9 px-3 text-sm font-medium rounded-md ut-uploading:cursor-not-allowed",
              allowedContent: "hidden",
            }}
            content={{
              button({ ready }) {
                return ready ? (
                  <Paperclip className="h-4 w-4" />
                ) : (
                  <Loader2 className="h-3 w-3 animate-spin" />
                );
              },
            }}
            onClientUploadComplete={(res) => {
              if (res && res[0]) {
                const file = res[0];
                let type = "file";
                if (file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i))
                  type = "image";
                else if (file.name.match(/\.(mp4|webm)$/i)) type = "video";
                else if (file.name.match(/\.pdf$/i)) type = "pdf";
                setAttachment({ url: file.url, type, name: file.name });
              }
            }}
            onUploadError={(error: Error) =>
              alert(`Upload failed: ${error.message}`)
            }
          />

          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              attachment ? "Add a caption..." : "Message the group..."
            }
            className="flex-1"
          />
          <Button
            type="submit"
            size="icon"
            variant="default"
            disabled={!input.trim() && !attachment}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
