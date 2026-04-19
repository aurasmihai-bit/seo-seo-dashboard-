"use client";
import { useState } from "react";

const scoreColor = (score) => {
  if (score >= 75) return "#22c55e";
  if (score >= 50) return "#f59e0b";
  return "#ef4444";
};

const scoreLabel = (score) => {
  if (score >= 75) return "Good";
  if (score >= 50) return "Needs Work";
  return "Poor";
};

const priorityColor = {
  HIGH: "#ef4444",
  MEDIUM: "#f59e0b",
  LOW: "#22c55e",
};

function ScoreRing({ score, size = 120, label, sublabel }) {
  const r = (size / 2) * 0.75;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = scoreColor(score);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1e2433" strokeWidth={size * 0.1} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={size * 0.1}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dasharray 1s ease" }}
        />
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"
          fill="#f1f5f9" fontSize={size * 0.22} fontFamily="'DM Mono', monospace" fontWeight="700">
          {score}
        </text>
      </svg>
      {label && <div style={{ color: "#94a3b8", fontSize: 12, fontFamily: "DM Mono, monospace", textAlign: "center" }}>{label}</div>}
      {sublabel && <div style={{ color, fontSize: 11, fontFamily: "DM Mono, monospace", fontWeight: 700 }}>{sublabel}</div>}
    </div>
  );
}

