'use client'

import { ModeToggle } from "@/components/ModeToggle";
import { UserProfileDropdown } from "@/components/user-profile-dropdown";
import Link from "next/link";

export function Header() {
  return (
    <header className="w-full fixed top-0 z-50 h-12 px-4 border-b border-muted/10 bg-transparent backdrop-blur-md flex items-center justify-between">
      <Link href="/" className="font-semibold text-base hover:opacity-70 transition-opacity">Cramly</Link>
      <div className="flex items-center gap-3">
        <ModeToggle />
      </div>
    </header>
  );
}
