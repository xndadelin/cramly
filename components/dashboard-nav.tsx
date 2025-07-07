'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { FileText, BookOpen, Bot } from 'lucide-react';

export function DashboardNav() {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname?.startsWith(path);
  };
  
  return (
    <nav className="mb-4">
      <div className="space-y-1">
        <Link 
          href="/dashboard/notes"
          className={cn(
            "flex items-center py-2 px-3 text-sm font-medium",
            isActive('/dashboard/notes') 
              ? "bg-transparent font-medium border-l-2 border-black/30 dark:border-white/30" 
              : "text-foreground/60 hover:text-foreground hover:bg-transparent hover:border-l-2 hover:border-black/20 dark:hover:border-white/20"
          )}
        >
          <FileText className="h-4 w-4 mr-2" />
          Notes
        </Link>
        
        <Link 
          href="/dashboard/ai-tutor"
          className={cn(
            "flex items-center py-2 px-3 text-sm font-medium",
            isActive('/dashboard/ai-tutor') 
              ? "bg-transparent font-medium border-l-2 border-black/30 dark:border-white/30" 
              : "text-foreground/60 hover:text-foreground hover:bg-transparent hover:border-l-2 hover:border-black/20 dark:hover:border-white/20"
          )}
        >
          <Bot className="h-4 w-4 mr-2" />
          AI Tutor
        </Link>
        
        <Link 
          href="/dashboard/flashcards"
          className={cn(
            "flex items-center py-2 px-3 text-sm font-medium",
            isActive('/dashboard/flashcards') 
              ? "bg-transparent font-medium border-l-2 border-black/30 dark:border-white/30" 
              : "text-foreground/60 hover:text-foreground hover:bg-transparent hover:border-l-2 hover:border-black/20 dark:hover:border-white/20"
          )}
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Flashcards
        </Link>
      </div>
    </nav>
  );
}
