"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { WordCard } from "@/components/WordCard";
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import type { Word, WordProgress } from "@/types";

// Fetch words from API (paginated)
type VocabPageResp = { words: Word[]; total: number; page: number; totalPages: number };
const fetchWordsPage = async (level: string, query: string, letter: string, status: string, page: number): Promise<VocabPageResp> => {
  const params = new URLSearchParams();
  params.set("level", level);
  if (query) params.set("query", query);
  if (letter && letter !== "all") params.set("letter", letter);
  if (status && status !== "all") params.set("status", status);
  params.set("page", String(page));
  params.set("limit", "200");
  const res = await fetch(`/api/vocabulary?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch vocabulary");
  return (await res.json()) as VocabPageResp;
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
  const router = useRouter();
  const initialLevel = searchParams.get("level") || "all";
  const [level, setLevel] = useState(initialLevel);
  const [query, setQuery] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [letterFilter, setLetterFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState(() => {
    const s = (typeof window !== "undefined" ? new URLSearchParams(searchParams.toString()).get("status") : null) || "all";
    return ["all", "new", "learning", "reviewing", "mastered"].includes(s!) ? s! : "all";
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [needsRefresh, setNeedsRefresh] = useState(false);

  const queryClient = useQueryClient();

  // Data fetching (infinite)
  const {
    data: wordsPages,
    isLoading: isLoadingWords,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["vocabulary", level, query, letterFilter, statusFilter],
    queryFn: ({ pageParam = 1 }) => fetchWordsPage(level, query, letterFilter, statusFilter, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const next = lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined;
      return next;
    },
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
      setNeedsRefresh(true);
    },
  });

  // Processing words with filters (now all server-side)
  const words: Word[] = (wordsPages?.pages || []).flatMap((p) => p.words) || [];
  const progressMap: Record<string, WordProgress> = {};
  if (progressData) {
    progressData.forEach((p: WordProgress) => {
      progressMap[p.wordId] = p;
    });
  }

  const filteredWords = words;

  // Infinite scroll observer
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      });
    });
    io.observe(el);
    return () => io.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, level, query, letterFilter, statusFilter]);

  // Sync level to URL on change (avoid loops)
  useEffect(() => {
    const currentLevel = (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('level') : null) || 'all';
    if (currentLevel !== level) {
      const sp = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
      sp.set('level', level);
      router.replace(`/vocabulary?${sp.toString()}`);
    }
  }, [level, router]);

  const currentWord = filteredWords[currentWordIndex];
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  // Handlers
  const handleStartLearning = () => {
    setCurrentWordIndex(0);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (needsRefresh) {
      queryClient.invalidateQueries({ queryKey: ["progress"] });
      setNeedsRefresh(false);
    }
  };

  

  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">词汇</h1>
          <div className="flex flex-wrap gap-2 ml-4">
            {[
              { key: "all", label: "全部" },
              { key: "junior", label: "初中" },
              { key: "senior", label: "高中" },
              { key: "cet4", label: "英4" },
              { key: "ielts", label: "雅思" },
            ].map((opt) => (
              <button
                key={opt.key}
                onClick={() => { setLevel(opt.key); setCurrentWordIndex(0); }}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  level === opt.key
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

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
            <p className="text-gray-600 dark:text-gray-400">共找到 {(wordsPages?.pages?.[0]?.total ?? filteredWords.length)} 个单词</p>
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
          <div ref={loadMoreRef} className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
            {isFetchingNextPage ? "加载中..." : hasNextPage ? "上拉加载更多" : "已无更多"}
          </div>
          {isModalOpen && currentWord && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
              onClick={handleCloseModal}
            >
              <div className="relative w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <WordCard
                  word={currentWord}
                  progress={progressMap[currentWord.id]}
                  mode="learn"
                  onNext={() => {
                    if (currentWordIndex < filteredWords.length - 1) {
                      setCurrentWordIndex((prev) => prev + 1);
                    } else {
                      handleCloseModal();
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
