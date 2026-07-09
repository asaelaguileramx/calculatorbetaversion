import React, { useState, useMemo } from "react";
import { Car, Wrench, DollarSign, TrendingUp, AlertTriangle, CheckCircle2, Plus, Trash2, Info, ClipboardList, Tag, ExternalLink, Search } from "lucide-react";

const COLORS = {
  bg: "#0B0E13",
  surface: "#12161D",
  surfaceAlt: "#1A1F27",
  border: "#232A35",
  blue: "#1E6FFF",
  blueDim: "#123C99",
  cyan: "#4FE0FF",
  amber: "#FFB020",
  orange: "#E8542E",
  green: "#00B368",
  text: "#F4F7FB",
  muted: "#7C8896",
};

const DIFF_STYLES = {
  facil: { label: "FÁCIL", color: COLORS.green, bg: "rgba(76,175,109,0.12)" },
  medio: { label: "MEDIO", color: COLORS.amber, bg: "rgba(255,176,32,0.12)" },
  dificil: { label: "DIFÍCIL", color: COLORS.orange, bg: "rgba(232,84,46,0.12)" },
};

const BODY_PARTS = [
  { id: "front_bumper", name: "Parachoques delantero", difficulty: "facil", note: "Cubierta atornillada, no suele requerir soldadura." },
  { id: "rear_bumper", name: "Parachoques trasero", difficulty: "facil", note: "Cubierta atornillada, reemplazo directo." },
  { id: "hood", name: "Cofre", difficulty: "facil", note: "Atornillado, requiere pintura para igualar color." },
  { id: "trunk", name: "Cajuela / compuerta trasera", difficulty: "facil", note: "Atornillada, revisa bisagras y cableado de luces." },
  { id: "fender_fl", name: "Fender delantero izq.", difficulty: "facil", note: "Atornillado en la mayoría de autos modernos." },
  { id: "fender_fr", name: "Fender delantero der.", difficulty: "facil", note: "Atornillado en la mayoría de autos modernos." },
  { id: "door_fl", name: "Puerta del. izq.", difficulty: "medio", note: "Revisa vidrio, regulador y arnés interno." },
  { id: "door_fr", name: "Puerta del. der.", difficulty: "medio", note: "Revisa vidrio, regulador y arnés interno." },
  { id: "door_rl", name: "Puerta tras. izq.", difficulty: "medio", note: "Revisa vidrio, regulador y arnés interno." },
  { id: "door_rr", name: "Puerta tras. der.", difficulty: "medio", note: "Revisa vidrio, regulador y arnés interno." },
  { id: "quarter_l", name: "Panel de cuarto izq.", difficulty: "dificil", note: "Normalmente soldado — soldadura y pintura extensa." },
  { id: "quarter_r", name: "Panel de cuarto der.", difficulty: "dificil", note: "Normalmente soldado — soldadura y pintura extensa." },
  { id: "roof", name: "Techo", difficulty: "dificil", note: "Panel estructural soldado, trabajo especializado." },
  { id: "frame", name: "Core support / riel de frame", difficulty: "dificil", note: "Estructural — puede requerir banco de alineación." },
  { id: "pillars", name: "Pilares A/B/C", difficulty: "dificil", note: "Estructurales, críticos para seguridad." },
  { id: "headlights", name: "Faros", difficulty: "facil", note: "Conector plug-and-play en la mayoría de casos." },
  { id: "taillights", name: "Calaveras", difficulty: "facil", note: "Conector plug-and-play en la mayoría de casos." },
  { id: "grille", name: "Parrilla", difficulty: "facil", note: "Atornillada o con clips." },
  { id: "glass", name: "Parabrisas / vidrios", difficulty: "medio", note: "Autos recientes pueden requerir calibración ADAS." },
];

const MECH_PARTS = [
  { id: "engine", name: "Motor", difficulty: "dificil", note: "Confirma si el daño es solo accesorios o interno real." },
  { id: "transmission", name: "Transmisión", difficulty: "dificil", note: "Reconstruida vs. usada cambia mucho el costo." },
  { id: "radiator", name: "Radiador / enfriamiento", difficulty: "medio", note: "Accesible, reemplazo relativamente directo." },
  { id: "suspension", name: "Suspensión (amortig., rótulas, brazos)", difficulty: "medio", note: "Piezas comunes, mano de obra moderada." },
  { id: "brakes", name: "Frenos", difficulty: "facil", note: "Piezas fáciles de conseguir." },
  { id: "wiring", name: "Arnés eléctrico / módulos", difficulty: "dificil", note: "Diagnóstico complejo, más en daño por fuego/agua." },
  { id: "airbags", name: "Airbags / SRS", difficulty: "medio", note: "Requiere reset de módulo SRS." },
  { id: "flood", name: "Daño por inundación (flood)", difficulty: "dificil", note: "Afecta electrónica, tapicería y motor — alto riesgo." },
];

