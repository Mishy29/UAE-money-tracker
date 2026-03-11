import { useState, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, Cell, PieChart, Pie,
} from "recharts";

const GOLD = "#C9A84C";
const GOLD_DIM = "#8B6914";
const RED = "#FF4444";
const GREEN = "#00D4AA";
const BLUE = "#4A9EFF";
const DARK = "#0A0C10";
const CARD = "#0F1318";
const BORDER = "#1E2530";

const destinations = [
  { name: "Switzerland", code: "CH", flag: "🇨🇭", flow: 4.2, change: +12.4, reason: "Safe haven banking, neutrality hedge", risk: "LOW", sectors: ["Private Banking", "Gold Vaults", "Real Estate"], color: "#E74C3C" },
  { name: "Singapore", code: "SG", flag: "🇸🇬", flow: 3.8, change: +28.7, reason: "Asian pivot, family offices boom", risk: "LOW", sectors: ["Family Offices", "Equities", "Fintech"], color: "#E67E22" },
  { name: "US Treasuries", code: "US", flag: "🇺🇸", flow: 6.1, change: +8.2, reason: "Dollar dominance, geopolitical buffer", risk: "LOW-MED", sectors: ["T-Bills", "Bonds", "Equity ETFs"], color: BLUE },
  { name: "Gold & Commodities", code: "XAU", flag: "🥇", flow: 5.3, change: +41.2, reason: "War premium, fiat distrust surge", risk: "LOW", sectors: ["Physical Gold", "Silver", "Oil Futures"], color: GOLD },
  { name: "Crypto / BTC", code: "BTC", flag: "₿", flow: 2.1, change: +63.8, reason: "Sanctions bypass, borderless store of value", risk: "HIGH", sectors: ["Bitcoin", "Stablecoins", "DeFi"], color: "#F7931A" },
  { name: "London", code: "UK", flag: "🇬🇧", flow: 1.4, change: -6.1, reason: "Post-Brexit complexity, slower flows", risk: "MED", sectors: ["Real Estate", "Hedge Funds", "Art"], color: "#9B59B6" },
  { name: "India", code: "IN", flag: "🇮🇳", flow: 1.9, change: +19.4, reason: "Diaspora repatriation, strategic neutrality", risk: "MED", sectors: ["Equities", "Infrastructure", "Remittance"], color: "#1ABC9C" },
  { name: "Hong Kong", code: "HK", flag: "🇭🇰", flow: 0.8, change: -14.2, reason: "China risk overhang reducing appeal", risk: "MED-HIGH", sectors: ["Equities", "Real Estate"], color: "#E91E63" },
];

const monthlyFlow = [
  { month: "Sep'24", total: 8.2, gold: 2.1, crypto: 0.9, bonds: 3.1, re: 2.1 },
  { month: "Oct'24", total: 9.4, gold: 2.4, crypto: 1.1, bonds: 3.6, re: 2.3 },
  { month: "Nov'24", total: 11.2, gold: 3.1, crypto: 1.4, bonds: 4.2, re: 2.5 },
  { month: "Dec'24", total: 13.8, gold: 3.8, crypto: 2.1, bonds: 5.1, re: 2.8 },
  { month: "Jan'25", total: 15.1, gold: 4.4, crypto: 2.8, bonds: 5.4, re: 2.5 },
  { month: "Feb'25", total: 17.3, gold: 5.2, crypto: 3.1, bonds: 6.1, re: 2.9 },
  { month: "Mar'25", total: 21.4, gold: 6.8, crypto: 3.9, bonds: 7.2, re: 3.5 },
];

const warZoneRisk = [
  { subject: "Iran Escalation", A: 82, fullMark: 100 },
  { subject: "Red Sea Disruption", A: 74, fullMark: 100 },
  { subject: "Lebanon Spillover", A: 61, fullMark: 100 },
  { subject: "Russia Sanctions", A: 55, fullMark: 100 },
  { subject: "Strait of Hormuz", A: 68, fullMark: 100 },
  { subject: "Oil Shock Risk", A: 79, fullMark: 100 },
];

