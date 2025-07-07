'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { signOut } from '@/lib/auth';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import Image from 'next/image';

export function UserProfileDropdown() {
    const { user, loading } = useCurrentUser();
    const [isSigningOut, setIsSigningOut] = useState(false);

    const handleSignOut = async () => {
        try {
            setIsSigningOut(true);
            const { error } = await signOut();
            if (error) {
                console.error('Sign out error:', error);
            }
            window.location.href = '/';
        } catch (error) {
            console.error('Sign out exception:', error);
            window.location.href = '/';
        } finally {
            setIsSigningOut(false);
        }
    };

    if (loading) {
        return <div className="h-8 w-8 rounded-full bg-muted animate-pulse"></div>;
    }

    if (!user) {
        return null;
    }

    const getInitials = () => {
        const name = user.user_metadata?.full_name || user.email || '';
        if (!name) return '?';

        const parts = name.split(' ');
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }

        if (name.includes('@')) {
            return name[0].toUpperCase();
        }

        return name.substring(0, 2).toUpperCase();
    };

    const getProfileImageUrl = () => {
        return (
            user.user_metadata?.avatar_url
        );
    };

    const avatarUrl = getProfileImageUrl();
    const initials = getInitials();
    const userDisplayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';

    return (
        <div className="relative">
            <div className="group">
                <button
                    className="flex items-center rounded-md overflow-hidden focus:outline-none focus:ring-1 focus:ring-primary hover:opacity-90 transition-opacity"
                    aria-label="User menu"
                    aria-haspopup="true"
                >
                    {avatarUrl ? (
                        <div className="h-7 w-7 relative overflow-hidden border border-muted/20">
                            <Image
                                src={avatarUrl}
                                alt={userDisplayName}
                                fill
                                className="object-cover"
                                sizes="28px"
                                unoptimized
                            />
                        </div>
                    ) : (
                        <div className="h-7 w-7 bg-transparent backdrop-blur-md flex items-center justify-center text-xs font-medium text-primary border border-muted/20">
                            {initials}
                        </div>
                    )}
                </button>

                <div className="absolute right-0 top-full mt-1 w-48 bg-transparent backdrop-blur-md border border-muted/10 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                    <div className="p-2 border-b border-muted/10">
                        <p className="text-sm font-medium truncate">{userDisplayName}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <div className="p-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-xs h-8 hover:bg-background/5"
                            onClick={handleSignOut}
                            disabled={isSigningOut}
                        >
                            {isSigningOut ? (
                                <span className="flex items-center">
                                    <div className="h-3 w-3 mr-2 rounded-full border-2 border-muted-foreground border-t-transparent animate-spin"></div>
                                    Signing out...
                                </span>
                            ) : (
                                <span className="flex items-center">
                                    <LogOut className="mr-2 h-3 w-3" />
                                    Log out
                                </span>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
