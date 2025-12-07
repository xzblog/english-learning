import { Link, useLocation } from "react-router-dom";
import { useLearningStore } from "../stores/learningStore";
import "./Layout.css";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { theme, toggleTheme, currentStreak, getWordsToReview } = useLearningStore();

  const reviewCount = getWordsToReview().length;

  const navItems = [
    { path: "/", icon: "🏠", label: "首页" },
    { path: "/vocabulary", icon: "📚", label: "词汇" },
    { path: "/grammar", icon: "📝", label: "语法" },
    { path: "/review", icon: "🔄", label: "复习", badge: reviewCount },
    { path: "/plan", icon: "📅", label: "计划" },
  ];

  return (
    <div className="layout">
      {/* Desktop Header */}
      <header className="header">
        <div className="container">
          <nav className="nav">
            <Link to="/" className="nav-brand">
              📖 英语学习
            </Link>

            <ul className="nav-links">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className={`nav-link ${location.pathname === item.path ? "active" : ""}`}>
                    {item.icon} {item.label}
                    {item.badge && item.badge > 0 && <span className="nav-badge">{item.badge}</span>}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="nav-actions">
              {currentStreak > 0 && (
                <div className="streak">
                  <span className="streak-icon">🔥</span>
                  <span>{currentStreak} 天</span>
                </div>
              )}

              <button className="theme-toggle" onClick={toggleTheme}>
                {theme === "light" ? "🌙" : "☀️"}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">{children}</div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="bottom-nav">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`bottom-nav-item ${location.pathname === item.path ? "active" : ""}`}
          >
            <span className="bottom-nav-icon">
              {item.icon}
              {item.badge && item.badge > 0 && <span className="mobile-badge">{item.badge}</span>}
            </span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
