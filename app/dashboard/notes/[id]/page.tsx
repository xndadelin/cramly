'use client';

import { Sidebar } from "@/components/ui/sidebar";
import { RichTextEditor } from "@/components/rich-text-editor";
import { useEffect, useState, useCallback } from "react";
import { Note, getNoteById } from "@/lib/notes";
import { useRouter, useParams } from "next/navigation";
import React from "react";

interface NotePageProps {
  params: {
    id: string;
  }
}

export default function NotePage({ params }: NotePageProps) {
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshSidebar, setRefreshSidebar] = useState(0);
  const router = useRouter();
  const routeParams = useParams();
  const noteId = routeParams?.id as string;

  useEffect(() => {
    async function loadNote() {
      if (!noteId) {
        setCurrentNote(null);
        setIsLoading(false);
        return;
      }

      if (currentNote && currentNote.id === noteId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const note = await getNoteById(noteId);
        setCurrentNote(note);
      } catch (error) {
        console.error('Error loading note:', error);
        setCurrentNote(null);
        router.push('/dashboard/notes');
      } finally {
        setIsLoading(false);
      }
    }

    loadNote();
  }, [noteId, currentNote?.id, router]);

  const handleNoteSelected = (note: Note | null) => {
    if (note && note.id !== noteId) {
      router.push(`/dashboard/notes/${note.id}`, { scroll: false });
    }
  };

  const handleNoteChanged = useCallback((isUnsaved: boolean) => {
    if (currentNote) {
      setCurrentNote(prev => {
        if (!prev) return null;
        return { ...prev, isUnsaved };
      });
    }
  }, [currentNote]);

  const handleNoteSaved = (note: Note) => {
    setCurrentNote(note);
    setRefreshSidebar(prev => prev + 1);
  };

  return (
    <div className="flex min-h-screen max-h-screen overflow-hidden">
      <Sidebar 
        currentNoteId={noteId} 
        onNoteSelected={handleNoteSelected} 
        refreshTrigger={refreshSidebar}
      />
      <div className="flex-1 flex flex-col p-4 overflow-hidden">
        <h1 className="text-3xl font-bold mb-6">Notes</h1>
        <div className="flex-1 overflow-y-auto pr-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
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
    </div>
  );
}
