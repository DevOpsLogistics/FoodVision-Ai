import { dishImage } from "./dishImages";
import { visitorsForDish } from "./communityVisitors";

export type RecipeFilterTag = "plant" | "protein" | "low-glycemic" | "quick";

export type RecipeCard = {
  id: string;
  name: string;
  image: string;
  time: string;
  calories: number;
  description: string;
  price: number;
  ingredients: string[];
  steps: string[];
  colSpan: number;
  tags: RecipeFilterTag[];
};

export const RECIPE_FILTERS = [
  { id: "all", label: "Tất cả công thức" },
  { id: "plant", label: "Nguồn gốc thực vật" },
  { id: "protein", label: "Giàu Protein" },
  { id: "low-glycemic", label: "Ít đường huyết" },
  { id: "quick", label: "Chuẩn bị nhanh" },
] as const;

export type RecipeFilterId = (typeof RECIPE_FILTERS)[number]["id"];

export const RECIPE_CARDS: RecipeCard[] = [
  {
    id: "goi_cuon",
    name: "Gỏi cuốn",
    image: dishImage("goi_cuon"),
    time: "20p",
    calories: 280,
    price: 35000,
    description: "Gỏi cuốn tôm thịt — tươi mát, chấm tương đậu phộng.",
    ingredients: ["Bánh tráng", "Tôm luộc", "Thịt ba chỉ", "Bún tươi", "Rau sống", "Tương đậu phộng"],
    steps: [
      "Luộc tôm và thịt, thái lát mỏng.",
      "Nhúng bánh tráng, cuốn rau, bún, tôm, thịt.",
      "Cuộn chặt, chấm tương đậu phộng.",
    ],
    colSpan: 4,
    tags: ["plant", "protein", "low-glycemic", "quick"],
  },
  {
    id: "banh_cuon",
    name: "Bánh cuốn",
    image: dishImage("banh_cuon"),
    time: "25p",
    calories: 320,
    price: 40000,
    description: "Bánh cuốn nóng — bột mỏng, nhân thịt, rắc hành phi.",
    ingredients: ["Bột gạo", "Thịt xay", "Mộc nhĩ", "Hành phi", "Nước mắm pha"],
    steps: [
      "Pha bột loãng, tráng mỏng trên chảo.",
      "Rắc nhân thịt, cuộn lại.",
      "Rắc hành phi, ăn kèm nước chấm.",
    ],
    colSpan: 4,
    tags: ["plant", "low-glycemic", "quick"],
  },
  {
    id: "bun_bo_hue",
    name: "Bún bò Huế",
    image: dishImage("bun_bo_hue"),
    time: "40p",
    calories: 510,
    price: 55000,
    description: "Bún bò Huế cay nồng — nước lèo đậm đà, sả thơm.",
    ingredients: ["Bún tươi", "Bắp bò", "Chân giò", "Sả", "Ớt", "Rau thơm"],
    steps: [
      "Ninh xương và bắp bò với sả, ớt.",
      "Thái bò tái, blanch bún.",
      "Chan nước lèo, thêm rau và chả.",
    ],
    colSpan: 4,
    tags: ["protein"],
  },
  {
    id: "ga_luoc",
    name: "Gà luộc",
    image: dishImage("ga_luoc"),
    time: "35p",
    calories: 340,
    price: 120000,
    description: "Gà luộc lá chanh — da vàng, chấm muối tiêu chanh.",
    ingredients: ["Gà ta", "Lá chanh", "Gừng", "Muối", "Tiêu", "Chanh"],
    steps: [
      "Luộc gà với gừng, muối đến chín.",
      "Ngâm nước đá cho da giòn.",
      "Chặt miếng, chấm muối tiêu chanh.",
    ],
    colSpan: 4,
    tags: ["protein", "low-glycemic"],
  },
  {
    id: "ga_nuong",
    name: "Gà nướng",
    image: dishImage("ga_nuong"),
    time: "30p",
    calories: 380,
    price: 85000,
    description: "Gà nướng mật ong — da sánh, thịt mềm, rắc vừng.",
    ingredients: ["Đùi gà", "Mật ong", "Tỏi", "Nước tương", "Vừng rang"],
    steps: [
      "Ướp gà mật ong, tỏi, nước tương 30 phút.",
      "Nướng 180°C, phết mật ong đều.",
      "Rắc vừng, dọn nóng.",
    ],
    colSpan: 4,
    tags: ["protein"],
  },
  {
    id: "goi_tai_heo",
    name: "Gỏi tai heo",
    image: dishImage("goi_tai_heo"),
    time: "20p",
    calories: 300,
    price: 45000,
    description: "Gỏi tai heo — giòn sần sật, trộn rau thơm và đậu phộng.",
    ingredients: ["Tai heo luộc", "Hành tây", "Rau răm", "Đậu phộng", "Nước mắm chua ngọt"],
    steps: [
      "Thái tai heo sợi, ngâm nước đá.",
      "Trộn hành, rau răm, nước mắm.",
      "Rắc đậu phộng rang trước khi ăn.",
    ],
    colSpan: 4,
    tags: ["protein", "low-glycemic", "quick"],
  },
  {
    id: "chuoi_nep_nuong",
    name: "Chuối nếp nướng",
    image: dishImage("chuoi_nep_nuong"),
    time: "15p",
    calories: 220,
    price: 20000,
    description: "Chuối nếp nướng than — ngọt béo, thơm lá chuối.",
    ingredients: ["Chuối sứ", "Nếp dẻo", "Lá chuối", "Đường", "Nước cốt dừa"],
    steps: [
      "Gói chuối với nếp trong lá chuối.",
      "Nướng than đến vàng thơm.",
      "Chấm nước cốt dừa pha đường.",
    ],
    colSpan: 4,
    tags: ["plant", "low-glycemic", "quick"],
  },
  {
    id: "sushi",
    name: "Sushi",
    image: dishImage("sushi"),
    time: "20p",
    calories: 350,
    price: 95000,
    description: "Sushi tổng hợp — cá tươi, cơm dẻo, wasabi gừng.",
    ingredients: ["Cơm sushi", "Cá hồi", "Tôm", "Wasabi", "Gừng ngâm", "Nori"],
    steps: [
      "Nấu cơm sushi, để nguội vừa.",
      "Cuộn maki hoặc nắn nigiri.",
      "Cắt miếng, dọn kèm wasabi gừng.",
    ],
    colSpan: 4,
    tags: ["protein", "low-glycemic", "quick"],
  },
  {
    id: "sushi_platter",
    name: "Sashimi & maki",
    image: dishImage("sushi_platter"),
    time: "25p",
    calories: 420,
    price: 150000,
    description: "Đĩa sashimi và maki — hải sản tươi, trình bày đẹp mắt.",
    ingredients: ["Cá hồi", "Cá ngừ", "Tôm", "Cơm sushi", "Wasabi", "Tương shoyu"],
    steps: [
      "Thái sashimi lát mỏng tươi.",
      "Cuộn các loại maki đa dạng.",
      "Trình bày đĩa, chấm shoyu wasabi.",
    ],
    colSpan: 4,
    tags: ["protein", "quick"],
  },
];

export function filterRecipes(cards: RecipeCard[], filterId: RecipeFilterId): RecipeCard[] {
  if (filterId === "all") return cards;
  return cards.filter((card) => card.tags.includes(filterId));
}

export function shuffleRecipes(cards: RecipeCard[]): RecipeCard[] {
  const list = [...cards];
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

export function formatPrice(vnd: number): string {
  return new Intl.NumberFormat("vi-VN").format(vnd) + "đ";
}

export function getVisitorsForRecipe(recipeId: string) {
  return visitorsForDish(recipeId, 3);
}
