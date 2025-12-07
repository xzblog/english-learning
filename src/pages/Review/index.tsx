import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useLearningStore } from "../../stores/learningStore";
import { getWordById } from "../../data/vocabulary";
import { WordCard } from "../../components/WordCard";
import "./Review.css";

export function Review() {
  const { getWordsToReview, reviewWord, favorites, mistakes, removeMistake } = useLearningStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [mode, setMode] = useState<"pending" | "favorites" | "mistakes">("pending");
  const [reviewComplete, setReviewComplete] = useState(false);
  const [stats, setStats] = useState({ correct: 0, wrong: 0 });

  const wordsToReview = getWordsToReview();

  const currentWords = useMemo(() => {
    switch (mode) {
      case "pending":
        return wordsToReview.map((r) => getWordById(r.wordId)).filter(Boolean);
      case "favorites":
        return favorites.map((id) => getWordById(id)).filter(Boolean);
      case "mistakes":
        return mistakes.map((id) => getWordById(id)).filter(Boolean);
      default:
        return [];
    }
  }, [mode, wordsToReview, favorites, mistakes]);

  const currentWord = currentWords[currentIndex];

  const handleAnswer = (correct: boolean) => {
    if (!currentWord) return;

    if (mode === "pending") {
      reviewWord(currentWord.id, correct);
    }

    if (!correct && mode !== "mistakes") {
      // Add to mistakes automatically handled in store if needed
    }

    if (correct && mode === "mistakes") {
      removeMistake(currentWord.id);
    }

    setStats((prev) => ({
      correct: correct ? prev.correct + 1 : prev.correct,
      wrong: correct ? prev.wrong : prev.wrong + 1,
    }));

    if (currentIndex < currentWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setReviewComplete(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setReviewComplete(false);
    setStats({ correct: 0, wrong: 0 });
  };

  const handleModeChange = (newMode: typeof mode) => {
    setMode(newMode);
    setCurrentIndex(0);
    setReviewComplete(false);
    setStats({ correct: 0, wrong: 0 });
  };

  return (
    <div className="review-page animate-fade-in">
      <header className="page-header">
        <h1>🔄 复习</h1>
        <p>巩固记忆，温故知新</p>
      </header>

      {/* Mode Tabs */}
      <div className="review-tabs">
        <button
          className={`review-tab ${mode === "pending" ? "active" : ""}`}
          onClick={() => handleModeChange("pending")}
        >
          <span className="tab-emoji">📝</span>
          <span>待复习</span>
          <span className="tab-badge">{wordsToReview.length}</span>
        </button>
        <button
          className={`review-tab ${mode === "favorites" ? "active" : ""}`}
          onClick={() => handleModeChange("favorites")}
        >
          <span className="tab-emoji">⭐</span>
          <span>生词本</span>
          <span className="tab-badge">{favorites.length}</span>
        </button>
        <button
          className={`review-tab ${mode === "mistakes" ? "active" : ""}`}
          onClick={() => handleModeChange("mistakes")}
        >
          <span className="tab-emoji">❌</span>
          <span>错题本</span>
          <span className="tab-badge">{mistakes.length}</span>
        </button>
      </div>

      {currentWords.length === 0 ? (
        <div className="empty-state card">
          <span className="empty-state-icon">
            {mode === "pending" && "🎉"}
            {mode === "favorites" && "📚"}
            {mode === "mistakes" && "✅"}
          </span>
          {mode === "pending" && (
            <>
              <h3>暂无待复习单词</h3>
              <p>继续学习新单词，系统会根据艾宾浩斯遗忘曲线安排复习</p>
              <Link to="/vocabulary" className="btn btn-primary">
                去学习
              </Link>
            </>
          )}
          {mode === "favorites" && (
            <>
              <h3>生词本为空</h3>
              <p>学习时点击星标可以收藏单词到生词本</p>
            </>
          )}
          {mode === "mistakes" && (
            <>
              <h3>没有错题</h3>
              <p>复习时答错的单词会自动加入错题本</p>
            </>
          )}
        </div>
      ) : reviewComplete ? (
        <div className="review-complete card">
          <span className="complete-icon">🎊</span>
          <h2>复习完成！</h2>
          <div className="complete-stats">
            <div className="complete-stat correct">
              <span className="stat-number">{stats.correct}</span>
              <span className="stat-label">正确</span>
            </div>
            <div className="complete-stat wrong">
              <span className="stat-number">{stats.wrong}</span>
              <span className="stat-label">错误</span>
            </div>
            <div className="complete-stat accuracy">
              <span className="stat-number">
                {stats.correct + stats.wrong > 0
                  ? Math.round((stats.correct / (stats.correct + stats.wrong)) * 100)
                  : 0}
                %
              </span>
              <span className="stat-label">正确率</span>
            </div>
          </div>
          <div className="complete-actions">
            <button className="btn btn-secondary" onClick={handleRestart}>
              再来一次
            </button>
            <Link to="/vocabulary" className="btn btn-primary">
              继续学习
            </Link>
          </div>
        </div>
      ) : (
        <div className="review-content">
          <div className="review-progress">
            <span className="progress-text">
              {currentIndex + 1} / {currentWords.length}
            </span>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${((currentIndex + 1) / currentWords.length) * 100}%` }}
              />
            </div>
          </div>

          {currentWord && <WordCard word={currentWord} mode="review" onAnswer={handleAnswer} />}
        </div>
      )}

      {/* Spaced Repetition Info */}
      <div className="review-info card">
        <h4>📊 艾宾浩斯遗忘曲线</h4>
        <p>系统会在以下时间点安排复习，帮助你形成长期记忆：</p>
        <div className="review-schedule">
          <div className="schedule-item">
            <span className="day">1天</span>
            <span className="desc">首次复习</span>
          </div>
          <div className="schedule-item">
            <span className="day">2天</span>
            <span className="desc">第二次</span>
          </div>
          <div className="schedule-item">
            <span className="day">4天</span>
            <span className="desc">第三次</span>
          </div>
          <div className="schedule-item">
            <span className="day">7天</span>
            <span className="desc">第四次</span>
          </div>
          <div className="schedule-item">
            <span className="day">15天</span>
            <span className="desc">完成</span>
          </div>
        </div>
      </div>
    </div>
  );
}
