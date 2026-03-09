"use client";

interface FeedItem {
  id: string;
  type: string;
  amount_usdc: string;
  agent_name: string;
  agent_slug: string;
  tile_size: string;
  created_at: string;
}

interface FeedProps {
  items: FeedItem[];
}

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return `${seconds} seconds ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

const TYPE_LABELS: Record<string, string> = {
  claim: "claimed a tile for",
  upgrade: "upgraded to",
  endorse: "endorsed",
  verify: "earned",
};

const TYPE_BADGE: Record<string, string> = {
  claim: "CLAIM",
  upgrade: "UPGRADE",
  endorse: "ENDORSE",
  verify: "VERIFIED",
};

// Amount color by type
const AMOUNT_COLOR: Record<string, string> = {
  claim: "color-cyan",
  upgrade: "color-magenta",
  endorse: "color-green",
  verify: "color-yellow",
};

export default function Feed({ items }: FeedProps) {
  if (items.length === 0) {
    return (
      <div style={{ textAlign: "center", color: "var(--text-dim)", fontSize: 12, padding: "32px 0" }}>
        No transactions yet. Be the first.
      </div>
    );
  }

  return (
    <div className="feed">
      {items.map((item) => (
        <div key={item.id} className="feed-item">
          <div className="feed-action">
            <span className="agent-name">{item.agent_name}</span>{" "}
            {TYPE_LABELS[item.type] || item.type}{" "}
            {item.type === "upgrade" ? `${item.tile_size} for ` : ""}
            <span className={`amount ${AMOUNT_COLOR[item.type] || "color-cyan"}`}>
              {item.type === "verify"
                ? "Verified badge"
                : `$${Number(item.amount_usdc).toLocaleString()} USDC`}
            </span>
          </div>
          <div className="feed-time">{timeAgo(item.created_at)}</div>
          <span className={`feed-type type-${item.type}`}>
            {TYPE_BADGE[item.type] || item.type.toUpperCase()}
          </span>
        </div>
      ))}
    </div>
  );
}
