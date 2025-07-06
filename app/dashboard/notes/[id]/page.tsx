'use client';

import { Sidebar } from "@/components/ui/sidebar";
import { RichTextEditor } from "@/components/rich-text-editor";
import { useEffect, useState, useCallback } from "react";
import { Note, getNoteById, deleteNote } from "@/lib/notes";
import { useRouter, useParams } from "next/navigation";
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
    <div className="flex h-full min-h-[calc(100vh-80px)] w-full overflow-hidden">
      <Sidebar 
        currentNoteId={noteId} 
        onNoteSelected={handleNoteSelected}
        onDeleteNote={() => setIsDeleteDialogOpen(true)}
        refreshTrigger={refreshSidebar}
      />
      <div className="flex-1 flex flex-col p-3 overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
              <p className="text-sm text-muted-foreground">Loading...</p>
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">Delete Note</DialogTitle>
            <DialogDescription className="text-sm">
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-end">
            <Button variant="outline" size="sm" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              size="sm"
              onClick={handleDeleteNote}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
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
