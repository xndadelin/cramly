'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loading } from '@/components/ui/loading';

export default function Signin() {
    const router = useRouter();
    
    useEffect(() => {
        router.replace('/auth');
    }, [router]);
    
    return <Loading />;
}