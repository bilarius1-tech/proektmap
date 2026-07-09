import { NextResponse } from "next/server";
let cache: any = null; let ct = 0; const TTL = 60*60*1000;

export async function GET() {
  if (cache && Date.now()-ct < TTL) return NextResponse.json(cache);
  try {
    const res = await fetch("https://openrouter.ai/api/v1/models", { headers: {"Accept":"application/json"}, signal: AbortSignal.timeout(15000) });
    const raw = await res.json();
    const models = (raw.data||[]).map((m:any)=>({
      id:m.id,name:m.name,provider:m.id?.split("/")[0]||"?",
      ctx:m.context_length||0,
      priceP:+((m.pricing?.prompt||0)*1e6).toFixed(2),
      priceC:+((m.pricing?.completion||0)*1e6).toFixed(2),
      intel:m.benchmarks?.artificial_analysis?.intelligence_index||0,
      code:m.benchmarks?.artificial_analysis?.coding_index||0,
      arenaElo:m.benchmarks?.design_arena?.elo||0,
      vision:m.architecture?.modality?.includes("image")||false,
      reason:!!m.reasoning,
      desc:m.description||"",
    })).filter((m:any)=>m.ctx>0);
    models.sort((a:any,b:any)=>b.intel-a.intel);
    const r={models,total:models.length,updated:new Date().toISOString()};
    cache=r; ct=Date.now(); return NextResponse.json(r);
  } catch { if(cache) return NextResponse.json(cache); return NextResponse.json({models:[],total:0},{status:500}); }
}
