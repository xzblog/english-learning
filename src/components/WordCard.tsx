"use client";
 
import { useState, useEffect } from "react";
import { Volume2, Star, ChevronDown, ChevronUp } from "lucide-react";
import type { Word, WordProgress } from "@/types";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface WordCardProps {
  word: Word;
  progress?: WordProgress;
  mode: "learn" | "review" | "view";
  onNext?: () => void;
  onAnswer?: (correct: boolean) => void;
  onToggleFavorite?: (id: string) => void;
  onMarkLearning?: (id: string) => void;
  onMarkMastered?: (id: string) => void;
  isFavorite?: boolean;
}

export function WordCard({
  word,
  progress,
  mode,
  onNext,
  onToggleFavorite,
  onMarkLearning,
  onMarkMastered,
  isFavorite,
}: WordCardProps) {
  const [flipped, setFlipped] = useState(false);
  const [showExample, setShowExample] = useState(true);
  const [ttsVoice, setTtsVoice] = useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    const pickVoice = () => {
      if (!("speechSynthesis" in window)) return;
      const voices = window.speechSynthesis.getVoices();
      const enVoices = voices.filter((v) => (v.lang || "").toLowerCase().startsWith("en"));
      const preferred = enVoices.find((v) => {
        const name = (v.name || "").toLowerCase();
        return (
          name.includes("samantha") ||
          name.includes("female") ||
          name.includes("jenny") ||
          name.includes("aria") ||
          name.includes("zira")
        );
      }) || enVoices[0] || voices[0] || null;
      setTtsVoice(preferred || null);
    };
    pickVoice();
    if ("speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = pickVoice;
    }
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      if (ttsVoice) utterance.voice = ttsVoice;
      utterance.rate = 0.85;
      utterance.pitch = 1.1;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleFlip = () => {
    if (!flipped) {
      setFlipped(true);
      speak(word.word);
    }
  };

  const handleLearn = () => {
    if (onMarkLearning) onMarkLearning(word.id);
    if (onNext) onNext();
  };

  const handleMastered = () => {
    if (onMarkMastered) onMarkMastered(word.id);
    if (onNext) onNext();
  };

  const getPosLabel = (pos: string) => {
    const posMap: Record<string, string> = {
      n: "名词",
      v: "动词",
      adj: "形容词",
      adv: "副词",
      prep: "介词",
      conj: "连词",
      pron: "代词",
      num: "数词",
      art: "冠词",
      int: "感叹词",
      phrase: "短语",
    };
    return posMap[pos] || pos;
  };

  return (
    <div
      className={twMerge("relative w-full max-w-md h-100 cursor-pointer perspective-1000 group", flipped && "flipped")}
      onClick={mode === "learn" ? handleFlip : undefined}
    >
      <div
        className={clsx(
          "relative w-full h-full transition-transform duration-500 transform-style-3d shadow-xl rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700",
          flipped && "rotate-y-180"
        )}
      >
        {/* Front Side */}
        <div className="absolute w-full h-full backface-hidden flex flex-col p-6">
          <div className="flex justify-between items-start mb-8">
            <span
              className={clsx(
                "px-2 py-1 rounded text-xs font-semibold",
                word.level === "junior"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
              )}
            >
              {word.level === "junior" ? "初中" : "高中"}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onToggleFavorite) onToggleFavorite(word.id);
              }}
              className={clsx(
                "p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
                isFavorite ? "text-yellow-400" : "text-gray-400"
              )}
            >
              <Star className={clsx("w-5 h-5", isFavorite && "fill-current")} />
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <h2 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">{word.word}</h2>
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-serif">
              <span>{word.phonetic}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  speak(word.word);
                }}
                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {mode === "learn" && !flipped && (
            <p className="text-center text-sm text-gray-400 animate-pulse mt-auto">点击卡片查看释义</p>
          )}

          {mode === "view" && (
            <div className="mt-8 space-y-2">
              {word.meanings.map((m, i) => (
                <div key={i} className="flex gap-2 text-left">
                  <span className="text-gray-500 dark:text-gray-400 w-12 text-sm">{getPosLabel(m.pos)}</span>
                  <span className="text-gray-700 dark:text-gray-300 flex-1">{m.definition}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Back Side */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 flex flex-col p-6 bg-white dark:bg-gray-800 rounded-2xl">
          <div className="flex justify-between items-start mb-4">
            <span
              className={clsx(
                "px-2 py-1 rounded text-xs font-semibold",
                word.level === "junior"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
              )}
            >
              {word.level === "junior" ? "初中" : "高中"}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onToggleFavorite) onToggleFavorite(word.id);
              }}
              className={clsx(
                "p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
                isFavorite ? "text-yellow-400" : "text-gray-400"
              )}
            >
              <Star className={clsx("w-5 h-5", isFavorite && "fill-current")} />
            </button>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{word.word}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-serif">{word.phonetic}</p>
          </div>

          <div className="space-y-3 mb-4 max-h-40">
            {word.meanings.map((m, i) => (
              <div key={i} className="flex gap-2 text-sm text-left">
                <span className="text-gray-500 dark:text-gray-400 w-8 italic flex-shrink-0">{getPosLabel(m.pos)}</span>
                <span className="text-gray-700 dark:text-gray-300 flex-1">{m.definition}</span>
              </div>
            ))}
          </div>

          <div className="mt-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowExample(!showExample);
              }}
              className="w-full flex items-center justify-center gap-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 py-2"
            >
              {showExample ? "收起例句" : "查看例句"}
              {showExample ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {showExample && (
              <div className="text-xs text-left bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg mb-4 space-y-2">
                {word.examples.map((ex, i) => (
                  <div key={i} onClick={(e) => e.stopPropagation()}>
                    <p className="text-gray-800 dark:text-gray-200 mb-1 flex justify-between">
                      {ex.en}
                      <button onClick={() => speak(ex.en)}>
                        <Volume2 className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                      </button>
                    </p>
                    <p className="text-gray-500 dark:text-gray-400">{ex.cn}</p>
                  </div>
                ))}
              </div>
            )}

            {mode === "learn" && (
              <div className="flex gap-3 mt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFlipped(false);
                  }}
                  className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  再看一次
                </button>
                {progress?.status !== "mastered" ? (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMastered();
                      }}
                      className="flex-1 px-4 py-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50 transition-colors text-sm font-medium"
                    >
                      已掌握
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLearn();
                      }}
                      className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors text-sm font-medium"
                    >
                      继续
                    </button>
                  </>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLearn();
                    }}
                    className="col-span-1 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                  >
                    下一个
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
