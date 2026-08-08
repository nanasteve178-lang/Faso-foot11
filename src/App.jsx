import React, { useState, useMemo, useEffect } from "react";

/* ============================================================
   FASO 11 — application de football burkinabè (prototype)
   Données de démonstration à remplacer par des données réelles.
   ============================================================ */

/* ---------- Données ---------- */

const CLUBS = [
  { id: "asf", name: "ASFA Yennenga", short: "ASF", ville: "Ouagadougou", c1: "#1F6B3D", c2: "#EDE6D6" },
  { id: "rah", name: "Rahimo FC", short: "RAH", ville: "Koudougou", c1: "#1E4E8C", c2: "#EDE6D6" },
  { id: "sal", name: "Salitas FC", short: "SAL", ville: "Ouagadougou", c1: "#A9431E", c2: "#14140F" },
  { id: "usf", name: "USFA", short: "USF", ville: "Ouagadougou", c1: "#132A54", c2: "#E8B33D" },
  { id: "rck", name: "Rail Club du Kadiogo", short: "RCK", ville: "Ouagadougou", c1: "#14140F", c2: "#E8B33D" },
  { id: "maj", name: "Majestic SC", short: "MAJ", ville: "Ouagadougou", c1: "#5B2A6E", c2: "#EDE6D6" },
  { id: "efo", name: "Étoile Filante", short: "EFO", ville: "Ouagadougou", c1: "#1F6B3D", c2: "#E8B33D" },
  { id: "vit", name: "Vitesse FC", short: "VIT", ville: "Ouagadougou", c1: "#C65A2E", c2: "#14140F" },
  { id: "uso", name: "US Ouaga", short: "USO", ville: "Ouagadougou", c1: "#A9431E", c2: "#EDE6D6" },
  { id: "bas", name: "Bassablo FC", short: "BAS", ville: "Banfora", c1: "#146B6B", c2: "#EDE6D6" },
  { id: "dou", name: "AS Douanes", short: "DOU", ville: "Ouagadougou", c1: "#132A54", c2: "#A9431E" },
  { id: "koz", name: "Kozeda FC", short: "KOZ", ville: "Ziniaré", c1: "#6E1F2A", c2: "#E8B33D" },
];

const clubById = (id) => CLUBS.find((c) => c.id === id);

function buildStandings(seed) {
  return CLUBS.map((c, i) => {
    const j = ((seed + i * 7) % 9) + 6;
    const v = Math.max(0, Math.round(j * (0.3 + ((i * 13) % 40) / 100)));
    const n = Math.max(0, Math.round((j - v) * (0.25 + ((i * 5) % 30) / 100)));
    const d = Math.max(0, j - v - n);
    const bm = v * 2 + n + ((i * 3) % 6);
    const be = d * 2 + n + ((i * 2) % 5);
    return { club: c.id, mj: j, v, n, d, bm, be, pts: v * 3 + n };
  }).sort((a, b) => b.pts - a.pts || b.bm - b.be - (a.bm - a.be));
}

const DIVISIONS = {
  d1: { label: "1ʳᵉ Division", standings: buildStandings(3) },
  d2: { label: "2ᵉ Division", standings: buildStandings(11) },
  d3: { label: "3ᵉ Division", standings: buildStandings(19) },
  reg: { label: "Régionale (Centre)", standings: buildStandings(27) },
};

const MATCHES = [
  { id: 1, home: "sal", away: "usf", date: "2026-08-07", time: "16:00", status: "live", minute: 63, hs: 1, as: 0, journee: 12 },
  { id: 2, home: "asf", away: "rck", date: "2026-08-07", time: "18:00", status: "upcoming", journee: 12 },
  { id: 3, home: "rah", away: "efo", date: "2026-08-08", time: "16:00", status: "upcoming", journee: 12 },
  { id: 4, home: "maj", away: "vit", date: "2026-08-08", time: "18:00", status: "upcoming", journee: 12 },
  { id: 5, home: "dou", away: "koz", date: "2026-08-01", time: "16:00", status: "finished", hs: 2, as: 2, journee: 11 },
  { id: 6, home: "bas", away: "uso", date: "2026-08-01", time: "18:00", status: "finished", hs: 0, as: 1, journee: 11 },
  { id: 7, home: "usf", away: "rah", date: "2026-07-25", time: "16:00", status: "finished", hs: 3, as: 1, journee: 10 },
  { id: 8, home: "rck", away: "sal", date: "2026-07-25", time: "18:00", status: "finished", hs: 1, as: 1, journee: 10 },
];

