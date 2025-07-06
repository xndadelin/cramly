'use client';

import { Sidebar } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { Note, createNote } from "@/lib/notes";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

export default function NotesPage() {
  const [refreshSidebar, setRefreshSidebar] = useState(0);
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const handleNoteSelected = async (note: Note | null) => {
    console.log('handleNoteSelected called with note:', note);
    if (note) {
      console.log('Navigating to existing note:', note.id);
      router.push(`/dashboard/notes/${note.id}`, { scroll: false });
    } else {
      console.log('Creating new note');
      await handleCreateNewNote();
    }
  };

  const handleCreateNewNote = async () => {
    // Show an alert to confirm the function is being called
    alert("Creating new note from dashboard page...");
    
    if (isCreatingNote) {
      return;
    }
    
    setIsCreatingNote(true);
    try {
      const newNote = await createNote('Untitled Note', '<h1>Hello, world!</h1><p>Start typing to create your notes.</p>');
      
      toast({
        title: "Note created",
        description: "New note has been created successfully."
      });
      
      setRefreshSidebar(prev => prev + 1);
      router.push(`/dashboard/notes/${newNote.id}`, { scroll: false });
    } catch (error) {
      console.error('Error creating new note:', error);
      toast({
        title: "Error",
        description: "Failed to create a new note. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreatingNote(false);
    }
  };

  const handleNoteSaved = () => {
    setRefreshSidebar(prev => prev + 1);
  };

  return (
    <div className="flex min-h-screen max-h-screen overflow-hidden">
      <Sidebar 
        onNoteSelected={handleNoteSelected} 
        refreshTrigger={refreshSidebar}
      />
      <div className="flex-1 flex flex-col p-4 overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Notes</h1>
          <Button 
            onClick={handleCreateNewNote}
            disabled={isCreatingNote}
            className="flex items-center gap-2"
          >
            {isCreatingNote ? (
              <>Creating...</>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                New Note
              </>
            )}
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto pr-4 flex items-center justify-center flex-col space-y-4">
          <p className="text-muted-foreground">Select a note from the sidebar or create a new one to get started.</p>
          <Button 
            variant="outline" 
            onClick={handleCreateNewNote}
            disabled={isCreatingNote}
          >
            {isCreatingNote ? 'Creating...' : 'Create a new note'}
          </Button>
        </div>
      </div>
    </div>
  );
}