// Tabla oficial de Copart — Buyer Fee, título "Non-Clean Title" (aplica a la mayoría de salvage)
// Copart — Secured Payment Methods, Non-Clean Title (Salvage). Solo aceptamos pagos secured.
const COPART_SALVAGE_SECURED_TIERS = [
  [49.99, 25], [99.99, 45], [199.99, 80], [299.99, 130], [349.99, 137.5], [399.99, 145],
  [449.99, 175], [499.99, 185], [549.99, 205], [599.99, 210], [699.99, 240], [799.99, 270],
  [899.99, 295], [999.99, 320], [1199.99, 375], [1299.99, 395], [1399.99, 410], [1499.99, 430],
  [1599.99, 445], [1699.99, 465], [1799.99, 485], [1999.99, 510], [2399.99, 535], [2499.99, 570],
  [2999.99, 610], [3499.99, 655], [3999.99, 705], [4499.99, 725], [4999.99, 750], [5499.99, 775],
  [5999.99, 800], [6499.99, 825], [6999.99, 845], [7499.99, 880], [7999.99, 900], [8499.99, 925],
  [8999.99, 945], [9999.99, 945], [10499.99, 1000], [10999.99, 1000], [11499.99, 1000], [11999.99, 1000],
  [12499.99, 1000], [14999.99, 1000],
];
// Pendiente: tabla oficial de Copart Clean Title (secured) — pídesela a Asael antes de activar esta opción.
const COPART_CLEAN_SECURED_TIERS = null;
// IAAI — Licensed Buyer, Standard Volume Fee (efectivo 4 nov 2024). Coincide exacto con
// la tabla de Copart Salvage Secured, se deja como tabla independiente por si cambian distinto.
const IAAI_TIERS = [
  [49.99, 25], [99.99, 45], [199.99, 80], [299.99, 130], [349.99, 137.5], [399.99, 145],
  [449.99, 175], [499.99, 185], [549.99, 205], [599.99, 210], [699.99, 240], [799.99, 270],
  [899.99, 295], [999.99, 320], [1199.99, 375], [1299.99, 395], [1399.99, 410], [1499.99, 430],
  [1599.99, 445], [1699.99, 465], [1799.99, 485], [1999.99, 510], [2399.99, 535], [2499.99, 570],
  [2999.99, 610], [3499.99, 655], [3999.99, 705], [4499.99, 725], [4999.99, 750], [5499.99, 775],
  [5999.99, 800], [6499.99, 825], [6999.99, 845], [7499.99, 880], [7999.99, 900], [8499.99, 925],
  [9999.99, 945], [14999.99, 1000],
];

const PARTS_SOURCES = [
  {
    category: "Usadas / recicladas",
    tip: "Compara los 3 antes de decidir — el mismo panel o motor puede variar bastante de precio entre ellos.",
    items: [
      { name: "Car-Part.com", url: "https://www.car-part.com/", desc: "Buscador de yards por año/modelo — compara precios de varios recicladores a la vez, incluye motor y transmisión." },
      { name: "eBay Motors", url: "https://www.ebay.com/", desc: "Bueno para piezas específicas por número de parte o VIN. Revisa rating del vendedor y política de devoluciones." },
      { name: "Facebook Marketplace", url: "https://www.facebook.com/marketplace/", desc: "Busca grupos locales de 'auto parts' o 'car parts for sale' — buenos precios de particulares y talleres pequeños en tu zona." },
    ],
  },
  {
    category: "Nuevas — abre cuenta comercial",
    tip: "Con cuenta comercial (Pro / trade account) el precio y disponibilidad mejoran mucho vs. comprar como cliente normal — vale la pena si vas a hacer varios flips.",
    items: [
      { name: "AutoZone Pro Account", url: "https://www.autozonepro.com/", desc: "Cuenta comercial para talleres — precios de mayoreo, entrega rápida a tienda o directo al taller." },
      { name: "O'Reilly First Call", url: "https://www.oreillyauto.com/first-call-online", desc: "Su plataforma para talleres — catálogo con precios comerciales y entrega programada." },
      { name: "Worldpac (o tu proveedor local)", url: "https://www.worldpac.com/", desc: "Fuerte en marcas europeas/asiáticas OEM. Pide cuenta comercial con tu proveedor local de confianza también." },
    ],
  },
];

