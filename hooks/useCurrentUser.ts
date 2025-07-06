import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from '@/lib/auth';
import { User } from '@supabase/supabase-js';

export function useCurrentUser(redirectIfAuthenticated = false, redirectPath = '/dashboard') {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const { user, error } = await getUser();
        
        if (error) {
          console.error('Authentication error:', error);
          setUser(null);
          
          if (!redirectIfAuthenticated) {
            router.replace('/auth');
            return;
          }
        } else if (user) {
          setUser(user);
          
          if (redirectIfAuthenticated) {
            router.replace(redirectPath);
            return;
          }
        } else {
          setUser(null);
          if (!redirectIfAuthenticated) {
            router.replace('/auth');
            return;
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setUser(null);
        
        if (!redirectIfAuthenticated) {
          router.replace('/auth');
          return;
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [redirectIfAuthenticated, redirectPath, router]);

  return { user, loading };
}
