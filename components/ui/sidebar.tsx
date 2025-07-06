'use client';

import { useEffect, useState } from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from 'next/navigation';
import { 
  FileText,
  Loader2,
  Search,
  Trash2,
} from "lucide-react";
import { Note, getNotes, createNote } from '@/lib/notes';
import { Input } from '@/components/ui/input';

function NewNoteButton() {
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();
  
  const handleClick = async () => {
    if (isCreating) return;
    
    setIsCreating(true);
    try {
      const newNote = await createNote('Untitled Note', '<h1>Hello, world!</h1><p>Start typing to create your notes.</p>');
      router.push(`/dashboard/notes/${newNote.id}`);
    } catch (error) {
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <Button 
      variant="secondary" 
      size="sm" 
      className="flex-1"
      onClick={handleClick}
      disabled={isCreating}
    >
      <FileText className="h-4 w-4 mr-2" />
      {isCreating ? 'Creating...' : 'New note'}
    </Button>
  );
}

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  currentNoteId?: string;
  onNoteSelected?: (note: Note | null) => void;
  onDeleteNote?: (noteId: string) => void;
  refreshTrigger?: number;
}

export function Sidebar({ className, currentNoteId, onNoteSelected, onDeleteNote, refreshTrigger = 0, ...props }: SidebarProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const notesData = await getNotes();
        
        const sortedNotes = [...notesData].sort((a, b) => {
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        });
        
        setNotes(sortedNotes);
        setFilteredNotes(sortedNotes);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [refreshTrigger]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredNotes(notes);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = notes.filter(note => 
        note.title.toLowerCase().includes(query) || 
        note.content.toLowerCase().includes(query)
      );
      setFilteredNotes(filtered);
    }
  }, [searchQuery, notes]);

  const handleSelectNote = (note: Note) => {
    try {
      if (note.id === currentNoteId) {
        return;
      }
      
      if (onNoteSelected) {
        onNoteSelected(note);
      } else {
        router.push(`/dashboard/notes/${note.id}`, { scroll: false });
      }
    } catch (error) {
    }
  };

  return (
    <div className={cn("w-64 h-screen border-r bg-background flex-shrink-0 overflow-hidden", className)} {...props}>
      <div className="flex flex-col h-full overflow-hidden">
        <div className="p-4 border-b flex-shrink-0">
          <h2 className="text-lg font-semibold">Notes portal</h2>
          <div className="mt-2 relative">
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8"
            />
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1.5 h-6 w-6 p-0"
                onClick={() => setSearchQuery("")}
              >
                ✕
              </Button>
            )}
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <div className="text-xs uppercase text-muted-foreground font-medium mb-2 mt-4">All Notes</div>
              {filteredNotes.length > 0 ? (
                <div className="space-y-1">
                  {filteredNotes.map((note) => (
                    <div key={note.id} className="relative group">
                      <Button
                        variant={note.id === currentNoteId ? "secondary" : "ghost"}
                        size="sm"
                        className="w-full justify-start gap-2 text-left font-normal h-8"
                        onClick={() => handleSelectNote(note)}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        <span className="truncate">{note.title}</span>
                        {note.isUnsaved && (
                          <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse ml-1" title="Unsaved changes" />
                        )}
                      </Button>
                      {note.id === currentNoteId && onDeleteNote && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteNote(note.id);
                          }}
                          className="absolute right-2 top-1 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                          title="Delete note"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground px-2">No notes found</p>
              )}
            </>
          )}
        </nav>
        <div className="border-t p-4 flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Quick actions</span>
          </div>
          <div className="flex flex-wrap">
            <NewNoteButton />
          </div>
        </div>
      </div>
    </div>
  );
}
