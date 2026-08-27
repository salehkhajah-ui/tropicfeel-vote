/* Smart Money — Supabase client and data access helpers.
   The publishable key is meant to be public; every table is protected by
   row-level security, so the browser can only ever read published companies
   and write to companies the signed-in user is a member of. */

import { createClient } from "/assets/vendor/supabase-js.esm.js";

export const SUPABASE_URL = "https://astuonidhsuubnzgftqy.supabase.co";
export const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_3W277FyokOxUTQsf1Qn0DQ_AjSuub3s";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

/* ---------- auth ---------- */
export const getSession = async () =>
  (await supabase.auth.getSession()).data.session;

export async function requireSession(redirectTo = "/app/login") {
  const session = await getSession();
  if (!session) {
    location.replace(redirectTo + "?next=" + encodeURIComponent(location.pathname + location.search));
    return null;
  }
  return session;
}

export const signOut = () => supabase.auth.signOut();

/* ---------- companies ---------- */
export const listDirectory = () =>
  supabase.from("company_directory").select("*").order("score_opportunity", { ascending: false });

export const getDirectoryEntry = (slug) =>
  supabase.from("company_directory").select("*").eq("slug", slug).maybeSingle();

/* Companies the signed-in user belongs to. RLS makes the membership join
   sufficient — no user_id filter is needed or trusted from the client. */
export const myCompanies = () =>
  supabase.from("company_members").select("role, companies(*)").order("created_at");

export const onboardCompany = (fields) =>
  supabase.rpc("onboard_company", fields);

export const updateCompany = (id, patch) =>
  supabase.from("companies").update(patch).eq("id", id).select().maybeSingle();

/* ---------- financials & signals (self-reported, editable by members) ---------- */
export const upsertFinancials = (row) =>
  supabase.from("company_financials").upsert(row, { onConflict: "company_id,fiscal_year" }).select().maybeSingle();

export const getFinancials = (companyId) =>
  supabase.from("company_financials").select("*").eq("company_id", companyId)
    .order("fiscal_year", { ascending: false });

export const getVerifications = (companyId) =>
  supabase.from("metric_verifications").select("metric, fiscal_year, method, verified_at")
    .eq("company_id", companyId);

export const listSignals = (companyId) =>
  supabase.from("opportunity_signals").select("*").eq("company_id", companyId)
    .order("created_at", { ascending: false });

export const addSignal = (row) =>
  supabase.from("opportunity_signals").insert(row).select().maybeSingle();

export const closeSignal = (id) =>
  supabase.from("opportunity_signals").update({ status: "closed" }).eq("id", id);

export const listIdleAssets = (companyId) =>
  supabase.from("idle_assets").select("*").eq("company_id", companyId);

export const addIdleAsset = (row) =>
  supabase.from("idle_assets").insert(row).select().maybeSingle();

/* ---------- platform outputs (read-only for every client) ---------- */
export const getValuation = (companyId) =>
  supabase.from("valuations").select("*").eq("company_id", companyId).eq("is_current", true).maybeSingle();

export const getScores = (companyId) =>
  supabase.from("company_scores").select("*").eq("company_id", companyId).maybeSingle();

export const myMatches = () =>
  supabase.from("deal_matches").select("*").order("created_at", { ascending: false });

/* ---------- MVP: scores, value gap, opportunities ---------- */
export const getScoreComponents = (companyId) =>
  supabase.from("score_components").select("*").eq("company_id", companyId).maybeSingle();

export const getValueGapActions = (companyId) =>
  supabase.from("value_gap_actions").select("*").eq("company_id", companyId).order("sort");

export const listOpportunities = (companyId, statuses = ["proposed", "viewed", "accepted"]) =>
  supabase.from("opportunities").select("*").eq("company_id", companyId)
    .in("status", statuses).order("score", { ascending: false });

export const setOpportunityStatus = (id, status) =>
  supabase.from("opportunities").update({ status }).eq("id", id);

/* ---------- MVP: tenders ---------- */
export const listOpenTenders = () =>
  supabase.from("tenders").select("*, companies(name, slug, industry)").eq("status", "open")
    .order("deadline", { ascending: true, nullsFirst: false });

export const myTenders = (companyId) =>
  supabase.from("tenders").select("*").eq("company_id", companyId).order("created_at", { ascending: false });

