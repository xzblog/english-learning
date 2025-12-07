import { useState, useCallback } from "react";
import type { Word } from "../types";
import { useSpeech } from "../hooks/useSpeech";
import { useLearningStore } from "../stores/learningStore";
import "./WordCard.css";

interface WordCardProps {
  word: Word;
  mode: "learn" | "review" | "view";
  onNext?: () => void;
  onAnswer?: (correct: boolean) => void;
}

export function WordCard({ word, mode, onNext, onAnswer }: WordCardProps) {
  const [flipped, setFlipped] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const { speak } = useSpeech();
  const { toggleFavorite, favorites, learnWord, getWordProgress } = useLearningStore();

  const progress = getWordProgress(word.id);
  const isFavorite = favorites.includes(word.id);

  const handleSpeak = useCallback(() => {
    speak(word.word);
  }, [speak, word.word]);

  const handleSpeakExample = useCallback(
    (text: string) => {
      speak(text);
    },
    [speak]
  );

  const handleFlip = () => {
    if (!flipped) {
      setFlipped(true);
      handleSpeak();
    }
  };

  const handleLearn = () => {
    learnWord(word.id);
    if (onNext) onNext();
  };

  const handleAnswer = (correct: boolean) => {
    if (onAnswer) onAnswer(correct);
  };

  const getLevelLabel = () => {
    return word.level === "junior" ? "初中" : "高中";
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
    <div className={`word-card ${flipped ? "flipped" : ""}`} onClick={mode === "learn" ? handleFlip : undefined}>
      <div className="word-card-inner">
        {/* Front side - Word */}
        <div className="word-card-front">
          <div className="word-card-header">
            <span className={`level-tag ${word.level}`}>{getLevelLabel()}</span>
            <button
              className={`favorite-btn ${isFavorite ? "active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(word.id);
              }}
            >
              {isFavorite ? "★" : "☆"}
            </button>
          </div>

          <div className="word-main">
            <h2 className="word-text">{word.word}</h2>
            <p className="phonetic">{word.phonetic}</p>
            <button
              className="speak-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleSpeak();
              }}
            >
              🔊
            </button>
          </div>

          {mode === "learn" && !flipped && <p className="flip-hint">点击卡片查看释义</p>}

          {mode === "view" && (
            <div className="word-meanings">
              {word.meanings.map((m, i) => (
                <div key={i} className="meaning-item">
                  <span className="pos-tag">{getPosLabel(m.pos)}</span>
                  <span className="definition">{m.definition}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Back side - Meaning */}
        <div className="word-card-back">
          <div className="word-card-header">
            <span className={`level-tag ${word.level}`}>{getLevelLabel()}</span>
            <button
              className={`favorite-btn ${isFavorite ? "active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(word.id);
              }}
            >
              {isFavorite ? "★" : "☆"}
            </button>
          </div>

          <div className="word-main compact">
            <h2 className="word-text">{word.word}</h2>
            <p className="phonetic">{word.phonetic}</p>
          </div>

          <div className="word-meanings">
            {word.meanings.map((m, i) => (
              <div key={i} className="meaning-item">
                <span className="pos-tag">{getPosLabel(m.pos)}</span>
                <span className="definition">{m.definition}</span>
              </div>
            ))}
          </div>

          <button
            className="toggle-example-btn"
            onClick={(e) => {
              e.stopPropagation();
              setShowExample(!showExample);
            }}
          >
            {showExample ? "收起例句" : "查看例句"} {showExample ? "▲" : "▼"}
          </button>

          {showExample && word.examples.length > 0 && (
            <div className="examples">
              {word.examples.map((ex, i) => (
                <div key={i} className="example" onClick={(e) => e.stopPropagation()}>
                  <div className="example-en">
                    {ex.en}
                    <button className="speak-example-btn" onClick={() => handleSpeakExample(ex.en)}>
                      🔊
                    </button>
                  </div>
                  <div className="example-cn">{ex.cn}</div>
                </div>
              ))}
            </div>
          )}

          {mode === "learn" && (
            <div className="word-card-actions">
              <button
                className="btn btn-secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  setFlipped(false);
                }}
              >
                再看一次
              </button>
              <button
                className="btn btn-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLearn();
                }}
              >
                {progress?.status ? "继续" : "已学会 ✓"}
              </button>
            </div>
          )}

          {mode === "review" && (
            <div className="word-card-actions">
              <button
                className="btn btn-secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAnswer(false);
                }}
              >
                😕 不记得
              </button>
              <button
                className="btn btn-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAnswer(true);
                }}
              >
                😊 记得
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
