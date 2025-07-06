'use client';

import { Sidebar } from "@/components/ui/sidebar";
import { RichTextEditor } from "@/components/rich-text-editor";
import { useEffect, useState, useCallback } from "react";
import { Note, getNoteById, deleteNote } from "@/lib/notes";
import { useRouter, useParams } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function NotePage() {
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshSidebar, setRefreshSidebar] = useState(0);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const params = useParams();
  const noteId = Array.isArray(params?.id) ? params.id[0] : params?.id as string;

  useEffect(() => {
    async function loadNote() {
      if (!noteId) {
        setCurrentNote(null);
        setIsLoading(false);
        return;
      }

      if (!currentNote || currentNote.id !== noteId) {
        setIsLoading(true);
        try {
          const note = await getNoteById(noteId);
          setCurrentNote(note);
        } catch (error) {
          setCurrentNote(null);
          router.push('/dashboard/notes');
        } finally {
          setIsLoading(false);
        }
      }
    }

    loadNote();
  }, [noteId, router]);

  const handleNoteSelected = (note: Note | null) => {
    if (note && note.id !== noteId) {
      router.push(`/dashboard/notes/${note.id}`, { scroll: false });
    }
  };

  const handleNoteChanged = useCallback((isUnsaved: boolean) => {
    if (currentNote) {
      if (currentNote.isUnsaved !== isUnsaved) {
        setCurrentNote(prev => {
          if (!prev) return null;
          return { ...prev, isUnsaved };
        });
      }
    }
  }, []);

  const handleNoteSaved = useCallback((note: Note) => {
    setCurrentNote(note);
    setRefreshSidebar(prev => prev + 1);
  }, []);
  
  const handleDeleteNote = async () => {
    if (!currentNote) return;
    
    setIsDeleting(true);
    try {
      await deleteNote(currentNote.id);
      setIsDeleteDialogOpen(false);
      window.location.href = '/dashboard/notes';
    } catch (error) {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="flex min-h-screen max-h-screen overflow-hidden">
      <Sidebar 
        currentNoteId={noteId} 
        onNoteSelected={handleNoteSelected}
        onDeleteNote={() => setIsDeleteDialogOpen(true)}
        refreshTrigger={refreshSidebar}
      />
      <div className="flex-1 flex flex-col p-4 overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Notes</h1>
        </div>
        
        {currentNote && !isLoading && (
          <div className="flex items-center mb-4">
            <h2 className="text-2xl font-medium flex-1">{currentNote.title}</h2>
          </div>
        )}
        <div className="flex-1 overflow-y-auto pr-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <p className="text-muted-foreground">Loading note...</p>
            </div>
          ) : (
            <RichTextEditor 
              note={currentNote || undefined} 
              onNoteSaved={handleNoteSaved} 
              onNoteChanged={handleNoteChanged}
            />
          )}
        </div>
      </div>
      
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Note</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this note? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDeleteNote}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
