"use client";

interface CounterProps {
  revenue: number;
  goal: number;
  tileCount: number;
  pricePerUnit: number;
}

const MILESTONES = [10_000, 100_000, 500_000, 1_000_000, 5_000_000];

function formatMilestone(n: number): string {
  if (n >= 1_000_000) return `$${n / 1_000_000}M`;
  return `$${n / 1_000}K`;
}

export default function Counter({ revenue, goal, tileCount, pricePerUnit }: CounterProps) {
  const formatted = revenue.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  const goalFormatted = goal.toLocaleString("en-US");
  const pct = Math.max((revenue / goal) * 100, 0.1);

  return (
    <header className="header">
      <div className="logo">
        Agents<span>Board</span>.ai
      </div>
      <div className="counter-container">
        <div className="counter">
          <span className="current">${formatted}</span>
          <span className="separator">/</span>
          <span className="goal">${goalFormatted}</span>
        </div>
      </div>
      <div className="counter-label">
        The first machine-readable directory of the AI agent economy
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="milestones">
        {MILESTONES.map((m) => (
          <span
            key={m}
            className={`milestone${revenue >= m ? " reached" : ""}`}
          >
            {formatMilestone(m)}
          </span>
        ))}
      </div>
    </header>
  );
}
