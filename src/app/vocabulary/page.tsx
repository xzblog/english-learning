"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { WordCard } from "@/components/WordCard";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search } from "lucide-react";
import type { Word, WordProgress } from "@/types";

// Fetch words from API
const fetchWords = async (level: string, query: string) => {
  const res = await fetch(`/api/vocabulary?level=${level}&query=${query}&limit=1000`);
  if (!res.ok) throw new Error("Failed to fetch vocabulary");
  return res.json();
};

// Fetch user progress
const fetchProgress = async () => {
  const res = await fetch("/api/progress");
  if (res.status === 401) return []; // Not logged in
  if (!res.ok) throw new Error("Failed to fetch progress");
  return res.json();
};

function VocabularyContent() {
  const searchParams = useSearchParams();
  const level = searchParams.get("level") || "all";
  const [query, setQuery] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [letterFilter, setLetterFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState(() => {
    const s = (typeof window !== "undefined" ? new URLSearchParams(searchParams.toString()).get("status") : null) || "all";
    return ["all", "new", "learning", "reviewing", "mastered"].includes(s!) ? s! : "all";
  });

  const queryClient = useQueryClient();

  // Data fetching
  const { data: wordsData, isLoading: isLoadingWords } = useQuery({
    queryKey: ["vocabulary", level, query],
    queryFn: () => fetchWords(level, query),
  });

  const { data: progressData } = useQuery({
    queryKey: ["progress"],
    queryFn: fetchProgress,
  });

  

  // Mutations
  const updateProgressMutation = useMutation({
    mutationFn: async ({ wordId, status, correct }: { wordId: string; status?: string; correct?: boolean }) => {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wordId, status, correct }),
      });
      if (!res.ok) throw new Error("Failed to update progress");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progress"] });
    },
  });

  // Processing words with filters
  const words: Word[] = wordsData?.words || [];
  const progressMap: Record<string, WordProgress> = {};
  if (progressData) {
    progressData.forEach((p: WordProgress) => {
      progressMap[p.wordId] = p;
    });
  }

  const filteredWords = words.filter((word) => {
    // Letter filter
    if (letterFilter !== "all" && word.word[0].toUpperCase() !== letterFilter) return false;

    // Status filter
    const status = progressMap[word.id]?.status || "new";
    if (statusFilter !== "all") {
      if (statusFilter === "new" && status !== "new") return false;
      if (statusFilter === "learning" && status !== "learning" && status !== "reviewing") return false;
      if (statusFilter === "mastered" && status !== "mastered") return false;
    }

    return true;
  });

  const currentWord = filteredWords[currentWordIndex];
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  // Handlers
  const handleStartLearning = () => {
    setCurrentWordIndex(0);
    setIsModalOpen(true);
  };

  

  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {level === "senior" ? "高中词汇" : level === "junior" ? "初中词汇" : "全部词汇"}
        </h1>

        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="搜索单词..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {isLoadingWords ? (
        <div className="text-center py-12">加载中...</div>
      ) : (
        <div className="space-y-6">
          {/* Filters */}
          <div className="space-y-4">
            {/* Status Filter */}
            <div className="flex flex-wrap gap-2">
              {["all", "new", "learning", "mastered"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    statusFilter === status
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
                  }`}
                >
                  {status === "all" ? "全部" : status === "new" ? "新词" : status === "learning" ? "学习中" : "已掌握"}
                </button>
              ))}
            </div>

            {/* Letter Filter */}
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => setLetterFilter("all")}
                className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                  letterFilter === "all"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
                }`}
              >
                全部
              </button>
              {letters.map((letter) => (
                <button
                  key={letter}
                  onClick={() => setLetterFilter(letter)}
                  className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                    letterFilter === letter
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
                  }`}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex justify-between items-center">
            <p className="text-gray-600 dark:text-gray-400">共找到 {filteredWords.length} 个单词</p>
            {filteredWords.length > 0 && (
              <button
                onClick={handleStartLearning}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                开始学习
              </button>
            )}
          </div>

          {/* Word Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredWords.map((word, index) => {
              const progress = progressMap[word.id];
              return (
                <div
                  key={word.id}
                  onClick={() => {
                    setCurrentWordIndex(index);
                    setIsModalOpen(true);
                    // Do not automatically mark as learning on click, wait for card interaction
                  }}
                  className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-indigo-500 cursor-pointer transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{word.word}</h3>
                    {progress?.status && progress.status !== "new" && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          progress.status === "mastered"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {progress.status === "learning" ? "学习中" : progress.status === "reviewing" ? "复习中" : "已掌握"}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 font-serif mb-2">{word.phonetic}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{word.meanings[0]?.definition}</p>
                </div>
              );
            })}
          </div>
          {isModalOpen && currentWord && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
              onClick={() => setIsModalOpen(false)}
            >
              <div className="relative w-full max-w-xl" onClick={(e) => e.stopPropagation()}>
                <WordCard
                  word={currentWord}
                  progress={progressMap[currentWord.id]}
                  mode="learn"
                  onNext={() => {
                    if (currentWordIndex < filteredWords.length - 1) {
                      setCurrentWordIndex((prev) => prev + 1);
                    } else {
                      setIsModalOpen(false);
                    }
                  }}
                  onMarkLearning={(wordId) => updateProgressMutation.mutate({ wordId, status: "learning" })}
                  onMarkMastered={(wordId) => updateProgressMutation.mutate({ wordId, status: "mastered", correct: true })}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function VocabularyPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8 text-center">词汇加载中...</div>}>
      <VocabularyContent />
    </Suspense>
  );
}
