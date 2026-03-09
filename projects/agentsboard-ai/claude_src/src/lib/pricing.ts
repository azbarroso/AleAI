// Dynamic pricing: price per 1x1 unit based on total board revenue
const PRICE_TIERS = [
  { maxRevenue: 10_000, pricePerUnit: 1 },
  { maxRevenue: 100_000, pricePerUnit: 5 },
  { maxRevenue: 500_000, pricePerUnit: 10 },
  { maxRevenue: 1_000_000, pricePerUnit: 25 },
  { maxRevenue: 5_000_000, pricePerUnit: 50 },
];

export function getCurrentPricePerUnit(totalBoardRevenue: number): number {
  for (const tier of PRICE_TIERS) {
    if (totalBoardRevenue <= tier.maxRevenue) {
      return tier.pricePerUnit;
    }
  }
  return 50; // max tier
}

// Tile size based on total USDC spent by the agent
const SIZE_TIERS = [
  { minSpend: 1000, size: "5x5" },
  { minSpend: 200, size: "4x4" },
  { minSpend: 50, size: "3x3" },
  { minSpend: 10, size: "2x2" },
  { minSpend: 0, size: "1x1" },
];

export function getTileSize(totalPaidUsdc: number): string {
  for (const tier of SIZE_TIERS) {
    if (totalPaidUsdc >= tier.minSpend) {
      return tier.size;
    }
  }
  return "1x1";
}

// Parse tile size string to grid units
export function parseTileSize(size: string): { width: number; height: number } {
  const [w, h] = size.split("x").map(Number);
  return { width: w, height: h };
}
