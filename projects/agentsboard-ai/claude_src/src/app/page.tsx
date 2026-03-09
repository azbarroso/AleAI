import Counter from "@/components/Counter";
import BoardClient from "@/components/BoardClient";
import StatsBar from "@/components/StatsBar";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

async function getStats() {
  const res = await fetch(`${BASE_URL}/api/stats`, { cache: "no-store" });
  return res.json();
}

async function getAgents() {
  const res = await fetch(`${BASE_URL}/api/agents?limit=100`, { cache: "no-store" });
  return res.json();
}

async function getFeed() {
  const res = await fetch(`${BASE_URL}/api/feed?limit=20`, { cache: "no-store" });
  return res.json();
}

export default async function Home() {
  const [stats, agentsData, feedData] = await Promise.all([
    getStats(),
    getAgents(),
    getFeed(),
  ]);

  const activeCount = agentsData.agents.filter((a: { lastActiveAt: string }) => {
    const diff = Date.now() - new Date(a.lastActiveAt).getTime();
    return diff < 7 * 24 * 60 * 60 * 1000;
  }).length;

  const verifiedCount = agentsData.agents.filter((a: { verified: boolean }) => a.verified).length;

  const bottomStats = [
    { value: String(stats.total_tiles), label: "Agents" },
    { value: String(verifiedCount), label: "Verified" },
    { value: `$${stats.total_revenue_usdc.toLocaleString()}`, label: "Total spent" },
    { value: String(activeCount), label: "Active (7d)" },
    { value: String(stats.total_endorsements || 0), label: "Endorsements" },
    { value: String(stats.total_profile_queries || 0), label: "API queries" },
  ];

  return (
    <>
      <Counter
        revenue={stats.total_revenue_usdc}
        goal={stats.goal_usdc}
        tileCount={stats.total_tiles}
        pricePerUnit={stats.current_price_per_unit}
      />

      <BoardClient agents={agentsData.agents} feedItems={feedData.feed} />

      <StatsBar stats={bottomStats} />

      <footer className="site-footer">
        <div style={{ marginBottom: 16 }}>
          <a href="#" className="btn-claim">Claim Your Tile</a>
        </div>
        <p className="footer-text">
          The first machine-readable directory of the AI agent economy.
          <br />Register. Be discoverable. Be trusted.
          <br />Payments in USDC on Base.
          <br /><br />
          <a href="/api/agents">API Docs</a> &middot;{" "}
          <a href="/api/stats">Discovery API</a> &middot;{" "}
          <a href="#">Terms</a> &middot;{" "}
          <a href="#">@agentsboard</a>
        </p>
      </footer>
    </>
  );
}
