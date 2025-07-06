'use client';

import React, { useEffect, useState } from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter, usePathname } from 'next/navigation';
import { 
  BookOpen,
  FolderPlus,
  FileText,
  Folder,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { Note, getNotes, getFolders, createFolder, createNote } from '@/lib/notes';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';

function NewNoteButton() {
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();
  const toast = useToast();
  
  const handleClick = async () => {
    if (isCreating) return;
    
    setIsCreating(true);
    try {
      const newNote = await createNote('Untitled Note', '<h1>Hello, world!</h1><p>Start typing to create your notes.</p>');
      toast({
        title: "Note created",
        description: "New note has been created successfully."
      });
      router.push(`/dashboard/notes/${newNote.id}`);
    } catch (error) {
      console.error('Error creating note:', error);
      toast({
        title: "Error",
        description: "Failed to create a new note. Please try again.",
        variant: "destructive"
      });
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
  refreshTrigger?: number;
}

export function Sidebar({ className, currentNoteId, onNoteSelected, refreshTrigger = 0, ...props }: SidebarProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  const [newFolderName, setNewFolderName] = useState('');
  const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [notesData, foldersData] = await Promise.all([
          getNotes(),
          getFolders()
        ]);
        setNotes(notesData);
        setFolders(foldersData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [refreshTrigger]);

  const handleToggleFolder = (folderId: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      toast({
        title: "Error",
        description: "Folder name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    try {
      const newFolder = await createFolder(newFolderName.trim());
      setFolders([...folders, newFolder]);
      setNewFolderName('');
      setIsFolderDialogOpen(false);
      toast({
        title: "Success",
        description: `Folder "${newFolderName}" created successfully`,
      });
    } catch (error) {
      console.error('Error creating folder:', error);
      toast({
        title: "Error",
        description: "Failed to create folder",
        variant: "destructive",
      });
    }
  };

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
      console.error('Error selecting note:', error);
    }
  };

  const notesByFolder: Record<string, Note[]> = {};
  notes.forEach(note => {
    const folderId = note.folder_id || 'unfiled';
    if (!notesByFolder[folderId]) {
      notesByFolder[folderId] = [];
    }
    notesByFolder[folderId].push(note);
  });

  return (
    <div className={cn("w-64 h-screen border-r bg-background flex-shrink-0 overflow-hidden", className)} {...props}>
      <div className="flex flex-col h-full overflow-hidden">
        <div className="p-4 border-b flex-shrink-0">
          <h2 className="text-lg font-semibold">Notes portal</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link href="/dashboard/notes">
            <Button
              variant={pathname === "/dashboard/notes" ? "secondary" : "ghost"}
              className="w-full justify-start gap-3 text-left font-normal h-10 mb-4"
            >
              <BookOpen className="h-4 w-4" />
              <span>All Notes</span>
            </Button>
          </Link>
          
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <div className="text-xs uppercase text-muted-foreground font-medium mb-2 mt-4">Folders</div>
              
              {folders.map((folder) => (
                <div key={folder.id} className="mb-1">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-between gap-2 text-left font-normal h-8 px-2"
                    onClick={() => handleToggleFolder(folder.id)}
                  >
                    <div className="flex items-center">
                      <Folder className="h-4 w-4 mr-2" />
                      <span className="truncate">{folder.name}</span>
                    </div>
                    <ChevronRight className={`h-4 w-4 transition-transform ${expandedFolders[folder.id] ? 'rotate-90' : ''}`} />
                  </Button>
                  
                  {expandedFolders[folder.id] && notesByFolder[folder.id] && (
                    <div className="pl-6 space-y-1 mt-1">
                      {notesByFolder[folder.id].map((note) => (
                        <Button
                          key={note.id}
                          variant={note.id === currentNoteId ? "secondary" : "ghost"}
                          size="sm"
                          className="w-full justify-start gap-2 text-left font-normal h-7"
                          onClick={() => handleSelectNote(note)}
                        >
                          <FileText className="h-3 w-3" />
                          <span className="truncate">{note.title}</span>
                          {note.isUnsaved && (
                            <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse ml-1" title="Unsaved changes" />
                          )}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              <div className="text-xs uppercase text-muted-foreground font-medium mb-2 mt-4">Unfiled Notes</div>
              {notesByFolder['unfiled'] ? (
                <div className="space-y-1">
                  {notesByFolder['unfiled'].map((note) => (
                    <Button
                      key={note.id}
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
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground px-2">No unfiled notes</p>
              )}
            </>
          )}
        </nav>
        <div className="border-t p-4 flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Quick actions</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <NewNoteButton />
            
            <Dialog open={isFolderDialogOpen} onOpenChange={setIsFolderDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1">
                  <FolderPlus className="h-4 w-4 mr-2" />
                  New folder
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create new folder</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Input
                    placeholder="Folder name"
                    value={newFolderName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewFolderName(e.target.value)}
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsFolderDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateFolder}>
                    Create
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
