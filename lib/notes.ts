import { createClient } from "@/utils/supabase/client";

export interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  isUnsaved?: boolean;
}

export async function getNotes() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .order('updated_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching notes:', error);
    throw error;
  }
  
  return data as Note[];
}

export async function getNoteById(noteId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('id', noteId)
    .single();
  
  if (error) {
    console.error(`Error fetching note with id ${noteId}:`, error);
    throw error;
  }
  
  return data as Note;
}

export async function createNote(title: string, content: string) {
  const supabase = await createClient();
  
  const newNote = {
    title,
    content,
  };
  
  const { data, error } = await supabase
    .from('notes')
    .insert([newNote])
    .select();
  
  if (error) {
    console.error('Error creating note:', error);
    throw error;
  }
  
  return data[0] as Note;
}

export async function updateNote(noteId: string, updates: Partial<Note>) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('notes')
    .update(updates)
    .eq('id', noteId)
    .select();
  
  if (error) {
    console.error(`Error updating note with id ${noteId}:`, error);
    throw error;
  }
  
  return data[0] as Note;
}

export async function deleteNote(noteId: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', noteId);
  
  if (error) {
    console.error(`Error deleting note with id ${noteId}:`, error);
    throw error;
  }
  
  return true;
}


