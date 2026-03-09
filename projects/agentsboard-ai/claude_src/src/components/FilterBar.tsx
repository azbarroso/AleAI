"use client";

import { useState } from "react";

interface FilterBarProps {
  capabilities: string[];
  chains: string[];
  onFilterChange: (filters: { capability: string | null; chain: string | null; search: string }) => void;
}

export default function FilterBar({ capabilities, chains, onFilterChange }: FilterBarProps) {
  const [activeCapability, setActiveCapability] = useState<string | null>(null);
  const [activeChain, setActiveChain] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  function handleCapability(cap: string | null) {
    setActiveCapability(cap);
    onFilterChange({ capability: cap, chain: activeChain, search });
  }

  function handleChain(chain: string | null) {
    setActiveChain(chain);
    onFilterChange({ capability: activeCapability, chain, search });
  }

  function handleSearch(val: string) {
    setSearch(val);
    onFilterChange({ capability: activeCapability, chain: activeChain, search: val });
  }

  return (
    <div className="filter-bar">
      <span className="filter-label">Filter:</span>
      <button
        className={`filter-btn${activeCapability === null ? " active" : ""}`}
        onClick={() => handleCapability(null)}
      >
        All
      </button>
      {capabilities.map((cap) => (
        <button
          key={cap}
          className={`filter-btn${activeCapability === cap ? " active" : ""}`}
          onClick={() => handleCapability(cap === activeCapability ? null : cap)}
        >
          {cap}
        </button>
      ))}

      <span className="filter-label" style={{ marginLeft: 12 }}>Chain:</span>
      {chains.map((chain) => (
        <button
          key={chain}
          className={`filter-btn${activeChain === chain ? " active" : ""}`}
          onClick={() => handleChain(chain === activeChain ? null : chain)}
        >
          {chain}
        </button>
      ))}

      <input
        className="filter-search"
        type="text"
        placeholder="Search agents..."
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  );
}
