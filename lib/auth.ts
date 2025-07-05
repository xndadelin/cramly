import { createClient } from "@/utils/supabase/client";
import { getAuthStorage, setAuthStorage, clearAuthStorage } from "@/utils/auth-storage";

export const authSlack = async () => {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'slack_oidc',
        options: {
            redirectTo: `${window.location.origin}/auth`,
            queryParams: {
                prompt: 'consent'
            }
        }
    });

    return { data, error };
}

export const authGithub = async () => {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
            redirectTo: `${window.location.origin}/auth`,
            queryParams: {
                prompt: 'consent'
            }
        }
    });
    
    return { data, error };
}

export const authDiscord = async () => {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'discord',
        options: {
            redirectTo: `${window.location.origin}/auth`,
            queryParams: {
                prompt: 'consent'
            }
        }
    });

    return { data, error };
}

export const getUser = async () => {
    const supabase = await createClient();
    
    try {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.hash.substring(1));
            const accessToken = params.get('access_token');
            const refreshToken = params.get('refresh_token');
            
            if (accessToken && refreshToken) {
                await supabase.auth.setSession({
                    access_token: accessToken,
                    refresh_token: refreshToken
                });
            }
        }
        
        const {
            data: { user }, 
            error
        } = await supabase.auth.getUser();
        
        return { user, error };
    } catch (error) {
        console.log("Auth error caught:", error);
        return { user: null, error: error };
    }
}

export const signOut = async () => {
    try {
        clearAuthStorage();
        const supabase = await createClient();
        const { error } = await supabase.auth.signOut();
        
        return { error };
    } catch (error) {
        console.error('Error during sign out:', error);
        return { error };
    }
}