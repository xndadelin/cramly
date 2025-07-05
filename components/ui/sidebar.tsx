'use client';

import React from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  BookOpen,
  FilePlus,
  FolderPlus
} from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className, ...props }: SidebarProps) {
  const items = [
    {
      icon: BookOpen,
      label: "Notes",
      active: true,
    },
  ];

  return (
    <div className={cn("w-64 h-screen border-r bg-background flex-shrink-0 overflow-hidden", className)} {...props}>
      <div className="flex flex-col h-full overflow-hidden">
        <div className="p-4 border-b flex-shrink-0">
          <h2 className="text-lg font-semibold">Notes portal</h2>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {items.map((item, index) => (
            <Link href="/studies" key={index}>
              <Button
                variant={item.active ? "secondary" : "ghost"}
                className="w-full justify-start gap-3 text-left font-normal h-10"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Button>
            </Link>
          ))}
        </nav>
        <div className="border-t p-4 flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Quick actions</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              <FilePlus className="h-4 w-4 mr-2" />
              New note
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <FolderPlus className="h-4 w-4 mr-2" />
              New folder
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
