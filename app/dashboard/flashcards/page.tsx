'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2, Clock, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FlashcardGenerator } from '@/components/flashcard-generator';
import { createFlashcardDeck, getFlashcardDecks, FlashcardDeck } from '@/lib/flashcards';
import Link from 'next/link';

export default function FlashcardsPage() {
    const [isCreating, setIsCreating] = useState(false);
    const [deckTitle, setDeckTitle] = useState('');
    const [showTitleInput, setShowTitleInput] = useState(false);
    const [flashcardsToCreate, setFlashcardsToCreate] = useState<{ question: string, answer: string }[]>([]);
    const [aiPrompt, setAiPrompt] = useState('');
    const [decks, setDecks] = useState<FlashcardDeck[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function loadDecks() {
            try {
                const fetchedDecks = await getFlashcardDecks();
                setDecks(fetchedDecks);
            } catch (error) {
                console.error('Error loading flashcard decks:', error);
            } finally {
                setIsLoading(false);
            }
        }

        loadDecks();
    }, []);

    const handleFlashcardsGenerated = (flashcards: { question: string, answer: string }[], prompt: string) => {
        setFlashcardsToCreate(flashcards);
        setAiPrompt(prompt);
        setShowTitleInput(true);
    };

    const handleCreateDeck = async () => {
        if (isCreating || !deckTitle.trim() || flashcardsToCreate.length === 0) return;

        setIsCreating(true);
        try {
            const newDeck = await createFlashcardDeck(deckTitle, flashcardsToCreate, aiPrompt);

            setDeckTitle('');
            setFlashcardsToCreate([]);
            setShowTitleInput(false);

            setDecks(prevDecks => [newDeck, ...prevDecks]);
            router.push(`/dashboard/flashcards/${newDeck.id}`);
        } catch (error) {
            console.error('Failed to create flashcard deck:', error);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Flashcards</h1>
            </div>

            <div className="grid gap-6">
                <div className="p-6 border rounded-lg bg-card">
                    <h2 className="text-xl font-semibold mb-4">Your flashcard decks</h2>

                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin h-8 w-8 border-t-2 border-primary border-r-2 rounded-full"></div>
                        </div>
                    ) : decks.length > 0 ? (
                        <div className="grid gap-3">
                            {decks.map(deck => (
                                <Link
                                    key={deck.id}
                                    href={`/dashboard/flashcards/${deck.id}`}
                                    className="block p-4 border rounded-md hover:bg-accent/50 transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium">{deck.title}</h3>
                                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                                                <Clock className="h-3 w-3 mr-1" />
                                                <span>
                                                    {new Date(deck.created_at).toLocaleDateString()}
                                                </span>
                                                <span className="mx-2">•</span>
                                                <span>{deck.flashcards?.length || 0} cards</span>
                                            </div>
                                        </div>
                                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <p>You haven't created any flashcard decks yet.</p>
                            <p>Use the generator below to create your first deck!</p>
                        </div>
                    )}
                </div>

                <div className="p-6 border rounded-lg bg-card">
                    <h2 className="text-xl font-semibold mb-4">Create flashcards with AI</h2>
                    <p className="mb-4 text-muted-foreground">
                        Generate flashcards on any topic using AI. Simply enter a topic, and we'll create study flashcards for you.
                    </p>

                    <FlashcardGenerator onFlashcardsGenerated={handleFlashcardsGenerated} />

                    {showTitleInput && (
                        <div className="mt-6 space-y-4">
                            <h3 className="text-lg font-medium">Flashcards generated</h3>
                            <div className="border rounded-md p-4 bg-background/50">
                                <div className="mb-4">
                                    <label htmlFor="deckTitle" className="block text-sm font-medium mb-1">Deck title</label>
                                    <input
                                        id="deckTitle"
                                        type="text"
                                        value={deckTitle}
                                        onChange={(e) => setDeckTitle(e.target.value)}
                                        placeholder="Enter a title for your flashcard deck"
                                        className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                                        disabled={isCreating}
                                        autoFocus
                                    />
                                </div>

                                <div className="space-y-3">
                                    <h4 className="text-sm font-medium">Preview ({flashcardsToCreate.length} flashcards):</h4>
                                    <div className="max-h-60 overflow-y-auto space-y-2">
                                        {flashcardsToCreate.map((card, index) => (
                                            <div key={index} className="border rounded-md p-3 bg-background">
                                                <p className="font-medium">Q: {card.question}</p>
                                                <p className="text-muted-foreground">A: {card.answer}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-4 flex space-x-2">
                                    <Button
                                        onClick={handleCreateDeck}
                                        disabled={isCreating || !deckTitle.trim()}
                                        className="flex items-center gap-2"
                                    >
                                        {isCreating ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Creating...
                                            </>
                                        ) : (
                                            <>
                                                <PlusCircle className="h-4 w-4" />
                                                Create flashcard deck
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setShowTitleInput(false);
                                            setDeckTitle('');
                                            setFlashcardsToCreate([]);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
