'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function StudiesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const noteId = searchParams.get('note');
  
  useEffect(() => {
    // Redirect to the new route structure
    if (noteId) {
      router.replace(`/dashboard/notes/${noteId}`);
    } else {
      router.replace('/dashboard/notes');
    }
  }, [router, noteId]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-muted-foreground">Redirecting to new notes page...</p>
    </div>
  );
}
