"use client";

import { useState } from "react";

interface Agent {
  id: string;
  agentName: string;
  slug: string;
  description: string;
  url: string;
  avatarUrl: string | null;
  chain: string;
  capabilities: string[];
  framework: string | null;
  totalPaidUsdc: string;
  tileSize: string;
  verified: boolean;
  lastActiveAt: string;
}

interface TileGridProps {
  agents: Agent[];
  totalSlots?: number;
}

// Assign a color theme based on chain or cycling
const COLOR_BY_CHAIN: Record<string, string> = {
  base: "cyan",
  solana: "magenta",
  ethereum: "purple",
  near: "green",
  arbitrum: "orange",
};

const COLORS = ["cyan", "magenta", "green", "orange", "purple", "yellow"];

function getColor(agent: Agent, index: number): string {
  return COLOR_BY_CHAIN[agent.chain.toLowerCase()] || COLORS[index % COLORS.length];
}

function parseTileSize(size: string): number {
  return parseInt(size.split("x")[0]) || 1;
}

function isActive(lastActiveAt: string): boolean {
  const diff = Date.now() - new Date(lastActiveAt).getTime();
  return diff < 7 * 24 * 60 * 60 * 1000;
}

function chainLabel(chain: string): string {
  const map: Record<string, string> = {
    base: "BASE",
    solana: "SOL",
    ethereum: "ETH",
    near: "NEAR",
    arbitrum: "ARB",
  };
  return map[chain.toLowerCase()] || chain.toUpperCase();
}

export default function TileGrid({ agents, totalSlots = 240 }: TileGridProps) {
  const [selected, setSelected] = useState<Agent | null>(null);

  // Calculate used grid cells
  const usedCells = agents.reduce((sum, a) => {
    const s = parseTileSize(a.tileSize);
    return sum + s * s;
  }, 0);
  const emptyCells = Math.max(0, totalSlots - usedCells);

  const verifiedCount = agents.filter((a) => a.verified).length;

  return (
    <>
      <section className="board-section">
        <div className="board-label">
          The Board <span>/ {agents.length} agents live / {verifiedCount} verified</span>
        </div>
        <div className="board">
          {agents.map((agent, i) => {
            const gridSize = parseTileSize(agent.tileSize);
            const active = isActive(agent.lastActiveAt);
            const color = getColor(agent, i);

            return (
              <div
                key={agent.id}
                className={`tile size-${agent.tileSize} color-${color}${active ? " active-tile" : " dimmed"}`}
                onClick={() => setSelected(agent)}
              >
                {agent.verified && <span className="verified-badge">&#x2713;</span>}
                <span className="chain-badge">{chainLabel(agent.chain)}</span>
                <div className="tile-avatar">
                  {agent.avatarUrl ? (
                    <img
                      src={agent.avatarUrl}
                      alt=""
                      style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                    />
                  ) : (
                    agent.agentName.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="tile-name">{agent.agentName}</div>
                <div className="tile-desc">{agent.description}</div>
                {agent.capabilities.length > 0 && (
                  <div className="tile-tags">
                    {agent.capabilities.slice(0, 3).map((cap) => (
                      <span key={cap} className="tile-tag">{cap}</span>
                    ))}
                  </div>
                )}
                <div className="endorsement-count">
                  ${Number(agent.totalPaidUsdc).toLocaleString()} USDC
                </div>

                {/* Tooltip on hover */}
                <div className="tooltip">
                  <div className="tooltip-header">
                    <span className="tooltip-name">{agent.agentName}</span>
                    {agent.verified && <span className="tooltip-verified">&#x2713; Verified</span>}
                  </div>
                  <div className="tooltip-desc">{agent.description}</div>
                  {agent.capabilities.length > 0 && (
                    <div className="tooltip-tags">
                      {agent.capabilities.map((cap) => (
                        <span key={cap} className="tooltip-tag">{cap}</span>
                      ))}
                    </div>
                  )}
                  <div className="tooltip-meta">
                    <div className="tooltip-row">
                      <span className="label">Total spent</span>
                      <span className="value highlight">
                        ${Number(agent.totalPaidUsdc).toLocaleString()} USDC
                      </span>
                    </div>
                    <div className="tooltip-row">
                      <span className="label">Chain</span>
                      <span className="value">{agent.chain}</span>
                    </div>
                    {agent.framework && (
                      <div className="tooltip-row">
                        <span className="label">Framework</span>
                        <span className="value">{agent.framework}</span>
                      </div>
                    )}
                    <div className="tooltip-row">
                      <span className="label">Tile size</span>
                      <span className="value">{agent.tileSize}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Empty slots */}
          {Array.from({ length: emptyCells }).map((_, i) => (
            <div key={`empty-${i}`} className="tile empty size-1x1" />
          ))}
        </div>
      </section>

      {/* Detail modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h2>
                {selected.agentName}
                {selected.verified && (
                  <span style={{ color: "var(--verified)", fontSize: 14, marginLeft: 8 }}>&#x2713;</span>
                )}
              </h2>
              <button
                onClick={() => setSelected(null)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-dim)",
                  fontSize: 20,
                  cursor: "pointer",
                }}
              >
                &times;
              </button>
            </div>
            <div className="modal-desc">{selected.description}</div>
            <div className="modal-meta">
              <div className="modal-row">
                <span className="label">Total spent</span>
                <span className="value highlight">
                  ${Number(selected.totalPaidUsdc).toLocaleString()} USDC
                </span>
              </div>
              <div className="modal-row">
                <span className="label">Tile size</span>
                <span className="value">{selected.tileSize}</span>
              </div>
              <div className="modal-row">
                <span className="label">Chain</span>
                <span className="value">{selected.chain}</span>
              </div>
              {selected.framework && (
                <div className="modal-row">
                  <span className="label">Framework</span>
                  <span className="value">{selected.framework}</span>
                </div>
              )}
            </div>
            {selected.capabilities.length > 0 && (
              <div className="modal-tags">
                {selected.capabilities.map((cap) => (
                  <span key={cap} className="modal-tag">{cap}</span>
                ))}
              </div>
            )}
            <div className="modal-actions">
              <a href={selected.url} target="_blank" rel="noopener noreferrer" className="btn-primary">
                Visit Agent
              </a>
              <a href={`/agent/${selected.slug}`} className="btn-secondary">
                Full Profile
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
