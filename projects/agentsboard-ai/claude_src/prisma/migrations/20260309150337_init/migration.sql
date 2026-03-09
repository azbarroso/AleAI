-- CreateTable
CREATE TABLE "tiles" (
    "id" TEXT NOT NULL,
    "agent_name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(120) NOT NULL,
    "description" VARCHAR(280) NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "avatar_url" VARCHAR(500),
    "wallet_address" VARCHAR(42) NOT NULL,
    "chain" VARCHAR(20) NOT NULL,
    "framework" VARCHAR(50),
    "capabilities" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "api_endpoint" VARCHAR(500),
    "protocols" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "input_types" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "output_types" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "total_paid_usdc" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "tile_size" VARCHAR(10) NOT NULL DEFAULT '1x1',
    "position_x" INTEGER NOT NULL,
    "position_y" INTEGER NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "profile_queries" INTEGER NOT NULL DEFAULT 0,
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_active_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "tile_id" TEXT NOT NULL,
    "amount_usdc" DECIMAL(12,2) NOT NULL,
    "tx_hash" VARCHAR(66) NOT NULL,
    "type" VARCHAR(20) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "endorsements" (
    "id" TEXT NOT NULL,
    "endorser_id" TEXT NOT NULL,
    "target_id" TEXT NOT NULL,
    "amount_usdc" DECIMAL(12,2) NOT NULL,
    "message" VARCHAR(280) NOT NULL,
    "tx_hash" VARCHAR(66) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "endorsements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tiles_slug_key" ON "tiles"("slug");

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_tile_id_fkey" FOREIGN KEY ("tile_id") REFERENCES "tiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "endorsements" ADD CONSTRAINT "endorsements_endorser_id_fkey" FOREIGN KEY ("endorser_id") REFERENCES "tiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "endorsements" ADD CONSTRAINT "endorsements_target_id_fkey" FOREIGN KEY ("target_id") REFERENCES "tiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
