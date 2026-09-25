import Link from "next/link";
import { HOME_HUB_DIRECTORY } from "@/lib/home/stations-data";

export default function HomeHubDirectory() {
  return (
    <section className="home-directory" aria-labelledby="home-directory-title">
      <div className="home-directory-shell">
        <h2 id="home-directory-title">Разделы карты</h2>
        <p className="home-directory-lead">
          Спицы четырёх станций — откройте нужный раздел по названию.
        </p>

        <div className="home-directory-groups">
          {HOME_HUB_DIRECTORY.map((group) => (
            <div key={group.station} className="home-directory-group">
              <h3>{group.station}</h3>
              <ul>
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}>
                      <span className="home-directory-name">{item.title}</span>
                      <span className="home-directory-sub">{item.subtitle}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
