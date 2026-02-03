"use client";

import ThemeToggle from "./ThemeToggle";

export default function NavBar() {
  return (
    <nav className="border-b border-black/10 bg-[var(--background)] text-[var(--foreground)] dark:border-white/10">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 text-base">
        <a href="/profile" className="font-semibold tracking-wide hover:opacity-80">
          MyBlog
        </a>
        <div className="flex items-center gap-4">
          <a href="/profile" className="hover:underline">
            Home
          </a>
          <a className="hover:underline">About</a>
        </div>
        <ThemeToggle />
      </div>
    </nav>
  );
}