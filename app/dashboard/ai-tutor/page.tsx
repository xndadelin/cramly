'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Send, Trash2, Plus, MessageSquare } from 'lucide-react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { 
  getOrCreateActiveConversation, 
  getConversations,
  createConversation,
  getMessages, 
  addMessage,
  deleteConversation,
  Message,
  Conversation
} from '@/lib/ai-tutor';
import { cn } from '@/lib/utils';

export default function AITutorPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [controller, setController] = useState<AbortController | null>(null);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useCurrentUser();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const loadAllConversations = async () => {
    if (!user) return;
    
    try {
      const allConversations = await getConversations();
      setConversations(allConversations);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };
  const loadConversationMessages = async (conversationId: string) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const conversationMessages = await getMessages(conversationId);
      setMessages(conversationMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
      setMessages([{
        id: 'error-message',
        content: 'Failed to load messages. Please try refreshing the page.',
        role: 'assistant',
        created_at: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    const initialize = async () => {
      if (!user) {
        setIsInitializing(false);
        return;
      }
      
      setIsInitializing(true);
      try {
        await loadAllConversations();
        
        const activeConversation = await getOrCreateActiveConversation();
        if (!activeConversation) {
          throw new Error('Failed to get or create conversation');
        }
        
        setConversation(activeConversation);
        
        await loadConversationMessages(activeConversation.id);
      } catch (error) {
        console.error('Error initializing:', error);
        setMessages([{
          id: 'error-message',
          content: 'Failed to load conversation. Please try refreshing the page.',
          role: 'assistant',
          created_at: new Date().toISOString()
        }]);
      } finally {
        setIsInitializing(false);
      }
    };
    
    initialize();
  }, [user?.id]);
  
  const handleNewChat = async () => {
    if (!user) return;
    
    try {
      // Create a more descriptive title with current date
      const now = new Date();
      const formattedDate = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const formattedTime = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      const title = `Chat ${formattedDate}, ${formattedTime}`;
      
      const newConversation = await createConversation(title);
      
      setConversations(prev => [newConversation, ...prev]);
      
      setConversation(newConversation);
      
      setMessages([]);
    } catch (error) {
      console.error('Error creating new conversation:', error);
    }
  };
  const handleSwitchConversation = async (conv: Conversation) => {
    if (conv.id === conversation?.id) return;
    
    setConversation(conv);
    await loadConversationMessages(conv.id);
  };
  
  const handleDeleteConversation = async (convId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!window.confirm('Are you sure you want to delete this conversation?')) return;
    
    try {
      await deleteConversation(convId);
      
      setConversations(prev => prev.filter(c => c.id !== convId));
      
      if (conversation?.id === convId) {
        if (conversations.length > 1) {
          const nextConversation = conversations.find(c => c.id !== convId);
          if (nextConversation) {
            setConversation(nextConversation);
            await loadConversationMessages(nextConversation.id);
          } else {
            const newConversation = await createConversation('New chat');
            setConversation(newConversation);
            setMessages([]);
            setConversations([newConversation]);
          }
        } else {
          const newConversation = await createConversation('New chat');
          setConversation(newConversation);
          setMessages([]);
          setConversations([newConversation]);
        }
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading || !conversation) return;
    
    setInput('');
    setIsLoading(true);
    
    try {
      const userMessage = await addMessage(
        conversation.id,
        input.trim(),
        'user'
      );
      
      setMessages(prev => [...prev, userMessage]);
      
      const abortController = new AbortController();
      setController(abortController);
      
      const response = await fetch('https://ai.hackclub.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages.map(m => ({
            role: m.role,
            content: m.content
          })), { role: 'user', content: input.trim() }]
        }),
        signal: abortController.signal
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.choices && data.choices.length > 0) {
        const aiResponse = data.choices[0].message.content;
        
        const assistantMessage = await addMessage(
          conversation.id,
          aiResponse,
          'assistant'
        );
        
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Request was cancelled');
        setMessages(prev => [...prev, {
          id: 'cancelled-' + Date.now(),
          content: 'Response generation was cancelled.',
          role: 'assistant',
          created_at: new Date().toISOString()
        }]);
      } else {
        console.error('Error processing message:', error);
        setMessages(prev => [...prev, {
          id: 'error-' + Date.now(),
          content: 'Sorry, there was an error processing your message. Please try again.',
          role: 'assistant',
          created_at: new Date().toISOString()
        }]);
      }
    } finally {
      setIsLoading(false);
      setController(null);
    }
  };
  
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };
  
  const handleCancelResponse = () => {
    if (controller) {
      controller.abort();
    }
  };
  
  // Close sidebar on mobile when switching conversations
  const handleSwitchConversationMobile = async (conv: Conversation) => {
    await handleSwitchConversation(conv);
    
    // Close sidebar on mobile
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };
  
  if (isInitializing) {
    return (
      <div className="h-full flex items-center justify-center bg-transparent backdrop-blur-md">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-t-2 border-primary border-r-2 rounded-full mx-auto mb-4"></div>
          <p>Loading AI tutor...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="h-full flex items-center justify-center bg-transparent backdrop-blur-md">
        <div className="text-center max-w-md mx-auto p-6 bg-transparent backdrop-blur-md border border-muted/10 border-l-2 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Sign in required</h2>
          <p className="mb-4">Please sign in to use the AI Tutor feature.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-full flex flex-col md:flex-row overflow-hidden bg-transparent">
      <div className={cn(
        "fixed md:relative z-40 md:z-auto md:w-64 border-r border-muted/10 bg-transparent backdrop-blur-md flex flex-col transition-all duration-300 overflow-hidden",
        isSidebarOpen 
          ? "block w-64 h-full" 
          : "hidden md:block md:w-16"
      )}>
        <div className="p-3 border-b border-muted/10 bg-transparent backdrop-blur-md flex items-center justify-between">
          <h3 className={cn("font-medium", isSidebarOpen ? "block" : "hidden md:block")}>
            {isSidebarOpen ? "Chat history" : ""}
          </h3>
          <Button variant="ghost" size="sm" onClick={toggleSidebar} className="h-8 w-8 p-0 md:flex">
            {isSidebarOpen ? <span>«</span> : <span>»</span>}
          </Button>
        </div>
        
        <div className="p-2">
          <Button 
            variant="outline" 
            className="w-full justify-start gap-2 mb-2 bg-transparent backdrop-blur-md hover:bg-background/5 rounded-sm"
            onClick={handleNewChat}
          >
            <Plus className="h-4 w-4" /> 
            {isSidebarOpen && <span>New chat</span>}
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2">
          {conversations.map(conv => (
            <div 
              key={conv.id}
              onClick={() => handleSwitchConversationMobile(conv)}                
              className={cn(
                "flex items-center justify-between py-2 px-3 mb-1 cursor-pointer group backdrop-blur-md",
                conversation?.id === conv.id 
                  ? "bg-transparent border-l-2 border-black/30 dark:border-white/30 font-medium" 
                  : "hover:bg-transparent hover:border-l-2 hover:border-black/20 dark:hover:border-white/20"
              )}
            >
              <div className={cn("flex items-center gap-2 truncate", !isSidebarOpen && "md:hidden")}>
                <MessageSquare className="h-4 w-4 flex-shrink-0" />
                {isSidebarOpen && <span className="truncate">{conv.title}</span>}
              </div>
              
              {isSidebarOpen && (
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                  onClick={(e) => handleDeleteConversation(conv.id, e)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex-1 flex flex-col h-full bg-transparent backdrop-blur-md">
        <div className="md:hidden flex items-center justify-between p-3 border-b border-muted/10">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleSidebar} 
            className="h-8 w-8 p-0 rounded-sm"
          >
            {isSidebarOpen ? <span>×</span> : <span>≡</span>}
          </Button>
          <h3 className="font-medium">AI Tutor</h3>
          <div className="w-8"></div> {/* Empty div for balanced spacing */}
        </div>
        
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-xl mx-auto">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="p-6 bg-transparent">
                  <h3 className="text-lg font-semibold mb-2">Welcome to AI tutor</h3>
                  <p className="text-muted-foreground">Ask any question to get help with your studies!</p>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div 
                  key={message.id} 
                  className={cn(
                    "mb-6 p-4",
                    message.role === 'user' 
                      ? "bg-transparent border-l border-black/30 dark:border-white/30 ml-auto mr-0" 
                      : "bg-transparent border-l border-black/20 dark:border-white/20 mr-auto ml-0"
                  )}
                >
                  <div className="prose dark:prose-invert max-w-none">
                    {message.content.split('\n').map((line, i) => (
                      line ? <p key={i}>{line}</p> : <br key={i} />
                    ))}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        <div className="py-2 px-4 flex justify-center bg-transparent backdrop-blur-md">
          <form onSubmit={handleSubmit} className="w-full max-w-md">
            {isLoading ? (
              <div className="flex items-center justify-between px-5 py-3 min-h-[50px] border-2 border-opacity-30 rounded-md bg-opacity-5 backdrop-blur-sm shadow-md">
                <div className="flex items-center">
                  <div className="animate-spin h-4 w-4 border border-opacity-40 rounded-full mr-2"></div>
                  <span className="text-sm font-medium">Generating response...</span>
                </div>
                <Button 
                  type="button"
                  size="sm"
                  variant="ghost" 
                  onClick={handleCancelResponse}
                  className="opacity-70 hover:opacity-100 p-0"
                >
                  <span className="text-xs">Cancel</span>
                </Button>
              </div>
            ) : (
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask any question..."
                className="w-full min-h-[60px] max-h-32 px-5 py-4 bg-black/5 backdrop-blur-sm border-2 border-black/30 rounded-lg shadow-md resize-none focus:outline-none focus:ring-2 focus:ring-black/40 focus:border-black/50 transition-all"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (input.trim()) {
                      handleSubmit(e);
                    }
                  }
                }}
              />
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
