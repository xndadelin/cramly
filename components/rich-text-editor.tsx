'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';
import Link from '@tiptap/extension-link';
import Highlight from '@tiptap/extension-highlight';
import { Button } from '@/components/ui/button';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Code,
  Heading1,
  Heading2,
  Undo,
  Redo,
  Link as LinkIcon,
  Highlighter,
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from 'react';

export function RichTextEditor() {
  const [isSaving, setIsSaving] = useState(false);
  const [noteTitle, setNoteTitle] = useState('Untitled Note');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: 'Start typing to create your notes...',
      }),
      Typography,
      Link.configure({
        openOnClick: false,
      }),
      Highlight.configure({
        multicolor: true,
      }),
    ],
    content: '<h1>Hello, world!</h1><p>Start typing to create your notes.</p>',
  });

  const toggleBold = () => {
    editor?.chain().focus().toggleBold().run();
  };

  const toggleItalic = () => {
    editor?.chain().focus().toggleItalic().run();
  };

  const toggleBulletList = () => {
    editor?.chain().focus().toggleBulletList().run();
  };

  const toggleOrderedList = () => {
    editor?.chain().focus().toggleOrderedList().run();
  };

  const toggleBlockquote = () => {
    editor?.chain().focus().toggleBlockquote().run();
  };

  const toggleCodeBlock = () => {
    editor?.chain().focus().toggleCodeBlock().run();
  };

  const setHeading1 = () => {
    editor?.chain().focus().toggleHeading({ level: 1 }).run();
  };

  const setHeading2 = () => {
    editor?.chain().focus().toggleHeading({ level: 2 }).run();
  };

  const undo = () => {
    editor?.chain().focus().undo().run();
  };

  const redo = () => {
    editor?.chain().focus().redo().run();
  };



  const setHighlight = (color: string) => {
    try {
      if (color) {
        editor?.chain().focus().toggleHighlight({ color }).run();
      } else {
        editor?.chain().focus().toggleHighlight().run();
      }
    } catch (error) {
      console.error('Error applying highlight:', error);
    }
  };
  
  const setLink = () => {
    const url = window.prompt('URL');
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    } else {
      editor?.chain().focus().unsetLink().run();
    }
  };

  const saveNote = () => {
    setIsSaving(true);
    setTimeout(() => {
      const content = editor?.getHTML();
      console.log('Saving note:', { title: noteTitle, content });
      setIsSaving(false);
      alert(`Note "${noteTitle}" saved!`);
    }, 800);
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-col w-full bg-transparent">
      <div className="p-4 bg-transparent flex flex-wrap items-center justify-between gap-2">
        <input
          type="text"
          value={noteTitle}
          onChange={(e) => setNoteTitle(e.target.value)}
          placeholder="Enter note title..."
          className="flex-1 min-w-[200px] text-xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 p-0"
        />
        <Button 
          onClick={saveNote}
          disabled={isSaving}
          variant="outline"
          size="sm"
          className="border-primary/30 text-primary hover:text-primary/80 hover:bg-primary/5 transition-all"
        >
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </div>
      <div className="p-2 bg-transparent flex flex-wrap gap-1 overflow-x-auto max-w-full">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={undo}
          disabled={!editor.can().undo()}
          className="bg-transparent hover:bg-transparent/5"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={redo}
          disabled={!editor.can().redo()}
          className="bg-transparent hover:bg-transparent/5"
        >
          <Redo className="h-4 w-4" />
        </Button>
        <div className="mx-1 opacity-20">|</div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={setHeading1}
          className={editor.isActive('heading', { level: 1 }) ? 'text-primary' : 'bg-transparent hover:bg-transparent/5'}
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={setHeading2}
          className={editor.isActive('heading', { level: 2 }) ? 'text-primary' : 'bg-transparent hover:bg-transparent/5'}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <div className="mx-1 opacity-20">|</div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleBold}
          className={editor.isActive('bold') ? 'text-primary' : 'bg-transparent hover:bg-transparent/5'}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleItalic}
          className={editor.isActive('italic') ? 'text-primary' : 'bg-transparent hover:bg-transparent/5'}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={setLink}
          className={editor.isActive('link') ? 'text-primary' : 'bg-transparent hover:bg-transparent/5'}
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        <div className="mx-1 opacity-20">|</div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleBulletList}
          className={editor.isActive('bulletList') ? 'text-primary' : 'bg-transparent hover:bg-transparent/5'}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleOrderedList}
          className={editor.isActive('orderedList') ? 'text-primary' : 'bg-transparent hover:bg-transparent/5'}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <div className="mx-1 opacity-20">|</div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleBlockquote}
          className={editor.isActive('blockquote') ? 'text-primary' : 'bg-transparent hover:bg-transparent/5'}
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleCodeBlock}
          className={editor.isActive('codeBlock') ? 'text-primary' : 'bg-transparent hover:bg-transparent/5'}
        >
          <Code className="h-4 w-4" />
        </Button>
        
        <div className="mx-1 opacity-20">|</div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={editor.isActive('highlight') || editor.isActive('mark', { type: 'highlight' }) ? 'text-primary' : 'bg-transparent hover:bg-transparent/5'}
            >
              <Highlighter className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40 p-2 bg-background/60 backdrop-blur-sm border-0 shadow-sm">
            <div className="grid grid-cols-5 gap-1">
              {['#FFFF00', '#FFA500', '#FF0000', '#FFC0CB', '#00FF00', 
                '#00FFFF', '#0000FF', '#9370DB', '#FF00FF', '#90EE90'].map((color) => (
                <button
                  key={color}
                  onClick={() => setHighlight(color)}
                  className="w-6 h-6 rounded-full focus:outline-none focus:ring-1 focus:ring-primary/30 hover:scale-110 transition-all"
                  style={{ backgroundColor: color }}
                />
              ))}
              <button
                onClick={() => setHighlight('')}
                className="w-6 h-6 rounded-full border border-foreground/20 flex items-center justify-center hover:bg-foreground/5 transition-all"
              >
                <span className="text-xs">✕</span>
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="p-4 bg-transparent overflow-y-auto">
        <EditorContent 
          editor={editor} 
          className="min-h-[400px] max-h-[calc(100vh-300px)] focus:outline-none prose dark:prose-invert max-w-none tiptap-editor bg-transparent" 
        />
      </div>
    </div>
  );
}
