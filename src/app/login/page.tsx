"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Github, Chromium } from "lucide-react";
import { Suspense } from "react";

function LoginContent() {
  const params = useSearchParams();
  const error = params.get("error");

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-12">
      <Link href="/" className="flex flex-col items-center gap-6 mb-12">
        <div className="w-20 h-20 bg-indigo-600 rounded-lg flex items-center justify中心 text-white font-bold text-4xl">E</div>
        <span className="text-2xl font-bold text-gray-900 dark:text-white">English Learning</span>
      </Link>
      {error && (
        <div className="mb-4 text-sm text-red-600 dark:text-red-400">
          {error === "OAuthAccountNotLinked" ? "该邮箱已绑定其他登录方式，请用原方式登录" : "登录失败，请稍后重试"}
        </div>
      )}

      <div className="space-y-6">
        <button
          onClick={() => signIn("github", { callbackUrl: "/?signedIn=1" })}
          className="w-full cursor-pointer flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-black transition-colors"
        >
          <Github className="w-5 h-5" />
          使用 GitHub 登录
        </button>
        {/* <button
          onClick={() => signIn("google")}
          className="w-full cursor-pointer flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-black transition-colors"
        >
          <Chromium className="w-5 h-5" />
          使用 Google 登录
        </button> */}
      </div>

      <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
        登录后可同步学习进度与学习计划
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-16 text-center">加载中...</div>}>
      <LoginContent />
    </Suspense>
  );
}
