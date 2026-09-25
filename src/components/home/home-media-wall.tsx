import Link from "next/link";
import type { HomeMediaFeed, HomeMediaTile } from "@/lib/home/media-feed";

type Props = {
  feed: HomeMediaFeed;
};

function Tile({ tile, large }: { tile: HomeMediaTile; large?: boolean }) {
  return (
    <Link
      href={tile.href}
      className={`home-media-tile${large ? " is-large" : ""}`}
      data-kind={tile.kind}
    >
      <span className="home-media-tile-media" aria-hidden>
        <img src={tile.image} alt="" loading="lazy" decoding="async" />
      </span>
      <span className="home-media-tile-body">
        <span className="home-media-tile-kicker">
          {tile.kicker}
          {tile.meta ? ` · ${tile.meta}` : ""}
        </span>
        <strong className="home-media-tile-title">{tile.title}</strong>
      </span>
    </Link>
  );
}

export default function HomeMediaWall({ feed }: Props) {
  if (!feed.tiles.length) return null;

  const lead = feed.tiles.find((t) => t.featured) || feed.tiles[0];
  const rest = feed.tiles.filter((t) => t !== lead).slice(0, 7);

  return (
    <section className="home-media" aria-labelledby="home-media-title">
      <div className="home-media-shell">
        <div className="home-media-head">
          <div>
            <h2 id="home-media-title">Свежее на карте</h2>
            <p>Гайды, видеоуроки и микросервисы с превью — то, что вышло недавно.</p>
          </div>
          <nav className="home-media-links" aria-label="Разделы медиа">
            <Link href="/blog">Блог</Link>
            <Link href="/video">Видео</Link>
            <Link href="/services">Микросервисы</Link>
          </nav>
        </div>

        <div className="home-media-grid">
          <Tile tile={lead} large />
          {rest.map((tile) => (
            <Tile key={`${tile.kind}-${tile.href}-${tile.title}`} tile={tile} />
          ))}
        </div>
      </div>
    </section>
  );
}
