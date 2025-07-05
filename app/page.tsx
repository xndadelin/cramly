"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, Brain, GraduationCap, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/lib/auth";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { user, error } = await getUser();
        if (error) {
          console.error("Auth error:", error);
          return;
        }
        
        if (user) {
          router.replace('/dashboard');
        }
      } catch (error) {
        console.error("Failed to check authentication:", error);
      }
    };
    
    checkAuth();
  }, [router]);
  
  return (
    <div className="flex flex-col items-center min-h-screen">
      <section className="container flex flex-col items-center justify-center py-24 text-center space-y-10">
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Study smarter with <span className="relative">Cramly</span>
          </h1>
          <p className="mx-auto max-w-[700px] text-lg md:text-xl">
            The AI-powered study tool that helps students master any subject through personalized learning experiences.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Button size="lg" asChild>
              <Link href="/auth">
                Get started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
        
        <div className="relative w-full max-w-3xl aspect-video rounded-xl overflow-hidden border shadow-xl">
          <Image
            src="/app-preview.svg"
            alt="cramly preview"
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>

      <section className="container py-16 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">Transform your study experience</h2>
          <p className="mx-auto max-w-[700px] text-lg">
            Powerful features designed to make learning efficient and effective.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Sparkles className="h-6 w-6 mb-2" />
              <CardTitle>AI-powered tutoring</CardTitle>
              <CardDescription>
                Get instant help with challenging concepts and problems.
              </CardDescription>
            </CardHeader>
            <CardContent>
              Study with an AI tutor that adapts to your learning style and helps you overcome obstacles in real time.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Brain className="h-6 w-6 mb-2" />
              <CardTitle>Smart flashcards</CardTitle>
              <CardDescription>
                Memorize more effectively with spaced repetition.
              </CardDescription>
            </CardHeader>
            <CardContent>
              Our flashcard system adjusts to your performance, focusing on areas where you need the most practice.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <BookOpen className="h-6 w-6 mb-2" />
              <CardTitle>Comprehensive notes</CardTitle>
              <CardDescription>
                Organize and synthesize information efficiently.
              </CardDescription>
            </CardHeader>
             <CardContent>
              Create, search, and link your notes with AI assistance to build a personal knowledge base.
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="container py-16">
        <Card className="bg-muted/50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Ready to improve your academic performance?</CardTitle>
            <CardDescription>Join thousands of students already using Cramly.</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button size="lg" asChild>
              <Link href="/auth">
                Start for free <GraduationCap className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </section>
    </div>
  );
}
