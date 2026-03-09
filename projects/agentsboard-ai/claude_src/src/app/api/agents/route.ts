import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const capability = searchParams.get("capability");
    const chain = searchParams.get("chain");
    const framework = searchParams.get("framework");
    const limit = Math.min(Number(searchParams.get("limit")) || 50, 100);
    const offset = Number(searchParams.get("offset")) || 0;

    // Build filter conditions
    const where: Record<string, unknown> = { status: "active" };

    if (capability) {
      where.capabilities = { has: capability };
    }
    if (chain) {
      where.chain = chain;
    }
    if (framework) {
      where.framework = framework;
    }

    const [agents, total] = await Promise.all([
      prisma.tile.findMany({
        where,
        orderBy: { totalPaidUsdc: "desc" }, // highest spend = highest trust signal
        take: limit,
        skip: offset,
        select: {
          id: true,
          agentName: true,
          slug: true,
          description: true,
          url: true,
          avatarUrl: true,
          chain: true,
          framework: true,
          capabilities: true,
          apiEndpoint: true,
          protocols: true,
          totalPaidUsdc: true,
          tileSize: true,
          verified: true,
          createdAt: true,
          lastActiveAt: true,
        },
      }),
      prisma.tile.count({ where }),
    ]);

    return NextResponse.json({
      agents,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Agents list error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
