'use client';

import { useEffect, useState } from 'react';
import { getUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export const useAuth = (redirectTo: string = '/dashboard', redirectIfAuthenticated: boolean = true) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      setLoading(true);
      try {
        if (typeof window !== 'undefined' && window.location.hash && window.location.hash.includes('access_token')) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        const { user: currentUser, error } = await getUser();
        
        if (error) {
          console.error('Error checking authentication:', error); 
          
          setUser(null);
          setLoading(false);
          return;
        }
        
        setUser(currentUser || null);
        
        if (redirectIfAuthenticated && currentUser) {
          router.replace(redirectTo);
          return;
        } else if (!redirectIfAuthenticated && !currentUser) {
          router.replace('/auth');
          return;
        }
      } catch (error) {
        console.error('Authentication check error:', error);
        setUser(null);
      }
      
      setLoading(false);
    };

    checkUser();
  }, [router, redirectTo, redirectIfAuthenticated]);

  return { user, loading };
};
