'use client';

import { ReactNode } from 'react';
import { DashboardNav } from '@/components/dashboard-nav';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="md:w-52 p-3 md:border-r md:min-h-screen">
        <div className="mb-4">
          <h1 className="text-base font-medium">Dashboard</h1>
        </div>
        <DashboardNav />
      </div>
      
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
