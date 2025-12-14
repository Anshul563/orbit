"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  MessageSquare,
  Headphones,
  Briefcase,
  Settings,
  CreditCard,
  Users2Icon,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  MoreVertical,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AnimatedThemeToggler } from "./ui/animated-theme-toggler";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { LayoutPanelTopIcon } from "./icons/LayoutPanelTopIcon";
import { SearchIcon } from "./icons/SearchIcon";
import { UsersIcon } from "./icons/UsersIcon";
import { MessageSquareIcon } from "./icons/MessageSquareIcon";
import { WaypointsIcon } from "./icons/WaypointsIcon";
import { BookTextIcon } from "./icons/BookTextIcon";
import { GalleryVerticalEndIcon } from "./icons/GalleryVerticalEndIcon";

const sidebarItems = [
  { icon: LayoutPanelTopIcon, label: "Dashboard", href: "/dashboard" },
  { icon: SearchIcon, label: "Marketplace", href: "/dashboard/market" },
  { icon: WaypointsIcon, label: "Projects", href: "/dashboard/projects" },
  { icon: UsersIcon, label: "Communities", href: "/dashboard/community" },
  { icon: MessageSquareIcon, label: "Messages", href: "/dashboard/messages" },
  { icon: BookTextIcon, label: "Study Rooms", href: "/dashboard/study" },
];

interface AppSidebarProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
}

export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <TooltipProvider delayDuration={0}>
      <div
        className={cn(
          "relative flex h-screen flex-col border-r transition-all duration-300 ease-in-out",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* Toggle Button */}
        <div className="absolute -right-3 top-13 z-20">
          <Button
            variant="secondary"
            size="icon"
            className="h-6 w-6 rounded-sm border bg-accent dark:bg-card shadow-md"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <ChevronRight className="h-3 w-3 text-primary" />
            ) : (
              <ChevronLeft className="h-3 w-3 text-primary" />
            )}
          </Button>
        </div>

        {/* Logo Area */}
        <div
          className={cn(
            "flex h-16 items-center",
            isCollapsed ? "justify-center" : "px-6"
          )}
        >
          <div className="flex items-center font-display font-bold text-primary">
            <div className="flex items-center justify-center rounded-lg text-primary-foreground">
              <Image alt="logo" src={"/text.png"} width={80} height={80} />
            </div>
            {/* {!isCollapsed && <span className="text-2xl flex font-bold items-center bg-linear-to-t from-[#061c2d] to-[#184972] text-transparent bg-clip-text">rbit</span>} */}
          </div>
        </div>

        <Separator />

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1 p-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;

            return isCollapsed ? (
              // Collapsed View (Icons Only + Tooltip)
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link href={item.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      size="icon"
                      className={cn(
                        "h-10 w-10",
                        isActive &&
                          "bg-primary/10 text-primary hover:bg-primary/20"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="sr-only">{item.label}</span>
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="bg-popover text-popover-foreground"
                >
                  {item.label}
                </TooltipContent>
              </Tooltip>
            ) : (
              // Expanded View (Icon + Label)
              <Link key={item.href} href={item.href} className="block">
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3",
                    isActive &&
                      "bg-primary/10 text-primary hover:bg-primary/20 font-medium"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions (Wallet, etc.) */}
        <div className="p-2">
          {isCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/dashboard/wallet">
                  <Button variant="outline" size="icon" className="h-10 w-10">
                    <CreditCard className="h-4 w-4" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Wallet</TooltipContent>
            </Tooltip>
          ) : (
            <Link href="/dashboard/wallet">
              <Button
                variant="outline"
                className="w-full justify-start gap-3 border-dashed"
              >
                <GalleryVerticalEndIcon className="h-4 w-4" /> Wallet
              </Button>
            </Link>
          )}
        </div>

        <Separator />

        {/* User Profile Section */}
        <div className="p-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full p-2 hover:bg-accent",
                  isCollapsed ? "justify-center" : "justify-start"
                )}
              >
                <Avatar className="h-8 w-8 border">
                  <AvatarImage src={user.image || ""} alt={user.name} />
                  <AvatarFallback>
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {!isCollapsed && (
                  <div className="ml-3 flex flex-1 flex-col items-start text-left overflow-hidden">
                    <span className="text-sm font-medium truncate w-full">
                      {user.name}
                    </span>
                    <span className="text-xs text-muted-foreground truncate w-full">
                      {user.email}
                    </span>
                  </div>
                )}

                {!isCollapsed && (
                  <MoreVertical className="ml-2 h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-56"
              align="end"
              side={isCollapsed ? "right" : "top"}
            >
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href="/dashboard/settings">
                <DropdownMenuItem className="cursor-pointer gap-2">
                  <Settings className="h-4 w-4" /> Settings
                </DropdownMenuItem>
              </Link>
              <Link href="/dashboard/profile">
              <DropdownMenuItem className="cursor-pointer gap-2">
                <User className="h-4 w-4" /> Profile
              </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              {/* Theme Toggler inside menu for cleaner UI */}
              <div className="px-2 py-1.5 flex items-center justify-between">
                <span className="text-sm">Theme</span>
                <AnimatedThemeToggler />
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer gap-2 text-red-600 focus:text-red-600 focus:bg-red-50">
                <LogOut className="h-4 w-4" /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </TooltipProvider>
  );
}
