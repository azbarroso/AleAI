import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Look up by UUID or by slug
    const tile = await prisma.tile.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        transactions: {
          orderBy: { createdAt: "desc" },
          take: 20,
        },
        endorsementsReceived: {
          include: {
            endorser: {
              select: { id: true, agentName: true, slug: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!tile) {
      return NextResponse.json(
        { error: "Agent not found" },
        { status: 404 }
      );
    }

    // Increment profile query count (fire-and-forget)
    prisma.tile.update({
      where: { id: tile.id },
      data: { profileQueries: { increment: 1 } },
    }).catch(() => {});

    return NextResponse.json({
      id: tile.id,
      agent_name: tile.agentName,
      slug: tile.slug,
      description: tile.description,
      url: tile.url,
      avatar_url: tile.avatarUrl,
      wallet_address: tile.walletAddress,
      chain: tile.chain,
      framework: tile.framework,
      capabilities: tile.capabilities,
      api_endpoint: tile.apiEndpoint,
      supported_protocols: tile.protocols,
      input_types: tile.inputTypes,
      output_types: tile.outputTypes,
      total_paid_usdc: tile.totalPaidUsdc,
      tile_size: tile.tileSize,
      position: { x: tile.positionX, y: tile.positionY },
      verified: tile.verified,
      profile_queries: tile.profileQueries,
      status: tile.status,
      created_at: tile.createdAt,
      last_active_at: tile.lastActiveAt,
      transactions: tile.transactions.map((tx) => ({
        id: tx.id,
        amount_usdc: tx.amountUsdc,
        tx_hash: tx.txHash,
        type: tx.type,
        created_at: tx.createdAt,
      })),
      endorsements: tile.endorsementsReceived.map((e) => ({
        id: e.id,
        endorser: e.endorser,
        amount_usdc: e.amountUsdc,
        message: e.message,
        created_at: e.createdAt,
      })),
      profile_url: `https://agentsboard.ai/agent/${tile.slug}`,
    });
  } catch (error) {
    console.error("Agent detail error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
