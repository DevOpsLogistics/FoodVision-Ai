export type Challenge = {
  id: string;
  title: string;
  description: string;
  reward: string;
  target: number;
  unit: string;
  image: string;
  actionPath: string;
  actionLabel: string;
};

export const CHALLENGE_IMAGES = {
  nico: "/images/challenges/nico.png",
  yoshiko: "/images/challenges/yoshiko.png",
  honoka: "/images/challenges/honoka.png",
  asuna: "/images/challenges/asuna.png",
} as const;

export type ChallengeProgress = {
  joined: boolean;
  current: number;
  completed: boolean;
  completedAt?: string;
};

export const CHALLENGES: Challenge[] = [
  {
    id: "scan_3_meals",
    title: "Quét 3 bữa ăn",
    description: "Dùng máy quét khay để ghi nhận 3 bữa ăn trong tuần này.",
    reward: "+120 điểm",
    target: 3,
    unit: "bữa",
    image: CHALLENGE_IMAGES.nico,
    actionPath: "/scanner/select-tray",
    actionLabel: "Quét khay ngay",
  },
  {
    id: "try_3_dishes",
    title: "Thử 3 món mới",
    description: "Khám phá và xem công thức 3 món từ nhóm thực đơn.",
    reward: "+80 điểm",
    target: 3,
    unit: "món",
    image: CHALLENGE_IMAGES.honoka,
    actionPath: "/meal-recommendations",
    actionLabel: "Xem thực đơn",
  },
  {
    id: "log_5_days",
    title: "Ghi nhật ký 5 ngày",
    description: "Mở nhật ký dinh dưỡng và theo dõi bữa ăn 5 ngày liên tiếp.",
    reward: "+150 điểm",
    target: 5,
    unit: "ngày",
    image: CHALLENGE_IMAGES.yoshiko,
    actionPath: "/diary",
    actionLabel: "Mở nhật ký",
  },
  {
    id: "healthy_week",
    title: "Tuần ăn lành mạnh",
    description: "Chọn món ít đường huyết hoặc giàu protein từ bộ lọc thực đơn.",
    reward: "Huy hiệu Bạc",
    target: 4,
    unit: "lần",
    image: CHALLENGE_IMAGES.asuna,
    actionPath: "/meal-recommendations",
    actionLabel: "Lọc món lành mạnh",
  },
];

const STORAGE_KEY = "foodvision_challenges_v1";
const PENDING_PREFIX = "foodvision_challenge_pending_";

export function loadChallengeProgress(): Record<string, ChallengeProgress> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, ChallengeProgress>) : {};
  } catch {
    return {};
  }
}

export function saveChallengeProgress(data: Record<string, ChallengeProgress>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getChallengeProgress(
  store: Record<string, ChallengeProgress>,
  id: string,
): ChallengeProgress {
  return store[id] ?? { joined: false, current: 0, completed: false };
}

export function joinChallenge(store: Record<string, ChallengeProgress>, id: string) {
  const next = { ...store };
  const cur = getChallengeProgress(store, id);
  next[id] = { ...cur, joined: true };
  saveChallengeProgress(next);
  return next;
}

export function incrementChallenge(
  store: Record<string, ChallengeProgress>,
  id: string,
  challenge: Challenge,
) {
  const next = { ...store };
  const cur = getChallengeProgress(store, id);
  if (!cur.joined || cur.completed) return next;

  const current = Math.min(cur.current + 1, challenge.target);
  const completed = current >= challenge.target;
  next[id] = {
    joined: true,
    current,
    completed,
    completedAt: completed ? new Date().toISOString() : cur.completedAt,
  };
  saveChallengeProgress(next);
  return next;
}

export function markChallengePending(id: string) {
  sessionStorage.setItem(`${PENDING_PREFIX}${id}`, "1");
}

export function consumePendingChallenge(id: string): boolean {
  const key = `${PENDING_PREFIX}${id}`;
  if (sessionStorage.getItem(key) !== "1") return false;
  sessionStorage.removeItem(key);
  return true;
}

export function totalPoints(store: Record<string, ChallengeProgress>): number {
  return CHALLENGES.reduce((sum, c) => {
    const p = getChallengeProgress(store, c.id);
    if (!p.completed) return sum;
    const match = c.reward.match(/\+(\d+)/);
    return sum + (match ? Number(match[1]) : 0);
  }, 0);
}
