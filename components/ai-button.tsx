'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bot, Loader2 } from 'lucide-react';

interface AIButtonProps {
  onMarkdownReceived: (markdown: string) => void;
}

export function AIButton({ onMarkdownReceived }: AIButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [showPromptInput, setShowPromptInput] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAIRequest = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('https://ai.hackclub.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: `${prompt}\n\nPlease format your response in clean HTML with proper heading tags (h1, h2, h3), paragraph tags, list elements, and other appropriate HTML markup for a rich text editor. Use strong and em tags for emphasis.` }]
        })
      });

      if (!response.ok) {
        throw new Error('AI request failed');
      }

      const data = await response.json();
      if (data && data.choices && data.choices[0] && data.choices[0].message) {
        let content = data.choices[0].message.content;
        
        content = content.trim();
        content = `<div>${content}</div>`;
        
        onMarkdownReceived(content);
        setPrompt('');
        setShowPromptInput(false);
      }
    } catch (error) {
      console.error('Error making AI request:', error);
      setError(error instanceof Error ? error.message : 'Failed to get AI response');
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-4">
      {showPromptInput ? (
        <div className="flex flex-col space-y-2 p-3 border rounded-md bg-background/40 backdrop-blur-sm">
          <h3 className="text-sm font-medium mb-1">Ask AI for content</h3>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Write any question or request."
            className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px] bg-background text-foreground"
            disabled={isLoading}
            autoFocus
          />
          {error && (
            <div className="text-red-500 text-sm py-1">{error}</div>
          )}
          <div className="flex space-x-2">
            <Button 
              onClick={handleAIRequest} 
              disabled={isLoading || !prompt.trim()}
              size="sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Submit'
              )}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setShowPromptInput(false);
                setPrompt('');
                setError(null);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowPromptInput(true)}
          className="flex items-center gap-2"
        >
          <Bot className="h-4 w-4" />
          Ask AI
        </Button>
      )}
    </div>
  );
}