function CategoryCard({ cat }) {
  const [open, setOpen] = useState(false);
  const color = scoreColor(cat.score);

  return (
    <div style={{
      background: "#0f1724",
      border: `1px solid ${open ? color + "44" : "#1e2d45"}`,
      borderRadius: 12,
      overflow: "hidden",
      transition: "border-color 0.3s",
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", background: "none", border: "none", cursor: "pointer",
          padding: "16px 20px", display: "flex", alignItems: "center", gap: 16,
        }}
      >
        <div style={{
          width: 48, height: 48, borderRadius: 10, background: color + "18",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 22, fontFamily: "DM Mono, monospace", fontWeight: 800, color }}>{cat.score}</span>
        </div>
        <div style={{ flex: 1, textAlign: "left" }}>
          <div style={{ color: "#f1f5f9", fontSize: 14, fontWeight: 600, fontFamily: "DM Sans, sans-serif" }}>{cat.label}</div>
          <div style={{ color: "#64748b", fontSize: 12, marginTop: 2, fontFamily: "DM Sans, sans-serif" }}>{cat.description}</div>
        </div>
        <div style={{
          width: 100, height: 6, background: "#1e2d45", borderRadius: 3, flexShrink: 0,
        }}>
          <div style={{ width: `${cat.score}%`, height: "100%", background: color, borderRadius: 3, transition: "width 1s ease" }} />
        </div>
        <span style={{ color: "#475569", fontSize: 18, marginLeft: 8 }}>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div style={{ padding: "0 20px 20px", borderTop: "1px solid #1e2d45" }}>
          {cat.issues?.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <div style={{ color: "#ef4444", fontSize: 11, fontWeight: 700, letterSpacing: 1, fontFamily: "DM Mono, monospace", marginBottom: 8 }}>● ISSUES</div>
              {cat.issues.map((issue, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "flex-start" }}>
                  <span style={{ color: "#ef4444", marginTop: 2 }}>✕</span>
                  <span style={{ color: "#94a3b8", fontSize: 13, fontFamily: "DM Sans, sans-serif" }}>{issue}</span>
                </div>
              ))}
            </div>
          )}
          {cat.recommendations?.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <div style={{ color: "#22c55e", fontSize: 11, fontWeight: 700, letterSpacing: 1, fontFamily: "DM Mono, monospace", marginBottom: 8 }}>● RECOMANDĂRI</div>
              {cat.recommendations.map((rec, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "flex-start" }}>
                  <span style={{ color: "#22c55e", marginTop: 2 }}>→</span>
                  <span style={{ color: "#cbd5e1", fontSize: 13, fontFamily: "DM Sans, sans-serif" }}>{rec}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const runAudit = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError("");
    setData(null);

    try {
      const res = await fetch("/api/geo-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Audit failed");
      setData(json);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const categories = data ? Object.values(data.categories) : [];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500;700&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #07101e; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0a1628; }
        ::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 3px; }
        
        .scan-btn {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: white;
          border: none;
          padding: 14px 36px;
          border-radius: 10px;
          font-family: 'DM Mono', monospace;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          letter-spacing: 1px;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .scan-btn:hover:not(:disabled) { background: linear-gradient(135deg, #3b82f6, #2563eb); transform: translateY(-1px); box-shadow: 0 8px 24px #2563eb44; }
        .scan-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        
        .url-input {
          flex: 1;
          background: #0d1e35;
          border: 1.5px solid #1e3a5f;
          color: #f1f5f9;
          padding: 14px 18px;
          border-radius: 10px;
          font-family: 'DM Mono', monospace;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }
        .url-input::placeholder { color: #334a66; }
        .url-input:focus { border-color: #2563eb; }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 10px;
          border-radius: 20px;
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        
        .slide-in { animation: slideIn 0.4s ease forwards; }
        .loading-dot { animation: pulse 1.2s ease infinite; }
        .loading-dot:nth-child(2) { animation-delay: 0.2s; }
        .loading-dot:nth-child(3) { animation-delay: 0.4s; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#07101e", padding: "0 0 80px" }}>
        
        {/* Header */}
        <div style={{
          background: "linear-gradient(180deg, #0a1628 0%, #07101e 100%)",
          borderBottom: "1px solid #0e2040",
          padding: "20px 40px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: "linear-gradient(135deg, #2563eb, #0ea5e9)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16,
            }}>⚡</div>
            <div>
              <div style={{ color: "#f1f5f9", fontFamily: "DM Mono, monospace", fontWeight: 700, fontSize: 16, letterSpacing: -0.5 }}>GEO·SEO</div>
              <div style={{ color: "#334a66", fontFamily: "DM Mono, monospace", fontSize: 10, letterSpacing: 1 }}>AI SEARCH AUDITOR</div>
            </div>
          </div>
          <div className="badge" style={{ background: "#0e2040", color: "#3b82f6", border: "1px solid #1e3a5f" }}>
            <span>●</span> Powered by Claude
          </div>
        </div>

        {/* Hero */}
        <div style={{ textAlign: "center", padding: "60px 20px 40px", maxWidth: 720, margin: "0 auto" }}>
          <div className="badge" style={{ background: "#0d1e35", color: "#0ea5e9", border: "1px solid #1e3a5f", marginBottom: 20 }}>
            GEO-FIRST · AI SEARCH OPTIMIZATION
          </div>
          <h1 style={{
            fontFamily: "DM Sans, sans-serif", fontWeight: 700, fontSize: "clamp(28px, 5vw, 48px)",
            color: "#f1f5f9", lineHeight: 1.15, marginBottom: 16,
            background: "linear-gradient(135deg, #f1f5f9 0%, #94a3b8 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            Cum arată site-ul tău<br />pentru ChatGPT, Claude & Perplexity?
          </h1>
          <p style={{ color: "#4a6382", fontFamily: "DM Sans, sans-serif", fontSize: 16, lineHeight: 1.6 }}>
            Audit complet GEO + SEO — citabilitate AI, crawlere, brand authority,<br />schema markup și recomandări acționabile.
          </p>
        </div>

        {/* Input */}
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 20px" }}>
          <div style={{ display: "flex", gap: 12 }}>
            <input
              className="url-input"
              type="text"
              placeholder="https://exemplu.com sau exemplu.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && runAudit()}
              disabled={loading}
            />
            <button className="scan-btn" onClick={runAudit} disabled={loading || !url.trim()}>
              {loading ? "ANALIZEZ..." : "AUDITEAZĂ →"}
            </button>
          </div>

          {/* Loading state */}
          {loading && (
            <div style={{ marginTop: 40, textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 16 }}>
                {[0, 1, 2].map(i => (
                  <div key={i} className="loading-dot" style={{
                    width: 8, height: 8, borderRadius: "50%", background: "#2563eb",
                    animationDelay: `${i * 0.2}s`,
                  }} />
                ))}
              </div>
              <div style={{ color: "#334a66", fontFamily: "DM Mono, monospace", fontSize: 12 }}>
                Claude analizează {url}...
              </div>
              <div style={{ color: "#1e3a5f", fontFamily: "DM Mono, monospace", fontSize: 11, marginTop: 8 }}>
                Citabilitate AI · Brand Authority · Technical SEO · Schema Markup
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{
              marginTop: 20, padding: 16, borderRadius: 10,
              background: "#1a0a0a", border: "1px solid #3f1515",
              color: "#ef4444", fontFamily: "DM Mono, monospace", fontSize: 13,
            }}>
              ✕ {error}
            </div>
          )}
        </div>

        {/* Results */}
        {data && (
          <div className="slide-in" style={{ maxWidth: 1100, margin: "40px auto 0", padding: "0 20px" }}>
            
            {/* Score Overview */}
            <div style={{
              background: "linear-gradient(135deg, #0a1628 0%, #0d1e35 100%)",
              border: "1px solid #1e2d45",
              borderRadius: 16, padding: "32px 40px", marginBottom: 24,
              display: "flex", flexWrap: "wrap", gap: 32, alignItems: "center",
            }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ color: "#334a66", fontFamily: "DM Mono, monospace", fontSize: 11, letterSpacing: 1, marginBottom: 8 }}>DOMENIU ANALIZAT</div>
                <div style={{ color: "#f1f5f9", fontFamily: "DM Mono, monospace", fontSize: 20, fontWeight: 700 }}>{data.domain}</div>
                <div style={{ color: "#334a66", fontFamily: "DM Mono, monospace", fontSize: 11, marginTop: 8 }}>{data.auditDate}</div>
                <div style={{ marginTop: 16, color: "#94a3b8", fontFamily: "DM Sans, sans-serif", fontSize: 14, lineHeight: 1.6 }}>
                  {data.summary}
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
                  {[
                    { label: "llms.txt", val: data.llmsTxtPresent, yes: "Prezent", no: "Absent" },
                    { label: "Schema Markup", val: data.schemaMarkupDetected, yes: "Detectat", no: "Lipsă" },
                  ].map((item, i) => (
                    <div key={i} className="badge" style={{
                      background: item.val ? "#0a2010" : "#1a0a0a",
                      color: item.val ? "#22c55e" : "#ef4444",
                      border: `1px solid ${item.val ? "#14532d" : "#3f1515"}`,
                    }}>
                      {item.label}: {item.val ? item.yes : item.no}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: 40, flexWrap: "wrap", justifyContent: "center" }}>
                <ScoreRing score={data.overallScore} size={130} label="OVERALL SCORE" sublabel={scoreLabel(data.overallScore)} />
                <ScoreRing score={data.geoScore} size={100} label="GEO SCORE" sublabel={scoreLabel(data.geoScore)} />
                <ScoreRing score={data.seoScore} size={100} label="SEO SCORE" sublabel={scoreLabel(data.seoScore)} />
              </div>
            </div>

            {/* Categories Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 12, marginBottom: 24 }}>
              {categories.map((cat, i) => (
                <CategoryCard key={i} cat={cat} />
              ))}
            </div>

            {/* Quick Wins */}
            {data.quickWins?.length > 0 && (
              <div style={{
                background: "#0a1628", border: "1px solid #1e2d45",
                borderRadius: 16, padding: 28,
              }}>
                <div style={{ color: "#f1f5f9", fontFamily: "DM Mono, monospace", fontWeight: 700, fontSize: 14, marginBottom: 20, letterSpacing: 0.5 }}>
                  ⚡ QUICK WINS — Acțiuni Prioritare
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {data.quickWins.map((qw, i) => (
                    <div key={i} style={{
                      display: "flex", gap: 16, alignItems: "flex-start",
                      background: "#0d1e35", borderRadius: 10, padding: 16,
                      border: `1px solid ${priorityColor[qw.priority] + "22"}`,
                    }}>
                      <div className="badge" style={{
                        background: priorityColor[qw.priority] + "18",
                        color: priorityColor[qw.priority],
                        border: `1px solid ${priorityColor[qw.priority] + "44"}`,
                        flexShrink: 0,
                      }}>
                        {qw.priority}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: "#f1f5f9", fontSize: 14, fontFamily: "DM Sans, sans-serif", fontWeight: 600 }}>{qw.action}</div>
                        <div style={{ color: "#64748b", fontSize: 12, fontFamily: "DM Sans, sans-serif", marginTop: 4 }}>
                          Impact: {qw.impact} · Efort: {qw.effort}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty state tips */}
        {!data && !loading && (
          <div style={{ maxWidth: 680, margin: "48px auto 0", padding: "0 20px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
              {[
                { icon: "🤖", title: "AI Citability", desc: "Cât de des citează ChatGPT sau Claude site-ul tău" },
                { icon: "🔍", title: "Crawler Analysis", desc: "Accesul GPTBot, ClaudeBot, PerplexityBot" },
                { icon: "🏷️", title: "Schema Markup", desc: "Structured data pentru AI discoverability" },
                { icon: "📊", title: "Brand Authority", desc: "Prezența brandului pe platformele AI-citate" },
              ].map((item, i) => (
                <div key={i} style={{
                  background: "#0a1628", border: "1px solid #0e2040",
                  borderRadius: 12, padding: 20,
                }}>
                  <div style={{ fontSize: 28, marginBottom: 10 }}>{item.icon}</div>
                  <div style={{ color: "#cbd5e1", fontFamily: "DM Sans, sans-serif", fontWeight: 600, fontSize: 14, marginBottom: 6 }}>{item.title}</div>
                  <div style={{ color: "#334a66", fontFamily: "DM Sans, sans-serif", fontSize: 12, lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
