'use client'

import { ModeToggle } from "@/components/ModeToggle";

export function Header() {
  return (
    <header className="w-full p-4 flex items-center justify-between">
      <div className="font-bold text-xl">Cramly</div>
      <div>
        <ModeToggle />
      </div>
    </header>
  );
}
