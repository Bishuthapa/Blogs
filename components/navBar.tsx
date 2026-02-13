"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function NavBar() {
  return (
    <nav>
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 text-base">
        <Link
          href="/"
          className="font-semibold tracking-wide hover:opacity-80 hover:text-amber-700"
        >
          MyBlog
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/home" className="hover:underline hover:text-amber-700">
            Home
          </Link>
          <Link href="/profile" className="hover:underline hover:text-amber-700">
            Profile
          </Link>
        </div>
        <ThemeToggle />
      </div>
    </nav>
  );
}
