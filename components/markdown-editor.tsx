'use client';

import { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';

export function MarkdownEditor() {
  const [value, setValue] = useState<string | undefined>('# Hello, world!\n\nStart typing to create your notes.');
  
  return (
    <div className="container mx-auto p-4 markdown-body" data-color-mode="auto">
      <div className="mb-4 rounded-lg border">
        <MDEditor
          value={value}
          onChange={setValue}
          preview="live"
          height={500}
          visibleDragbar={false}
          hideToolbar={false}
        />
      </div>
      
      <div className="flex justify-end">
        <button 
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          onClick={() => alert('Note saved!')}
        >
          Save note
        </button>
      </div>
    </div>
  );
}
