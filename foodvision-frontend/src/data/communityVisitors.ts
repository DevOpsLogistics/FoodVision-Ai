export type CommunityVisitor = {
  id: string;
  name: string;
  avatar: string;
};

/** Khách thăm / thành viên cộng đồng */
export const COMMUNITY_VISITORS: CommunityVisitor[] = [
  { id: "conan", name: "Conan", avatar: "/images/avatars/conan.png" },
  { id: "ran", name: "Ran", avatar: "/images/avatars/ran.png" },
  { id: "megumi", name: "Megumi", avatar: "/images/avatars/megumi.png" },
  { id: "sailor_moon", name: "Sailor Moon", avatar: "/images/avatars/sailor_moon.png" },
  { id: "emilia", name: "Emilia", avatar: "/images/avatars/emilia.png" },
  { id: "rem", name: "Rem", avatar: "/images/avatars/rem.png" },
  { id: "sakura", name: "Sakura", avatar: "/images/avatars/sakura.png" },
];

export function visitorsForDish(dishId: string, count = 3): CommunityVisitor[] {
  let hash = 0;
  for (let i = 0; i < dishId.length; i++) hash = (hash + dishId.charCodeAt(i) * (i + 1)) % 997;
  const out: CommunityVisitor[] = [];
  for (let i = 0; i < count; i++) {
    out.push(COMMUNITY_VISITORS[(hash + i) % COMMUNITY_VISITORS.length]);
  }
  return out;
}
