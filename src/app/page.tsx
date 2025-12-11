"use client";

import Link from "next/link";
import { BarChart2, PenTool } from "lucide-react";
import { useMemo, useRef, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { MasteryStatus } from "@/types";

function Ring({ percent, label, goal, progress }: { percent: number; label: string; goal: number; progress: number }) {
  const p = Math.max(0, Math.min(100, Math.round(percent)));
  const size = 100;
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (p / 100) * c;
  return (
    <div className="flex flex-col items-center gap-4">
      <svg width={size} height={size} className="text-gray-200 dark:text-gray-700">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="currentColor" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="#6366F1"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${dash} ${c - dash}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <text x="50%" y="40%" dominantBaseline="middle" textAnchor="middle" className="fill-gray-900 dark:fill-white text-base">
          {p}%
        </text>
        <text x="50%" y="70%" dominantBaseline="middle" textAnchor="middle" className="text-xs fill-gray-600 dark:fill-gray-400">{label}</text>
      </svg>
      <div>
        <span className="text-2xl font-semibold text-gray-900 dark:text-white">{progress}</span>
        <span className="text-sm text-gray-900 dark:text-white"> / {goal} 词</span>
      </div>
    </div>
  );
}

export default function Home() {
  const { data: vocabInfo } = useQuery({
    queryKey: ["vocab-total"],
    queryFn: async () => {
      const res = await fetch(`/api/vocabulary?level=all&limit=1`);
      if (!res.ok) throw new Error("Failed to fetch vocabulary total");
      return res.json();
    },
  });

  type ProgressDoc = {
    wordId: string;
    status: MasteryStatus;
    lastReviewedAt?: string | number | Date;
  };
  const { data: progressData = [] } = useQuery<ProgressDoc[]>({
    queryKey: ["progress-home"],
    queryFn: async () => {
      const res = await fetch(`/api/progress`);
      if (res.status === 401) return [];
      if (!res.ok) throw new Error("Failed to fetch progress");
      return res.json();
    },
  });

  type StudyPlanDoc = {
    _id: string;
    name: string;
    dailyGoal: number;
    targetLevel: string;
    startDate: string | number | Date;
    status: "active" | "paused" | "completed";
  };
  const { data: plans = [] } = useQuery<StudyPlanDoc[]>({
    queryKey: ["plans-home"],
    queryFn: async () => {
      const res = await fetch(`/api/study-plan`);
      if (res.status === 401) return [];
      if (!res.ok) throw new Error("Failed to fetch plans");
      return res.json();
    },
  });

  const totals = useMemo(() => {
    const totalWords = vocabInfo?.total || 0;
    const mastered = progressData.filter((p) => p.status === "mastered").length;
    const reviewing = progressData.filter((p) => p.status === "reviewing").length;
    const percent = totalWords ? Math.round((mastered / totalWords) * 100) : 0;
    const activePlan = plans.find((p) => p.status === "active");
    const target = activePlan?.dailyGoal || 20;
    const todayStr = new Date().toDateString();
    const todayDone = progressData.filter((p) => (p.lastReviewedAt ? new Date(p.lastReviewedAt).toDateString() === todayStr : false)).length;
    const todayPercent = target ? Math.min(100, Math.round((todayDone / target) * 100)) : 0;
    return { totalWords, mastered, reviewing, percent, target, todayDone, todayPercent };
  }, [vocabInfo, progressData, plans]);

  const yearGrid = useMemo(() => {
    const today = new Date();
    const start = new Date(today);
    start.setFullYear(today.getFullYear() - 1);
    // Align start to last Sunday (GitHub style)
    const startDay = start.getDay(); // 0 Sun - 6 Sat
    start.setDate(start.getDate() - startDay);

    const dayCountMap: Record<string, number> = {};
    progressData.forEach((p) => {
      if (p.status === "mastered" && p.lastReviewedAt) {
        const d = new Date(p.lastReviewedAt);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        dayCountMap[key] = (dayCountMap[key] || 0) + 1;
      }
    });

    const weeks: Array<Array<{ date: Date; count: number; level: number }>> = [];
    const monthMarkers: Array<{ index: number; label: string }> = [];
    const d = new Date(start);
    let weekIndex = 0;
    while (d <= today) {
      const week: Array<{ date: Date; count: number; level: number }> = [];
      for (let i = 0; i < 7; i++) {
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        const count = dayCountMap[key] || 0;
        const level = Math.min(5, Math.floor(count / 10));
        week.push({ date: new Date(d), count, level });
        d.setDate(d.getDate() + 1);
        if (d > today) break;
      }
      // Mark month label at the first week that contains the 1st day of a month
      week.forEach((cell) => {
        if (cell.date.getDate() === 1) {
          const label = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][cell.date.getMonth()];
          monthMarkers.push({ index: weekIndex, label });
        }
      });
      weeks.push(week);
      weekIndex++;
    }
    return { weeks, monthMarkers };
  }, [progressData]);

  const adjustedMonthMarkers = useMemo(() => {
    const mm = yearGrid.monthMarkers;
    if (!mm.length) return [] as Array<{ index: number; label: string }>;
    const jan = mm.find((m) => m.label === "Jan");
    const base = jan ? jan.index : mm[0].index;
    return mm.filter((m) => m.index >= base).map((m) => ({ index: m.index - base, label: m.label }));
  }, [yearGrid.monthMarkers]);

  const weeksContainerRef = useRef<HTMLDivElement>(null);
  const yLabelsRef = useRef<HTMLDivElement>(null);
  const [weekColWidth, setWeekColWidth] = useState(16);
  const [leftBaseOffset, setLeftBaseOffset] = useState(0);
  useEffect(() => {
    const measure = () => {
      const container = weeksContainerRef.current;
      if (!container) return;
      const firstWeek = container.firstElementChild as HTMLElement | null;
      if (!firstWeek) return;
      const style = getComputedStyle(container);
      let gap = 0;
      if (style.columnGap && style.columnGap.endsWith("px")) {
        gap = parseFloat(style.columnGap);
      } else if (style.gap) {
        const parts = style.gap.split(" ");
        gap = parseFloat(parts[0] || "0");
      }
      const width = firstWeek.offsetWidth;
      setWeekColWidth(width + gap);
      const yEl = yLabelsRef.current;
      if (yEl) {
        const yStyle = getComputedStyle(yEl);
        const mr = parseFloat(yStyle.marginRight || "0");
        setLeftBaseOffset(yEl.offsetWidth + mr);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-3 md:p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <Ring percent={totals.percent} goal={totals.totalWords} progress={totals.mastered} label="总进度" />
          </div>
          <div className="p-3 md:p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <Ring percent={totals.todayPercent} goal={totals.target} progress={totals.todayDone} label="今日目标" />
          </div>
          <div className="p-3 md:p-6 bg-white flex flex-col items-center justify-center dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="text-3xl">🔥 <span className="align-middle text-gray-900 dark:text-white">0</span></div>
            <p className="mt-6 text-sm text-gray-600 dark:text-gray-300">连续学习天数</p>
          </div>
          <div className="p-3 md:p-6 bg-white flex flex-col items-center  justify-center dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="text-3xl">📝 <span className="align-middle text-purple-600">{totals.reviewing}</span></div>
            <p className="mt-6 text-sm text-gray-600 dark:text-gray-300">待复习单词</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 md:p-12 p-6">
          <div className="flex items-center gap-2 mb-8">
            <span className="text-xl">📊</span>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">学习统计</h2>
          </div>
          <div className="overflow-x-auto">
            <div
              className="relative h-4 mb-2 mx-auto"
              style={{ width: `${leftBaseOffset + yearGrid.weeks.length * weekColWidth}px` }}
            >
              {adjustedMonthMarkers.map((m) => (
                <div
                  key={m.index}
                  className="absolute text-xs text-gray-500 dark:text-gray-400"
                  style={{ left: `${leftBaseOffset + m.index * weekColWidth}px` }}
                >
                  {m.label}
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <div ref={yLabelsRef} className="flex flex-col items-end justify-between mr-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">Sun</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Fri</span>
              </div>
              <div ref={weeksContainerRef} className="flex gap-1">
                {yearGrid.weeks.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-1">
                    {week.map((cell, di) => {
                      const levelCls = [
                        "bg-gray-100 dark:bg-gray-700",
                        "bg-green-200 dark:bg-green-900/50",
                        "bg-green-300 dark:bg-green-800/60",
                        "bg-green-400 dark:bg-green-700/70",
                        "bg-green-500 dark:bg-green-600/80",
                        "bg-green-600 dark:bg-green-500",
                      ][cell.level];
                      const title = `${cell.date.getFullYear()}-${String(cell.date.getMonth() + 1).padStart(2, "0")}-${String(cell.date.getDate()).padStart(2, "0")}: ${cell.count} 词`; 
                      return (
                        <div
                          key={di}
                          className={`w-3 h-3 md:w-3.5 md:h-3.5 rounded ${levelCls}`}
                          title={title}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
            <div 
              className="mt-4 mx-auto flex justify-between items-center text-xs text-gray-500 dark:text-gray-400"
              style={{ width: `${leftBaseOffset + yearGrid.weeks.length * weekColWidth}px` }}
            >
              <div className="">studied 180 days in the past year</div>
              <div className="flex items-center gap-3">
                <span>Less</span>
                <span className="w-3 h-3 rounded bg-gray-100 dark:bg-gray-700 inline-block" />
                <span className="w-3 h-3 rounded bg-green-200 dark:bg-green-900/50 inline-block" />
                <span className="w-3 h-3 rounded bg-green-300 dark:bg-green-800/60 inline-block" />
                <span className="w-3 h-3 rounded bg-green-400 dark:bg-green-700/70 inline-block" />
                <span className="w-3 h-3 rounded bg-green-500 dark:bg-green-600/80 inline-block" />
                <span className="w-3 h-3 rounded bg-green-600 dark:bg-green-500 inline-block" />
                <span>More</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Link href="/vocabulary" className="flex flex-col items-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-4">
              <BarChart2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">开始学习</h3>
            <p className="text-gray-500 dark:text-gray-400">进入词汇页面开始学习与复习</p>
          </Link>
          <Link href="/study-plan" className="flex flex-col items-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="p-4 bg-orange-100 dark:bg-orange-900/30 rounded-full mb-4">
              <PenTool className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">制定计划</h3>
            <p className="text-gray-500 dark:text-gray-400">配置每日目标并跟踪进度</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
