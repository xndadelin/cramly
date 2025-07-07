'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bot, Loader2 } from 'lucide-react';

interface FlashcardGeneratorProps {
    onFlashcardsGenerated: (flashcards: { question: string, answer: string }[], prompt: string) => void;
}

export function FlashcardGenerator({ onFlashcardsGenerated }: FlashcardGeneratorProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [topic, setTopic] = useState('');
    const [count, setCount] = useState(5);
    const [showInput, setShowInput] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateFlashcards = async () => {
        if (!topic.trim()) return;

        setIsLoading(true);
        try {
            const response = await fetch('https://ai.hackclub.com/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [{
                        role: 'user',
                        content: `Generate ${count} flashcards about "${topic}". Each flashcard should have a clear question and a concise answer. Format your response as a JSON array of objects with "question" and "answer" fields. Only return the raw JSON array without any additional text, code blocks, or formatting.`
                    }]
                })
            });

            if (!response.ok) {
                throw new Error('AI request failed');
            }

            const data = await response.json();
            if (data && data.choices && data.choices[0] && data.choices[0].message) {
                let content = data.choices[0].message.content;

                content = content.trim();
                content = content.replace(/```json|```/g, '');

                try {
                    const flashcards = JSON.parse(content);
                    if (Array.isArray(flashcards) && flashcards.length > 0) {
                        onFlashcardsGenerated(flashcards, topic);
                        setTopic('');
                        setShowInput(false);
                    } else {
                        throw new Error('Invalid flashcards format received');
                    }
                } catch (error) {
                    throw new Error('Failed to parse flashcards from AI response');
                }
            }
        } catch (error) {
            console.error('Error generating flashcards:', error);
            setError(error instanceof Error ? error.message : 'Failed to generate flashcards');
            setTimeout(() => setError(null), 5000);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mb-4">
            {showInput ? (
                <div className="flex flex-col space-y-2 p-4 border rounded-md bg-background/40 backdrop-blur-sm">
                    <h3 className="text-lg font-medium mb-1">Generate flashcards</h3>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="topic" className="block text-sm font-medium mb-1">Topic or subject</label>
                            <input
                                id="topic"
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="E.g. JavaScript Basics, World Capitals, etc."
                                className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                                disabled={isLoading}
                                autoFocus
                            />
                        </div>

                        <div>
                            <label htmlFor="count" className="block text-sm font-medium mb-1">Number of flashcards</label>
                            <input
                                id="count"
                                type="number"
                                min={1}
                                max={20}
                                value={count}
                                onChange={(e) => setCount(Number(e.target.value))}
                                className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm py-1">{error}</div>
                    )}

                    <div className="flex space-x-2 pt-2">
                        <Button
                            onClick={handleGenerateFlashcards}
                            disabled={isLoading || !topic.trim()}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                'Generate flashcards'
                            )}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowInput(false);
                                setTopic('');
                                setError(null);
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            ) : (
                <Button
                    variant="default"
                    onClick={() => setShowInput(true)}
                    className="flex items-center gap-2"
                >
                    <Bot className="h-4 w-4" />
                    Generate flashcards with AI
                </Button>
            )}
        </div>
    );
}