const MATCH_DETAILS = {
  1: {
    lineupsHome: ["Zida", "Kaboré", "Sawadogo", "Ouédraogo", "Traoré", "Compaoré", "Bationo", "Nikiema", "Zongo", "Sanou", "Yaméogo"],
    lineupsAway: ["Ilboudo", "Kafando", "Tapsoba", "Nana", "Dabiré", "Ky", "Sorgho", "Bamogo", "Congo", "Guira", "Zoungrana"],
    stats: [
      { label: "Possession", home: 54, away: 46, unit: "%" },
      { label: "Tirs", home: 9, away: 4 },
      { label: "Tirs cadrés", home: 5, away: 2 },
      { label: "Corners", home: 6, away: 3 },
      { label: "Fautes", home: 8, away: 11 },
    ],
    events: [
      { min: 23, type: "but", team: "home", text: "But de Sanou sur penalty" },
      { min: 41, type: "jaune", team: "away", text: "Carton jaune — Nana" },
      { min: 58, type: "jaune", team: "home", text: "Carton jaune — Traoré" },
    ],
  },
};

const PLAYERS = [
  { id: 1, nom: "Issa Sanou", club: "sal", poste: "Attaquant", num: 9, age: 24, mj: 11, buts: 9, passes: 2, jaune: 1, rouge: 0 },
  { id: 2, nom: "Boukary Zongo", club: "sal", poste: "Milieu", num: 8, age: 27, mj: 12, buts: 3, passes: 6, jaune: 3, rouge: 0 },
  { id: 3, nom: "Adama Ilboudo", club: "usf", poste: "Gardien", num: 1, age: 29, mj: 12, buts: 0, passes: 0, jaune: 0, rouge: 0 },
  { id: 4, nom: "Rasmané Kafando", club: "usf", poste: "Défenseur", num: 4, age: 25, mj: 10, buts: 1, passes: 0, jaune: 4, rouge: 1 },
  { id: 5, nom: "Yacouba Ouédraogo", club: "asf", poste: "Attaquant", num: 11, age: 22, mj: 11, buts: 7, passes: 4, jaune: 2, rouge: 0 },
  { id: 6, nom: "Moussa Traoré", club: "asf", poste: "Milieu", num: 6, age: 26, mj: 12, buts: 2, passes: 8, jaune: 2, rouge: 0 },
  { id: 7, nom: "Salif Nikiema", club: "rah", poste: "Défenseur", num: 3, age: 28, mj: 12, buts: 0, passes: 1, jaune: 1, rouge: 0 },
  { id: 8, nom: "Harouna Sawadogo", club: "rck", poste: "Attaquant", num: 10, age: 23, mj: 9, buts: 6, passes: 3, jaune: 0, rouge: 0 },
  { id: 9, nom: "Ismaël Congo", club: "efo", poste: "Milieu", num: 7, age: 21, mj: 11, buts: 4, passes: 5, jaune: 1, rouge: 0 },
  { id: 10, nom: "Oumar Bamogo", club: "vit", poste: "Défenseur", num: 5, age: 30, mj: 12, buts: 1, passes: 0, jaune: 5, rouge: 0 },
];

const NEWS = [
  { id: 1, cat: "Sélection", titre: "Les Étalons connaissent leur groupe pour les prochaines éliminatoires", date: "5 août 2026" },
  { id: 2, cat: "Transfert", titre: "Issa Sanou proche d'un départ vers un club nord-africain", date: "4 août 2026" },
  { id: 3, cat: "Club", titre: "Rahimo FC officialise un nouvel entraîneur adjoint", date: "3 août 2026" },
  { id: 4, cat: "Résultat", titre: "USFA renverse Rahimo FC dans les dernières minutes", date: "25 juillet 2026" },
  { id: 5, cat: "Club", titre: "ASFA Yennenga inaugure son nouveau centre de formation", date: "20 juillet 2026" },
  { id: 6, cat: "Sélection", titre: "Retour de deux binationaux dans le groupe des Étalons", date: "18 juillet 2026" },
];

