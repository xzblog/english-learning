"use client";

import { useMemo, useState, Suspense } from "react";
import { PenTool, Search } from "lucide-react";
import { grammarRules } from "@/data/grammar";
import type { GrammarCategory, GrammarRule } from "@/types";

function GrammarContent() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<GrammarCategory | "all">("all");

  const filtered: GrammarRule[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    return grammarRules.filter((r) => {
      if (category !== "all" && r.category !== category) return false;
      if (!q) return true;
      return (
        r.title.toLowerCase().includes(q) ||
        r.titleCn.includes(query) ||
        r.description.includes(query) ||
        r.structure.includes(query) ||
        r.examples.some((e) => e.en.toLowerCase().includes(q) || e.cn.includes(query))
      );
    });
  }, [query, category]);

  const categories: Array<{ key: GrammarCategory | "all"; label: string }> = [
    { key: "all", label: "全部" },
    { key: "tense", label: "时态" },
    { key: "clause", label: "从句" },
    { key: "sentence", label: "句型" },
    { key: "mood", label: "语气" },
    { key: "non-finite", label: "非谓语" },
  ];

  return (
    <div className="container mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
          <PenTool className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">英语语法</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1 min-w-0">
          <input
            type="text"
            placeholder="搜索语法点或例句..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setCategory(c.key)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                category === c.key
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">共 {filtered.length} 条语法点</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((rule) => (
          <details key={rule.id} className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <summary className="cursor-pointer list-none p-4 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{rule.title}（{rule.titleCn}）</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{rule.description}</p>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                {rule.category}
              </span>
            </summary>
            <div className="px-4 pb-4 space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">结构</p>
                <div className="mt-1 px-3 py-2 rounded bg-gray-50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-100 text-sm">
                  {rule.structure}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">例句</p>
                <ul className="mt-1 space-y-2">
                  {rule.examples.map((ex, idx) => (
                    <li key={idx} className="text-sm text-gray-800 dark:text-gray-100">
                      <span className="font-mono">{ex.en}</span>
                      <span className="text-gray-500 dark:text-gray-400"> — {ex.cn}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {rule.tips && rule.tips.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">提示</p>
                  <ul className="mt-1 list-disc pl-5 text-sm text-gray-700 dark:text-gray-300">
                    {rule.tips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

export default function GrammarPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8 text-center">Loading grammar...</div>}>
      <GrammarContent />
    </Suspense>
  );
}
