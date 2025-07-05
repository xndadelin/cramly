'use client';

import { Button } from "@/components/ui/button";
import { authSlack, authGithub, authDiscord } from "@/lib/auth";
import { Github, MessageSquare, Loader2 } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { Loading } from "@/components/ui/loading";
import { useState } from "react";

export default function Auth() {
    const { user, loading } = useAuth('/dashboard', true);
    const [isAuthenticating, setIsAuthenticating] = useState<string | null>(null);

    const isProcessingAuth = typeof window !== 'undefined' && 
        (window.location.hash.includes('access_token') || 
         window.location.search.includes('code='));

    const handleSlackSignIn = async () => {
        try {
            setIsAuthenticating('slack');
            const { data, error } = await authSlack();
            if (error) {
                console.error("Slack auth error:", error);
            }
        } catch (error) {
            console.error("Slack auth exception:", error);
        } finally {
            setIsAuthenticating(null);
        }
    };

    const handleGithubSignIn = async () => {
        try {
            setIsAuthenticating('github');
            const { data, error } = await authGithub();
            if (error) {
                console.error("GitHub auth error:", error);
            }
        } catch (error) {
            console.error("GitHub auth exception:", error);
        } finally {
            setIsAuthenticating(null);
        }
    };

    const handleDiscordSignIn = async () => {
        try {
            setIsAuthenticating('discord');
            const { data, error } = await authDiscord();
            if (error) {
                console.error("Discord auth error:", error);
            }
        } catch (error) {
            console.error("Discord auth exception:", error);
        } finally {
            setIsAuthenticating(null);
        }
    };

    if (loading || isProcessingAuth) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <Loading />
                <p className="mt-4 text-lg">
                    {isProcessingAuth ? "Processing authentication..." : "Loading..."}
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <section className="container flex flex-col items-center justify-center py-24 text-center space-y-10">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                    Sign in to Cramly
                </h1>
                <p className="mx-auto max-w-[700px] text-lg md:text-xl">
                    Choose one of the authentication methods to continue.
                </p>

                <div className="flex flex-col w-full max-w-sm gap-4 mt-4">
                    <Button 
                        variant="outline" 
                        onClick={handleSlackSignIn}
                        disabled={isAuthenticating !== null}
                        className="flex items-center justify-center gap-3 h-12 text-white bg-[#4A154B] hover:bg-[#3e1040] border-0"
                    >
                        {isAuthenticating === 'slack' ? (
                            <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        ) : (
                            <svg 
                                viewBox="0 0 24 24" 
                                width="22" 
                                height="22" 
                                fill="currentColor"
                            >
                                <path d="M5.042,15.165 C5.042,16.486 3.973,17.555 2.652,17.555 C1.331,17.555 0.262,16.486 0.262,15.165 C0.262,13.844 1.331,12.775 2.652,12.775 L5.042,12.775 L5.042,15.165 Z M6.238,15.165 C6.238,13.844 7.307,12.775 8.628,12.775 C9.949,12.775 11.018,13.844 11.018,15.165 L11.018,21.142 C11.018,22.463 9.949,23.532 8.628,23.532 C7.307,23.532 6.238,22.463 6.238,21.142 L6.238,15.165 Z M8.628,5.042 C7.307,5.042 6.238,3.973 6.238,2.652 C6.238,1.331 7.307,0.262 8.628,0.262 C9.949,0.262 11.018,1.331 11.018,2.652 L11.018,5.042 L8.628,5.042 Z M8.628,6.238 C9.949,6.238 11.018,7.307 11.018,8.628 C11.018,9.949 9.949,11.018 8.628,11.018 L2.652,11.018 C1.331,11.018 0.262,9.949 0.262,8.628 C0.262,7.307 1.331,6.238 2.652,6.238 L8.628,6.238 Z M18.752,8.628 C18.752,7.307 19.821,6.238 21.142,6.238 C22.463,6.238 23.532,7.307 23.532,8.628 C23.532,9.949 22.463,11.018 21.142,11.018 L18.752,11.018 L18.752,8.628 Z M17.555,8.628 C17.555,9.949 16.486,11.018 15.165,11.018 C13.844,11.018 12.775,9.949 12.775,8.628 L12.775,2.652 C12.775,1.331 13.844,0.262 15.165,0.262 C16.486,0.262 17.555,1.331 17.555,2.652 L17.555,8.628 Z M15.165,18.752 C16.486,18.752 17.555,19.821 17.555,21.142 C17.555,22.463 16.486,23.532 15.165,23.532 C13.844,23.532 12.775,22.463 12.775,21.142 L12.775,18.752 L15.165,18.752 Z M15.165,17.555 C13.844,17.555 12.775,16.486 12.775,15.165 C12.775,13.844 13.844,12.775 15.165,12.775 L21.142,12.775 C22.463,12.775 23.532,13.844 23.532,15.165 C23.532,16.486 22.463,17.555 21.142,17.555 L15.165,17.555 Z" />
                            </svg>
                        )}
                        {isAuthenticating === 'slack' ? 'Signing in...' : 'Continue with Slack'}
                    </Button>
                    
                    <Button 
                        variant="outline" 
                        onClick={handleGithubSignIn}
                        disabled={isAuthenticating !== null}
                        className="flex items-center justify-center gap-3 h-12 text-white bg-[#24292e] hover:bg-[#1a1e22] border-0"
                    >
                        {isAuthenticating === 'github' ? (
                            <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        ) : (
                            <Github className="w-5 h-5" />
                        )}
                        {isAuthenticating === 'github' ? 'Signing in...' : 'Continue with GitHub'}
                    </Button>
                    
                    <Button 
                        variant="outline" 
                        onClick={handleDiscordSignIn}
                        disabled={isAuthenticating !== null}
                        className="flex items-center justify-center gap-3 h-12 text-white bg-[#5865F2] hover:bg-[#4752c4] border-0"
                    >
                        {isAuthenticating === 'discord' ? (
                            <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        ) : (
                            <svg 
                                width="22" 
                                height="22" 
                                viewBox="0 0 127.14 96.36" 
                                fill="currentColor"
                            >
                                <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
                            </svg>
                        )}
                        {isAuthenticating === 'discord' ? 'Signing in...' : 'Continue with Discord'}
                    </Button>
                </div>
            </section>
        </div>
    );
}