'use client';

import React from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  BookOpen,  
} from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className, ...props }: SidebarProps) {
  const items = [
    {
      icon: BookOpen,
      label: "Notes",
    },
  ];

  return (
    <div className={cn("w-64 h-screen border-r bg-background", className)} {...props}>
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Notes portal</h2>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {items.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              className="w-full justify-start gap-3 text-left font-normal h-10"
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Button>
          ))}
        </nav>
      </div>
    </div>
  );
}
