import { useState } from "react";
import { useLearningStore } from "../../stores/learningStore";
import { allVocabulary } from "../../data/vocabulary";
import type { WordLevel } from "../../types";
import "./StudyPlan.css";

export function StudyPlan() {
  const { studyPlans, activePlanId, createStudyPlan, setActivePlan, pausePlan, totalWordsLearned, getWeeklyStats } =
    useLearningStore();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    dailyGoal: 20,
    targetLevel: "all" as WordLevel | "all",
  });

  const weeklyStats = getWeeklyStats();
  const weeklyTotal = weeklyStats.reduce((acc, day) => acc + day.learned + day.reviewed, 0);
  const avgDaily = Math.round(weeklyTotal / 7);

  const handleCreatePlan = () => {
    if (!formData.name.trim()) return;

    createStudyPlan({
      name: formData.name,
      dailyGoal: formData.dailyGoal,
      targetLevel: formData.targetLevel,
      startDate: Date.now(),
      status: "active",
    });

    setShowCreateForm(false);
    setFormData({ name: "", dailyGoal: 20, targetLevel: "all" });
  };

  const getTargetWordsCount = (level: WordLevel | "all") => {
    if (level === "junior") return allVocabulary.filter((w) => w.level === "junior").length;
    if (level === "senior") return allVocabulary.filter((w) => w.level === "senior").length;
    return allVocabulary.length;
  };

  const calculateDaysToComplete = (dailyGoal: number, level: WordLevel | "all") => {
    const targetWords = getTargetWordsCount(level);
    const remaining = Math.max(0, targetWords - totalWordsLearned);
    return Math.ceil(remaining / dailyGoal);
  };

  return (
    <div className="plan-page animate-fade-in">
      <header className="page-header">
        <h1>📅 学习计划</h1>
        <p>科学规划，高效学习</p>
      </header>

      {/* Weekly Summary */}
      <div className="weekly-summary card">
        <h3>📊 本周学习总结</h3>
        <div className="summary-stats">
          <div className="summary-stat">
            <span className="stat-value">{weeklyTotal}</span>
            <span className="stat-label">本周学习</span>
          </div>
          <div className="summary-stat">
            <span className="stat-value">{avgDaily}</span>
            <span className="stat-label">日均单词</span>
          </div>
          <div className="summary-stat">
            <span className="stat-value">{totalWordsLearned}</span>
            <span className="stat-label">累计学习</span>
          </div>
        </div>
      </div>

      {/* Active Plan */}
      {studyPlans.length > 0 && (
        <div className="plans-section">
          <h3>我的计划</h3>
          <div className="plans-list">
            {studyPlans.map((plan) => {
              const isActive = plan.id === activePlanId;
              const daysToComplete = calculateDaysToComplete(plan.dailyGoal, plan.targetLevel);
              const targetWords = getTargetWordsCount(plan.targetLevel);
              const progress = Math.min((totalWordsLearned / targetWords) * 100, 100);

              return (
                <div
                  key={plan.id}
                  className={`plan-card card ${isActive ? "active" : ""} ${plan.status === "paused" ? "paused" : ""}`}
                >
                  <div className="plan-header">
                    <h4>{plan.name}</h4>
                    {isActive && <span className="active-badge">当前</span>}
                    {plan.status === "paused" && <span className="paused-badge">暂停</span>}
                  </div>

                  <div className="plan-details">
                    <div className="plan-detail">
                      <span className="detail-label">每日目标</span>
                      <span className="detail-value">{plan.dailyGoal} 词</span>
                    </div>
                    <div className="plan-detail">
                      <span className="detail-label">词汇范围</span>
                      <span className="detail-value">
                        {plan.targetLevel === "all" && "全部"}
                        {plan.targetLevel === "junior" && "初中"}
                        {plan.targetLevel === "senior" && "高中"}({targetWords} 词)
                      </span>
                    </div>
                    <div className="plan-detail">
                      <span className="detail-label">预计完成</span>
                      <span className="detail-value">{daysToComplete} 天</span>
                    </div>
                  </div>

                  <div className="plan-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                    <span className="progress-text">{Math.round(progress)}%</span>
                  </div>

                  <div className="plan-actions">
                    {!isActive && (
                      <button className="btn btn-primary btn-sm" onClick={() => setActivePlan(plan.id)}>
                        设为当前
                      </button>
                    )}
                    <button className="btn btn-secondary btn-sm" onClick={() => pausePlan(plan.id)}>
                      {plan.status === "paused" ? "恢复" : "暂停"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Create Plan */}
      {!showCreateForm ? (
        <button className="create-plan-btn btn btn-primary btn-lg" onClick={() => setShowCreateForm(true)}>
          ➕ 创建新计划
        </button>
      ) : (
        <div className="create-plan-form card">
          <h3>创建学习计划</h3>

          <div className="form-group">
            <label>计划名称</label>
            <input
              type="text"
              className="input"
              placeholder="例如：高考冲刺计划"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>每日学习目标</label>
            <div className="goal-options">
              {[10, 20, 30, 50].map((goal) => (
                <button
                  key={goal}
                  className={`goal-option ${formData.dailyGoal === goal ? "active" : ""}`}
                  onClick={() => setFormData({ ...formData, dailyGoal: goal })}
                >
                  {goal} 词/天
                </button>
              ))}
            </div>
            <input
              type="range"
              min="5"
              max="100"
              value={formData.dailyGoal}
              onChange={(e) => setFormData({ ...formData, dailyGoal: Number(e.target.value) })}
              className="goal-slider"
            />
            <div className="goal-value">{formData.dailyGoal} 词/天</div>
          </div>

          <div className="form-group">
            <label>词汇范围</label>
            <div className="level-options">
              <button
                className={`level-option ${formData.targetLevel === "all" ? "active" : ""}`}
                onClick={() => setFormData({ ...formData, targetLevel: "all" })}
              >
                📚 全部词汇
                <span>{allVocabulary.length} 词</span>
              </button>
              <button
                className={`level-option ${formData.targetLevel === "junior" ? "active" : ""}`}
                onClick={() => setFormData({ ...formData, targetLevel: "junior" })}
              >
                📗 初中词汇
                <span>{allVocabulary.filter((w) => w.level === "junior").length} 词</span>
              </button>
              <button
                className={`level-option ${formData.targetLevel === "senior" ? "active" : ""}`}
                onClick={() => setFormData({ ...formData, targetLevel: "senior" })}
              >
                📘 高中词汇
                <span>{allVocabulary.filter((w) => w.level === "senior").length} 词</span>
              </button>
            </div>
          </div>

          <div className="form-preview">
            <p>
              按此计划，预计 <strong>{calculateDaysToComplete(formData.dailyGoal, formData.targetLevel)}</strong> 天完成
            </p>
          </div>

          <div className="form-actions">
            <button className="btn btn-secondary" onClick={() => setShowCreateForm(false)}>
              取消
            </button>
            <button className="btn btn-primary" onClick={handleCreatePlan} disabled={!formData.name.trim()}>
              创建计划
            </button>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="tips-section card">
        <h4>💡 学习建议</h4>
        <ul>
          <li>每天坚持学习，保持学习连续性</li>
          <li>根据自己的时间安排合理的每日目标</li>
          <li>及时完成复习任务，巩固记忆效果</li>
          <li>善用生词本，重点突破难记单词</li>
        </ul>
      </div>
    </div>
  );
}