const ETALONS = {
  prochainMatch: { adversaire: "Mali", date: "2026-09-05", lieu: "Stade du 4-Août, Ouagadougou", competition: "Éliminatoires CAN" },
  calendrier: [
    { adversaire: "Mali", date: "2026-09-05", type: "domicile", competition: "Élim. CAN" },
    { adversaire: "Bénin", date: "2026-09-09", type: "exterieur", competition: "Élim. CAN" },
    { adversaire: "Niger", date: "2026-10-11", type: "domicile", competition: "Élim. CAN" },
  ],
  resultats: [
    { adversaire: "Sénégal", date: "2026-06-06", score: "1-1", type: "exterieur", competition: "Amical" },
    { adversaire: "Guinée", date: "2026-03-22", score: "2-0", type: "domicile", competition: "Élim. CAN" },
    { adversaire: "Gabon", date: "2026-03-18", score: "0-1", type: "exterieur", competition: "Élim. CAN" },
  ],
  classementGroupe: [
    { pays: "Mali", pts: 13, mj: 5 },
    { pays: "Burkina Faso", pts: 11, mj: 5 },
    { pays: "Bénin", pts: 7, mj: 5 },
    { pays: "Niger", pts: 3, mj: 5 },
  ],
  effectif: [
    { nom: "Hervé Koffi", poste: "Gardien", club: "Étranger" },
    { nom: "Issa Kaboré", poste: "Défenseur", club: "Étranger" },
    { nom: "Edmond Tapsoba", poste: "Défenseur", club: "Étranger" },
    { nom: "Blati Touré", poste: "Milieu", club: "Étranger" },
    { nom: "Dango Ouattara", poste: "Attaquant", club: "Étranger" },
    { nom: "Bertrand Traoré", poste: "Attaquant", club: "Étranger" },
    { nom: "Issa Sanou", poste: "Attaquant", club: "Salitas FC" },
  ],
};

const JOURS = ["dim", "lun", "mar", "mer", "jeu", "ven", "sam"];
function fmtDate(iso) {
  const d = new Date(iso + "T00:00:00");
  return `${JOURS[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}`;
}

/* ---------- Petits composants ---------- */

