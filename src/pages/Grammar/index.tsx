import { useState } from "react";
import { grammarRules, grammarCategories, getGrammarByCategory } from "../../data/grammar";
import { useSpeech } from "../../hooks/useSpeech";
import type { GrammarCategory } from "../../types";
import "./Grammar.css";

export function Grammar() {
  const [activeCategory, setActiveCategory] = useState<GrammarCategory | "all">("all");
  const [expandedRule, setExpandedRule] = useState<string | null>(null);
  const { speak } = useSpeech();

  const filteredRules = activeCategory === "all" ? grammarRules : getGrammarByCategory(activeCategory);

  const categories = Object.entries(grammarCategories) as [GrammarCategory, { name: string; description: string }][];

  return (
    <div className="grammar-page animate-fade-in">
      <header className="page-header">
        <h1>📝 语法学习</h1>
        <p>系统掌握英语语法规则</p>
      </header>

      {/* Category Tabs */}
      <div className="category-tabs">
        <button
          className={`category-tab ${activeCategory === "all" ? "active" : ""}`}
          onClick={() => setActiveCategory("all")}
        >
          <span className="tab-icon">📚</span>
          <span className="tab-name">全部</span>
          <span className="tab-count">{grammarRules.length}</span>
        </button>

        {categories.map(([key, value]) => (
          <button
            key={key}
            className={`category-tab ${activeCategory === key ? "active" : ""}`}
            onClick={() => setActiveCategory(key)}
          >
            <span className="tab-icon">
              {key === "tense" && "⏰"}
              {key === "clause" && "🔗"}
              {key === "sentence" && "📋"}
              {key === "mood" && "💭"}
              {key === "non-finite" && "🔄"}
            </span>
            <span className="tab-name">{value.name}</span>
            <span className="tab-count">{getGrammarByCategory(key).length}</span>
          </button>
        ))}
      </div>

      {/* Grammar Rules List */}
      <div className="grammar-list">
        {filteredRules.map((rule) => (
          <div key={rule.id} className={`grammar-card card ${expandedRule === rule.id ? "expanded" : ""}`}>
            <div className="grammar-header" onClick={() => setExpandedRule(expandedRule === rule.id ? null : rule.id)}>
              <div className="grammar-title">
                <h3>{rule.titleCn}</h3>
                <span className="grammar-title-en">{rule.title}</span>
              </div>
              <span className="expand-icon">{expandedRule === rule.id ? "−" : "+"}</span>
            </div>

            {expandedRule === rule.id && (
              <div className="grammar-content">
                <div className="grammar-description">
                  <p>{rule.description}</p>
                </div>

                <div className="grammar-structure">
                  <h4>📐 结构</h4>
                  <code>{rule.structure}</code>
                </div>

                <div className="grammar-examples">
                  <h4>📖 例句</h4>
                  {rule.examples.map((ex, i) => (
                    <div key={i} className="example">
                      <div className="example-en">
                        {ex.en}
                        <button
                          className="speak-btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            speak(ex.en);
                          }}
                        >
                          🔊
                        </button>
                      </div>
                      <div className="example-cn">{ex.cn}</div>
                    </div>
                  ))}
                </div>

                {rule.tips && rule.tips.length > 0 && (
                  <div className="grammar-tips">
                    <h4>💡 提示</h4>
                    <ul>
                      {rule.tips.map((tip, i) => (
                        <li key={i}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