/* tender creation and entries go through the paid checkout RPCs below —
   there is intentionally no direct-insert path */
export const setTenderStatus = (id, status) =>
  supabase.from("tenders").update({ status }).eq("id", id);

export const listTenderResponses = (tenderId) =>
  supabase.from("tender_responses").select("*, companies(name, slug, industry)")
    .eq("tender_id", tenderId).order("created_at");

export const myTenderResponses = (companyId) =>
  supabase.from("tender_responses").select("*, tenders(title, status, deadline, company_id)")
    .eq("company_id", companyId).order("created_at", { ascending: false });

export const setResponseStatus = (id, status) =>
  supabase.from("tender_responses").update({ status }).eq("id", id);

/* ---------- MVP: connections & messages ---------- */
export const listConnections = (companyId) =>
  supabase.from("connections")
    .select("*, from:companies!connections_from_company_id_fkey(id,name,slug,industry), to:companies!connections_to_company_id_fkey(id,name,slug,industry)")
    .or(`from_company_id.eq.${companyId},to_company_id.eq.${companyId}`)
    .order("created_at", { ascending: false });

export const requestConnection = (row) =>
  supabase.from("connections").insert(row).select().maybeSingle();

export const setConnectionStatus = (id, status) =>
  supabase.from("connections").update({ status }).eq("id", id);

export const listMessages = (connectionId) =>
  supabase.from("messages").select("*").eq("connection_id", connectionId).order("created_at");

export const sendMessage = (row) => supabase.from("messages").insert(row).select().maybeSingle();

/* ---------- capital allocation & deals ---------- */
export const listCapitalRecommendations = (companyId) =>
  supabase.from("capital_recommendations").select("*").eq("company_id", companyId).order("sort");

export const listDeals = (companyId) =>
  supabase.from("deals")
    .select("*, a:companies!deals_company_a_id_fkey(id,name,slug), b:companies!deals_company_b_id_fkey(id,name,slug)")
    .or(`company_a_id.eq.${companyId},company_b_id.eq.${companyId}`)
    .order("updated_at", { ascending: false });

export const updateDeal = (id, patch) =>
  supabase.from("deals").update(patch).eq("id", id).select().maybeSingle();

export const DEAL_STAGES = [
  "identified", "interested", "introduction", "nda", "due_diligence",
  "negotiation", "loi", "closing", "completed", "lost",
];

/* ---------- investor accounts ---------- */
export const getInvestorProfile = async () => {
  const s = await getSession();
  if (!s) return { data: null };
  return supabase.from("investor_profiles").select("*").eq("user_id", s.user.id).maybeSingle();
};

export const upsertInvestorProfile = async (row) => {
  const s = await getSession();
  return supabase.from("investor_profiles")
    .upsert({ ...row, user_id: s.user.id }, { onConflict: "user_id" }).select().maybeSingle();
};

export const getMandate = async () => {
  const s = await getSession();
  if (!s) return { data: null };
  return supabase.from("investor_mandates").select("*").eq("user_id", s.user.id).maybeSingle();
};

export const upsertMandate = async (row) => {
  const s = await getSession();
  return supabase.from("investor_mandates")
    .upsert({ ...row, user_id: s.user.id }, { onConflict: "user_id" }).select().maybeSingle();
};

export const getMyKyc = async () => {
  const s = await getSession();
  if (!s) return { data: null };
  return supabase.from("profiles").select("is_investor, investor_verified_at").eq("id", s.user.id).maybeSingle();
};

/* Deal flow: published companies with active capital signals, joined to their
   engine outputs. Signals define what counts as "seeking capital". */
export const CAPITAL_SIGNALS = [
  "open_to_investors", "seeking_capital", "selling_stake", "full_exit",
  "open_to_acquisition", "joint_venture",
];