function PartsSourceCard({ group }) {
  return (
    <div className="rounded-xl p-4" style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}` }}>
      <h3 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 14.5, textTransform: "uppercase", letterSpacing: "0.02em" }}>{group.category}</h3>
      <p style={{ color: COLORS.muted, fontSize: 11.5 }} className="mt-1 mb-3 flex items-start gap-1.5">
        <Info size={12} className="mt-0.5 shrink-0" />
        {group.tip}
      </p>
      <div className="space-y-2">
        {group.items.map((it) => (
          <a
            key={it.name}
            href={it.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-2 p-2.5 rounded-lg group"
            style={{ background: COLORS.surfaceAlt, border: `1px solid ${COLORS.border}`, textDecoration: "none" }}
          >
            <ExternalLink size={14} className="mt-0.5 shrink-0" style={{ color: COLORS.blue }} />
            <div>
              <span style={{ color: COLORS.text, fontSize: 13, fontWeight: 600 }}>{it.name}</span>
              <p style={{ color: COLORS.muted, fontSize: 11.5 }} className="mt-0.5">{it.desc}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

const ALL_PARTS = [...BODY_PARTS, ...MECH_PARTS];
const ALL_PART_IDS = new Set(ALL_PARTS.map((p) => p.id));

function buyerFeeEstimate(bid, auctionHouse, titleType) {
  const b = Number(bid) || 0;
  if (b <= 0) return 0;
  if (auctionHouse === "iaai") {
    for (const [max, fee] of IAAI_TIERS) {
      if (b <= max) return fee;
    }
    return Math.round(b * 0.075); // 15,000+: 7.50% (igual que Copart salvage secured)
  }
  if (titleType === "clean") {
    if (!COPART_CLEAN_SECURED_TIERS) return null; // datos pendientes de confirmar
    for (const [max, fee] of COPART_CLEAN_SECURED_TIERS) {
      if (b <= max) return fee;
    }
    return null; // tampoco tenemos el % de 15,000+ para clean todavía
  }
  for (const [max, fee] of COPART_SALVAGE_SECURED_TIERS) {
    if (b <= max) return fee;
  }
  return Math.round(b * 0.075); // 15,000+ secured, salvage: 7.50%
}

// Virtual Bid Fee — Pre-Bid vs Live Bid, según tabla oficial de Copart
const VIRTUAL_FEE_TIERS = {
  pre: [[99.99, 0], [499.99, 40], [999.99, 55], [1499.99, 75], [1999.99, 85], [3999.99, 100], [5999.99, 110], [7999.99, 125]],
  live: [[99.99, 0], [499.99, 50], [999.99, 65], [1499.99, 85], [1999.99, 95], [3999.99, 110], [5999.99, 125], [7999.99, 145]],
};

function virtualFeeEstimate(bid, bidType) {
  const b = Number(bid) || 0;
  if (b <= 0) return 0;
  const tiers = VIRTUAL_FEE_TIERS[bidType] || VIRTUAL_FEE_TIERS.live;
  for (const [max, fee] of tiers) {
    if (b <= max) return fee;
  }
  return bidType === "pre" ? 140 : 160;
}

// Comisión de broker: $300 por pujas hasta $5,000, +$100 por cada $5,000 adicionales.
function calcularComisionBroker(bid) {
  const b = Number(bid) || 0;
  if (b <= 0) return 0;
  const tier = Math.ceil(b / 5000);
  return 300 + 100 * (tier - 1);
}

// Depósito requerido: 10% de la puja o $500, lo que sea mayor.
function calcularDepositoRequerido(bid) {
  const b = Number(bid) || 0;
  if (b <= 0) return 0;
  return Math.max(500, b * 0.1);
}

function currency(n) {
  const v = Number(n) || 0;
  return v.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function Field({ label, value, onChange, prefix = "$", width = "w-24" }) {
  return (
    <div className="flex items-center gap-2">
      <span style={{ color: COLORS.muted, fontSize: 12 }}>{label}</span>
      <div className="flex items-center rounded" style={{ background: COLORS.bg, border: `1px solid ${COLORS.border}` }}>
        {prefix && <span className="pl-2" style={{ color: COLORS.muted, fontSize: 13 }}>{prefix}</span>}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${width} bg-transparent outline-none px-1.5 py-1.5 text-right`}
          style={{ color: COLORS.text, fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}
        />
      </div>
    </div>
  );
}

function DiffBadge({ difficulty }) {
  const d = DIFF_STYLES[difficulty];
  return (
    <span
      className="px-2 py-0.5 rounded font-bold tracking-wider shrink-0"
      style={{ color: d.color, background: d.bg, letterSpacing: "0.05em", fontSize: 10 }}
    >
      {d.label}
    </span>
  );
}

function PartRow({ part, state, onToggle, onCost }) {
  const s = state[part.id] || { included: false, parts: 0, labor: 0 };
  const subtotal = (Number(s.parts) || 0) + (Number(s.labor) || 0);
  return (
    <div
      className="flex flex-wrap items-center gap-3 px-3 py-2.5 rounded-lg"
      style={{ background: s.included ? COLORS.surfaceAlt : "transparent", border: `1px solid ${s.included ? COLORS.border : "transparent"}` }}
    >
      <input
        type="checkbox"
        checked={s.included}
        onChange={() => onToggle(part.id)}
        className="w-4 h-4 shrink-0 cursor-pointer accent-current"
        style={{ accentColor: COLORS.blue }}
      />
      <div className="flex-1" style={{ minWidth: 190 }}>
        <div className="flex items-center gap-2 flex-wrap">
          <span style={{ color: COLORS.text, fontSize: 13.5, fontWeight: 500 }}>{part.name}</span>
          <DiffBadge difficulty={part.difficulty} />
        </div>
        <p style={{ color: COLORS.muted, fontSize: 11.5 }} className="mt-0.5">{part.note}</p>
      </div>
      <Field label="Parte" value={s.parts} onChange={(v) => onCost(part.id, "parts", v)} />
      <Field label="Labor" value={s.labor} onChange={(v) => onCost(part.id, "labor", v)} />
      <div className="text-right" style={{ minWidth: 80 }}>
        <span style={{ color: s.included ? COLORS.blue : COLORS.muted, fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700 }}>
          {currency(subtotal)}
        </span>
      </div>
    </div>
  );
}

