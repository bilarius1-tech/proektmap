import Link from "next/link";
import type { HomeHubStat } from "@/lib/home/hub-stats";

type Props = {
  stats: HomeHubStat[];
};

function formatValue(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1).replace(".0", "")}k`;
  return String(n);
}

export default function HomeMetricsBar({ stats }: Props) {
  if (!stats.length) return null;

  return (
    <section className="home-metrics" aria-labelledby="home-metrics-title" data-theme="dark">
      <div className="home-metrics-shell">
        <h2 id="home-metrics-title">Карта в цифрах</h2>
        <p className="home-metrics-lead">Живые счётчики разделов — кликните, чтобы открыть.</p>
        <div className="home-metrics-grid">
          {stats.map((stat) => (
            <Link key={stat.href + stat.label} href={stat.href} className="home-metrics-item">
              <span className="home-metrics-value">{formatValue(stat.value)}</span>
              <span className="home-metrics-label">{stat.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
