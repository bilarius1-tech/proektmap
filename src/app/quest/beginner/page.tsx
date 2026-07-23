import BeginnerPathClient from "./client";
export const dynamic = "force-dynamic";
export const metadata = { title: "Путь новичка — Карта роста", description: "От нуля до сайта в интернете за час." };
export default function Page() {
  return <BeginnerPathClient />;
}