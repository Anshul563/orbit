"use client";

import { useState, useEffect } from "react";
import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  getNotifications,
  markAsRead,
  markAllRead,
} from "@/app/dashboard/notifications/actions"; // Ensure this path matches your project structure
import Pusher from "pusher-js";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Notification = {
  id: string;
  title: string;
  message: string | null;
  link: string | null;
  read: boolean | null;
  createdAt: Date | null;
  type: string | null;
};

export function NotificationButton({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // 1. Fetch initial data
  useEffect(() => {
    getNotifications().then((data) => {
      // Ensure date strings are converted to Date objects just in case
      const parsedData = data.map(n => ({
        ...n,
        createdAt: n.createdAt ? new Date(n.createdAt) : null
      }));
      setNotifications(parsedData);
      setUnreadCount(parsedData.filter((n) => !n.read).length);
    });
  }, []);

  // 2. Real-time Subscription
  useEffect(() => {
    if (!userId) return;

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe(`user-${userId}`);

    channel.bind("notification", (newNotif: any) => {
      setNotifications((prev) => [
        { ...newNotif, createdAt: new Date(newNotif.createdAt) },
        ...prev,
      ]);
      setUnreadCount((prev) => prev + 1);
      
      // Optional: Play a sound
      // new Audio('/sounds/ping.mp3').play().catch(() => {});
    });

    return () => {
      pusher.unsubscribe(`user-${userId}`);
    };
  }, [userId]);

  const handleMarkRead = async (id: string, link: string | null) => {
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    await markAsRead(id);

    if (link) {
      setOpen(false); // Close popover if navigating away
    }
  };

  const handleMarkAll = async () => {
    // Optimistic update
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
    await markAllRead();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-slate-600" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-600 ring-2 ring-white animate-pulse" />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between px-4 py-3 border-b bg-slate-50/50">
          <h4 className="font-semibold text-sm">Notifications</h4>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAll}
              className="text-xs text-blue-600 hover:underline flex items-center gap-1"
            >
              <Check className="h-3 w-3" /> Mark all read
            </button>
          )}
        </div>

        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-slate-500 text-sm">
              <Bell className="h-8 w-8 mb-2 opacity-20" />
              No notifications yet
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={cn(
                    "flex flex-col gap-1 p-4 border-b hover:bg-slate-50 transition cursor-pointer relative group",
                    !notif.read && "bg-blue-50/50"
                  )}
                  onClick={() =>
                    // Only trigger here if there is NO link, otherwise the Link component handles it
                    !notif.link && handleMarkRead(notif.id, null)
                  }
                >
                  <div className="flex justify-between items-start gap-2">
                    <span
                      className={cn(
                        "text-sm font-medium text-slate-900",
                        !notif.read && "font-bold"
                      )}
                    >
                      {notif.title}
                    </span>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">
                      {notif.createdAt
                        ? formatDistanceToNow(notif.createdAt, { addSuffix: true })
                        : "Just now"}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2">
                    {notif.message}
                  </p>

                  {/* Absolute Link Overlay */}
                  {notif.link && (
                    <Link
                      href={notif.link}
                      className="absolute inset-0 z-10"
                      onClick={(e) => {
                        // We mark as read, but allow default navigation behavior
                        handleMarkRead(notif.id, notif.link);
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}