const triggers = [
  { date: "Mar 11", event: "US-Iran naval confrontation", impact: "+$2.1B outflow spike", severity: "CRITICAL" },
  { date: "Feb 28", event: "Houthi expansion — Red Sea lanes", impact: "+$1.4B commodities pivot", severity: "HIGH" },
  { date: "Feb 14", event: "Israel-Gaza ceasefire collapse risk", impact: "+$0.9B gold demand", severity: "HIGH" },
  { date: "Jan 30", event: "SWIFT secondary sanction warnings", impact: "Crypto +63% volume", severity: "MED" },
  { date: "Jan 12", event: "UAE diplomatic repositioning signals", impact: "SG family office surge", severity: "MED" },
];

const sectorPie = [
  { name: "Gold & Commodities", value: 25.4 },
  { name: "US Bonds/T-Bills", value: 29.2 },
  { name: "Private Banking", value: 20.1 },
  { name: "Crypto/Digital", value: 10.0 },
  { name: "Real Estate", value: 9.1 },
  { name: "Equities", value: 6.2 },
];

const PIE_COLORS = [GOLD, BLUE, "#9B59B6", "#F7931A", GREEN, "#E74C3C"];

function Ticker() {
  const items = [
    "⚠️ IRAN STRAIT TENSIONS ELEVATED — Gold +2.4%",
    "📊 Dubai DFM Outflows: $21.4B MTD",
    "🔴 Red Sea shipping disruption — 3rd consecutive week",
    "💰 Singapore family offices +28.7% YOY inflows from GCC",
    "📉 AED assets under pressure — institutional re-allocation active",
    "⚡ BTC volume surge linked to MENA sanctions bypass activity",
    "🏦 Swiss private banks report record MENA deposit surge",
    "🛢️ Oil futures premium +$4.2/bbl war risk factor",
  ];

  return (
    <div style={{ background: "#0D0F14", borderBottom: `1px solid ${BORDER}`, padding: "8px 0", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ background: RED, color: "white", fontSize: 10, fontWeight: 900, padding: "3px 10px", letterSpacing: 2, whiteSpace: "nowrap", marginLeft: 16, fontFamily: "monospace" }}>LIVE</div>
        <div style={{ overflow: "hidden", flex: 1, maskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)" }}>
          <div style={{ whiteSpace: "nowrap", color: GOLD, fontSize: 11, fontFamily: "monospace", letterSpacing: 0.5, animation: "scroll-left 80s linear infinite" }}>
            {items.join("   ·   ")} · {items.join("   ·   ")}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, color, blink }) {
  return (
    <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderTop: `2px solid ${color || GOLD}`, padding: "18px 20px" }}>
      <div style={{ color: "#5A6478", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8, fontFamily: "monospace" }}>{label}</div>
      <div style={{ color: color || GOLD, fontSize: 26, fontWeight: 800, fontFamily: "'Courier New', monospace" }}>
        {blink && <span style={{ animation: "blink 1s step-end infinite", color: RED }}>● </span>}
        {value}
      </div>
      {sub && <div style={{ color: "#7A8599", fontSize: 11, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function RiskBadge({ level }) {
  const colors = { "LOW": GREEN, "LOW-MED": "#A0C040", "MED": "#F0A030", "MED-HIGH": "#E06020", "HIGH": RED };
  return (
    <span style={{ background: (colors[level] || GOLD) + "22", color: colors[level] || GOLD, border: `1px solid ${(colors[level] || GOLD)}44`, fontSize: 9, padding: "2px 7px", letterSpacing: 1.5, fontWeight: 700, fontFamily: "monospace" }}>{level}</span>
  );
}

export default function App() {
  const [selected, setSelected] = useState(null);
  const [activeTab, setActive] = useState("FLOWS");

  return (
    <div style={{ background: DARK, color: "#C8D0DC", minHeight: "100vh", fontFamily: "'IBM Plex Mono', 'Courier New', monospace" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;600;700&family=Cinzel:wght@700;900&display=swap');
        @keyframes scroll-left { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        ::-webkit-scrollbar { width: 4px } ::-webkit-scrollbar-track { background: #0A0C10 } ::-webkit-scrollbar-thumb { background: #2A3040 }
        * { box-sizing: border-box; margin: 0; padding: 0 }
        .dest-row:hover { background: #151A22 !important; cursor: pointer }
        .tab-btn { cursor: pointer; transition: all 0.2s }
      `}</style>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #0A0C10 0%, #0F1318 100%)", borderBottom: `1px solid ${BORDER}`, padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 42, height: 42, background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DIM})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 900, color: DARK }}>𝔻</div>
          <div>
            <div style={{ fontFamily: "Cinzel, serif", fontSize: 18, color: GOLD, letterSpacing: 3, fontWeight: 900 }}>DUBAI CAPITAL EXODUS TRACKER</div>
            <div style={{ fontSize: 10, color: "#5A6478", letterSpacing: 2 }}>GEOPOLITICAL CAPITAL FLOW INTELLIGENCE · WAR-STATE EDITION</div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, color: RED, fontWeight: 700, letterSpacing: 1 }}>⚠ WAR STATE: ELEVATED</div>
          <div style={{ fontSize: 10, color: "#5A6478" }}>Updated: Mar 11, 2026 · 14:32 GST</div>
        </div>
      </div>

      <Ticker />

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 1, margin: "16px 16px 0" }}>
        <StatCard label="Total MTD Outflow" value="$21.4B" sub="↑ 31.2% vs prior month" color={RED} blink />
        <StatCard label="YTD Capital Exit" value="$89.7B" sub="Highest since 2022 crisis" color={GOLD} />
        <StatCard label="Top Destination" value="US T-Bills" sub="$6.1B · 28.5% of flows" color={BLUE} />
        <StatCard label="War Risk Index" value="74/100" sub="Iran + Red Sea drivers" color="#FF6B35" />
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, margin: "16px 16px 0", borderBottom: `1px solid ${BORDER}`, overflowX: "auto" }}>
        {["FLOWS", "DESTINATIONS", "WAR RISK", "TRIGGERS"].map(t => (
          <button key={t} className="tab-btn" onClick={() => setActive(t)} style={{ background: activeTab === t ? CARD : "transparent", color: activeTab === t ? GOLD : "#5A6478", border: "none", borderBottom: activeTab === t ? `2px solid ${GOLD}` : "2px solid transparent", padding: "10px 20px", fontSize: 11, letterSpacing: 2, fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace", whiteSpace: "nowrap" }}>{t}</button>
        ))}
      </div>

      <div style={{ padding: "0 16px 24px" }}>

        {/* FLOWS TAB */}
        {activeTab === "FLOWS" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 12, marginTop: 12 }}>
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, padding: 20, gridColumn: "1 / -1" }}>
              <div style={{ color: "#5A6478", fontSize: 10, letterSpacing: 2, marginBottom: 16 }}>MONTHLY CAPITAL OUTFLOW COMPOSITION ($B)</div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={monthlyFlow}>
                  <defs>
                    {[["gold", GOLD], ["crypto", "#F7931A"], ["bonds", BLUE], ["re", GREEN]].map(([id, c]) => (
                      <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={c} stopOpacity={0.4} />
                        <stop offset="95%" stopColor={c} stopOpacity={0} />
                      </linearGradient>
                    ))}
                  </defs>
                  <XAxis dataKey="month" tick={{ fill: "#5A6478", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#5A6478", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#0F1318", border: `1px solid ${BORDER}`, color: GOLD, fontSize: 11 }} />
                  <Area type="monotone" dataKey="gold" stackId="1" stroke={GOLD} fill="url(#gold)" name="Gold/Commodities" />
                  <Area type="monotone" dataKey="bonds" stackId="1" stroke={BLUE} fill="url(#bonds)" name="US Bonds" />
                  <Area type="monotone" dataKey="re" stackId="1" stroke={GREEN} fill="url(#re)" name="Real Estate" />
                  <Area type="monotone" dataKey="crypto" stackId="1" stroke="#F7931A" fill="url(#crypto)" name="Crypto" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div style={{ background: CARD, border: `1px solid ${BORDER}`, padding: 20 }}>
              <div style={{ color: "#5A6478", fontSize: 10, letterSpacing: 2, marginBottom: 16 }}>ASSET CLASS DISTRIBUTION (%)</div>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={sectorPie} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                    {sectorPie.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#0F1318", border: `1px solid ${BORDER}`, color: GOLD, fontSize: 10 }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 16px", marginTop: 8 }}>
                {sectorPie.map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: "#7A8599" }}>
                    <div style={{ width: 8, height: 8, background: PIE_COLORS[i], borderRadius: 1 }} />
                    {s.name}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: CARD, border: `1px solid ${BORDER}`, padding: 20 }}>
              <div style={{ color: "#5A6478", fontSize: 10, letterSpacing: 2, marginBottom: 16 }}>OUTFLOW BY DESTINATION ($B MTD)</div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={destinations.map(d => ({ name: d.code, flow: d.flow }))} barSize={22}>
                  <XAxis dataKey="name" tick={{ fill: "#5A6478", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#5A6478", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#0F1318", border: `1px solid ${BORDER}`, color: GOLD, fontSize: 11 }} />
                  <Bar dataKey="flow" name="Flow ($B)" radius={[2, 2, 0, 0]}>
                    {destinations.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* DESTINATIONS TAB */}
        {activeTab === "DESTINATIONS" && (
          <div style={{ marginTop: 12 }}>
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, overflowX: "auto" }}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 2fr 2fr", padding: "10px 20px", borderBottom: `1px solid ${BORDER}`, color: "#5A6478", fontSize: 9, letterSpacing: 2, minWidth: 700 }}>
                <span>DESTINATION</span><span>FLOW $B</span><span>MOM %</span><span>RISK</span><span>KEY DRIVER</span><span>SECTORS</span>
              </div>
              {destinations.map((d, i) => (
                <div key={i} className="dest-row" onClick={() => setSelected(selected === i ? null : i)} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 2fr 2fr", padding: "14px 20px", borderBottom: `1px solid ${BORDER}`, background: selected === i ? "#151A22" : "transparent", minWidth: 700 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 18 }}>{d.flag}</span>
                    <div>
                      <div style={{ color: "#C8D0DC", fontWeight: 700, fontSize: 12 }}>{d.name}</div>
                      <div style={{ color: "#5A6478", fontSize: 9, letterSpacing: 1 }}>{d.code}</div>
                    </div>
                  </div>
                  <div style={{ color: GOLD, fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center" }}>${d.flow}B</div>
                  <div style={{ color: d.change > 0 ? GREEN : RED, fontWeight: 700, fontSize: 12, display: "flex", alignItems: "center" }}>{d.change > 0 ? "▲" : "▼"} {Math.abs(d.change)}%</div>
                  <div style={{ display: "flex", alignItems: "center" }}><RiskBadge level={d.risk} /></div>
                  <div style={{ color: "#7A8599", fontSize: 11, display: "flex", alignItems: "center" }}>{d.reason}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
                    {d.sectors.map((s, j) => (
                      <span key={j} style={{ background: d.color + "22", color: d.color, fontSize: 9, padding: "2px 6px", borderRadius: 2, letterSpacing: 1 }}>{s}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {selected !== null && (
              <div style={{ background: "#111620", border: `1px solid ${destinations[selected].color}44`, borderTop: `2px solid ${destinations[selected].color}`, padding: 20, marginTop: 2 }}>
                <div style={{ display: "flex", gap: 32, alignItems: "flex-start", flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ fontFamily: "Cinzel, serif", color: destinations[selected].color, fontSize: 16, marginBottom: 8 }}>
                      {destinations[selected].flag} {destinations[selected].name} — FLOW INTELLIGENCE
                    </div>
                    <div style={{ color: "#8A9AB5", fontSize: 12, lineHeight: 1.8 }}>
                      <strong style={{ color: GOLD }}>Capital Driver:</strong> {destinations[selected].reason}<br />
                      <strong style={{ color: GOLD }}>Active Sectors:</strong> {destinations[selected].sectors.join(", ")}<br />
                      <strong style={{ color: GOLD }}>Risk Profile:</strong> <RiskBadge level={destinations[selected].risk} /><br />
                      <strong style={{ color: GOLD }}>MoM Change:</strong> <span style={{ color: destinations[selected].change > 0 ? GREEN : RED }}>{destinations[selected].change > 0 ? "+" : ""}{destinations[selected].change}%</span>
                    </div>
                  </div>
                  <div style={{ background: DARK, border: `1px solid ${BORDER}`, padding: "14px 20px", minWidth: 200 }}>
                    <div style={{ color: "#5A6478", fontSize: 9, letterSpacing: 2, marginBottom: 8 }}>MTD FLOW</div>
                    <div style={{ color: destinations[selected].color, fontSize: 36, fontWeight: 900 }}>${destinations[selected].flow}B</div>
                    <div style={{ color: "#5A6478", fontSize: 10, marginTop: 4 }}>of $21.4B total outflow</div>
                    <div style={{ marginTop: 8, height: 4, background: "#1E2530", borderRadius: 2 }}>
                      <div style={{ height: 4, borderRadius: 2, width: `${(destinations[selected].flow / 21.4 * 100).toFixed(0)}%`, background: destinations[selected].color }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* WAR RISK TAB */}
        {activeTab === "WAR RISK" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 12, marginTop: 12 }}>
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, padding: 20 }}>
              <div style={{ color: "#5A6478", fontSize: 10, letterSpacing: 2, marginBottom: 16 }}>REGIONAL WAR RISK RADAR</div>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={warZoneRisk} cx="50%" cy="50%" outerRadius="70%">
                  <PolarGrid stroke="#1E2530" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "#7A8599", fontSize: 10 }} />
                  <Radar name="Risk" dataKey="A" stroke={RED} fill={RED} fillOpacity={0.2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div style={{ background: CARD, border: `1px solid ${BORDER}`, padding: 20 }}>
              <div style={{ color: "#5A6478", fontSize: 10, letterSpacing: 2, marginBottom: 16 }}>WAR RISK LEVELS</div>
              {warZoneRisk.map((w, i) => (
                <div key={i} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: "#C8D0DC" }}>{w.subject}</span>
                    <span style={{ fontSize: 11, color: w.A > 70 ? RED : w.A > 55 ? "#F0A030" : GREEN, fontWeight: 700 }}>{w.A}</span>
                  </div>
                  <div style={{ height: 3, background: "#1E2530", borderRadius: 2 }}>
                    <div style={{ height: 3, borderRadius: 2, width: `${w.A}%`, background: w.A > 70 ? `linear-gradient(to right, ${RED}, #FF8844)` : w.A > 55 ? `linear-gradient(to right, #E08020, #F0C040)` : `linear-gradient(to right, ${GREEN}, #40E0A0)` }} />
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 20, padding: 14, background: RED + "11", border: `1px solid ${RED}33` }}>
                <div style={{ color: RED, fontSize: 10, fontWeight: 700, letterSpacing: 2, marginBottom: 6 }}>CRITICAL NEXUS</div>
                <div style={{ fontSize: 11, color: "#8A9AB5", lineHeight: 1.8 }}>
                  Iran escalation + Strait of Hormuz risk = dual energy shock vector. At 80+/100, expect <strong style={{ color: GOLD }}>immediate gold/crypto flight</strong> and <strong style={{ color: GOLD }}>USD T-Bill surge</strong> within 48–72hrs of incident.
                </div>
              </div>
            </div>

            <div style={{ background: CARD, border: `1px solid ${BORDER}`, padding: 20, gridColumn: "1 / -1" }}>
              <div style={{ color: "#5A6478", fontSize: 10, letterSpacing: 2, marginBottom: 16 }}>GEOPOLITICAL SCENARIO → FLOW FORECAST</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
                {[
                  { scenario: "SCENARIO A: Hormuz Closure", prob: "18%", color: RED, flows: ["+$15–22B emergency", "Gold +60–80%", "Crypto +120%", "USD T-Bills +40%"], timeline: "72hr spike response" },
                  { scenario: "SCENARIO B: Iran-Israel Exchange", prob: "34%", color: "#FF6B35", flows: ["+$8–12B acceleration", "Oil +35%", "SG/CH inflows surge", "AED volatility spike"], timeline: "1–2 week rebalance" },
                  { scenario: "SCENARIO C: Ceasefire / De-escalation", prob: "48%", color: GREEN, flows: ["Partial return flows", "Real estate stabilizes", "Equities recover", "Crypto profit-take"], timeline: "4–6 week normalization" },
                ].map((s, i) => (
                  <div key={i} style={{ border: `1px solid ${s.color}44`, borderTop: `2px solid ${s.color}`, padding: 16 }}>
                    <div style={{ color: s.color, fontSize: 11, fontWeight: 700, marginBottom: 4 }}>{s.scenario}</div>
                    <div style={{ color: "#5A6478", fontSize: 10, marginBottom: 10 }}>Probability: <strong style={{ color: s.color }}>{s.prob}</strong></div>
                    {s.flows.map((f, j) => <div key={j} style={{ color: "#8A9AB5", fontSize: 10, padding: "3px 0", borderBottom: "1px solid #1E2530" }}>→ {f}</div>)}
                    <div style={{ marginTop: 8, color: s.color, fontSize: 9, letterSpacing: 1 }}>⏱ {s.timeline}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TRIGGERS TAB */}
        {activeTab === "TRIGGERS" && (
          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 12 }}>
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, gridColumn: "1 / -1", overflowX: "auto" }}>
              <div style={{ padding: "14px 20px", borderBottom: `1px solid ${BORDER}`, color: "#5A6478", fontSize: 10, letterSpacing: 2 }}>GEOPOLITICAL TRIGGER LOG</div>
              {triggers.map((t, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "80px 1fr 200px 100px", padding: "14px 20px", borderBottom: `1px solid ${BORDER}`, alignItems: "center", gap: 12, minWidth: 600 }}>
                  <div style={{ color: GOLD, fontSize: 11, fontWeight: 700 }}>{t.date}</div>
                  <div style={{ color: "#C8D0DC", fontSize: 12 }}>{t.event}</div>
                  <div style={{ color: GREEN, fontSize: 11 }}>{t.impact}</div>
                  <span style={{ background: t.severity === "CRITICAL" ? RED + "22" : t.severity === "HIGH" ? "#FF6B3522" : GOLD + "22", color: t.severity === "CRITICAL" ? RED : t.severity === "HIGH" ? "#FF6B35" : GOLD, border: `1px solid ${t.severity === "CRITICAL" ? RED : t.severity === "HIGH" ? "#FF6B35" : GOLD}44`, fontSize: 9, padding: "3px 8px", letterSpacing: 1.5, fontWeight: 700 }}>{t.severity}</span>
                </div>
              ))}
            </div>

            <div style={{ background: CARD, border: `1px solid ${BORDER}`, padding: 20 }}>
              <div style={{ color: "#5A6478", fontSize: 10, letterSpacing: 2, marginBottom: 16 }}>SMART MONEY SIGNALS</div>
              {[
                { signal: "Institutional gold buying", strength: 91, color: GOLD },
                { signal: "Crypto OTC desk volume", strength: 78, color: "#F7931A" },
                { signal: "USD T-Bill demand", strength: 85, color: BLUE },
                { signal: "Singapore FO intake", strength: 72, color: GREEN },
                { signal: "DFM net foreign selling", strength: 63, color: RED },
              ].map((s, i) => (
                <div key={i} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ color: "#C8D0DC", fontSize: 11 }}>{s.signal}</span>
                    <span style={{ color: s.color, fontWeight: 700, fontSize: 11 }}>{s.strength}/100</span>
                  </div>
                  <div style={{ height: 4, background: "#1E2530", borderRadius: 2 }}>
                    <div style={{ height: 4, borderRadius: 2, width: `${s.strength}%`, background: `linear-gradient(to right, ${s.color}88, ${s.color})` }} />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: CARD, border: `1px solid ${BORDER}`, padding: 20 }}>
              <div style={{ color: "#5A6478", fontSize: 10, letterSpacing: 2, marginBottom: 16 }}>ANALYST THESIS</div>
              <div style={{ fontSize: 12, color: "#8A9AB5", lineHeight: 2 }}>
                <span style={{ color: GOLD }}>Core thesis:</span> Dubai sits at the nexus of Iran risk, Red Sea shipping disruption, and GCC-West sanctions friction. Capital is not fleeing the region permanently — it is <em style={{ color: "#C8D0DC" }}>hedging</em>.<br /><br />
                <span style={{ color: GOLD }}>Key observation:</span> The bifurcation between crypto (+63% volume) and US T-Bills (+8%) reflects a split in investor profile — sanctioned or near-sanctioned entities use crypto; institutional GCC money moves to USD paper.<br /><br />
                <span style={{ color: GOLD }}>Watch:</span> Singapore absorption capacity + Swiss banking discretion = the two valves regulating how much stays offshore vs. returns when de-escalation signals emerge.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
