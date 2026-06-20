"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { mealsApi } from "@/lib/api";

type ScheduleItem = {
  id: string;
  hour: number;
  minute: number;
  endHour: number;
  endMinute: number;
  label: string;
  mealType?: string;
  needRecord?: boolean;
};

const DAILY_SCHEDULE: ScheduleItem[] = [
  {
    id: "breakfast",
    hour: 8,
    minute: 0,
    endHour: 12,
    endMinute: 29,
    label: "Bữa sáng (Yến mạch)",
    mealType: "breakfast",
    needRecord: true,
  },
  {
    id: "lunch",
    hour: 12,
    minute: 30,
    endHour: 14,
    endMinute: 59,
    label: "Bữa trưa",
    mealType: "lunch",
    needRecord: true,
  },
  {
    id: "water",
    hour: 15,
    minute: 0,
    endHour: 18,
    endMinute: 29,
    label: "Giờ uống nước (500ml)",
  },
  {
    id: "dinner",
    hour: 18,
    minute: 30,
    endHour: 23,
    endMinute: 59,
    label: "Bữa tối",
    mealType: "dinner",
    needRecord: true,
  },
];

function toMinutes(hour: number, minute: number) {
  return hour * 60 + minute;
}

function formatClock(hour: number, minute: number) {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

type ItemStatus = "past" | "current" | "upcoming" | "future";

function baseStatus(now: Date, item: ScheduleItem): "past" | "current" | "future" {
  const nowM = toMinutes(now.getHours(), now.getMinutes());
  const startM = toMinutes(item.hour, item.minute);
  const endM = toMinutes(item.endHour, item.endMinute);

  if (nowM < startM) return "future";
  if (nowM >= startM && nowM <= endM) return "current";
  return "past";
}

function resolveStatuses(now: Date): Record<string, ItemStatus> {
  const base = DAILY_SCHEDULE.map((item) => ({
    id: item.id,
    status: baseStatus(now, item),
  }));

  const hasCurrent = base.some((b) => b.status === "current");
  const result: Record<string, ItemStatus> = {};

  if (!hasCurrent) {
    const nextIdx = base.findIndex((b) => b.status === "future");
    base.forEach((b, i) => {
      if (i === nextIdx) result[b.id] = "upcoming";
      else result[b.id] = b.status;
    });
    return result;
  }

  base.forEach((b) => {
    result[b.id] = b.status;
  });
  return result;
}

export default function TodayTimeline() {
  const [now, setNow] = useState(() => new Date());
  const [loggedMeals, setLoggedMeals] = useState<Set<string>>(new Set());

  const dateParam = useMemo(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }, []);

  const statuses = useMemo(() => resolveStatuses(now), [now]);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    mealsApi
      .list(dateParam)
      .then((list) => {
        const types = new Set(
          (list as Array<{ meal_type?: string }>)
            .map((m) => m.meal_type)
            .filter(Boolean) as string[],
        );
        setLoggedMeals(types);
      })
      .catch(() => {});
  }, [dateParam]);

  return (
    <div className="bg-surface-container-lowest rounded-xl p-lg border border-surface-variant/30 flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3 pb-1 border-b border-surface-variant/20">
        <p className="text-xs uppercase tracking-widest text-outline">Lịch trình hôm nay</p>
        <p className="text-xs tabular-nums schedule-highlight font-medium" suppressHydrationWarning>
          {now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })}
        </p>
      </div>

      {DAILY_SCHEDULE.map((item) => {
        const status = statuses[item.id];
        const isActive = status === "current" || status === "upcoming";
        const isCurrent = status === "current";
        const isFuture = status === "future";
        const isLogged = item.mealType ? loggedMeals.has(item.mealType) : false;

        let displayLabel = item.label;
        if (status === "upcoming") {
          displayLabel = `${item.label} – Sắp tới`;
        } else if (item.needRecord && item.mealType) {
          if (isCurrent && !isLogged) displayLabel = `${item.label} – Cần ghi nhận`;
          else if (isLogged) displayLabel = `${item.label} – Đã ghi nhận`;
        }

        return (
          <div
            key={item.id}
            className={`flex gap-4 items-center transition-all duration-500 ${isFuture ? "opacity-50" : "opacity-100"}`}
          >
            <div
              className={`font-label-md w-16 text-right tabular-nums shrink-0 ${
                isActive ? "schedule-highlight font-semibold" : "text-on-surface-variant"
              }`}
              suppressHydrationWarning
            >
              {formatClock(item.hour, item.minute)}
            </div>

            <div className="relative shrink-0 w-3 h-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  isActive ? "schedule-dot-current" : isFuture ? "bg-surface-variant" : "schedule-dot-past"
                }`}
              />
              {isActive && (
                <span className="absolute inset-0 w-3 h-3 rounded-full schedule-dot-ping animate-ping opacity-75" />
              )}
            </div>

            <div
              className={`flex-1 p-3 rounded-lg border flex justify-between items-center transition-all duration-500 ${
                isActive
                  ? status === "upcoming"
                    ? "schedule-card-upcoming"
                    : "schedule-card-current"
                  : "bg-surface-container-lowest border-surface-variant/20 text-on-surface"
              }`}
            >
              <span className={`font-body-md ${isActive ? "font-bold" : ""}`}>{displayLabel}</span>
              {isCurrent && item.needRecord && !isLogged && (
                <Link href="/scanner" className="text-xs font-semibold underline underline-offset-2 shrink-0 ml-3">
                  Quét ngay
                </Link>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
