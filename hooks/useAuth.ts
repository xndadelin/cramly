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
        const { user: currentUser, error } = await getUser();
        
        if (error) {
          console.error('Error checking authentication:', error);
        }
        
        setUser(currentUser || null);
        
        if (redirectIfAuthenticated && currentUser) {
          router.replace(redirectTo);
          return;
        } else if (!redirectIfAuthenticated && !currentUser) {
          router.replace('/signin');
          return;
        }
      } catch (error) {
        console.error('Authentication check error:', error);
      }
      
      setLoading(false);
    };

    checkUser();
  }, [router, redirectTo, redirectIfAuthenticated]);

  return { user, loading };
};
