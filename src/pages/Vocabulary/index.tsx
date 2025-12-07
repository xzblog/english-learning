import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { getVocabularyByLevel, searchWords } from "../../data/vocabulary";
import { WordCard } from "../../components/WordCard";
import { useLearningStore } from "../../stores/learningStore";
import type { WordLevel } from "../../types";
import "./Vocabulary.css";

export function Vocabulary() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mode, setMode] = useState<"list" | "learn">("list");

  const level = (searchParams.get("level") || "all") as WordLevel | "all";
  const { wordProgress, favorites } = useLearningStore();

  const allWords = useMemo(() => {
    if (searchQuery) {
      return searchWords(searchQuery);
    }
    return getVocabularyByLevel(level);
  }, [level, searchQuery]);

  // Filter options
  const [filter, setFilter] = useState<"all" | "new" | "learning" | "mastered" | "favorites">("all");

  const filteredWords = useMemo(() => {
    switch (filter) {
      case "new":
        return allWords.filter((w) => !wordProgress[w.id] || wordProgress[w.id].status === "new");
      case "learning":
        return allWords.filter(
          (w) => wordProgress[w.id]?.status === "learning" || wordProgress[w.id]?.status === "reviewing"
        );
      case "mastered":
        return allWords.filter((w) => wordProgress[w.id]?.status === "mastered");
      case "favorites":
        return allWords.filter((w) => favorites.includes(w.id));
      default:
        return allWords;
    }
  }, [allWords, filter, wordProgress, favorites]);

  const currentWord = filteredWords[currentIndex];

  const handleLevelChange = (newLevel: WordLevel | "all") => {
    setSearchParams(newLevel === "all" ? {} : { level: newLevel });
    setCurrentIndex(0);
  };

  const handleNext = () => {
    if (currentIndex < filteredWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Loop back or show completion message
      setMode("list");
    }
  };

  const handleStartLearning = () => {
    setCurrentIndex(0);
    setMode("learn");
  };

  // Stats
  const stats = useMemo(() => {
    const total = allWords.length;
    const learned = allWords.filter(
      (w) => wordProgress[w.id]?.status !== undefined && wordProgress[w.id]?.status !== "new"
    ).length;
    const mastered = allWords.filter((w) => wordProgress[w.id]?.status === "mastered").length;
    return { total, learned, mastered, newWords: total - learned };
  }, [allWords, wordProgress]);

  return (
    <div className="vocabulary-page animate-fade-in">
      <header className="page-header">
        <h1>📚 词汇学习</h1>
        <p>掌握核心词汇，打好英语基础</p>
      </header>

      {/* Level & Filter Tabs */}
      <div className="filter-section">
        <div className="tabs">
          <button className={`tab ${level === "all" ? "active" : ""}`} onClick={() => handleLevelChange("all")}>
            全部
          </button>
          <button className={`tab ${level === "junior" ? "active" : ""}`} onClick={() => handleLevelChange("junior")}>
            📗 初中
          </button>
          <button className={`tab ${level === "senior" ? "active" : ""}`} onClick={() => handleLevelChange("senior")}>
            📘 高中
          </button>
        </div>

        <div className="search-box">
          <input
            type="text"
            className="input"
            placeholder="搜索单词或释义..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Stats Bar */}
      <div className="stats-bar card">
        <div className="stat-item">
          <span className="stat-number">{stats.total}</span>
          <span className="stat-label">总词汇</span>
        </div>
        <div className="stat-item">
          <span className="stat-number new">{stats.newWords}</span>
          <span className="stat-label">待学习</span>
        </div>
        <div className="stat-item">
          <span className="stat-number learning">{stats.learned - stats.mastered}</span>
          <span className="stat-label">学习中</span>
        </div>
        <div className="stat-item">
          <span className="stat-number mastered">{stats.mastered}</span>
          <span className="stat-label">已掌握</span>
        </div>
      </div>

      {/* Filter Tags */}
      <div className="filter-tags">
        {["all", "new", "learning", "mastered", "favorites"].map((f) => (
          <button
            key={f}
            className={`filter-tag ${filter === f ? "active" : ""}`}
            onClick={() => {
              setFilter(f as typeof filter);
              setCurrentIndex(0);
            }}
          >
            {f === "all" && "全部"}
            {f === "new" && "🆕 待学习"}
            {f === "learning" && "📖 学习中"}
            {f === "mastered" && "✅ 已掌握"}
            {f === "favorites" && "⭐ 生词本"}
          </button>
        ))}
      </div>

      {mode === "list" ? (
        <>
          {/* Start Learning Button */}
          {filteredWords.length > 0 && (
            <div className="learn-action">
              <button className="btn btn-primary btn-lg" onClick={handleStartLearning}>
                开始学习 ({filteredWords.length} 词)
              </button>
            </div>
          )}

          {/* Word List */}
          <div className="word-list">
            {filteredWords.length === 0 ? (
              <div className="empty-state">
                <span className="empty-state-icon">📭</span>
                <p>没有找到单词</p>
              </div>
            ) : (
              filteredWords.map((word) => {
                const progress = wordProgress[word.id];
                const isFavorite = favorites.includes(word.id);

                return (
                  <div
                    key={word.id}
                    className="word-list-item card"
                    onClick={() => {
                      setCurrentIndex(filteredWords.indexOf(word));
                      setMode("learn");
                    }}
                  >
                    <div className="word-info">
                      <span className="word-text">{word.word}</span>
                      <span className="word-phonetic">{word.phonetic}</span>
                    </div>
                    <div className="word-meaning">{word.meanings[0]?.definition}</div>
                    <div className="word-meta">
                      <span className={`level-tag ${word.level}`}>{word.level === "junior" ? "初中" : "高中"}</span>
                      {progress?.status && progress.status !== "new" && (
                        <span className={`status-badge ${progress.status}`}>
                          {progress.status === "learning" && "学习中"}
                          {progress.status === "reviewing" && "复习中"}
                          {progress.status === "mastered" && "已掌握"}
                        </span>
                      )}
                      {isFavorite && <span className="favorite-badge">⭐</span>}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      ) : (
        /* Learning Mode */
        <div className="learn-mode">
          <div className="learn-header">
            <button className="btn btn-secondary" onClick={() => setMode("list")}>
              ← 返回列表
            </button>
            <span className="progress-text">
              {currentIndex + 1} / {filteredWords.length}
            </span>
          </div>

          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${((currentIndex + 1) / filteredWords.length) * 100}%` }} />
          </div>

          {currentWord && <WordCard word={currentWord} mode="learn" onNext={handleNext} />}
        </div>
      )}
    </div>
  );
}
