"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, redirect } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  CreditCard,
  LogOut,
  MoreVertical,
  Settings,
  User,
  Menu,
  X,
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
import { authClient } from "@/lib/auth-client";

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

const handleLogout = async () => {
  await authClient.signOut();
  redirect("/");
};

export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  // Automatically close sidebar when resizing back to desktop
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setIsMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <TooltipProvider delayDuration={0}>
      {/* MOBILE HEADER */}
      <div className="md:hidden fixed top-0 left-0 z-50 w-full bg-background border-b flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2">
          <Image src="/text.png" alt="logo" width={40} height={40} />
          <span className="font-bold text-primary">Orbit</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* SIDEBAR (Desktop + Mobile) */}
      <div
        className={cn(
          "fixed md:static z-40 top-0 left-0 h-screen flex flex-col border-r bg-background transition-all duration-300 ease-in-out",
          isCollapsed ? "w-16" : "w-64",
          // Mobile slide-in logic
          "md:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
          "md:flex"
        )}
      >
        {/* Collapse toggle (Desktop only) */}
        <div className="hidden md:block absolute -right-3 top-14 z-20">
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
            "flex h-16 items-center border-b",
            isCollapsed ? "justify-center" : "px-6"
          )}
        >
          <div className="flex items-center font-bold text-primary">
            <Image alt="logo" src="/text.png" width={80} height={80} />
          </div>
        </div>

        <Separator />

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;

            return isCollapsed ? (
              // Collapsed View
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link href={item.href} onClick={() => setIsMobileOpen(false)}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      size="icon"
                      className={cn(
                        "h-10 w-10",
                        isActive && "bg-primary/10 text-primary hover:bg-primary/20"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="sr-only">{item.label}</span>
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            ) : (
              // Expanded View
              <Link
                key={item.href}
                href={item.href}
                className="block"
                onClick={() => setIsMobileOpen(false)}
              >
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

        {/* Wallet */}
        <div className="p-2 border-t">
          {isCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/dashboard/wallet" onClick={() => setIsMobileOpen(false)}>
                  <Button variant="outline" size="icon" className="h-10 w-10">
                    <CreditCard className="h-4 w-4" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Wallet</TooltipContent>
            </Tooltip>
          ) : (
            <Link href="/dashboard/wallet" onClick={() => setIsMobileOpen(false)}>
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

        {/* User Profile */}
        <div className="p-3 border-t">
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
                  <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>

                {!isCollapsed && (
                  <div className="ml-3 flex flex-1 flex-col items-start text-left overflow-hidden">
                    <span className="text-sm font-medium truncate w-full">{user.name}</span>
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
              <Link href="/dashboard/settings" onClick={() => setIsMobileOpen(false)}>
                <DropdownMenuItem className="cursor-pointer gap-2">
                  <Settings className="h-4 w-4" /> Settings
                </DropdownMenuItem>
              </Link>
              <Link href="/dashboard/profile" onClick={() => setIsMobileOpen(false)}>
                <DropdownMenuItem className="cursor-pointer gap-2">
                  <User className="h-4 w-4" /> Profile
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <div className="px-2 py-1.5 flex items-center justify-between">
                <span className="text-sm">Theme</span>
                <AnimatedThemeToggler />
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer gap-2 text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <LogOut className="h-4 w-4" /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* BACKDROP for Mobile */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
        />
      )}
    </TooltipProvider>
  );
}
