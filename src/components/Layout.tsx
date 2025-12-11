"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { LogOut, User as UserIcon } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

export function Layout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const isAuthPage = pathname === "/login";

  if (isAuthPage) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <main className="flex-1 container mx-auto px-4 py-16">{children}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-700">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform">
              E
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white">English Learning</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-12">
            <Link
              href="/"
              className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 font-medium transition-colors"
            >
              首页
            </Link>
            <Link
              href="/vocabulary"
              className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 font-medium transition-colors"
            >
              词汇
            </Link>
            <Link
              href="/grammar"
              className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 font-medium transition-colors"
            >
              语法
            </Link>
            <Link
              href="/vocabulary?status=reviewing"
              className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 font-medium transition-colors"
            >
              复习
            </Link>
            <Link
              href="/study-plan"
              className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 font-medium transition-colors"
            >
              计划
            </Link>

            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-2" />

            {session ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-1.5 rounded-full transition-colors"
                >
                  {session.user?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-600"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <UserIcon className="w-5 h-5" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{session.user?.name}</span>
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-1 animate-in fade-in slide-in-from-top-2">
                    <button
                      onClick={() => signOut()}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => signIn()}
                className="px-5 py-2 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-all hover:shadow-lg hover:shadow-indigo-500/30 active:scale-95"
              >
                Sign In
              </button>
            )}
          </div>
          {/* Mobile User */}
          <div className="md:hidden flex items-center gap-2">
            {session ? (
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                {session.user?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={session.user.image!} alt={session.user.name || "User"} className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-600" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <UserIcon className="w-5 h-5" />
                  </div>
                )}
              </button>
            ) : (
              <button onClick={() => signIn()} className="px-3 py-1.5 bg-indigo-600 text-white rounded-full text-sm">登录</button>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-1 container mx-auto px-4 py-8">{children}</main>

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} English Learning Platform. All rights reserved.</p>
        </div>
      </footer>
      {/* Mobile Bottom Nav */}
      <div className="sticky bottom-0 left-0 right-0 md:hidden bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-5 text-center">
            <Link href="/" className="py-2 text-xs text-gray-600 dark:text-gray-300">
              <div className="flex flex-col gap-1">
                <span>🏠</span>
                <span>首页</span>
              </div>
            </Link>
            <Link href="/vocabulary" className="py-2 text-xs text-gray-600 dark:text-gray-300">
              <div className="flex flex-col gap-1">
                <span>🏠</span>
                <span>词汇</span>
              </div>
            </Link>
            <Link href="/grammar" className="py-2 text-xs text-gray-600 dark:text-gray-300">
              <div className="flex flex-col gap-1">
                <span>📝</span>
                <span>语法</span>
              </div>
            </Link>
            <Link href="/vocabulary?status=reviewing" className="py-2 text-xs text-gray-600 dark:text-gray-300">
              <div className="flex flex-col gap-1">
                <span>🔄</span>
                <span>复习</span>
              </div>
            </Link>
            <Link href="/study-plan" className="py-2 text-xs text-gray-600 dark:text-gray-300">
              <div className="flex flex-col gap-1">
                <span>📅</span>
                <span>计划</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}