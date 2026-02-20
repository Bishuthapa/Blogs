"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function NavBar() {
  return (
    <nav>
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 text-base">
        <Link
          href="/blog"
          className="font-semibold tracking-wide hover:opacity-80 hover:text-amber-700"
        >
          Blogs
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/" className="hover:underline hover:text-amber-700">
            Home
          </Link>
          <Link href="/blog/create-blog" className="hover:underline hover:text-amber-700">
            Create
          </Link>
        </div>
        <ThemeToggle />
      </div>
    </nav>
  );
}
