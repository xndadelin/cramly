import { createClient } from "@/utils/supabase/client";


export const authSlack = async () => {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'slack_oidc',
    });

    return { data, error };
}

export const authGithub = async () => {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
    });
    
    return { data, error };
}

export const authDiscord = async () => {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'discord',
    });

    return { data, error };
}

export const getUser = async () => {
    const supabase = await createClient();
    const {
        data: { user }, 
        error
    } = await supabase.auth.getUser();
    
    return { user, error };
}

export const signOut = async () => {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    return { error };
}