'use client';

import { useEffect, useState } from 'react';
import { createNote } from '@/lib/notes';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

export default function NewNotePage() {
  const [isCreating, setIsCreating] = useState(true);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    async function createNewNote() {
      try {
        const newNote = await createNote(
          'Untitled Note', 
          '<h1>Hello, world!</h1><p>Start typing to create your notes.</p>'
        );
        
        setTimeout(() => {
          router.push(`/dashboard/notes/${newNote.id}`);
        }, 100);
      } catch (error) {
        console.error('Error creating note:', error);
        toast({
          title: "Error creating note",
          description: "There was a problem creating your note. Please try again.",
          variant: "destructive",
        });
        router.push('/dashboard/notes');
      } finally {
        setIsCreating(false);
      }
    }

    createNewNote();
  }, [router, toast]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Creating new note...</p>
      </div>
    </div>
  );
}
