'use client'

import { ModeToggle } from "@/components/ModeToggle";
import Link from "next/link";

export function Header() {
  return (
    <header className="w-full fixed top-0 z-50 h-12 px-3 border-b bg-background/80 backdrop-blur-sm flex items-center justify-between">
      <Link href="/" className="font-semibold text-base hover:text-primary">Cramly</Link>
      <div>
        <ModeToggle />
      </div>
    </header>
  );
}