export async function listDealFlow() {
  const { data: signals, error } = await supabase
    .from("opportunity_signals").select("company_id, type, title")
    .eq("status", "active").in("type", CAPITAL_SIGNALS);
  if (error || !signals?.length) return { data: [], error };
  const ids = [...new Set(signals.map((s) => s.company_id))];
  const [{ data: companies }, { data: vals }, { data: scores }] = await Promise.all([
    supabase.from("companies").select("*").in("id", ids).eq("status", "published"),
    supabase.from("valuations").select("*").in("company_id", ids).eq("is_current", true),
    supabase.from("score_components").select("*").in("company_id", ids),
  ]);
  const vById = Object.fromEntries((vals || []).map((v) => [v.company_id, v]));
  const sById = Object.fromEntries((scores || []).map((s) => [s.company_id, s]));
  const sigById = {};
  signals.forEach((s) => (sigById[s.company_id] = [...(sigById[s.company_id] || []), s]));
  return {
    data: (companies || []).map((c) => ({
      company: c, valuation: vById[c.id] || null, scores: sById[c.id] || null,
      signals: sigById[c.id] || [],
    })),
  };
}

/* Mandate fit — the same disclosed five-component formula the demo terminal
   uses, now driven by the investor's stored mandate and engine outputs. */
export function mandateFit(entry, mandate) {
  const { company: c, valuation: v, scores: sc } = entry;
  const sector = mandate.sectors?.includes(c.industry) ? 30
    : mandate.adjacent?.includes(c.industry) ? 14 : 4;
  const stage = mandate.stages?.includes(c.stage || "") ? 20 : 10;
  const quality = Math.round(((sc?.investment_readiness ?? sc?.total ?? 50) / 100) * 25);
  const risk = Math.round(((sc?.financial_health ?? 50) / 100) * 15);
  const conf = v?.confidence === "high" ? 10 : v?.confidence === "medium" ? 6 : 3;
  return {
    total: sector + stage + quality + risk + conf,
    parts: [
      { label: "Sector", v: sector, max: 30 },
      { label: "Stage", v: stage, max: 20 },
      { label: "Quality", v: quality, max: 25 },
      { label: "Risk", v: risk, max: 15 },
      { label: "Data", v: conf, max: 10 },
    ],
  };
}

export const listWatchlist = async () => {
  const s = await getSession();
  if (!s) return { data: [] };
  return supabase.from("watchlists").select("company_id").eq("user_id", s.user.id);
};
export const watchCompany = async (companyId) => {
  const s = await getSession();
  return supabase.from("watchlists").insert({ user_id: s.user.id, company_id: companyId });
};
export const unwatchCompany = async (companyId) => {
  const s = await getSession();
  return supabase.from("watchlists").delete().eq("user_id", s.user.id).eq("company_id", companyId);
};

/* ---------- data-room requests ---------- */
export const myAccessRequests = async () => {
  const s = await getSession();
  if (!s) return { data: [] };
  return supabase.from("data_room_requests")
    .select("*, companies(name, slug)").eq("requester_id", s.user.id)
    .order("created_at", { ascending: false });
};
export const requestAccess = async (companyId, note) => {
  const s = await getSession();
  return supabase.from("data_room_requests")
    .insert({ company_id: companyId, requester_id: s.user.id, note: note || null })
    .select().maybeSingle();
};
export async function companyAccessRequests(companyId) {
  // no FK path between data_room_requests and investor_profiles (both key on
  // auth.users), so join the requester profiles in a second query
  const { data: reqs, error } = await supabase.from("data_room_requests")
    .select("*").eq("company_id", companyId).order("created_at", { ascending: false });
  if (error || !reqs?.length) return { data: reqs || [], error };
  const { data: profiles } = await supabase.from("investor_profiles")
    .select("user_id, display_name, firm_type, based")
    .in("user_id", [...new Set(reqs.map((r) => r.requester_id))]);
  const byId = Object.fromEntries((profiles || []).map((p) => [p.user_id, p]));
  return { data: reqs.map((r) => ({ ...r, investor: byId[r.requester_id] || null })) };
}
export const decideAccessRequest = (id, status) =>
  supabase.from("data_room_requests").update({ status, decided_at: new Date().toISOString() }).eq("id", id);

/* ---------- notifications ---------- */
export const listNotifications = async (limit = 20) => {
  const s = await getSession();
  if (!s) return { data: [] };
  return supabase.from("notifications").select("*").eq("user_id", s.user.id)
    .order("created_at", { ascending: false }).limit(limit);
};
export const markNotificationRead = (id) =>
  supabase.from("notifications").update({ read_at: new Date().toISOString() }).eq("id", id);

