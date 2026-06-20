/** Giá tham khảo theo món (VND) — ánh xạ từ lớp CNN của khay trường. */
const SCAN_CLASS_PRICES: Record<string, number> = {
  com_trang: 5000,
  ca_kho: 18000,
  canh_chua: 10000,
  canh_rau: 8000,
  dau_hu_chien: 12000,
  dau_hu_sot_ca: 12000,
  suon_nuong: 28000,
  thit_kho: 20000,
  thit_kho_trung: 22000,
  trung_chien: 10000,
  rau_xao: 8000,
  rau_luoc: 7000,
  kim_chi: 6000,
  mam_vung: 5000,
};

const DEFAULT_PRICE = 10000;

export function dishPrice(className: string): number {
  return SCAN_CLASS_PRICES[className] ?? DEFAULT_PRICE;
}
