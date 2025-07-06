'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { FileText, BookOpen } from 'lucide-react';

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
            "flex items-center py-2 px-3 text-sm font-medium rounded-md",
            isActive('/dashboard/notes') 
              ? "bg-primary/10 text-primary" 
              : "text-foreground/60 hover:text-foreground hover:bg-muted"
          )}
        >
          <FileText className="h-4 w-4 mr-2" />
          Notes
        </Link>
        
        <Link 
          href="/dashboard/flashcards"
          className={cn(
            "flex items-center py-2 px-3 text-sm font-medium rounded-md",
            isActive('/dashboard/flashcards') 
              ? "bg-primary/10 text-primary" 
              : "text-foreground/60 hover:text-foreground hover:bg-muted"
          )}
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Flashcards
        </Link>
      </div>
    </nav>
  );
}
