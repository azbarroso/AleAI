import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number(searchParams.get("limit")) || 20, 50);

    const transactions = await prisma.transaction.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        tile: {
          select: { agentName: true, slug: true, tileSize: true },
        },
      },
    });

    return NextResponse.json({
      feed: transactions.map((tx) => ({
        id: tx.id,
        type: tx.type,
        amount_usdc: tx.amountUsdc,
        tx_hash: tx.txHash,
        agent_name: tx.tile.agentName,
        agent_slug: tx.tile.slug,
        tile_size: tx.tile.tileSize,
        created_at: tx.createdAt,
      })),
    });
  } catch (error) {
    console.error("Feed error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
