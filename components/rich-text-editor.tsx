'use client';

import React from 'react';
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
  Loader2,
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState, useEffect, useRef } from 'react';
import { updateNote, Note } from '@/lib/notes';
import { useToast } from "@/components/ui/use-toast";

interface RichTextEditorProps {
  note?: Note;
  onNoteSaved?: (note: Note) => void;
  onNoteChanged?: (isUnsaved: boolean) => void;
}

export function RichTextEditor({ note, onNoteSaved, onNoteChanged }: RichTextEditorProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [isUnsaved, setIsUnsaved] = useState(false);
  const [noteTitle, setNoteTitle] = useState(note?.title || 'Untitled Note');
  const [currentNoteId, setCurrentNoteId] = useState<string | undefined>(note?.id);
  const [originalContent, setOriginalContent] = useState<string>(note?.content || '');
  const [originalTitle, setOriginalTitle] = useState<string>(note?.title || 'Untitled Note');
  const toast = useToast();
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const notifySuccess = React.useCallback((title: string, description: string) => {
    toast({
      title,
      description,
    });
  }, [toast]);

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
    content: note?.content || '<h1>Hello, world!</h1><p>Start typing to create your notes.</p>',
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }

      updateTimeoutRef.current = setTimeout(() => {
        updateUnsavedStatus();
        updateTimeoutRef.current = null;
      }, 300);
    }
  });
  
  const checkForChanges = React.useCallback(() => {
    if (!editor || !currentNoteId) return false;
    
    const currentContent = editor.getHTML();
    const currentTitleValue = noteTitle;
    
    const contentChanged = currentContent !== originalContent;
    const titleChanged = currentTitleValue !== originalTitle;
    
    return contentChanged || titleChanged;
  }, [editor, currentNoteId, noteTitle, originalContent, originalTitle]);

  const updateUnsavedStatus = React.useCallback((forceValue?: boolean) => {
    const hasChanges = forceValue !== undefined ? forceValue : checkForChanges();
    
    if (isUnsaved !== hasChanges) {
      setIsUnsaved(hasChanges);
      if (onNoteChanged) {
        onNoteChanged(hasChanges);
      }
    }
  }, [onNoteChanged, isUnsaved, checkForChanges]);

  useEffect(() => {
    if (!editor || !note) return;
    
    if (currentNoteId !== note.id) {
      setCurrentNoteId(note.id);
      setNoteTitle(note.title);
      setOriginalTitle(note.title);
      setOriginalContent(note.content);
      
      if (editor.getHTML() !== note.content) {
        editor.commands.setContent(note.content || '');
      }
      
      updateUnsavedStatus(false);
    }
  }, [note?.id, editor]);
  
  useEffect(() => {
    if (!editor) return;
    
    if (!note) {
      const defaultContent = '<h1>Hello, world!</h1><p>Start typing to create your notes.</p>';
      setCurrentNoteId(undefined);
      setNoteTitle('Untitled Note');
      setOriginalTitle('Untitled Note');
      setOriginalContent(defaultContent);
      editor.commands.setContent(defaultContent);
      updateUnsavedStatus(false);
    }
  }, [note, editor, updateUnsavedStatus]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (isUnsaved && editor && currentNoteId) {
        setIsAutoSaving(true);
        try {
          const content = editor.getHTML();
          
          const savedNote = await updateNote(currentNoteId, {
            title: noteTitle,
            content
          });
          
          setOriginalContent(content);
          setOriginalTitle(noteTitle);
          updateUnsavedStatus(false);
          
          if (onNoteSaved && savedNote) {
            onNoteSaved(savedNote);
          }
        } catch (error) {
          console.error('Error during auto-save:', error);
        } finally {
          setIsAutoSaving(false);
        }
      }
    }, 20000);
    
    return () => {
      clearInterval(interval);
    };
  }, [editor, currentNoteId, isUnsaved, noteTitle, updateUnsavedStatus, onNoteSaved]);

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

  const saveNote = async () => {
    if (!editor || !currentNoteId) return;
    
    setIsSaving(true);
    try {
      const content = editor.getHTML();
      
      const savedNote = await updateNote(currentNoteId, {
        title: noteTitle,
        content
      });
      notifySuccess("Note updated", `"${noteTitle}" has been updated successfully.`);
      
      setOriginalContent(content);
      setOriginalTitle(noteTitle);
      updateUnsavedStatus(false);
      
      if (onNoteSaved && savedNote) {
        onNoteSaved(savedNote);
      }
    } catch (error) {
      console.error('Error saving note:', error);
      toast({
        title: "Error saving note",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-col w-full bg-transparent">
      <div className="p-4 bg-transparent flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1">
          <input
            type="text"
            value={noteTitle}
            onChange={(e) => {
              setNoteTitle(e.target.value);
              updateUnsavedStatus();
            }}
            placeholder="Enter note title..."
            className="flex-1 min-w-[200px] text-xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 p-0"
          />
          {isUnsaved && (
            <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" title="Unsaved changes" />
          )}
        </div>
        <div className="flex gap-2 items-center">
          {isUnsaved && !isAutoSaving && (
            <span className="text-xs text-muted-foreground flex items-center">
              Unsaved changes (auto-saves every 20s)
            </span>
          )}
          {isAutoSaving && (
            <span className="text-xs text-muted-foreground flex items-center">
              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              Auto-saving...
            </span>
          )}
          <Button 
            onClick={saveNote}
            disabled={isSaving}
            variant="outline"
            size="sm"
            className="border-primary/30 text-primary hover:text-primary/80 hover:bg-primary/5 transition-all"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : 'Save'}
          </Button>
        </div>
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
