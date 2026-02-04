"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function NavBar() {
  return (
    <nav>
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 text-base">
        <Link
          href="/profile"
          className="font-semibold tracking-wide hover:opacity-80"
        >
          MyBlog
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/home" className="hover:underline">
            Home
          </Link>
          <Link href="/profile" className="hover:underline">
            Profile
          </Link>
        </div>
        <ThemeToggle />
      </div>
    </nav>
  );
}
