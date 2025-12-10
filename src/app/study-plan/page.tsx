"use client";

import { useState, Suspense } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BarChart2 } from "lucide-react";

interface Plan {
  _id: string;
  name: string;
  dailyGoal: number;
  targetLevel: string;
  startDate: string | number | Date;
  status: "active" | "paused" | "completed";
}

const fetchPlans = async (): Promise<Plan[]> => {
  const res = await fetch("/api/study-plan");
  if (res.status === 401) return [];
  if (!res.ok) throw new Error("Failed to fetch study plans");
  return res.json();
};

function StudyPlanContent() {
  const queryClient = useQueryClient();
  const { data: plans = [] } = useQuery<Plan[]>({ queryKey: ["study-plans"], queryFn: fetchPlans });

  const createPlan = useMutation({
    mutationFn: async (payload: { name: string; dailyGoal: number; targetLevel: string; startDate?: string }) => {
      const res = await fetch("/api/study-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to create plan");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["study-plans"] }),
  });

  const updatePlan = useMutation({
    mutationFn: async (payload: { id: string; status?: string; dailyGoal?: number; name?: string }) => {
      const res = await fetch("/api/study-plan", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to update plan");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["study-plans"] }),
  });

  const [name, setName] = useState("");
  const [dailyGoal, setDailyGoal] = useState(20);
  const [targetLevel, setTargetLevel] = useState("all");
  const [startDate, setStartDate] = useState<string>("");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full">
          <BarChart2 className="w-6 h-6 text-orange-600 dark:text-orange-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">学习计划</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-8">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">创建新计划</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">计划名称</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
              placeholder="例：寒假每日背词"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">每日目标（词）</label>
            <input
              type="number"
              min={1}
              value={dailyGoal}
              onChange={(e) => setDailyGoal(parseInt(e.target.value || "0"))}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">目标等级</label>
            <select
              value={targetLevel}
              onChange={(e) => setTargetLevel(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            >
              <option value="junior">初中词汇</option>
              <option value="senior">高中词汇</option>
              <option value="all">全部词汇</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">开始日期</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            />
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={() => {
              if (!name || !dailyGoal || !targetLevel) return;
              createPlan.mutate({ name, dailyGoal, targetLevel, startDate });
              setName("");
            }}
            className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            创建计划
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {plans.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">暂无计划。登录后可创建学习计划并在设备间同步。</p>
        ) : (
          plans.map((plan) => (
            <div
              key={plan._id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 flex items-center justify-between"
            >
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  每日 {plan.dailyGoal} 词 · 目标：{plan.targetLevel} · 开始：{new Date(plan.startDate).toLocaleDateString()}
                </p>
                <span
                  className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full ${
                    plan.status === "active"
                      ? "bg-green-100 text-green-700"
                      : plan.status === "paused"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {plan.status}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {plan.status !== "active" && (
                  <button
                    onClick={() => updatePlan.mutate({ id: plan._id, status: "active" })}
                    className="px-3 py-1 rounded-lg bg-green-600 text-white text-sm hover:bg-green-700"
                  >
                    开始
                  </button>
                )}
                {plan.status === "active" && (
                  <button
                    onClick={() => updatePlan.mutate({ id: plan._id, status: "paused" })}
                    className="px-3 py-1 rounded-lg bg-yellow-600 text-white text-sm hover:bg-yellow-700"
                  >
                    暂停
                  </button>
                )}
                {plan.status !== "completed" && (
                  <button
                    onClick={() => updatePlan.mutate({ id: plan._id, status: "completed" })}
                    className="px-3 py-1 rounded-lg bg-gray-600 text-white text-sm hover:bg-gray-700"
                  >
                    完成
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function StudyPlanPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8 text-center">Loading study plan...</div>}>
      <StudyPlanContent />
    </Suspense>
  );
}
