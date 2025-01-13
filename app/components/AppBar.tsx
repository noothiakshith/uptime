"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function AppBar() {
  const { data: session } = useSession();

  return (
    <header className="w-full border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="text-xl font-bold">
          Uptime
        </div>
        
        {session ? (
          <div className="flex items-center gap-4">
            <span>{session.user?.name}</span>
            <button
               onClick={()=>signOut()}
              className="px-4 py-2 rounded-md bg-gray-900 text-white hover:bg-gray-800 transition-colors"
            >
              Sign out
            </button>
          </div>
        ) : (
          <button
          onClick={()=>signIn()}
            className="px-4 py-2 rounded-md bg-gray-900 text-white hover:bg-gray-800 transition-colors"
          >
            Sign in
          </button>
        )}
      </div>
    </header>
  );
}
