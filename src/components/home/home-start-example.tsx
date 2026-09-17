"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { HOME_START_EXAMPLE } from "@/lib/home/stations-data";

export default function HomeStartExample() {
  const [copied, setCopied] = useState(false);

  async function copyGood() {
    try {
      await navigator.clipboard.writeText(HOME_START_EXAMPLE.good);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <section className="home-example" aria-label="Как начинать работу в ProektMap">
      <div className="home-example-grid">
        <div className="home-example-card is-bad">
          <span>Плохо</span>
          <p>{HOME_START_EXAMPLE.bad}</p>
        </div>
        <div className="home-example-card is-good">
          <span>Хорошо</span>
          <p>{HOME_START_EXAMPLE.good}</p>
          <button type="button" onClick={copyGood}>
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Скопировано" : "Копировать"}
          </button>
        </div>
      </div>
      <p className="home-example-why">{HOME_START_EXAMPLE.why}</p>
    </section>
  );
}
