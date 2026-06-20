/** Ảnh món — ảnh HD do user cung cấp */
export const DISH_IMAGES: Record<string, string> = {
  goi_cuon: "/images/dishes/goi_cuon.jpg",
  banh_cuon: "/images/dishes/banh_cuon.jpg",
  bun_bo_hue: "/images/dishes/bun_bo_hue.jpg",
  ga_luoc: "/images/dishes/ga_luoc.jpg",
  goi_tai_heo: "/images/dishes/goi_tai_heo.jpg",
  chuoi_nep_nuong: "/images/dishes/chuoi_nep_nuong.jpg",
  ga_nuong: "/images/dishes/ga_nuong.jpg",
  sushi: "/images/dishes/sushi.jpg",
  sushi_platter: "/images/dishes/sushi_platter.jpg",
};

/** Map tên lớp CNN (khay trường) → ảnh hiển thị */
const SCAN_CLASS_IMAGES: Record<string, string> = {
  ca_kho: DISH_IMAGES.sushi,
  thit_kho: DISH_IMAGES.banh_cuon,
  thit_kho_trung: DISH_IMAGES.banh_cuon,
  suon_nuong: DISH_IMAGES.ga_nuong,
  canh_chua: DISH_IMAGES.bun_bo_hue,
  canh_rau: DISH_IMAGES.bun_bo_hue,
  com_trang: DISH_IMAGES.ga_luoc,
  dau_hu_chien: DISH_IMAGES.banh_cuon,
  dau_hu_sot_ca: DISH_IMAGES.banh_cuon,
  trung_chien: DISH_IMAGES.ga_nuong,
  rau_xao: DISH_IMAGES.goi_cuon,
  rau_luoc: DISH_IMAGES.goi_cuon,
  kim_chi: DISH_IMAGES.goi_tai_heo,
  mam_vung: DISH_IMAGES.goi_tai_heo,
};

export function dishImage(className: string): string {
  return (
    DISH_IMAGES[className] ??
    SCAN_CLASS_IMAGES[className] ??
    DISH_IMAGES.goi_cuon
  );
}

/** Gom lượt quét khay trường → món thực đơn (tên + ảnh luôn khớp) */
const SCAN_TO_MENU_DISH: Record<string, string> = {
  ca_kho: "sushi",
  trung_chien: "banh_cuon",
  com_trang: "ga_luoc",
  canh_rau: "bun_bo_hue",
  canh_chua: "bun_bo_hue",
  thit_kho: "banh_cuon",
  thit_kho_trung: "banh_cuon",
  suon_nuong: "ga_nuong",
  dau_hu_chien: "banh_cuon",
  dau_hu_sot_ca: "banh_cuon",
  rau_xao: "goi_cuon",
  rau_luoc: "goi_cuon",
  kim_chi: "goi_tai_heo",
  mam_vung: "goi_tai_heo",
};

export function menuDishForScanClass(className: string): string {
  if (DISH_IMAGES[className]) return className;
  return SCAN_TO_MENU_DISH[className] ?? className;
}
