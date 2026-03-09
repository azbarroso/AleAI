import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentPricePerUnit } from "@/lib/pricing";

export async function GET() {
  try {
    const [tileCount, revenueResult, capabilityStats, chainStats, endorsementCount, profileQueriesResult] =
      await Promise.all([
        prisma.tile.count({ where: { status: "active" } }),
        prisma.tile.aggregate({ _sum: { totalPaidUsdc: true } }),
        prisma.$queryRaw<{ capability: string; count: bigint }[]>`
          SELECT unnest(capabilities) as capability, COUNT(*) as count
          FROM tiles
          WHERE status = 'active'
          GROUP BY capability
          ORDER BY count DESC
        `,
        prisma.tile.groupBy({
          by: ["chain"],
          _count: true,
          where: { status: "active" },
          orderBy: { _count: { chain: "desc" } },
        }),
        prisma.endorsement.count(),
        prisma.tile.aggregate({ _sum: { profileQueries: true } }),
      ]);

    const totalRevenue = Number(revenueResult._sum.totalPaidUsdc || 0);

    return NextResponse.json({
      total_revenue_usdc: totalRevenue,
      goal_usdc: 5_000_000,
      progress_pct: Number(((totalRevenue / 5_000_000) * 100).toFixed(4)),
      total_tiles: tileCount,
      current_price_per_unit: getCurrentPricePerUnit(totalRevenue),
      agents_by_capability: capabilityStats.map((c: { capability: string; count: bigint }) => ({
        capability: c.capability,
        count: Number(c.count),
      })),
      agents_by_chain: chainStats.map((c: { chain: string; _count: number }) => ({
        chain: c.chain,
        count: c._count,
      })),
      total_endorsements: endorsementCount,
      total_profile_queries: Number(profileQueriesResult._sum.profileQueries || 0),
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
