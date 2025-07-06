import { createClient } from "@/utils/supabase/client";

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  created_at: string;
  updated_at: string;
}

export interface FlashcardDeck {
  id: string;
  title: string;
  flashcards: Flashcard[];
  created_at: string;
  updated_at: string;
}

export async function getFlashcardDecks() {
  const supabase = await createClient();
  
  const { data: decks, error: decksError } = await supabase
    .from('flashcard_decks')
    .select('*')
    .order('updated_at', { ascending: false });
  
  if (decksError) {
    throw decksError;
  }
  
  if (!decks || decks.length === 0) {
    return [] as FlashcardDeck[];
  }
  const { data: flashcardCounts, error: countsError } = await supabase
    .from('flashcards')
    .select('deck_id, id')
    .in('deck_id', decks.map((deck: any) => deck.id));
    
  if (countsError) {
    throw countsError;
  }
  
  const decksWithFlashcards = decks.map((deck: any) => {
    const deckFlashcards = flashcardCounts?.filter((fc: any) => fc.deck_id === deck.id) || [];
    return {
      ...deck,
      flashcards: deckFlashcards.map((fc: any) => ({ id: fc.id } as Flashcard))
    } as FlashcardDeck;
  });
  
  return decksWithFlashcards as FlashcardDeck[];
}

export async function getFlashcardDeckById(deckId: string) {
  const supabase = await createClient();
  
  const { data: deck, error: deckError } = await supabase
    .from('flashcard_decks')
    .select('*')
    .eq('id', deckId)
    .single();
  
  if (deckError) {
    throw deckError;
  }

  const { data: cards, error: cardsError } = await supabase
    .from('flashcards')
    .select('*')
    .eq('deck_id', deckId)
    .order('created_at', { ascending: true });
  
  if (cardsError) {
    throw cardsError;
  }
  
  return {
    ...deck,
    flashcards: cards
  } as FlashcardDeck;
}

export async function createFlashcardDeck(title: string, flashcards: { question: string, answer: string }[], aiPrompt?: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("User must be logged in to create flashcard decks");
  }
  const { data: deck, error: deckError } = await supabase
    .from('flashcard_decks')
    .insert([{ 
      title,
      user_id: user.id,
      ai_prompt: aiPrompt
    }])
    .select('*')
    .single();
  
  if (deckError) {
    throw deckError;
  }
  
  if (flashcards.length > 0) {
    const cardsToInsert = flashcards.map(card => ({
      deck_id: deck.id,
      question: card.question,
      answer: card.answer
    }));
    
    const { error: cardsError } = await supabase
      .from('flashcards')
      .insert(cardsToInsert);
    
    if (cardsError) {
      throw cardsError;
    }
  }
  
  return {
    ...deck,
    flashcards: flashcards.map((fc, index) => ({
      id: `temp-${index}`,
      deck_id: deck.id,
      question: fc.question,
      answer: fc.answer,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }))
  } as FlashcardDeck;
}

export async function deleteFlashcardDeck(deckId: string) {
  const supabase = await createClient();
  
  const { error: cardsError } = await supabase
    .from('flashcards')
    .delete()
    .eq('deck_id', deckId);
  
  if (cardsError) {
    throw cardsError;
  }
  
  const { error: deckError } = await supabase
    .from('flashcard_decks')
    .delete()
    .eq('id', deckId);
  
  if (deckError) {
    throw deckError;
  }
}
