
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const createClient = async (cookieStorePromise: ReturnType<typeof cookies>) => {
  try {
    if (!supabaseUrl || !supabaseKey) {
      console.error("Supabase environment variables are missing!");
      throw new Error("Missing Supabase configuration");
    }
    
    const cookieStore = await cookieStorePromise;
    return createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          getAll() {
            try {
              return cookieStore.getAll();
            } catch (err) {
              console.error("Error getting cookies:", err);
              return [];
            }
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
            } catch (err) {
              console.warn("Could not set cookies in server component:", err);
            }
          },
        },
      },
    );
  } catch (error) {
    console.error("Error creating server client:", error);
    throw error;
  }
};
