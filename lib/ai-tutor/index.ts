import { createClient } from '@/utils/supabase/client';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  created_at: string;
}

export interface Conversation {
  id: string;
  title: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export async function getConversations() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('ai_conversations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching conversations:', error);
    throw error;
  }

  return data as Conversation[];
}

export async function getConversation(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('ai_conversations')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching conversation:', error);
    throw error;
  }

  return data as Conversation;
}

export async function getMessages(conversationId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('ai_messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }

  return data as Message[];
}

export async function createConversation(title: string = 'New Conversation') {
  const supabase = await createClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError) {
    console.error('Error getting user:', userError);
    throw userError;
  }
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  const { data, error } = await supabase
    .from('ai_conversations')
    .insert([{ 
      title,
      user_id: user.id 
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating conversation:', error);
    throw error;
  }

  return data as Conversation;
}

export async function updateConversationTitle(id: string, title: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('ai_conversations')
    .update({ title, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('Error updating conversation title:', error);
    throw error;
  }
}

export async function deleteConversation(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('ai_conversations')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting conversation:', error);
    throw error;
  }
}

export async function addMessage(conversationId: string, content: string, role: 'user' | 'assistant') {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('ai_messages')
    .insert([
      {
        conversation_id: conversationId,
        content,
        role
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error adding message:', error);
    throw error;
  }

  return data as Message;
}

export async function getOrCreateActiveConversation(): Promise<Conversation> {
  const supabase = await createClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError) {
    console.error('Error getting user:', userError);
    throw userError;
  }
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  try {
    const conversations = await getConversations();
    
    if (conversations.length > 0) {
      return conversations[0];
    } else {
      // Create a more descriptive title with current date
      const now = new Date();
      const formattedDate = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const formattedTime = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      const title = `Chat ${formattedDate}, ${formattedTime}`;
      
      return await createConversation(title);
    }
  } catch (error) {
    console.error('Error getting or creating conversation:', error);
    throw error;
  }
}
