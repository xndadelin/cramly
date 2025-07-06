'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getFlashcardDeckById, deleteFlashcardDeck, FlashcardDeck } from '@/lib/flashcards';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2, RefreshCcw } from 'lucide-react';
import Link from 'next/link';

export default function FlashcardDeckPage() {
    const params = useParams();
    const router = useRouter();
    const [deck, setDeck] = useState<FlashcardDeck | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchDeck = async () => {
            if (!params.id) return;

            setIsLoading(true);
            try {
                const deckData = await getFlashcardDeckById(params.id as string);
                setDeck(deckData);
            } catch (error) {
                console.error('Error fetching flashcard deck:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDeck();
    }, [params.id]);

    const handleDeleteDeck = async () => {
        if (!deck || isDeleting) return;

        if (!window.confirm('Are you sure you want to delete this flashcard deck? This action cannot be undone.')) {
            return;
        }

        setIsDeleting(true);
        try {
            await deleteFlashcardDeck(deck.id);
            router.push('/dashboard/flashcards');
        } catch (error) {
            console.error('Error deleting deck:', error);
            setIsDeleting(false);
        }
    };

    const handleNextCard = () => {
        if (!deck || deck.flashcards.length === 0) return;

        setShowAnswer(false);
        setCurrentCardIndex((prev) => (prev + 1) % deck.flashcards.length);
    };

    const handlePreviousCard = () => {
        if (!deck || deck.flashcards.length === 0) return;

        setShowAnswer(false);
        setCurrentCardIndex((prev) => {
            const newIndex = prev - 1;
            return newIndex < 0 ? deck.flashcards.length - 1 : newIndex;
        });
    };

    const handleToggleAnswer = () => {
        setShowAnswer((prev) => !prev);
    };

    const handleRestart = () => {
        setCurrentCardIndex(0);
        setShowAnswer(false);
    };

    if (isLoading) {
        return (
            <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="animate-spin h-8 w-8 border-t-2 border-primary border-r-2 rounded-full mx-auto mb-4"></div>
                    <p>Loading flashcards...</p>
                </div>
            </div>
        );
    }

    if (!deck) {
        return (
            <div className="container mx-auto p-4">
                <div className="text-center">              
                    <p className="mb-4">Flashcard deck not found.</p>
                    <Link href="/dashboard/flashcards">
                        <Button variant="outline">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to flashcards
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    const currentCard = deck.flashcards[currentCardIndex];
    const totalCards = deck.flashcards.length;

    return (
        <div className="container mx-auto p-4">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Link href="/dashboard/flashcards">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">{deck.title}</h1>
                </div>

                <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDeleteDeck}
                    disabled={isDeleting}
                    className="flex items-center gap-1"
                >
                    <Trash2 className="h-4 w-4" />
                    Delete deck
                </Button>
            </div>

            <div className="flex flex-col items-center">
                <div className="w-full max-w-3xl">
                    <div className="bg-card border rounded-lg shadow-sm overflow-hidden">
                        <div className="p-4 border-b flex justify-between items-center">
                            <span className="font-medium">Card {currentCardIndex + 1} of {totalCards}</span>
                            <Button variant="ghost" size="sm" onClick={handleRestart} className="flex items-center gap-1">
                                <RefreshCcw className="h-4 w-4" />
                                Restart
                            </Button>
                        </div>

                        <div
                            className="p-8 min-h-[250px] flex flex-col justify-center items-center cursor-pointer"
                            onClick={handleToggleAnswer}
                        >
                            <div className="text-center space-y-6">
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Question</h3>
                                    <p className="text-xl">{currentCard.question}</p>
                                </div>

                                {showAnswer && (
                                    <div className="border-t pt-6">
                                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Answer</h3>
                                        <p className="text-lg">{currentCard.answer}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-4 border-t flex justify-between items-center">
                            <Button variant="outline" onClick={handlePreviousCard}>Previous</Button>

                            {!showAnswer ? (
                                <Button onClick={handleToggleAnswer}>Show answer</Button>
                            ) : (
                                <div className="flex gap-2">
                                    <Button
                                        variant="default"
                                        className="gap-1"
                                        onClick={handleNextCard}
                                    >
                                        Next card
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
