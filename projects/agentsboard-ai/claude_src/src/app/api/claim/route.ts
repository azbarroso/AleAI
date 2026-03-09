import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getTileSize } from "@/lib/pricing";
import { generateSlug } from "@/lib/slug";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { agent_name, description, url, wallet_address, chain, amount_usdc, tx_hash } = body;

    if (!agent_name || !description || !url || !wallet_address || !chain || !amount_usdc || !tx_hash) {
      return NextResponse.json(
        { error: "Missing required fields: agent_name, description, url, wallet_address, chain, amount_usdc, tx_hash" },
        { status: 400 }
      );
    }

    if (amount_usdc < 1) {
      return NextResponse.json(
        { error: "Minimum tile cost is $1 USDC" },
        { status: 400 }
      );
    }

    // Generate slug and check uniqueness
    const slug = generateSlug(agent_name);
    const existing = await prisma.tile.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "An agent with a similar name already exists. Try a different name." },
        { status: 409 }
      );
    }

    // Check tx_hash hasn't been used
    const existingTx = await prisma.transaction.findFirst({ where: { txHash: tx_hash } });
    if (existingTx) {
      return NextResponse.json(
        { error: "This transaction has already been used" },
        { status: 409 }
      );
    }

    // TODO: Verify USDC payment on-chain (Phase 1 stub — trusts the tx_hash for now)

    // Calculate tile size and position
    const tileSize = getTileSize(amount_usdc);
    const tileCount = await prisma.tile.count();
    // Simple grid placement: fill left-to-right, top-to-bottom
    const gridWidth = 100; // 100-unit wide grid
    const positionX = (tileCount * 2) % gridWidth;
    const positionY = Math.floor((tileCount * 2) / gridWidth) * 2;

    // Create tile and transaction in a single DB transaction
    const tile = await prisma.tile.create({
      data: {
        agentName: agent_name,
        slug,
        description,
        url,
        avatarUrl: body.avatar_url || null,
        walletAddress: wallet_address,
        chain,
        framework: body.framework || null,
        capabilities: body.capabilities || [],
        apiEndpoint: body.api_endpoint || null,
        protocols: body.supported_protocols || [],
        inputTypes: body.input_types || [],
        outputTypes: body.output_types || [],
        totalPaidUsdc: amount_usdc,
        tileSize,
        positionX,
        positionY,
        transactions: {
          create: {
            amountUsdc: amount_usdc,
            txHash: tx_hash,
            type: "claim",
          },
        },
      },
    });

    return NextResponse.json(
      {
        tile_id: tile.id,
        slug: tile.slug,
        position: { x: tile.positionX, y: tile.positionY },
        size: tile.tileSize,
        tx_hash,
        profile_url: `https://agentsboard.ai/agent/${tile.slug}`,
        api_profile: `https://agentsboard.ai/api/agents/${tile.id}`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Claim error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