/* ---------- audited financials: upload + AI analysis ---------- */
export async function uploadFinancialDocument(companyId, file) {
  const s = await getSession();
  const path = `${companyId}/${crypto.randomUUID()}.pdf`;
  const { error: upErr } = await supabase.storage.from("financial-docs")
    .upload(path, file, { contentType: "application/pdf" });
  if (upErr) return { error: upErr };
  return supabase.from("financial_documents").insert({
    company_id: companyId, storage_path: path, filename: file.name,
    mime_type: "application/pdf", size_bytes: file.size, uploaded_by: s.user.id,
  }).select().maybeSingle();
}

export const listFinancialDocuments = (companyId) =>
  supabase.from("financial_documents")
    .select("id, filename, status, error, model, created_at, storage_path")
    .eq("company_id", companyId).order("created_at", { ascending: false });

/* Deleting the row cascades to the document's ai_insights; the stored PDF
   must go through the Storage API (SQL deletes are blocked). */
export async function deleteFinancialDocument(doc) {
  const { error: sErr } = await supabase.storage.from("financial-docs").remove([doc.storage_path]);
  if (sErr) return { error: sErr };
  return supabase.from("financial_documents").delete().eq("id", doc.id);
}

export const analyzeFinancialDocument = (documentId) =>
  supabase.functions.invoke("analyze-financials", { body: { document_id: documentId } });

export const listAiInsights = (companyId) =>
  supabase.from("ai_insights").select("*").eq("company_id", companyId)
    .order("kind").order("created_at", { ascending: false });

/* Renders a valuation's method string as a "valuation letter": the narrative,
   key assumptions as bullets, and the standing disclaimer set apart. Handles
   both the AI method text and the engine's formula description. */
