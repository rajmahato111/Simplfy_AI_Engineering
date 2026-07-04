"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export function AuthNav() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <span className="hidden text-sm text-zinc-400 sm:inline">…</span>;
  }

  if (session?.user) {
    return (
      <div className="hidden items-center gap-1 sm:flex">
        <span className="max-w-[7rem] truncate px-1 text-sm text-zinc-500 lg:max-w-[9rem]">
          {session.user.name ?? session.user.email}
        </span>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="whitespace-nowrap rounded-md px-2.5 py-2 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className="hidden whitespace-nowrap rounded-md px-2.5 py-2 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 sm:inline"
    >
      Sign in
    </Link>
  );
}