function Badge({ club, size = 34 }) {
  const c = clubById(club);
  if (!c) return null;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "7px 7px 3px 3px",
        background: `linear-gradient(155deg, ${c.c1} 60%, ${c.c2} 60%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        boxShadow: "0 2px 0 rgba(0,0,0,.35)",
      }}
    >
      <span
        style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 700,
          fontSize: size * 0.4,
          color: c.c2,
          letterSpacing: 0.5,
          textShadow: "0 1px 1px rgba(0,0,0,.4)",
        }}
      >
        {c.short}
      </span>
    </div>
  );
}

function SectionTitle({ eyebrow, title, right }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", margin: "18px 16px 10px" }}>
      <div>
        {eyebrow && (
          <div style={{ fontSize: 11, letterSpacing: 2, color: "#C6A24D", textTransform: "uppercase", fontWeight: 600, marginBottom: 2 }}>
            {eyebrow}
          </div>
        )}
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 24, fontWeight: 700, color: "#EDE6D6", textTransform: "uppercase", letterSpacing: 0.5 }}>
          {title}
        </div>
      </div>
      {right}
    </div>
  );
}

function Pill({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        border: "1px solid " + (active ? "#C65A2E" : "#33322A"),
        background: active ? "#A9431E" : "transparent",
        color: active ? "#EDE6D6" : "#8A8577",
        borderRadius: 20,
        padding: "6px 14px",
        fontFamily: "'Barlow Condensed', sans-serif",
        fontSize: 15,
        fontWeight: 600,
        letterSpacing: 0.4,
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        cursor: "pointer",
        transition: "all .15s",
      }}
    >
      {children}
    </button>
  );
}

/* ---------- Ticker ---------- */

function LiveDot({ size = 6 }) {
  return (
    <span style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <span className="live-pulse" style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#E14B3C" }} />
      <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#E14B3C" }} />
    </span>
  );
}

function Ticker() {
  const live = MATCHES.filter((m) => m.status === "live");
  const items = live.length
    ? live
    : [MATCHES.find((m) => m.status === "upcoming")];
  return (
    <div style={{ background: "#0D0D09", borderBottom: "1px solid #2A2A20", overflow: "hidden" }}>
      <div style={{ display: "flex", gap: 28, padding: "7px 16px", overflowX: "auto" }}>
        {items.filter(Boolean).map((m) => {
          const h = clubById(m.home), a = clubById(m.away);
          return (
            <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              {m.status === "live" && <LiveDot />}
              <span style={{ fontFamily: "'Barlow Condensed', monospace", fontSize: 15, color: "#C6A24D", fontWeight: 600, letterSpacing: 1 }}>
                {h.short} {m.status !== "upcoming" ? m.hs : ""}
                {" – "}
                {m.status !== "upcoming" ? m.as : ""} {a.short}
              </span>
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, color: "#8A8577" }}>
                {m.status === "live" ? `${m.minute}′` : m.status === "upcoming" ? m.time : "term."}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Onglet Classement ---------- */

function Classement({ favorites, toggleFav }) {
  const [div, setDiv] = useState("d1");
  const data = DIVISIONS[div].standings;
  return (
    <div>
      <div style={{ display: "flex", gap: 8, padding: "14px 16px 0", overflowX: "auto" }}>
        {Object.entries(DIVISIONS).map(([k, v]) => (
          <Pill key={k} active={div === k} onClick={() => setDiv(k)}>
            {v.label}
          </Pill>
        ))}
      </div>
      <SectionTitle eyebrow="Championnat national" title={DIVISIONS[div].label} />
      <div style={{ margin: "0 16px 8px", fontSize: 12, color: "#6E6A5C" }}>
        Classement à titre d'exemple — à remplacer par les données réelles de la saison.
      </div>
      <div style={{ margin: "0 12px 24px", background: "#1D1D16", borderRadius: 12, overflow: "hidden", border: "1px solid #2A2A20" }}>
        <div style={{ display: "grid", gridTemplateColumns: "18px 26px 1fr 26px 26px 26px 26px 30px 34px", gap: 4, padding: "8px 10px", fontSize: 11, color: "#6E6A5C", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid #2A2A20" }}>
          <span></span><span>#</span><span>Club</span><span>MJ</span><span>V</span><span>N</span><span>D</span><span>+/-</span><span style={{ textAlign: "right" }}>Pts</span>
        </div>
        {data.map((row, i) => {
          const c = clubById(row.club);
          const zone = i < 2 ? "#1F6B3D" : i >= data.length - 2 ? "#A9431E" : "transparent";
          const fav = favorites.has(row.club);
          return (
            <div
              key={row.club}
              style={{
                display: "grid",
                gridTemplateColumns: "18px 26px 1fr 26px 26px 26px 26px 30px 34px",
                gap: 4,
                alignItems: "center",
                padding: "9px 10px",
                borderBottom: i === data.length - 1 ? "none" : "1px solid #24241B",
                borderLeft: `3px solid ${zone}`,
              }}
            >
              <button
                onClick={() => toggleFav(row.club)}
                aria-label="Suivre ce club"
                style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontSize: 13, color: fav ? "#E8B33D" : "#3A3A2E", lineHeight: 1 }}
              >
                {fav ? "★" : "☆"}
              </button>
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 15, color: "#8A8577" }}>{i + 1}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                <Badge club={row.club} size={22} />
                <span style={{ fontSize: 13, color: "#EDE6D6", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</span>
              </div>
              <span style={{ fontSize: 13, color: "#B5B0A0", textAlign: "center" }}>{row.mj}</span>
              <span style={{ fontSize: 13, color: "#B5B0A0", textAlign: "center" }}>{row.v}</span>
              <span style={{ fontSize: 13, color: "#B5B0A0", textAlign: "center" }}>{row.n}</span>
              <span style={{ fontSize: 13, color: "#B5B0A0", textAlign: "center" }}>{row.d}</span>
              <span style={{ fontSize: 12, color: "#8A8577", textAlign: "center" }}>{row.bm - row.be > 0 ? "+" : ""}{row.bm - row.be}</span>
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, fontWeight: 700, color: "#E8B33D", textAlign: "right" }}>{row.pts}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* Mini classement réutilisé dans la fiche match (onglet "Classement") */
function MiniStandings({ divKey, highlight }) {
  const data = DIVISIONS[divKey].standings;
  return (
    <div style={{ margin: "0 16px 24px", background: "#1D1D16", borderRadius: 12, overflow: "hidden", border: "1px solid #2A2A20" }}>
      <div style={{ display: "grid", gridTemplateColumns: "26px 1fr 26px 30px 34px", gap: 4, padding: "8px 10px", fontSize: 11, color: "#6E6A5C", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid #2A2A20" }}>
        <span>#</span><span>Club</span><span>MJ</span><span>+/-</span><span style={{ textAlign: "right" }}>Pts</span>
      </div>
      {data.map((row, i) => {
        const c = clubById(row.club);
        const isHi = highlight.includes(row.club);
        return (
          <div
            key={row.club}
            style={{
              display: "grid", gridTemplateColumns: "26px 1fr 26px 30px 34px", gap: 4, alignItems: "center",
              padding: "8px 10px", borderBottom: i === data.length - 1 ? "none" : "1px solid #24241B",
              background: isHi ? "rgba(232,179,61,.08)" : "transparent",
            }}
          >
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, color: "#8A8577" }}>{i + 1}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 7, minWidth: 0 }}>
              <Badge club={row.club} size={18} />
              <span style={{ fontSize: 12, color: isHi ? "#E8B33D" : "#EDE6D6", fontWeight: isHi ? 700 : 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</span>
            </div>
            <span style={{ fontSize: 12, color: "#B5B0A0", textAlign: "center" }}>{row.mj}</span>
            <span style={{ fontSize: 11, color: "#8A8577", textAlign: "center" }}>{row.bm - row.be > 0 ? "+" : ""}{row.bm - row.be}</span>
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, fontWeight: 700, color: "#E8B33D", textAlign: "right" }}>{row.pts}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Onglet Matchs ---------- */

function MatchCard({ m, onOpen, onToggleFav, isFav }) {
  const h = clubById(m.home), a = clubById(m.away);
  return (
    <div
      style={{
        display: "flex", alignItems: "center", width: "100%", gap: 10,
        background: "#1D1D16", border: "1px solid #2A2A20", borderRadius: 12,
        padding: "12px 12px", marginBottom: 6,
      }}
    >
      <button
        onClick={() => onToggleFav(m.id)}
        aria-label="Suivre ce match"
        style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontSize: 14, color: isFav ? "#E8B33D" : "#3A3A2E", flexShrink: 0 }}
      >
        {isFav ? "★" : "☆"}
      </button>
      <button
        onClick={() => onOpen(m)}
        style={{ display: "flex", alignItems: "center", flex: 1, gap: 10, background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left" }}
      >
        <div style={{ width: 40, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2 }}>
          {m.status === "live" ? (
            <>
              <LiveDot />
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, color: "#E14B3C", fontWeight: 700 }}>{m.minute}′</span>
            </>
          ) : (
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, color: "#8A8577", fontWeight: 700, textTransform: "uppercase" }}>
              {m.status === "upcoming" ? m.time : "Terminé"}
            </span>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <Badge club={m.home} size={20} />
            <span style={{ fontSize: 13, color: "#EDE6D6", flex: 1 }}>{h.name}</span>
            {m.status !== "upcoming" && <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, fontWeight: 700, color: m.status === "live" ? "#E14B3C" : "#E8B33D" }}>{m.hs}</span>}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Badge club={m.away} size={20} />
            <span style={{ fontSize: 13, color: "#EDE6D6", flex: 1 }}>{a.name}</span>
            {m.status !== "upcoming" && <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, fontWeight: 700, color: m.status === "live" ? "#E14B3C" : "#E8B33D" }}>{m.as}</span>}
          </div>
        </div>
        <span style={{ fontSize: 20, color: "#4A4A3E" }}>›</span>
    
