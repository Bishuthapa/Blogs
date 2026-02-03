"use client";

import { usePathname } from "next/navigation";
import NavBar from "./navBar";

const HIDDEN_NAV_PATHS = ["/login", "/signup", "/forgot-password", "/reset-password", "/verify-email"];

export default function NavWrapper() {
  const pathname = usePathname();

  const shouldHideNav = HIDDEN_NAV_PATHS.some((path) =>
    pathname.startsWith(path)
  );

  if (shouldHideNav) {
    return null;
  }

  return <NavBar />;
}

