export function abbreviateUnit(unitName?: string | null): string {
  if (!unitName) return "";
  const lower = unitName.toLowerCase().trim();
  if (lower.startsWith("kilogram") || lower === "kg" || lower === "kgs") return "kg";
  if (lower === "g" || (lower.startsWith("gram") && !lower.startsWith("kilogram"))) return "g";
  if (lower.startsWith("litre") || lower.startsWith("liter") || lower === "l") return "L";
  if (lower.startsWith("millilitre") || lower.startsWith("milliliter") || lower === "ml") return "ml";
  if (lower.startsWith("piece") || lower === "pc" || lower === "pcs") return "pcs";
  if (lower.startsWith("dozen")) return "dz";
  if (lower.startsWith("box")) return "box";
  if (lower.startsWith("pack")) return "pack";
  return unitName;
}

export function formatQtyValue(qty: number): string {
  const n = Number(qty);
  if (!Number.isFinite(n)) return "0";
  if (Number.isInteger(n)) return String(n);
  return String(Number(n.toFixed(3)));
}

export function formatQtyWithUnit(qty: number, unitName?: string | null): string {
  const amount = formatQtyValue(qty);
  const unit = abbreviateUnit(unitName);
  return unit ? `${amount} ${unit}` : amount;
}
