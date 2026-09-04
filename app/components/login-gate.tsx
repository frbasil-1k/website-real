"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { GlobalNavigation } from "./global-navigation";
import { SiteFooter } from "./site-footer";

export default function LoginGate({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const loggedIn = localStorage.getItem("dbce-logged-in");

    if (!loggedIn && pathname !== "/login") {
      router.replace("/login");
      return;
    }

    if (loggedIn && pathname === "/login") {
      router.replace("/");
      return;
    }

    setChecking(false);
  }, [pathname, router]);

  if (checking) {
    return (
      <div className="min-h-screen bg-background" />
    );
  }

  // Login page gets NO navbar or footer
  if (pathname === "/login") {
    return <>{children}</>;
  }

  // All normal website pages get navbar + footer
  return (
    <>
      <GlobalNavigation />

      {children}

      <SiteFooter />
    </>
  );
}