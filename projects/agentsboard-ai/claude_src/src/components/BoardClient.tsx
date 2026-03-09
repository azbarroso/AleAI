"use client";

import { useState, useMemo } from "react";
import FilterBar from "./FilterBar";
import TileGrid from "./TileGrid";
import Feed from "./Feed";

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

interface FeedItem {
  id: string;
  type: string;
  amount_usdc: string;
  agent_name: string;
  agent_slug: string;
  tile_size: string;
  created_at: string;
}

interface BoardClientProps {
  agents: Agent[];
  feedItems: FeedItem[];
}

export default function BoardClient({ agents, feedItems }: BoardClientProps) {
  const [filters, setFilters] = useState({
    capability: null as string | null,
    chain: null as string | null,
    search: "",
  });

  // Extract unique capabilities and chains from data
  const capabilities = useMemo(() => {
    const set = new Set<string>();
    agents.forEach((a) => a.capabilities.forEach((c) => set.add(c)));
    return Array.from(set).sort();
  }, [agents]);

  const chains = useMemo(() => {
    const set = new Set<string>();
    agents.forEach((a) => set.add(a.chain));
    return Array.from(set).sort();
  }, [agents]);

  // Filter agents
  const filtered = useMemo(() => {
    return agents.filter((a) => {
      if (filters.capability && !a.capabilities.includes(filters.capability)) return false;
      if (filters.chain && a.chain !== filters.chain) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (
          !a.agentName.toLowerCase().includes(q) &&
          !a.description.toLowerCase().includes(q) &&
          !a.capabilities.some((c) => c.toLowerCase().includes(q))
        ) {
          return false;
        }
      }
      return true;
    });
  }, [agents, filters]);

  return (
    <>
      <FilterBar
        capabilities={capabilities.slice(0, 6)}
        chains={chains}
        onFilterChange={setFilters}
      />

      <main className="main-layout">
        <TileGrid agents={filtered} />

        <aside className="feed-section">
          <div className="feed-label">
            <span className="live-dot" /> Live transactions
          </div>
          <Feed items={feedItems} />
        </aside>
      </main>
    </>
  );
}
