'use client';

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { signOut } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export default function Dashboard() {
  const { user, loading } = useCurrentUser();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      const { error } = await signOut();
      if (error) {
        console.error("Sign out error:", error);
      }
      router.push("/");
    } catch (error) {
      console.error("Sign out exception:", error);
      router.push("/");
    } finally {
      setIsSigningOut(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin" />
        <p className="mt-4">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button 
          onClick={handleSignOut} 
          variant="outline" 
          disabled={isSigningOut}
        >
          {isSigningOut ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Signing out...
            </>
          ) : (
            'Sign out'
          )}
        </Button>
      </div>  
      
      <div className="bg-card rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Welcome, {user.user_metadata?.full_name || user.email || "User"}!</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-muted-foreground">Email:</p>
            <p>{user.email || "No email provided"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Last sign in:</p>
            <p>{new Date(user.last_sign_in_at || "").toLocaleString()}</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-2">Notes</h3>
          <p className="text-muted-foreground">Create and manage your notes.</p>
          <Link href="/dashboard/notes" className="mt-4 inline-block">
            <Button variant="outline">View notes</Button>
          </Link>
        </div>
        
        <div className="bg-card rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-2">Flashcards</h3>
          <p className="text-muted-foreground">Review and create flashcard decks for effective learning.</p>
          <Link href="/dashboard/flashcards" className="mt-4 inline-block">
            <Button variant="outline">Access flashcards</Button>
          </Link>
        </div>
        
        <div className="bg-card rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-2">AI tutor</h3>
          <p className="text-muted-foreground">Get personalized help from our AI tutor.</p>
          <Link href="/tutor" className="mt-4 inline-block">
            <Button variant="outline">Start learning</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