export default function CopartFlipCalculator() {
  const [tab, setTab] = useState(0);

  // --- Compra ---
  const [auctionHouse, setAuctionHouse] = useState("copart"); // 'copart' o 'iaai'
  const [copartTitleType, setCopartTitleType] = useState("salvage"); // 'salvage' o 'clean'
  const [bid, setBid] = useState("2500");
  const [bidType, setBidType] = useState("live"); // 'pre' o 'live'
  const [buyerFeeOverride, setBuyerFeeOverride] = useState("");
  const [virtualFeeOverride, setVirtualFeeOverride] = useState("");
  const [gateFee, setGateFee] = useState("95");
  const [envFee, setEnvFee] = useState("15");
  const [titleShipping, setTitleShipping] = useState("15");
  const [storage, setStorage] = useState("0");
  const [transport, setTransport] = useState("300");
  const [titleTax, setTitleTax] = useState("0");

  const [brokerFeeOverride, setBrokerFeeOverride] = useState("");
  const [depositoOverride, setDepositoOverride] = useState("");

  const buyerFeeAuto = buyerFeeEstimate(bid, auctionHouse, copartTitleType);
  const buyerFee = buyerFeeOverride !== "" ? Number(buyerFeeOverride) || 0 : (buyerFeeAuto ?? 0);
  const virtualFeeAuto = virtualFeeEstimate(bid, bidType);
  const virtualFee = virtualFeeOverride !== "" ? Number(virtualFeeOverride) || 0 : (virtualFeeAuto ?? 0);
  const brokerFeeAuto = calcularComisionBroker(bid);
  const brokerFee = brokerFeeOverride !== "" ? Number(brokerFeeOverride) || 0 : brokerFeeAuto;
  const depositoAuto = calcularDepositoRequerido(bid);
  const deposito = depositoOverride !== "" ? Number(depositoOverride) || 0 : depositoAuto;
  const totalCompra =
    (Number(bid) || 0) + buyerFee + virtualFee + (Number(gateFee) || 0) + (Number(envFee) || 0) +
    (Number(titleShipping) || 0) + (Number(storage) || 0) + (Number(transport) || 0) + (Number(titleTax) || 0) +
    brokerFee;

  const handleAuctionChange = (house) => {
    setAuctionHouse(house);
    setGateFee(house === "iaai" ? "105" : "95");
  };

  // --- Daños ---
  const [damage, setDamage] = useState({});
  const toggle = (id) =>
    setDamage((d) => ({ ...d, [id]: { ...(d[id] || { parts: 0, labor: 0 }), included: !(d[id]?.included) } }));
  const setCost = (id, field, val) =>
    setDamage((d) => ({ ...d, [id]: { ...(d[id] || { included: true, parts: 0, labor: 0 }), included: true, [field]: val } }));

  const damageTotal = useMemo(() => {
    return Object.values(damage).reduce((acc, s) => (s.included ? acc + (Number(s.parts) || 0) + (Number(s.labor) || 0) : acc), 0);
  }, [damage]);

  const bodyIncluded = BODY_PARTS.filter((p) => damage[p.id]?.included);
  const mechIncluded = MECH_PARTS.filter((p) => damage[p.id]?.included);
  const hardestLevel = [...bodyIncluded, ...mechIncluded].reduce((worst, p) => {
    const order = { facil: 1, medio: 2, dificil: 3 };
    return order[p.difficulty] > order[worst] ? p.difficulty : worst;
  }, "facil");

  // --- Venta (comps Marketplace) ---
  const [targetMileage, setTargetMileage] = useState("60000");
  const [targetTitleType, setTargetTitleType] = useState("salvage"); // 'clean' o 'salvage'
  const [comps, setComps] = useState([
    { id: 1, price: "9500", mileage: "55000", titleType: "salvage" },
    { id: 2, price: "10200", mileage: "48000", titleType: "salvage" },
  ]);
  const addComp = () => setComps((c) => [...c, { id: Date.now(), price: "", mileage: "", titleType: targetTitleType }]);
  const removeComp = (id) => setComps((c) => c.filter((x) => x.id !== id));
  const updateComp = (id, field, val) => setComps((c) => c.map((x) => (x.id === id ? { ...x, [field]: val } : x)));

  const compStats = useMemo(() => {
    const all = comps
      .map((c) => ({ price: Number(c.price), mileage: Number(c.mileage), titleType: c.titleType || "salvage" }))
      .filter((c) => c.price > 0);
    if (all.length === 0) return null;

    const matching = all.filter((c) => c.titleType === targetTitleType);
    const mixedTitles = new Set(all.map((c) => c.titleType)).size > 1;
    // Si hay suficientes comps del mismo tipo de título, úsalos solamente; si no, usa todos con advertencia.
    const valid = matching.length >= 2 ? matching : all;
    const usedFallback = matching.length < 2 && all.length > 0;

    const prices = valid.map((v) => v.price).sort((a, b) => a - b);
    const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
    const median = prices.length % 2 === 0 ? (prices[prices.length / 2 - 1] + prices[prices.length / 2]) / 2 : prices[(prices.length - 1) / 2];
    const min = prices[0];
    const max = prices[prices.length - 1];

    let regressionEstimate = null;
    const withMiles = valid.filter((v) => v.mileage > 0);
    if (withMiles.length >= 3) {
      const n = withMiles.length;
      const sumX = withMiles.reduce((a, v) => a + v.mileage, 0);
      const sumY = withMiles.reduce((a, v) => a + v.price, 0);
      const sumXY = withMiles.reduce((a, v) => a + v.mileage * v.price, 0);
      const sumX2 = withMiles.reduce((a, v) => a + v.mileage * v.mileage, 0);
      const denom = n * sumX2 - sumX * sumX;
      if (denom !== 0) {
        const slope = (n * sumXY - sumX * sumY) / denom;
        const intercept = (sumY - slope * sumX) / n;
        regressionEstimate = intercept + slope * (Number(targetMileage) || 0);
      }
    }
    return { avg, median, min, max, regressionEstimate, count: valid.length, mixedTitles, usedFallback, matchingCount: matching.length };
  }, [comps, targetMileage, targetTitleType]);

  const estimatedSalePrice = compStats ? Math.round(compStats.regressionEstimate ?? compStats.avg) : 0;

  // --- Resumen ---
  const inversionTotal = totalCompra + damageTotal;
  const gananciaBruta = estimatedSalePrice - inversionTotal;
  const margen = estimatedSalePrice > 0 ? (gananciaBruta / estimatedSalePrice) * 100 : 0;

  const semaforo = margen >= 20 ? { color: COLORS.green, label: "BUEN NEGOCIO" } : margen >= 8 ? { color: COLORS.amber, label: "MARGEN AJUSTADO" } : { color: COLORS.orange, label: "RIESGO ALTO" };

  const tabs = [
    { label: "Compra", icon: Tag },
    { label: "Daños", icon: Wrench },
    { label: "Partes", icon: Search },
    { label: "Venta", icon: TrendingUp },
    { label: "Resumen", icon: ClipboardList },
  ];

  return (
    <div style={{ background: COLORS.bg, minHeight: "100%", color: COLORS.text }} className="w-full">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap');
        input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
      `}</style>

      {/* Header - RADAR — Auction Broker */}
      <div className="px-4 pt-6 pb-4 sm:px-8" style={{ borderBottom: `2px solid ${COLORS.border}` }}>
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: COLORS.surfaceAlt, border: `1px solid ${COLORS.blueDim}` }}
          >
            <svg width="26" height="26" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="30" fill="none" stroke={COLORS.blue} strokeWidth="4" opacity="0.45" />
              <circle cx="50" cy="50" r="20" fill="none" stroke={COLORS.blue} strokeWidth="4" opacity="0.7" />
              <circle cx="50" cy="50" r="9" fill="none" stroke={COLORS.blue} strokeWidth="4" />
              <line x1="50" y1="50" x2="50" y2="20" stroke={COLORS.cyan} strokeWidth="5" />
              <circle cx="50" cy="50" r="4" fill={COLORS.cyan} />
            </svg>
          </div>
          <div>
            <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 22, letterSpacing: "0.08em", fontWeight: 700, textTransform: "uppercase" }}>
              RADAR
            </h1>
            <p style={{ color: COLORS.muted, fontSize: 11.5, letterSpacing: "0.08em", textTransform: "uppercase" }}>Auction Broker — Compra → Daños → Venta → Margen</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-3 sm:px-8 pt-3 overflow-x-auto" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
        {tabs.map((t, i) => {
          const Icon = t.icon;
          const active = tab === i;
          return (
            <button
              key={t.label}
              onClick={() => setTab(i)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-t-lg shrink-0"
              style={{
                background: active ? COLORS.surface : "transparent",
                borderTop: active ? `2px solid ${COLORS.blue}` : "2px solid transparent",
                color: active ? COLORS.text : COLORS.muted,
              }}
            >
              <span
                className="w-4 h-4 rounded-full flex items-center justify-center font-bold"
                style={{ background: active ? COLORS.blue : COLORS.border, color: active ? COLORS.bg : COLORS.muted, fontSize: 9 }}
              >
                {i + 1}
              </span>
              <Icon size={14} />
              <span style={{ fontSize: 13, fontWeight: 600 }}>{t.label}</span>
            </button>
          );
        })}
      </div>

      <div className="p-4 sm:p-8 max-w-3xl mx-auto">
        {/* TAB 0: COMPRA */}
        {tab === 0 && (
          <div className="space-y-4">
            <div className="rounded-xl p-4" style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}` }}>
              <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 15, textTransform: "uppercase", letterSpacing: "0.03em" }}>
                Puja y fees
              </h2>

              <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
                <span style={{ fontSize: 13.5 }}>Casa de subasta</span>
                <div className="flex rounded-lg overflow-hidden" style={{ border: `1px solid ${COLORS.border}` }}>
                  {[{ k: "copart", l: "Copart" }, { k: "iaai", l: "IAAI" }].map((o) => (
                    <button
                      key={o.k}
                      onClick={() => handleAuctionChange(o.k)}
                      className="px-3 py-1.5 text-xs font-semibold"
                      style={{ background: auctionHouse === o.k ? COLORS.blue : "transparent", color: auctionHouse === o.k ? COLORS.bg : COLORS.muted }}
                    >
                      {o.l}
                    </button>
                  ))}
                </div>
              </div>

              {auctionHouse === "copart" && (
                <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
                  <span style={{ fontSize: 13.5 }}>Tipo de título</span>
                  <div className="flex rounded-lg overflow-hidden" style={{ border: `1px solid ${COLORS.border}` }}>
                    {[{ k: "salvage", l: "Salvage" }, { k: "clean", l: "Clean Title" }].map((o) => (
                      <button
                        key={o.k}
                        onClick={() => setCopartTitleType(o.k)}
                        className="px-3 py-1.5 text-xs font-semibold"
                        style={{ background: copartTitleType === o.k ? COLORS.blue : "transparent", color: copartTitleType === o.k ? COLORS.bg : COLORS.muted }}
                      >
                        {o.l}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {auctionHouse === "copart" ? (
                <p style={{ color: COLORS.muted, fontSize: 12 }} className="mt-3 flex items-start gap-1.5">
                  <Info size={13} className="mt-0.5 shrink-0" />
                  Tabla oficial de <strong>pagos secured únicamente</strong> (transferencia, cashier's check, débito, ePay — no aceptamos unsecured). Vehículos <strong>heavy duty</strong> (camiones pesados, RVs, equipo agrícola/industrial, buses) tienen tarifas más altas que estas — verifica en tu cuenta si el lote es heavy duty.
                  {copartTitleType === "clean" && (
                    <> <strong>Nota:</strong> todavía no tenemos la tabla oficial de Clean Title cargada — el fee no se calcula solo, ingrésalo manualmente abajo.</>
                  )}
                </p>
              ) : (
                <p style={{ color: COLORS.muted, fontSize: 12 }} className="mt-3 flex items-start gap-1.5">
                  <Info size={13} className="mt-0.5 shrink-0" />
                  Tabla de <strong>IAAI Licensed — Standard Volume</strong>. Excluye Rec Rides y Heavy Vehicles (tarifas distintas). Service Fee: <strong>$105</strong> (ya ajustado abajo).
                </p>
              )}

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span style={{ fontSize: 13.5 }}>Puja ganadora (hammer price)</span>
                  <Field label="" prefix="$" width="w-28" value={bid} onChange={setBid} />
                </div>

                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span style={{ fontSize: 13.5 }}>Tipo de puja</span>
                  <div className="flex rounded-lg overflow-hidden" style={{ border: `1px solid ${COLORS.border}` }}>
                    {[{ k: "pre", l: "Pre-Bid" }, { k: "live", l: "Live Bid" }].map((o) => (
                      <button
                        key={o.k}
                        onClick={() => setBidType(o.k)}
                        className="px-3 py-1.5 text-xs font-semibold"
                        style={{ background: bidType === o.k ? COLORS.blue : "transparent", color: bidType === o.k ? COLORS.bg : COLORS.muted }}
                      >
                        {o.l}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span style={{ fontSize: 13.5 }}>
                    Buyer's fee{" "}
                    <span style={{ color: buyerFeeAuto == null ? COLORS.orange : COLORS.muted, fontSize: 11 }}>
                      {buyerFeeAuto == null ? "(sin tabla — ingresa manual)" : `(tabla oficial: ${currency(buyerFeeAuto)})`}
                    </span>
                  </span>
                  <Field label="" prefix="$" width="w-28" value={buyerFeeOverride !== "" ? buyerFeeOverride : (buyerFeeAuto ?? "")} onChange={setBuyerFeeOverride} />
                </div>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span style={{ fontSize: 13.5 }}>
                    Virtual bid fee{" "}
                    <span style={{ color: virtualFeeAuto == null ? COLORS.orange : COLORS.muted, fontSize: 11 }}>
                      {virtualFeeAuto == null ? "(sin tabla — ingresa manual)" : `(tabla oficial: ${currency(virtualFeeAuto)})`}
                    </span>
                  </span>
                  <Field label="" prefix="$" width="w-28" value={virtualFeeOverride !== "" ? virtualFeeOverride : (virtualFeeAuto ?? "")} onChange={setVirtualFeeOverride} />
                </div>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span style={{ fontSize: 13.5 }}>{auctionHouse === "iaai" ? "Service fee" : "Gate fee"}</span>
                  <Field label="" prefix="$" width="w-28" value={gateFee} onChange={setGateFee} />
                </div>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span style={{ fontSize: 13.5 }}>Environmental fee</span>
                  <Field label="" prefix="$" width="w-28" value={envFee} onChange={setEnvFee} />
                </div>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span style={{ fontSize: 13.5 }}>Envío de título (USPS $15 / FedEx $20)</span>
                  <Field label="" prefix="$" width="w-28" value={titleShipping} onChange={setTitleShipping} />
                </div>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span style={{ fontSize: 13.5 }}>
                    Storage <span style={{ color: COLORS.muted, fontSize: 11 }}>(varía por ubicación — 0 si recoges a tiempo)</span>
                  </span>
                  <Field label="" prefix="$" width="w-28" value={storage} onChange={setStorage} />
                </div>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span style={{ fontSize: 13.5 }}>Transporte estimado</span>
                  <Field label="" prefix="$" width="w-28" value={transport} onChange={setTransport} />
                </div>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span style={{ fontSize: 13.5 }}>Impuestos de venta (state tax, si aplica)</span>
                  <Field label="" prefix="$" width="w-28" value={titleTax} onChange={setTitleTax} />
                </div>
              </div>
            </div>

            <p style={{ color: COLORS.muted, fontSize: 11 }} className="flex items-start gap-1.5">
              <Info size={13} className="mt-0.5 shrink-0" />
              Buyer's fee y Virtual/Internet bid fee se calculan solos para Copart Salvage e IAAI Licensed (pagos secured). Para Copart Clean Title, ingresa el monto manualmente hasta que se confirme esa tabla.
            </p>

            <div className="rounded-xl p-4" style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}` }}>
              <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 15, textTransform: "uppercase", letterSpacing: "0.03em" }}>
                Costo de nuestro servicio
              </h2>
              <div className="mt-3 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span style={{ fontSize: 13.5 }}>
                    Comisión de broker <span style={{ color: COLORS.muted, fontSize: 11 }}>($300 hasta $5,000, +$100 c/$5,000 extra)</span>
                  </span>
                  <Field label="" prefix="$" width="w-28" value={brokerFeeOverride !== "" ? brokerFeeOverride : brokerFeeAuto} onChange={setBrokerFeeOverride} />
                </div>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span style={{ fontSize: 13.5 }}>
                    Depósito requerido <span style={{ color: COLORS.muted, fontSize: 11 }}>(10% o $500, lo mayor — reembolsable)</span>
                  </span>
                  <Field label="" prefix="$" width="w-28" value={depositoOverride !== "" ? depositoOverride : depositoAuto} onChange={setDepositoOverride} />
                </div>
              </div>
              <p style={{ color: COLORS.muted, fontSize: 11 }} className="mt-2">
                El depósito es reembolsable y no se suma al costo total de abajo — la comisión de broker sí, porque es el costo real de nuestro servicio.
              </p>
            </div>

            <div className="rounded-xl p-4 flex items-center justify-between" style={{ background: COLORS.surfaceAlt, border: `1px solid ${COLORS.blueDim}` }}>
              <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 14, textTransform: "uppercase" }}>Costo total de adquisición</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 700, color: COLORS.blue }}>{currency(totalCompra)}</span>
            </div>

            <div className="rounded-xl p-3.5 flex items-start gap-2" style={{ background: "rgba(232,84,46,0.1)", border: `1px solid ${COLORS.orange}` }}>
              <AlertTriangle size={16} className="mt-0.5 shrink-0" color={COLORS.orange} />
              <p style={{ color: COLORS.text, fontSize: 12 }}>
                Estos números son una <strong>estimación</strong>, no una cotización final. Pueden variar según las condiciones específicas del lote, el estatus de tu cuenta pujadora (pública, licenciada, volumen), y es posible que este cálculo esté ignorando algún cargo aplicable a tu caso particular. Además, <strong>no incluye impuestos locales, transporte ni costo de reparación</strong> — revisa esas partidas por separado antes de decidir tu puja máxima.
              </p>
            </div>
          </div>
        )}

        {/* TAB 1: DAÑOS */}
        {tab === 1 && (
          <div className="space-y-5">
            <p style={{ color: COLORS.muted, fontSize: 12.5 }} className="flex items-start gap-1.5">
              <Info size={13} className="mt-0.5 shrink-0" />
              Marca los componentes dañados y anota tu cotización real de partes y mano de obra. La dificultad es una guía general — siempre inspecciona el auto en persona o con fotos detalladas.
            </p>

            <div>
              <h3 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 14, textTransform: "uppercase", letterSpacing: "0.03em", color: COLORS.muted }} className="mb-2">
                Carrocería / Body shop
              </h3>
              <div className="space-y-1.5">
                {BODY_PARTS.map((p) => (
                  <PartRow key={p.id} part={p} state={damage} onToggle={toggle} onCost={setCost} />
                ))}
              </div>
            </div>

            <div>
              <h3 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 14, textTransform: "uppercase", letterSpacing: "0.03em", color: COLORS.muted }} className="mb-2">
                Motor / Mecánico
              </h3>
              <div className="space-y-1.5">
                {MECH_PARTS.map((p) => (
                  <PartRow key={p.id} part={p} state={damage} onToggle={toggle} onCost={setCost} />
                ))}
              </div>
            </div>

            <div className="rounded-xl p-4 flex items-center justify-between flex-wrap gap-2" style={{ background: COLORS.surfaceAlt, border: `1px solid ${COLORS.blueDim}` }}>
              <div>
                <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 14, textTransform: "uppercase" }}>Costo total de reparación</span>
                <div className="mt-1"><DiffBadge difficulty={hardestLevel} /> <span style={{ color: COLORS.muted, fontSize: 11.5 }}>nivel más alto de dificultad detectado</span></div>
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 700, color: COLORS.blue }}>{currency(damageTotal)}</span>
            </div>
          </div>
        )}

        {/* TAB 2: PARTES */}
        {tab === 2 && (
          <div className="space-y-4">
            <p style={{ color: COLORS.muted, fontSize: 12.5 }} className="flex items-start gap-1.5">
              <Info size={13} className="mt-0.5 shrink-0" />
              Estas fuentes te ayudan a cotizar precios reales de partes antes de meterlos en la pestaña de Daños. Ningún sitio tiene siempre el mejor precio — compara.
            </p>
            {PARTS_SOURCES.map((group) => (
              <PartsSourceCard key={group.category} group={group} />
            ))}
          </div>
        )}

        {/* TAB 3: VENTA / COMPS */}
        {tab === 3 && (
          <div className="space-y-4">
            <div className="rounded-xl p-3.5 flex items-start gap-2" style={{ background: "rgba(232,84,46,0.1)", border: `1px solid ${COLORS.orange}` }}>
              <AlertTriangle size={16} className="mt-0.5 shrink-0" color={COLORS.orange} />
              <p style={{ color: COLORS.text, fontSize: 12.5 }}>
                El tipo de título <strong>cambia mucho el precio de venta real</strong>. Un salvage/rebuilt casi siempre se vende por menos que uno de título limpio, aunque el auto se vea idéntico. No compares a ciegas — asegúrate de que tus comparables tengan el mismo tipo de título que tu auto, para no llevarte una sorpresa al momento de vender.
              </p>
            </div>

            <div className="rounded-xl p-4" style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}` }}>
              <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 15, textTransform: "uppercase", letterSpacing: "0.03em" }}>
                Comparables (Car-Part.com, eBay, Facebook Marketplace)
              </h2>
              <p style={{ color: COLORS.muted, fontSize: 12 }} className="mt-1">
                Agrega 3 o más autos similares (mismo año/modelo aprox.) que veas publicados, con precio, millaje y tipo de título.
              </p>

              <div className="flex items-center justify-between mt-3 mb-2 flex-wrap gap-2">
                <span style={{ fontSize: 13 }}>Millaje de tu auto</span>
                <Field label="" prefix="" width="w-28" value={targetMileage} onChange={setTargetMileage} />
              </div>
              <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                <span style={{ fontSize: 13 }}>Título de tu auto</span>
                <div className="flex rounded-lg overflow-hidden" style={{ border: `1px solid ${COLORS.border}` }}>
                  {[{ k: "clean", l: "Limpio" }, { k: "salvage", l: "Salvage / Rebuilt" }].map((o) => (
                    <button
                      key={o.k}
                      onClick={() => setTargetTitleType(o.k)}
                      className="px-3 py-1.5 text-xs font-semibold"
                      style={{ background: targetTitleType === o.k ? COLORS.blue : "transparent", color: targetTitleType === o.k ? COLORS.bg : COLORS.muted }}
                    >
                      {o.l}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 mt-3">
                {comps.map((c) => (
                  <div key={c.id} className="flex items-center gap-2 p-2 rounded-lg flex-wrap" style={{ background: COLORS.surfaceAlt }}>
                    <Field label="Precio" prefix="$" width="w-24" value={c.price} onChange={(v) => updateComp(c.id, "price", v)} />
                    <Field label="Millas" prefix="" width="w-24" value={c.mileage} onChange={(v) => updateComp(c.id, "mileage", v)} />
                    <div className="flex rounded-md overflow-hidden" style={{ border: `1px solid ${COLORS.border}` }}>
                      {[{ k: "clean", l: "Limpio" }, { k: "salvage", l: "Salvage" }].map((o) => (
                        <button
                          key={o.k}
                          onClick={() => updateComp(c.id, "titleType", o.k)}
                          className="px-2 py-1"
                          style={{ background: (c.titleType || "salvage") === o.k ? COLORS.blue : "transparent", color: (c.titleType || "salvage") === o.k ? COLORS.bg : COLORS.muted, fontSize: 10.5, fontWeight: 700 }}
                        >
                          {o.l}
                        </button>
                      ))}
                    </div>
                    <button onClick={() => removeComp(c.id)} className="ml-auto p-1.5 rounded" style={{ color: COLORS.orange }}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={addComp}
                className="mt-3 flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm"
                style={{ background: COLORS.bg, border: `1px solid ${COLORS.border}`, color: COLORS.text }}
              >
                <Plus size={14} /> Agregar comparable
              </button>
            </div>

            {compStats && (
              <div className="rounded-xl p-4 space-y-2" style={{ background: COLORS.surfaceAlt, border: `1px solid ${COLORS.blueDim}` }}>
                {compStats.usedFallback && compStats.mixedTitles && (
                  <div className="flex items-start gap-1.5 p-2 rounded-lg mb-1" style={{ background: "rgba(232,84,46,0.12)" }}>
                    <AlertTriangle size={13} className="mt-0.5 shrink-0" color={COLORS.orange} />
                    <p style={{ color: COLORS.orange, fontSize: 11 }}>
                      No tienes suficientes comparables de título "{targetTitleType === "clean" ? "limpio" : "salvage/rebuilt"}", así que este estimado mezcla ambos tipos — probablemente sea menos preciso. Agrega más comparables del mismo tipo de título que tu auto.
                    </p>
                  </div>
                )}
                <div className="flex justify-between text-sm"><span style={{ color: COLORS.muted }}>Promedio</span><span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{currency(compStats.avg)}</span></div>
                <div className="flex justify-between text-sm"><span style={{ color: COLORS.muted }}>Mediana</span><span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{currency(compStats.median)}</span></div>
                <div className="flex justify-between text-sm"><span style={{ color: COLORS.muted }}>Rango</span><span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{currency(compStats.min)} – {currency(compStats.max)}</span></div>
                {compStats.regressionEstimate != null && (
                  <div className="flex justify-between text-sm"><span style={{ color: COLORS.muted }}>Ajustado a {Number(targetMileage).toLocaleString()} mi</span><span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{currency(compStats.regressionEstimate)}</span></div>
                )}
                <div className="pt-2 mt-1 flex items-center justify-between" style={{ borderTop: `1px dashed ${COLORS.border}` }}>
                  <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 14, textTransform: "uppercase" }}>Precio de venta estimado</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 700, color: COLORS.blue }}>{currency(estimatedSalePrice)}</span>
                </div>
                <p style={{ color: COLORS.muted, fontSize: 11 }}>
                  Basado en {compStats.count} comparable(s) de título {targetTitleType === "clean" ? "limpio" : "salvage/rebuilt"}. Con 3+ datos y millaje variado, se ajusta automáticamente al millaje de tu auto.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: RESUMEN */}
        {tab === 4 && (
          <div className="space-y-4">
            <div className="rounded-xl p-4 space-y-3" style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}` }}>
              <div className="flex justify-between items-center">
                <span style={{ fontSize: 13.5, color: COLORS.muted }}>Costo de adquisición (Copart)</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14 }}>{currency(totalCompra)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span style={{ fontSize: 13.5, color: COLORS.muted }}>Costo de reparación</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14 }}>{currency(damageTotal)}</span>
              </div>
              <div className="flex justify-between items-center pt-2" style={{ borderTop: `1px dashed ${COLORS.border}` }}>
                <span style={{ fontSize: 13.5, fontWeight: 600 }}>Inversión total</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 16, fontWeight: 700 }}>{currency(inversionTotal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span style={{ fontSize: 13.5, color: COLORS.muted }}>Precio de venta estimado</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14 }}>{currency(estimatedSalePrice)}</span>
              </div>
            </div>

            <div className="rounded-xl p-5" style={{ background: COLORS.surfaceAlt, border: `2px solid ${semaforo.color}` }}>
              <div className="flex items-center gap-2 mb-2">
                {margen >= 20 ? <CheckCircle2 size={18} color={semaforo.color} /> : <AlertTriangle size={18} color={semaforo.color} />}
                <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 14, textTransform: "uppercase", letterSpacing: "0.03em", color: semaforo.color }}>{semaforo.label}</span>
              </div>
              <div className="flex items-end justify-between flex-wrap gap-2">
                <div>
                  <p style={{ color: COLORS.muted, fontSize: 12 }}>Ganancia bruta estimada</p>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 28, fontWeight: 700, color: gananciaBruta >= 0 ? COLORS.green : COLORS.orange }}>
                    {currency(gananciaBruta)}
                  </p>
                </div>
                <div className="text-right">
                  <p style={{ color: COLORS.muted, fontSize: 12 }}>Margen</p>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 700 }}>{margen.toFixed(1)}%</p>
                </div>
              </div>
            </div>

            <p style={{ color: COLORS.muted, fontSize: 11.5 }} className="flex items-start gap-1.5">
              <Info size={13} className="mt-0.5 shrink-0" />
              Este resumen es una guía de estimación, no asesoría financiera. Verifica siempre fees reales de Copart, cotizaciones de partes/mano de obra y el estado real del título antes de pujar.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
