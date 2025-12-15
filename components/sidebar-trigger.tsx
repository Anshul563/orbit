"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, PanelLeft } from "lucide-react";
import { useSidebar } from "./sidebar-provider";

export function SidebarTrigger() {
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
      className="hidden md:flex ml-2"
    >
      <PanelLeft className="h-5 w-5" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}
