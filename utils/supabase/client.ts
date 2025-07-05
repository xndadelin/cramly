
import { createBrowserClient } from "@supabase/ssr";
import { isClient } from "../client-utils";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const createClient = () => {
  if (!isClient) {
    console.warn("Attempted to create Supabase client on the server side");
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: new Error("Server side rendering") }),
        signInWithOAuth: async () => ({ data: null, error: new Error("Server side rendering") }),
        signOut: async () => ({ error: null }),
      }
    } as any;
  }
  
  if (!supabaseUrl || !supabaseKey) {
    console.error("Supabase environment variables are missing!");
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: new Error("Missing configuration") }),
        signInWithOAuth: async () => ({ data: null, error: new Error("Missing configuration") }),
        signOut: async () => ({ error: null }),
      }
    } as any;
  }
  
  return createBrowserClient(
    supabaseUrl,
    supabaseKey,
    {
      auth: {
        flowType: 'pkce',
        persistSession: true,
        detectSessionInUrl: true,
        autoRefreshToken: true,
        debug: true
      },
      global: {
        fetch: (...args) => {
          return fetch(...args).catch(error => {
            console.error('Supabase fetch error:', error);
            throw error;
          });
        }
      }
    }
  );
};
