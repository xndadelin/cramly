'use client';

import { Sidebar } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { Note } from "@/lib/notes";
import { useRouter } from "next/navigation";

export default function NotesPage() {
  const [refreshSidebar, setRefreshSidebar] = useState(0);
  const router = useRouter();

  const handleNoteSelected = (note: Note | null) => {
    if (note) {
      router.push(`/dashboard/notes/${note.id}`, { scroll: false });
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
        <h1 className="text-3xl font-bold mb-6">Notes</h1>
        <div className="flex-1 overflow-y-auto pr-4 flex items-center justify-center">
          <p className="text-muted-foreground">Select a note from the sidebar or create a new one to get started.</p>
        </div>
      </div>
    </div>
  );
}
