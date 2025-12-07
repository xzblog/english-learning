import { Link } from "react-router-dom";
import { useLearningStore } from "../../stores/learningStore";
import { allVocabulary } from "../../data/vocabulary";
import { ProgressRing } from "../../components/ProgressRing";
import "./Home.css";

export function Home() {
  const {
    totalWordsLearned,
    currentStreak,
    getWordsToReview,
    getTodayRecord,
    getWeeklyStats,
    studyPlans,
    activePlanId,
  } = useLearningStore();

  const wordsToReview = getWordsToReview();
  const todayRecord = getTodayRecord();
  const weeklyStats = getWeeklyStats();
  const activePlan = studyPlans.find((p) => p.id === activePlanId);

  const totalWords = allVocabulary.length;
  const progressPercent = totalWords > 0 ? (totalWordsLearned / totalWords) * 100 : 0;

  // Calculate today's goal progress
  const dailyGoal = activePlan?.dailyGoal || 20;
  const todayLearned = todayRecord?.wordsLearned || 0;
  const todayProgress = Math.min((todayLearned / dailyGoal) * 100, 100);

  return (
    <div className="home animate-fade-in">
      {/* Hero Section */}
      <section className="hero">
        <h1>📖 英语学习助手</h1>
        <p>系统化学习中高中英语词汇与语法，助你快速提升英语能力</p>
        <div className="hero-actions">
          <Link to="/vocabulary" className="btn btn-primary btn-lg">
            开始学习
          </Link>
          {wordsToReview.length > 0 && (
            <Link to="/review" className="btn btn-outline btn-lg">
              复习 ({wordsToReview.length})
            </Link>
          )}
        </div>
      </section>

      {/* Stats Overview */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-card card">
            <ProgressRing progress={progressPercent} label="总进度" />
            <div className="stat-details">
              <span className="stat-main">{totalWordsLearned}</span>
              <span className="stat-sub">/ {totalWords} 词</span>
            </div>
          </div>

          <div className="stat-card card">
            <ProgressRing progress={todayProgress} color="success" label="今日目标" />
            <div className="stat-details">
              <span className="stat-main">{todayLearned}</span>
              <span className="stat-sub">/ {dailyGoal} 词</span>
            </div>
          </div>

          <div className="stat-card card streak-card">
            <div className="streak-display">
              <span className="streak-fire">🔥</span>
              <span className="streak-number">{currentStreak}</span>
            </div>
            <p className="streak-label">连续学习天数</p>
          </div>

          <div className="stat-card card review-card">
            <div className="review-display">
              <span className="review-icon">📝</span>
              <span className="review-number">{wordsToReview.length}</span>
            </div>
            <p className="review-label">待复习单词</p>
            {wordsToReview.length > 0 && (
              <Link to="/review" className="btn btn-sm btn-primary">
                立即复习
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Weekly Chart */}
      <section className="weekly-section card">
        <h3>📊 本周学习统计</h3>
        <div className="weekly-chart">
          {weeklyStats.map((day, i) => {
            const total = day.learned + day.reviewed;
            const maxHeight = Math.max(...weeklyStats.map((d) => d.learned + d.reviewed), 1);
            const height = total > 0 ? (total / maxHeight) * 100 : 5;
            const weekday = ["日", "一", "二", "三", "四", "五", "六"][new Date(day.date).getDay()];
            const isToday = i === weeklyStats.length - 1;

            return (
              <div key={day.date} className={`chart-bar-wrapper ${isToday ? "today" : ""}`}>
                <div className="chart-bar" style={{ height: `${height}%` }}>
                  <div className="bar-learned" style={{ flex: day.learned }}></div>
                  <div className="bar-reviewed" style={{ flex: day.reviewed }}></div>
                </div>
                <span className="chart-label">{weekday}</span>
                <span className="chart-value">{total}</span>
              </div>
            );
          })}
        </div>
        <div className="chart-legend">
          <span className="legend-item">
            <span className="legend-dot learned"></span> 学习
          </span>
          <span className="legend-item">
            <span className="legend-dot reviewed"></span> 复习
          </span>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions">
        <h3>快速开始</h3>
        <div className="action-cards">
          <Link to="/vocabulary?level=junior" className="action-card card">
            <span className="action-icon">📗</span>
            <h4>初中词汇</h4>
            <p>约 2000 词</p>
          </Link>

          <Link to="/vocabulary?level=senior" className="action-card card">
            <span className="action-icon">📘</span>
            <h4>高中词汇</h4>
            <p>约 3500 词</p>
          </Link>

          <Link to="/grammar" className="action-card card">
            <span className="action-icon">📝</span>
            <h4>语法学习</h4>
            <p>8 大类语法</p>
          </Link>

          <Link to="/plan" className="action-card card">
            <span className="action-icon">📅</span>
            <h4>制定计划</h4>
            <p>科学规划</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