export function valuationLetter(method) {
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  let m = String(method || "").trim()
    .replace(/^AI analysis of the uploaded audited statements\.\s*/i, "")
    .replace(/\s*[^.]*not a certified appraisal\.?\s*$/i, "");
  const [body, assump] = m.split(/\s*Key assumptions:\s*/i);
  const bullets = (assump || "").split(/;\s*/)
    .map((s) => s.replace(/\.\s*$/, "").trim()).filter(Boolean);
  return `
    <p>${esc(body).trim()}</p>
    ${bullets.length ? `
      <div class="letter-kicker">Key assumptions</div>
      <ul>${bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>` : ""}
    <div class="letter-note">Model estimate for decision support — not a certified
      appraisal, an offer, or investment advice.</div>`;
}

/* ---------- billing ---------- */
export const createCheckout = (companyId, plan, cycle) =>
  supabase.rpc("create_checkout", { p_company_id: companyId, p_plan: plan, p_cycle: cycle });

export const startPayment = (invoiceId, returnTo) =>
  supabase.functions.invoke("billing-checkout",
    { body: { invoice_id: invoiceId, return_to: returnTo } });

/* ---------- paid one-off actions: proposals & tenders ---------- */
export const getPlatformFees = async () => {
  const { data } = await supabase.from("platform_fees").select("*").eq("is_active", true);
  return Object.fromEntries((data || []).map((f) => [f.key, f]));
};

export const createProposalCheckout = (p) =>
  supabase.rpc("create_proposal_checkout", {
    p_to_company: p.toCompanyId, p_subject: p.subject, p_body: p.body,
    p_from_name: p.fromName, p_contact_email: p.contactEmail,
    p_contact_phone: p.contactPhone ?? null, p_offer_amount: p.offerAmount ?? null,
    p_from_company: p.fromCompanyId ?? null,
  });

export const myProposals = () =>
  supabase.from("proposals").select("*, companies:to_company_id(name, industry)")
    .order("created_at", { ascending: false });

export const companyProposals = (companyId) =>
  supabase.from("proposals").select("*")
    .eq("to_company_id", companyId).neq("status", "pending_payment")
    .order("created_at", { ascending: false });

export const decideProposal = (id, status) =>
  supabase.from("proposals").update({ status }).eq("id", id).select().maybeSingle();

export const createTenderCheckout = (p) =>
  supabase.rpc("create_tender_checkout", {
    p_company: p.companyId, p_title: p.title, p_category: p.category,
    p_description: p.description, p_budget: p.budget ?? null, p_deadline: p.deadline ?? null,
    p_location: p.location ?? null, p_requirements: p.requirements ?? null,
  });

export const createTenderEntryCheckout = (p) =>
  supabase.rpc("create_tender_entry_checkout", {
    p_tender: p.tenderId, p_company: p.companyId,
    p_offer_description: p.offerDescription, p_delivery_time: p.deliveryTime ?? null,
    p_qualifications: p.qualifications ?? null, p_amount: p.amount ?? null,
    p_message: p.message ?? null,
  });

export const listInvoices = (companyId) =>
  supabase.from("invoices").select("*, invoice_items(*), payments(provider, status, created_at)")
    .eq("company_id", companyId).order("created_at", { ascending: false });

export const getInvoice = (invoiceId) =>
  supabase.from("invoices").select("*").eq("id", invoiceId).maybeSingle();

export const setCancelAtPeriodEnd = (companyId, value) =>
  supabase.rpc("set_cancel_at_period_end", { p_company_id: companyId, p_value: value });

/* ---------- MVP: plans & subscription ---------- */
export const listPlans = () =>
  supabase.from("plans").select("*").eq("is_active", true).order("sort");

export const getSubscription = (companyId) =>
  supabase.from("subscriptions").select("*").eq("company_id", companyId).maybeSingle();

/* ---------- MVP: benchmarks ---------- */
export const getBenchmark = (industry) =>
  supabase.from("industry_benchmarks").select("*").eq("industry", industry).maybeSingle();

/* ---------- analytics: fire-and-forget funnel events ---------- */
const sessionKey = (() => {
  try {
    let k = localStorage.getItem("sm_session");
    if (!k) { k = crypto.randomUUID(); localStorage.setItem("sm_session", k); }
    return k;
  } catch { return null; }
})();

export function track(name, props = {}) {
  getSession().then((s) =>
    supabase.from("events").insert({
      user_id: s?.user?.id ?? null, session_key: sessionKey, name, props,
    })
  ).catch(() => {});
}

/* ---------- profile completion ---------- */
export function profileCompletion(company, financials, signals) {
  const checks = [
    !!company.name, !!company.industry, !!company.city, !!company.founded_year,
    !!company.employees, !!company.about, !!company.website,
    (company.objectives?.length || 0) > 0,
    (financials?.length || 0) > 0,
    (financials?.length || 0) >= 2,
    (signals?.length || 0) > 0,
    company.status === "published",
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export const OBJECTIVES = [
  ["find_customers", "Find customers"],
  ["find_suppliers", "Find suppliers"],
  ["find_partners", "Find strategic partners"],
  ["raise_capital", "Raise capital"],
  ["sell_stake", "Sell part of my company"],
  ["sell_company", "Sell my company"],
  ["acquire", "Acquire a company"],
  ["find_tenders", "Find tenders"],
  ["publish_tenders", "Publish tenders"],
  ["expand", "Expand geographically"],
  ["reduce_costs", "Reduce costs"],
  ["improve_value", "Improve company value"],
  ["explore", "Explore opportunities"],
];

export const OPP_ICONS = {
  customer: "🤝", supplier: "📦", partnership: "🧩", investment: "💰",
  acquisition: "🏢", merger: "🔗", expansion: "🌍", cost_reduction: "✂️", tender: "📋",
};

/* ---------- formatting ---------- */
export const fmtKD = (n) => {
  if (n === null || n === undefined || n === "") return "—";
  const v = Number(n);
  if (v >= 1000000) return (v / 1000000).toFixed(v % 1000000 === 0 ? 0 : 1) + "M KD";
  if (v >= 1000) return Math.round(v / 1000) + "K KD";
  return v + " KD";
};

export const SIGNAL_TYPES = [
  ["open_to_investors", "Open to investors"],
  ["open_to_acquisition", "Open to acquisition"],
  ["open_to_partnership", "Open to partnerships"],
  ["seeking_distributors", "Looking for distributors"],
  ["seeking_suppliers", "Looking for suppliers"],
  ["selling_stake", "Selling a stake"],
  ["full_exit", "Full exit"],
  ["acquiring", "Looking to acquire"],
  ["joint_venture", "Open to joint ventures"],
  ["seeking_capital", "Raising capital"],
  ["expanding", "Expanding to a new market"],
  ["tender", "Bidding on tenders"],
  ["hiring", "Hiring"],
  ["other", "Other"],
];
