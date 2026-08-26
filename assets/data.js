/* Smart Money — demo dataset
   All companies, figures, and matches are fictional, for product demonstration only. */

window.SM = (function () {
  const companies = [
    {
      id: "aldeera",
      name: "Al-Deera Construction Co.",
      short: "AD",
      color: "#e8b64c",
      industry: "Construction",
      location: "Kuwait City, Kuwait",
      founded: 2009,
      employees: 142,
      stage: "Established",
      ownership: "Family-owned (2 shareholders)",
      certifications: ["ISO 9001", "Kuwait Municipality Grade A"],
      markets: ["Kuwait"],
      about: "Mid-size general contractor focused on commercial fit-outs and light industrial builds. Strong repeat business with two anchor clients.",
      financials: {
        revenue: 800000, ebitda: 176000, margin: 22, cashFlow: 121000,
        debt: 240000, growth: 11, receivableDays: 88, verified: ["revenue", "ebitda"],
        trend: [520, 580, 610, 660, 720, 800]
      },
      valuation: { low: 2100000, high: 3400000, point: 2650000, confidence: "Medium", method: "EBITDA multiple (blended 4.2x–6.1x, GCC construction comps) cross-checked with DCF" },
      scores: { growth: 68, risk: 46, investment: 74, acquisition: 61, opportunity: 82 },
      signals: ["Open to investors", "Seeking subcontract partners"],
      idleAssets: ["Scaffolding fleet idle ~40% of the year", "Yard space in Shuwaikh unused on weekends"],
      relationships: { suppliers: ["qortuba", "khaleej"], customers: ["dana"], competitors: ["desertrose"] }
    },
    {
      id: "gulfbridge",
      name: "Gulf Bridge Logistics",
      short: "GB",
      color: "#5aa2ff",
      industry: "Logistics",
      location: "Shuaiba, Kuwait",
      founded: 2014,
      employees: 96,
      stage: "Growth",
      ownership: "Two founders + angel investor (12%)",
      certifications: ["ISO 28000"],
      markets: ["Kuwait", "Saudi Arabia"],
      about: "Cross-border trucking and last-mile delivery. Fleet of 54 trucks; utilization has dipped since losing a retail contract.",
      financials: {
        revenue: 1900000, ebitda: 285000, margin: 15, cashFlow: 198000,
        debt: 610000, growth: 6, receivableDays: 64, verified: ["revenue"],
        trend: [1450, 1600, 1820, 1760, 1850, 1900]
      },
      valuation: { low: 1400000, high: 2300000, point: 1800000, confidence: "Medium", method: "EBITDA multiple (5.0x–8.0x logistics comps), fleet asset floor applied" },
      scores: { growth: 55, risk: 52, investment: 63, acquisition: 70, opportunity: 77 },
      signals: ["Open to partnerships", "Selling minority stake (15%)"],
      idleAssets: ["11 trucks idle on weekdays (~20% of fleet)", "Return legs from KSA run 60% empty"],
      relationships: { suppliers: ["khaleej"], customers: ["sidra", "noor"], competitors: [] }
    },
    {
      id: "sidra",
      name: "Sidra Foods",
      short: "SF",
      color: "#2fd48a",
      industry: "Food Manufacturing",
      location: "Sabhan, Kuwait",
      founded: 2011,
      employees: 210,
      stage: "Established",
      ownership: "Family holding (Al-Sidra Group)",
      certifications: ["HACCP", "ISO 22000", "Halal certified"],
      markets: ["Kuwait", "Qatar", "Bahrain"],
      about: "Frozen and ambient food producer supplying co-ops and HORECA. Distribution costs rising; seeking a dedicated logistics partner.",
      financials: {
        revenue: 4200000, ebitda: 714000, margin: 17, cashFlow: 540000,
        debt: 980000, growth: 14, receivableDays: 51, verified: ["revenue", "ebitda", "debt"],
        trend: [2900, 3100, 3400, 3700, 3900, 4200]
      },
      valuation: { low: 4600000, high: 7100000, point: 5800000, confidence: "High", method: "EBITDA multiple (6.4x–9.9x F&B comps) with verified financials uplift" },
      scores: { growth: 76, risk: 34, investment: 84, acquisition: 58, opportunity: 88 },
      signals: ["Looking for distributors", "Open to joint ventures"],
      idleAssets: ["Second production line runs one shift only", "Cold store at 55% occupancy in summer"],
      relationships: { suppliers: ["alsahel", "qortuba"], customers: ["marina"], competitors: [] }
    },
    {
      id: "marina",
      name: "Marina Retail Group",
      short: "MR",
      color: "#a48aff",
      industry: "Retail & Distribution",
      location: "Riyadh, Saudi Arabia",
      founded: 2006,
      employees: 380,
      stage: "Established",
      ownership: "Private (3 partners)",
      certifications: ["SFDA licensed"],
      markets: ["Saudi Arabia", "Kuwait", "UAE"],
      about: "FMCG distributor with 2,400 points of sale across KSA. Actively signing regional brands that want Saudi shelf presence.",
      financials: {
        revenue: 11500000, ebitda: 1035000, margin: 9, cashFlow: 760000,
        debt: 2100000, growth: 9, receivableDays: 73, verified: ["revenue"],
        trend: [8600, 9200, 9900, 10400, 11000, 11500]
      },
      valuation: { low: 7200000, high: 11800000, point: 9300000, confidence: "Medium", method: "Revenue + EBITDA blend, distribution network premium" },
      scores: { growth: 62, risk: 41, investment: 71, acquisition: 66, opportunity: 79 },
      signals: ["Looking for supplier brands", "Open to acquisition of niche distributors"],
      idleAssets: ["Van fleet capacity available in Eastern Province"],
      relationships: { suppliers: ["sidra"], customers: [], competitors: ["khaleej"] }
    },
    {
      id: "falcon",
      name: "Falcon Warehousing",
      short: "FW",
      color: "#5aa2ff",
      industry: "Warehousing",
      location: "Amghara, Kuwait",
      founded: 2016,
      employees: 44,
      stage: "Growth",
      ownership: "Single owner",
      certifications: ["Civil Defense approved", "GDP compliant zone"],
      markets: ["Kuwait"],
      about: "18,000 m² of dry and temperature-controlled storage. A tenant exit left roughly a third of capacity unlet.",
      financials: {
        revenue: 1100000, ebitda: 462000, margin: 42, cashFlow: 380000,
        debt: 1500000, growth: 3, receivableDays: 35, verified: ["revenue", "ebitda"],
        trend: [880, 950, 1040, 1150, 1120, 1100]
      },
      valuation: { low: 2800000, high: 4100000, point: 3400000, confidence: "High", method: "Income capitalization on rent roll + asset appraisal floor" },
      scores: { growth: 44, risk: 49, investment: 66, acquisition: 72, opportunity: 74 },
      signals: ["Leasing capacity", "Open to sale-and-leaseback investors"],
      idleAssets: ["6,200 m² dry storage vacant", "Racking for 4,000 pallet positions unused"],
      relationships: { suppliers: [], customers: ["noor", "qortuba"], competitors: [] }
    },
    {
      id: "noor",
      name: "Noor Medical Supplies",
      short: "NM",
      color: "#2fd48a",
      industry: "Healthcare Distribution",
      location: "Kuwait City, Kuwait",
      founded: 2018,
      employees: 61,
      stage: "Growth",
      ownership: "Founder (70%) + family office (30%)",
      certifications: ["MOH import license", "ISO 13485"],
      markets: ["Kuwait", "Bahrain"],
      about: "Importer of consumables and devices for private clinics. Growing fast and outgrowing its rented storage.",
      financials: {
        revenue: 2600000, ebitda: 390000, margin: 15, cashFlow: 240000,
        debt: 420000, growth: 28, receivableDays: 95, verified: ["revenue"],
        trend: [1100, 1400, 1700, 2000, 2300, 2600]
      },
      valuation: { low: 2900000, high: 4800000, point: 3800000, confidence: "Medium", method: "Growth-adjusted EBITDA multiple, healthcare distribution comps" },
      scores: { growth: 86, risk: 44, investment: 81, acquisition: 55, opportunity: 85 },
      signals: ["Looking for warehouse space", "Raising growth capital"],
      idleAssets: [],
      relationships: { suppliers: [], customers: [], competitors: [] }
    },
    {
      id: "qortuba",
      name: "Qortuba Plastics",
      short: "QP",
      color: "#e8b64c",
      industry: "Manufacturing",
      location: "Sabhan, Kuwait",
      founded: 2003,
      employees: 175,
      stage: "Mature",
      ownership: "Family-owned, 2nd generation",
      certifications: ["ISO 9001", "ISO 14001"],
      markets: ["Kuwait", "Iraq", "Saudi Arabia"],
      about: "Injection-molded packaging and construction plastics. Solid order book but heavy cash tied up in raw material inventory.",
      financials: {
        revenue: 5100000, ebitda: 663000, margin: 13, cashFlow: 310000,
        debt: 1350000, growth: 4, receivableDays: 79, verified: ["revenue", "ebitda"],
        trend: [4700, 4800, 4950, 5000, 5050, 5100]
      },
      valuation: { low: 3900000, high: 5800000, point: 4700000, confidence: "High", method: "EBITDA multiple (5.9x–8.7x GCC plastics comps)" },
      scores: { growth: 38, risk: 47, investment: 58, acquisition: 76, opportunity: 71 },
      signals: ["Open to acquisition", "Seeking export distributors"],
      idleAssets: ["3 molding machines on single shift", "Inventory ~140 days of cover (sector median: 85)"],
      relationships: { suppliers: [], customers: ["aldeera", "sidra"], competitors: [] }
    },
    {
      id: "bayan",
      name: "Bayan Tech Solutions",
      short: "BT",
      color: "#a48aff",
      industry: "Software & IT",
      location: "Kuwait City, Kuwait",
      founded: 2019,
      employees: 38,
      stage: "Growth",
      ownership: "3 founders + seed investors (18%)",
      certifications: ["CITRA registered"],
      markets: ["Kuwait", "UAE"],
      about: "ERP implementations and custom software for family businesses. Recurring support contracts now 45% of revenue.",
      financials: {
        revenue: 1400000, ebitda: 322000, margin: 23, cashFlow: 290000,
        debt: 0, growth: 34, receivableDays: 42, verified: [],
        trend: [520, 700, 900, 1050, 1200, 1400]
      },
      valuation: { low: 2200000, high: 4300000, point: 3100000, confidence: "Low", method: "Revenue multiple (1.6x–3.1x), recurring-revenue weighted; self-reported figures" },
      scores: { growth: 90, risk: 39, investment: 79, acquisition: 52, opportunity: 76 },
      signals: ["Looking for channel partners", "Hiring senior engineers"],
      idleAssets: ["Bench capacity: 4 developers between projects"],
      relationships: { suppliers: [], customers: ["dana", "marina"], competitors: [] }
    },
    {
      id: "alsahel",
      name: "Al-Sahel Fisheries",
      short: "AS",
      color: "#2fd48a",
      industry: "Food & Agriculture",
      location: "Doha Port, Kuwait",
      founded: 1998,
      employees: 88,
      stage: "Mature",
      ownership: "Family-owned",
      certifications: ["PAAFR licensed", "HACCP"],
      markets: ["Kuwait"],
      about: "Fishing fleet and seafood processing. Stable cash generator; owner exploring partial exit for succession planning.",
      financials: {
        revenue: 2300000, ebitda: 414000, margin: 18, cashFlow: 350000,
        debt: 180000, growth: 2, receivableDays: 22, verified: ["revenue", "ebitda", "debt"],
        trend: [2150, 2200, 2250, 2250, 2280, 2300]
      },
      valuation: { low: 2400000, high: 3600000, point: 3000000, confidence: "High", method: "EBITDA multiple with fleet asset floor; verified financials" },
      scores: { growth: 25, risk: 30, investment: 60, acquisition: 82, opportunity: 64 },
      signals: ["Selling 30% stake", "Succession planning"],
      idleAssets: ["Processing plant at 60% capacity", "2 vessels dry-docked"],
      relationships: { suppliers: [], customers: ["sidra"], competitors: [] }
    },
    {
      id: "desertrose",
      name: "Desert Rose Interiors",
      short: "DR",
      color: "#f0647c",
      industry: "Construction",
      location: "Hawally, Kuwait",
      founded: 2015,
      employees: 52,
      stage: "Growth",
      ownership: "Two partners",
      certifications: ["Kuwait Municipality Grade B"],
      markets: ["Kuwait"],
      about: "High-end residential and hospitality fit-outs. Pipeline of Saudi hotel projects it currently can't service without a local presence.",
      financials: {
        revenue: 1700000, ebitda: 272000, margin: 16, cashFlow: 190000,
        debt: 300000, growth: 19, receivableDays: 71, verified: [],
        trend: [900, 1050, 1200, 1350, 1500, 1700]
      },
      valuation: { low: 1300000, high: 2400000, point: 1800000, confidence: "Low", method: "EBITDA multiple, discounted for self-reported figures and client concentration" },
      scores: { growth: 78, risk: 55, investment: 65, acquisition: 48, opportunity: 80 },
      signals: ["Expanding to Saudi Arabia", "Looking for a local JV partner"],
      idleAssets: [],
      relationships: { suppliers: ["qortuba"], customers: [], competitors: ["aldeera"] }
    },
    {
      id: "khaleej",
      name: "Khaleej Auto Parts",
      short: "KA",
      color: "#5aa2ff",
      industry: "Automotive Distribution",
      location: "Shuwaikh, Kuwait",
      founded: 2008,
      employees: 67,
      stage: "Established",
      ownership: "Single owner",
      certifications: [],
      markets: ["Kuwait", "Iraq"],
      about: "Wholesale distributor of commercial vehicle parts. Entering the fleet-maintenance market and looking for workshop partners.",
      financials: {
        revenue: 3400000, ebitda: 374000, margin: 11, cashFlow: 280000,
        debt: 720000, growth: 7, receivableDays: 66, verified: ["revenue"],
        trend: [2900, 3000, 3100, 3200, 3300, 3400]
      },
      valuation: { low: 2300000, high: 3500000, point: 2900000, confidence: "Medium", method: "EBITDA multiple, working-capital adjusted" },
      scores: { growth: 51, risk: 43, investment: 62, acquisition: 68, opportunity: 70 },
      signals: ["Entering fleet maintenance", "Looking for workshop partners"],
      idleAssets: ["Spare parts inventory overweight in slow-moving SKUs (est. 310,000 KD)"],
      relationships: { suppliers: [], customers: ["gulfbridge", "aldeera"], competitors: ["marina"] }
    },
    {
      id: "dana",
      name: "Dana Family Holding",
      short: "DH",
      color: "#e8b64c",
      industry: "Diversified Holding",
      location: "Kuwait City, Kuwait",
      founded: 1987,
      employees: 260,
      stage: "Mature",
      ownership: "Family holding, 3rd generation",
      certifications: [],
      markets: ["Kuwait", "Bahrain"],
      about: "Holding with interests in real estate, catering, and facilities management. The family wants to sell 30% of the catering arm.",
      financials: {
        revenue: 9800000, ebitda: 1470000, margin: 15, cashFlow: 1100000,
        debt: 2600000, growth: 5, receivableDays: 58, verified: ["revenue", "ebitda"],
        trend: [8700, 9000, 9200, 9400, 9600, 9800]
      },
      valuation: { low: 9500000, high: 14200000, point: 11800000, confidence: "Medium", method: "Sum-of-the-parts across three operating units" },
      scores: { growth: 42, risk: 36, investment: 69, acquisition: 74, opportunity: 73 },
      signals: ["Selling 30% of catering unit", "Open to strategic investors"],
      idleAssets: ["Commercial building in Salmiya 35% vacant", "Central kitchen night shift unused"],
      relationships: { suppliers: ["aldeera", "bayan"], customers: [], competitors: [] }
    }
  ];

  /* AI-manufactured deal matches — the "opportunity engine" */
  const matches = [
    {
      id: "m1", a: "noor", b: "falcon", type: "Capacity match", icon: "🏭",
      headline: "Warehouse need ↔ vacant capacity",
      detail: "Noor Medical is outgrowing rented storage while Falcon Warehousing has 6,200 m² of GDP-compliant space vacant 15 minutes away.",
      value: 120000, valueLabel: "est. annual value", confidence: 88
    },
    {
      id: "m2", a: "sidra", b: "gulfbridge", type: "Logistics synergy", icon: "🚚",
      headline: "Distribution need ↔ idle trucks",
      detail: "Sidra Foods' rising distribution costs map onto Gulf Bridge's 11 idle trucks and 60%-empty KSA return legs.",
      value: 85000, valueLabel: "est. annual synergy", confidence: 82
    },
    {
      id: "m3", a: "desertrose", b: "marina", type: "Market entry", icon: "🌍",
      headline: "Saudi expansion ↔ existing distribution",
      detail: "Desert Rose has Saudi hotel projects it can't service; Marina Retail has licensed operations and relationships across KSA.",
      value: 450000, valueLabel: "est. pipeline unlocked", confidence: 71
    },
    {
      id: "m4", a: "aldeera", b: "dana", type: "Tender match", icon: "📋",
      headline: "Fit-out expertise ↔ renovation tender",
      detail: "Dana Family Holding's Salmiya building renovation matches Al-Deera's commercial fit-out track record and Grade A certification.",
      value: 380000, valueLabel: "est. contract value", confidence: 79
    },
    {
      id: "m5", a: "alsahel", b: "sidra", type: "Vertical integration", icon: "🤝",
      headline: "30% stake for sale ↔ strategic buyer",
      detail: "Al-Sahel's partial exit would secure Sidra's seafood supply chain and fill its idle second production line.",
      value: 900000, valueLabel: "indicative stake value", confidence: 75
    },
    {
      id: "m6", a: "khaleej", b: "gulfbridge", type: "Service partnership", icon: "🔧",
      headline: "Fleet maintenance ↔ 54-truck fleet",
      detail: "Khaleej's new fleet-maintenance arm could service Gulf Bridge's fleet, moving 310,000 KD of slow inventory in the process.",
      value: 95000, valueLabel: "est. annual value", confidence: 80
    },
    {
      id: "m7", a: "bayan", b: "qortuba", type: "Digitization", icon: "💻",
      headline: "ERP bench capacity ↔ inventory problem",
      detail: "Bayan's 4 benched developers could deploy inventory optimization at Qortuba, where stock cover runs 55 days above the sector median.",
      value: 260000, valueLabel: "est. working capital freed", confidence: 68
    }
  ];

  /* Evidence behind each AI match — shown as "Why this match?" */
  const matchWhy = {
    m1: ["Noor Medical's storage requests grew 3 months in a row while its revenue grew 28% YoY",
         "Falcon's occupancy dropped to 66% after a tenant exit — 6,200 m² GDP-compliant space is idle",
         "Facilities are 15 minutes apart; Falcon already serves two healthcare tenants"],
    m2: ["Sidra's distribution cost per delivery rose 12% over two quarters",
         "Gulf Bridge reports 11 idle trucks on weekdays and 60%-empty return legs from KSA",
         "Both companies already share a customer, reducing onboarding friction"],
    m3: ["Desert Rose published a 'Saudi expansion' signal and lists an unserviceable KSA pipeline",
         "Marina Retail holds SFDA licensing and 2,400 points of sale across KSA",
         "Hospitality fit-out demand in KSA is growing ~15% annually in platform data"],
    m4: ["Dana's Salmiya building is 35% vacant and flagged for renovation",
         "Al-Deera holds Kuwait Municipality Grade A and a commercial fit-out track record",
         "Al-Deera is already a supplier to Dana — an existing trust relationship"],
    m5: ["Al-Sahel published a 'selling 30%' succession signal with verified financials",
         "Sidra already buys from Al-Sahel — vertical integration would secure its supply chain",
         "Sidra's idle second production line matches Al-Sahel's processing overflow"],
    m6: ["Khaleej published a fleet-maintenance signal and holds 310,000 KD of slow-moving parts",
         "Gulf Bridge operates 54 trucks with no in-house maintenance contract",
         "Khaleej already supplies Gulf Bridge — a service upsell, not a cold introduction"],
    m7: ["Qortuba's inventory cover is 140 days vs a sector median of 85",
         "Bayan has 4 benched developers and ERP deployment experience in manufacturing",
         "Estimated 260,000 KD of working capital is trapped in excess stock"]
  };
  matches.forEach((m) => { m.why = matchWhy[m.id] || []; });

  /* Sector benchmark medians used for dashboard comparisons */
  const benchmarks = { margin: 14, receivableDays: 64, growth: 8 };

  /* Indicative EBITDA multiple ranges by industry (for the instant-valuation wizard) */
  const multiples = {
    "Construction": [4.2, 6.1], "Logistics": [5.0, 8.0], "Food Manufacturing": [6.4, 9.9],
    "Retail & Distribution": [5.5, 8.5], "Warehousing": [6.0, 9.0], "Healthcare Distribution": [6.5, 10.0],
    "Manufacturing": [5.9, 8.7], "Software & IT": [8.0, 14.0], "Food & Agriculture": [5.0, 7.5],
    "Automotive Distribution": [5.2, 7.8], "Diversified Holding": [6.0, 9.5], "Other": [5.0, 8.0]
  };

  /* Capital-allocation insights for the demo dashboard (Al-Deera's view) */
  const insights = [
    {
      icon: "⏱", tone: "gold",
      title: "Receivables are your cheapest capital",
      body: "Your receivable days (88) run 24 days above the Kuwait construction median. Reducing them by 15 days would free an estimated 400,000 KD of working capital.",
      impact: "+400,000 KD liquidity"
    },
    {
      icon: "🏗", tone: "blue",
      title: "Scaffolding fleet is idle 40% of the year",
      body: "Three contractors within 20 km rent equivalent scaffolding at market rates. Listing your idle fleet could yield an estimated 36,000 KD annually.",
      impact: "+36,000 KD / yr"
    },
    {
      icon: "📊", tone: "green",
      title: "Client concentration risk rising",
      body: "Your top customer is 47% of revenue, up from 31% two years ago. Three matched prospects in your grade band are tendering this quarter.",
      impact: "3 diversification leads"
    },
    {
      icon: "🧱", tone: "violet",
      title: "Supplier consolidation opportunity",
      body: "Consolidating plastics and fixtures purchasing with Qortuba Plastics at your combined volume suggests a 6–9% input cost reduction.",
      impact: "−6–9% input costs"
    }
  ];

  const fmtKD = (n) => {
    if (n >= 1000000) return (n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1) + "M KD";
    if (n >= 1000) return Math.round(n / 1000) + "K KD";
    return n + " KD";
  };
  const fmtKDfull = (n) => n.toLocaleString("en-US") + " KD";
  const byId = (id) => companies.find((c) => c.id === id);

  return { companies, matches, insights, benchmarks, multiples, fmtKD, fmtKDfull, byId };
})();
