"use client";

import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, MoreVertical, Phone, Video, PhoneIncoming, ArrowLeft } from "lucide-react"; // Added ArrowLeft
import { cn } from "@/lib/utils";
import Pusher from "pusher-js";
import { getMessages, sendMessage, sendCallNotification } from "./actions";
import { format } from "date-fns";
import { CallInterface } from "./call-interface";

// Types
type Conversation = {
  id: string;
  post: { title: string } | null;
  otherUser: { name: string; image: string | null };
};

type Message = {
  id: string;
  content: string;
  senderId: string;
  createdAt: Date | null;
  sender?: { name: string; image: string | null };
  callType?: "audio" | "video";
};

export function ChatInterface({ 
  conversations, 
  currentUserId 
}: { 
  conversations: Conversation[]; 
  currentUserId: string 
}) {
  // Initialize with the first conversation, but on mobile this puts you in chat view immediately.
  // The Back button allows navigation back to the list.
  const [selectedSwap, setSelectedSwap] = useState<Conversation | null>(conversations[0] || null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Call State
  const [isInCall, setIsInCall] = useState(false);
  const [isVideoCall, setIsVideoCall] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. Fetch Messages
  useEffect(() => {
    if (!selectedSwap) return;
    setLoading(true);
    // Reset call state when switching chats
    setIsInCall(false); 

    getMessages(selectedSwap.id).then((data) => {
      setMessages(data);
      setLoading(false);
    });
  }, [selectedSwap]);

  // 2. Pusher Subscription
  useEffect(() => {
    if (!selectedSwap) return;

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe(`swap-${selectedSwap.id}`);

    // Standard Messages
    channel.bind("incoming-message", (newMessage: any) => {
      setMessages((prev) => {
        if (prev.find(m => m.id === newMessage.id)) return prev;
        return [...prev, { ...newMessage, createdAt: new Date(newMessage.createdAt) }];
      });
    });

    // Call Notifications
    channel.bind("incoming-call", (callEvent: any) => {
       setMessages((prev) => {
         if (prev.find(m => m.id === callEvent.id)) return prev;
         return [...prev, { 
             ...callEvent, 
             createdAt: new Date(callEvent.createdAt) 
         }];
       });
    });

    return () => {
      pusher.unsubscribe(`swap-${selectedSwap.id}`);
    };
  }, [selectedSwap]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !selectedSwap) return;

    const tempId = Math.random().toString();
    const tempContent = input;
    
    setMessages(prev => [...prev, {
        id: tempId,
        content: tempContent,
        senderId: currentUserId,
        createdAt: new Date(),
    }]);
    setInput("");

    await sendMessage(selectedSwap.id, tempContent);
  };

  const startCall = async (video: boolean) => {
      if (!selectedSwap) return;
      setIsVideoCall(video);
      setIsInCall(true);

      // Notify other user via chat system
      await sendCallNotification(selectedSwap.id, video ? "video" : "audio");
  };

  const joinCall = (video: boolean) => {
      setIsVideoCall(video);
      setIsInCall(true);
  };

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4 text-slate-500">
        No active chats. Start a Swap in the Marketplace!
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-120px)] border rounded-xl overflow-hidden shadow-sm relative bg-white">
      
      {/* --- ACTIVE CALL OVERLAY --- */}
      {isInCall && selectedSwap && (
          <CallInterface 
            swapId={selectedSwap.id} 
            video={isVideoCall} 
            onLeave={() => setIsInCall(false)} 
          />
      )}

      {/* SIDEBAR: CONVERSATION LIST */}
      {/* Logic: Hidden on mobile if a chat is selected. Visible on desktop always. */}
      <div className={cn(
        "flex-col border-r h-full bg-slate-50",
        selectedSwap ? "hidden md:flex w-full md:w-80" : "flex w-full md:w-80"
      )}>
        <div className="p-4 border-b font-semibold text-slate-700">Messages</div>
        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-1 p-2">
            {conversations.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setSelectedSwap(chat)}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg text-left transition hover:bg-slate-200/50",
                  selectedSwap?.id === chat.id && "bg-blue-50 border-blue-200 border"
                )}
              >
                <Avatar>
                  <AvatarImage src={chat.otherUser.image || ""} />
                  <AvatarFallback>{chat.otherUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="overflow-hidden">
                  <p className="font-medium text-sm truncate">{chat.otherUser.name}</p>
                  <p className="text-xs text-slate-500 truncate">{chat.post?.title || "Project"}</p>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* MAIN CHAT WINDOW */}
      {/* Logic: Hidden on mobile if NO chat is selected. Visible on desktop always. */}
      <div className={cn(
        "flex-col h-full",
        !selectedSwap ? "hidden md:flex md:flex-1 items-center justify-center bg-slate-50" : "flex w-full md:flex-1"
      )}>
        
        {!selectedSwap ? (
            /* Desktop Empty State */
            <div className="text-slate-400 text-sm">Select a conversation to start chatting</div>
        ) : (
          /* Active Chat View */
          <>
            <div className="p-4 border-b flex justify-between items-center bg-white z-10">
              <div className="flex items-center gap-3">
                {/* Back Button (Mobile Only) */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden -ml-2" 
                  onClick={() => setSelectedSwap(null)}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>

                <Avatar className="h-9 w-9">
                  <AvatarImage src={selectedSwap.otherUser.image || ""} />
                  <AvatarFallback>{selectedSwap.otherUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-sm">{selectedSwap.otherUser.name}</h3>
                  <p className="text-xs text-slate-500 max-w-[120px] md:max-w-none truncate">
                    Working on: {selectedSwap.post?.title}
                  </p>
                </div>
              </div>
              
              {/* CALL BUTTONS */}
              <div className="flex gap-1 md:gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => startCall(false)}
                  title="Voice Call"
                >
                  <Phone className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => startCall(true)}
                  title="Video Call"
                >
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
              </div>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50" ref={scrollRef}>
              {loading ? (
                <p className="text-center text-sm text-slate-400 mt-10">Loading history...</p>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.senderId === currentUserId;
                  const isCallMsg = msg.content.includes("Started a"); 
                  
                  return (
                    <div key={msg.id} className={cn("flex w-full", isMe ? "justify-end" : "justify-start")}>
                      <div className={cn(
                        "max-w-[75%] md:max-w-[70%] rounded-2xl px-4 py-2 text-sm shadow-sm",
                        isCallMsg 
                          ? "bg-slate-800 text-white border-none"
                          : isMe 
                            ? "bg-blue-600 text-white rounded-br-none" 
                            : "bg-white border text-slate-800 rounded-bl-none"
                      )}>
                        
                        {isCallMsg ? (
                          <div className="flex flex-col items-center gap-2 py-2">
                            <p className="font-semibold">{msg.content}</p>
                            {!isMe && (
                              <Button 
                                  size="sm" 
                                  variant="secondary" 
                                  className="w-full bg-green-500 hover:bg-green-600 text-white border-none"
                                  onClick={() => joinCall(msg.content.includes("Video"))}
                              >
                                  <PhoneIncoming className="h-3 w-3 mr-2" /> Join Call
                              </Button>
                            )}
                            {isMe && <span className="text-xs opacity-70">(Click call button to rejoin)</span>}
                          </div>
                        ) : (
                          <p>{msg.content}</p>
                        )}

                        <span className={cn(
                          "text-[10px] block text-right mt-1", 
                          isMe ? "text-blue-200" : "text-slate-400"
                        )}>
                          {msg.createdAt ? format(new Date(msg.createdAt), "h:mm a") : "Sending..."}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-4 bg-white border-t">
              <form onSubmit={handleSend} className="flex gap-2">
                <Input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1"
                />
                <Button type="submit" size="icon" disabled={!input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        )}

      </div>
    </div>
  );
}