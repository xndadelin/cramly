'use client';

import { Sidebar } from "@/components/ui/sidebar";

export default function Studies() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">Studies</h1>
      </div>
    </div>
  );
}
