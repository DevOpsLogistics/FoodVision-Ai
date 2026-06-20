import Image from "next/image";
import type { CommunityVisitor } from "@/data/communityVisitors";

type Props = {
  visitors: CommunityVisitor[];
  size?: "sm" | "md";
  showNames?: boolean;
};

const sizes = { sm: 32, md: 40 };

export default function VisitorAvatars({ visitors, size = "sm", showNames = false }: Props) {
  const px = sizes[size];
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="flex -space-x-2 shrink-0">
        {visitors.map((v) => (
          <div
            key={v.id}
            className="relative rounded-full border-2 border-surface-container-lowest shadow-sm overflow-hidden bg-surface-variant"
            style={{ width: px, height: px }}
            title={v.name}
          >
            <Image
              src={v.avatar}
              alt={v.name}
              width={px}
              height={px}
              className="object-cover w-full h-full"
            />
          </div>
        ))}
      </div>
      {showNames && (
        <span className="font-label-sm text-label-sm text-outline truncate">
          {visitors.map((v) => v.name).join(", ")} đã thử
        </span>
      )}
    </div>
  );
}
