"use client";

import { usePathname, useRouter } from "next/navigation";

/**
 * Header link for "Biblioteca" that navigates to the inline scroll section
 * on the main page instead of the separate /cases route.
 *
 * - If already on "/", dispatches a custom event so HomePage can scroll to the section.
 * - If on any other page, navigates to "/?view=biblioteca".
 */
export default function BibliotecaNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (pathname === "/") {
      // Already on main page — tell HomePage to scroll to Biblioteca
      window.dispatchEvent(new CustomEvent("navigate-biblioteca"));
    } else {
      // Navigate to main page with query param
      router.push("/?view=biblioteca");
    }
  };

  return (
    <a href="/#biblioteca" onClick={handleClick} className="site-nav-link">
      Biblioteca
    </a>
  );
}
