"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PageShell, SectionDivider } from "@/components/PageLayout";
import {
  CHALLENGES,
  consumePendingChallenge,
  getChallengeProgress,
  incrementChallenge,
  joinChallenge,
  loadChallengeProgress,
  markChallengePending,
  totalPoints,
  type Challenge,
  type ChallengeProgress,
} from "@/data/challenges";

function CheerText() {
  return (
    <span className="co-len-wrap text-xl md:text-2xl" aria-hidden>
      <span className="co-len-inner">Cố Lên</span>
    </span>
  );
}

function ChallengeCard({
  challenge,
  progress,
  onJoin,
  onStart,
}: {
  challenge: Challenge;
  progress: ChallengeProgress;
  onJoin: () => void;
  onStart: () => void;
}) {
  const pct = progress.joined
    ? Math.round((progress.current / challenge.target) * 100)
    : 0;

  return (
    <article className="bg-surface-container-lowest border border-surface-variant/30 rounded-xl p-md flex flex-col h-full">
      <div className="flex items-start gap-4 mb-base">
        <div className="w-28 h-32 md:w-32 md:h-36 shrink-0 relative -mt-1">
          <Image
            src={challenge.image}
            alt={challenge.title}
            width={128}
            height={144}
            className="challenge-char-glow object-contain object-top w-full h-full -translate-y-1"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">{challenge.title}</h3>
          <p className="font-body-md text-body-md text-on-surface-variant">{challenge.description}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-md">
        <span className="font-label-sm text-label-sm px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
          {challenge.reward}
        </span>
        {progress.completed && (
          <span className="font-label-sm text-label-sm px-3 py-1 rounded-full bg-primary/10 text-primary">
            Hoàn thành
          </span>
        )}
      </div>

      {progress.joined && !progress.completed && (
        <div className="mb-md">
          <div className="flex justify-between items-start font-label-sm text-label-sm text-on-surface-variant mb-1.5">
            <span className="pt-1">
              {progress.current}/{challenge.target} {challenge.unit}
            </span>
            <div className="flex flex-col items-end gap-0.5">
              <CheerText />
              <span>{pct}%</span>
            </div>
          </div>
          <div className="h-2 rounded-full bg-surface-variant overflow-hidden">
            <div
              className="h-full bg-red-500 transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      {progress.joined && progress.completed && (
        <div className="mb-md">
          <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant mb-1">
            <span>
              {progress.current}/{challenge.target} {challenge.unit}
            </span>
            <span>{pct}%</span>
          </div>
          <div className="h-2 rounded-full bg-surface-variant overflow-hidden">
            <div className="h-full bg-red-500 transition-all duration-500" style={{ width: "100%" }} />
          </div>
        </div>
      )}

      <div className="mt-auto pt-2">
        {!progress.joined ? (
          <button
            type="button"
            onClick={onJoin}
            className="w-full bg-red-500 text-white py-3 rounded-lg font-label-md text-label-md hover:bg-red-600 transition-colors active:scale-[0.98]"
          >
            Tham gia thử thách
          </button>
        ) : progress.completed ? (
          <button
            type="button"
            disabled
            className="w-full bg-surface-container-high text-on-surface-variant py-3 rounded-lg font-label-md text-label-md cursor-default"
          >
            Đã hoàn thành
          </button>
        ) : (
          <button
            type="button"
            onClick={onStart}
            className="w-full bg-red-500 text-white py-3 rounded-lg font-label-md text-label-md hover:bg-red-600 transition-colors active:scale-[0.98]"
          >
            {challenge.actionLabel}
          </button>
        )}
      </div>
    </article>
  );
}

export default function ChallengesPage() {
  const router = useRouter();
  const [progressStore, setProgressStore] = useState<Record<string, ChallengeProgress>>({});
  const [query, setQuery] = useState("");

  useEffect(() => {
    const store = loadChallengeProgress();
    let next = { ...store };
    let changed = false;

    for (const challenge of CHALLENGES) {
      if (consumePendingChallenge(challenge.id)) {
        next = incrementChallenge(next, challenge.id, challenge);
        changed = true;
      }
    }

    setProgressStore(changed ? next : store);
  }, []);

  const points = totalPoints(progressStore);
  const completedCount = CHALLENGES.filter((c) => getChallengeProgress(progressStore, c.id).completed).length;

  const filteredChallenges = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CHALLENGES;
    return CHALLENGES.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.reward.toLowerCase().includes(q),
    );
  }, [query]);

  const handleJoin = (challenge: Challenge) => {
    setProgressStore((prev) => joinChallenge(prev, challenge.id));
  };

  const handleStart = (challenge: Challenge) => {
    markChallengePending(challenge.id);
    router.push(challenge.actionPath);
  };

  return (
    <PageShell mainClassName="!pt-32 md:!pt-36">
      <section className="mb-lg">
        <label htmlFor="challenge-search" className="sr-only">
          Tìm kiếm thử thách
        </label>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[22px]">
            search
          </span>
          <input
            id="challenge-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm kiếm thử thách..."
            className="w-full bg-surface-container-lowest border border-surface-variant/40 rounded-xl py-3.5 pl-12 pr-4 font-body-md text-white placeholder:text-on-surface-variant focus:outline-none focus:border-red-500/60 focus:ring-2 focus:ring-red-500/25 transition-colors"
          />
        </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-md mb-lg">
        <div className="bg-surface-container-lowest border border-surface-variant/30 rounded-xl p-md text-center">
          <p className="font-label-sm text-label-sm text-outline uppercase tracking-wider mb-1">Điểm tích lũy</p>
          <p className="font-headline-md text-headline-md text-red-500">{points}</p>
        </div>
        <div className="bg-surface-container-lowest border border-surface-variant/30 rounded-xl p-md text-center">
          <p className="font-label-sm text-label-sm text-outline uppercase tracking-wider mb-1">Đã hoàn thành</p>
          <p className="font-headline-md text-headline-md text-on-surface">
            {completedCount}/{CHALLENGES.length}
          </p>
        </div>
        <div className="bg-surface-container-lowest border border-surface-variant/30 rounded-xl p-md text-center">
          <p className="font-label-sm text-label-sm text-outline uppercase tracking-wider mb-1">Hạng thành viên</p>
          <p className="font-headline-md text-headline-md text-on-surface">Bạc</p>
        </div>
      </div>

      <SectionDivider title="Thử thách đang mở" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-md mb-lg">
        {filteredChallenges.length > 0 ? (
          filteredChallenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              progress={getChallengeProgress(progressStore, challenge.id)}
              onJoin={() => handleJoin(challenge)}
              onStart={() => handleStart(challenge)}
            />
          ))
        ) : (
          <p className="md:col-span-2 text-center font-body-md text-on-surface-variant py-xl">
            Không tìm thấy thử thách phù hợp.
          </p>
        )}
      </div>

      <p className="text-center font-body-md text-on-surface-variant">
        Sau khi bấm nút hành động và quay lại trang này, tiến độ sẽ được cập nhật tự động.{" "}
        <Link href="/dashboard" className="text-red-400 hover:text-red-300 underline">
          Về bảng điều khiển
        </Link>
      </p>
    </PageShell>
  );
}
