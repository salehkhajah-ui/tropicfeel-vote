/* Smart Money — shared chrome (nav + footer), bilingual EN/AR */
(function () {
  const page = document.body.dataset.page || "";
  const ar = document.documentElement.lang === "ar";
  const home = ar ? "/ar" : "/";

  // link to the same page in the other language. The /app section is English-only
  // for now, so it gets no switcher rather than a link to a page that isn't there.
  const bilingual = page !== "app";
  const hasArTwin = !["get-started"].includes(page);
  const otherLangHref = !hasArTwin ? "/ar" : ar
    ? (location.pathname.replace(/^\/ar\/?/, "/") + location.search + location.hash)
    : ("/ar" + (location.pathname === "/" ? "" : location.pathname) + location.search + location.hash);

  const t = ar ? {
    brand: "سمارت موني",
    companies: "الشركات", graph: "الشبكة الاقتصادية", vision: "الرؤية",
    model: "نموذج العمل", demo: "العرض الحي ↗", lang: "English",
    visionHref: "/ar#vision", modelHref: "/ar#model",
    companiesHref: "/ar/companies", graphHref: "/ar/graph", dashHref: "/ar/dashboard",
    investors: "المستثمرون", pricing: "الأسعار",
    investorsHref: "/ar/investors", pricingHref: "/ar/pricing",
    investorLink: "منصة المستثمر", wizardLink: "قيّم شركتك مجاناً", wizardHref: "/get-started",
    app: "الدخول",
    tagline: "ننظّم الاقتصاد الخاص في العالم — بدءًا من الكويت والخليج.",
    copyright: `© ${new Date().getFullYear()} سمارت موني. موقع تجريبي — جميع الشركات والأرقام افتراضية.`,
    product: "المنتج", dirLink: "دليل الشركات", graphLink: "الشبكة الاقتصادية", dashLink: "لوحة الفرص",
    companyCol: "الشركة", visionLink: "الرؤية", roadmapLink: "خارطة الطريق", modelLink: "نموذج العمل",
    roadmapHref: "/ar#phases",
    discTitle: "تنبيه مهم:",
    disc: "تقييمات سمارت موني ودرجاتها وتقديرات التآزر فيها هي مخرجات نماذج ذكاء اصطناعي لغرض دعم القرار فقط، وليست تقييمات معتمدة ولا نصيحة استثمارية ولا عرضًا لأوراق مالية. لا تتيح المنصة شراء أو بيع الأسهم؛ ويجري التعريف بالمستثمرين حصرًا عبر غرف بيانات بوصول موثّق، وأي تسهيل مستقبلي للمعاملات سيتم فقط عبر شركاء مرخّصين وخاضعين للرقابة، وبما يتوافق مع متطلبات الأوراق المالية ومكافحة غسل الأموال والتحقق من هوية العملاء."
  } : {
    brand: "Smart Money",
    companies: "Companies", graph: "Economic Graph", vision: "Vision",
    model: "Business Model", demo: "Live Demo ↗", lang: "العربية",
    visionHref: "/#vision", modelHref: "/#model",
    companiesHref: "/companies", graphHref: "/graph", dashHref: "/dashboard",
    investors: "Investors", pricing: "Pricing",
    investorsHref: "/investors", pricingHref: "/pricing",
    investorLink: "Investor Terminal", wizardLink: "Get Your Free Valuation", wizardHref: "/get-started",
    app: "Sign in",
    tagline: "Organizing the world's private economy — starting with Kuwait and the GCC.",
    copyright: `© ${new Date().getFullYear()} Smart Money. Demonstration site — all companies and figures are fictional.`,
    product: "Product", dirLink: "Company Directory", graphLink: "Economic Graph", dashLink: "Opportunity Dashboard",
    companyCol: "Company", visionLink: "Vision", roadmapLink: "Roadmap", modelLink: "Business Model",
    roadmapHref: "/#phases",
    discTitle: "Important:",
    disc: "Smart Money valuations, scores, and synergy estimates are AI model outputs intended for decision support only. They are not certified appraisals, investment advice, or offers of securities. The platform does not facilitate the purchase or sale of equity; introductions to investors occur only through verified-access data rooms, and any future transaction facilitation would occur solely through licensed, regulated partners in compliance with applicable securities, AML, and KYC requirements."
  };

  const nav = document.createElement("header");
  nav.className = "nav";
  nav.innerHTML = `
    <div class="nav-inner">
      <a class="brand" href="${home}">
        <span class="brand-mark">S</span>
        <span>${t.brand}</span>
      </a>
      <button class="nav-toggle" aria-label="Menu" aria-expanded="false">☰</button>
      <nav class="nav-links">
        <a href="${t.companiesHref}" class="${page === "companies" ? "active" : ""}">${t.companies}</a>
        <a href="${t.graphHref}" class="${page === "graph" ? "active" : ""}">${t.graph}</a>
        <a href="${t.investorsHref}" class="${page === "investors" ? "active" : ""}">${t.investors}</a>
        <a href="${t.pricingHref}" class="${page === "pricing" ? "active" : ""}">${t.pricing}</a>
        <a href="/app" class="${page === "app" ? "active" : ""}">${t.app}</a>
        ${bilingual ? `<a href="${otherLangHref}" class="lang-switch" lang="${ar ? "en" : "ar"}" dir="${ar ? "ltr" : "rtl"}">${t.lang}</a>` : ""}
        <a href="${t.dashHref}" class="cta ${page === "dashboard" ? "active" : ""}">${t.demo}</a>
      </nav>
    </div>`;
  // Signed in? The "Sign in" link becomes the account name (still leads to /app).
  // The supabase-js session lives in localStorage; read it without loading the SDK.
  try {
    const key = Object.keys(localStorage).find((k) => /^sb-.+-auth-token$/.test(k));
    const raw = key && localStorage.getItem(key);
    if (raw) {
      const s = JSON.parse(raw.startsWith("base64-") ? atob(raw.slice(7)) : raw);
      const u = s?.user;
      if (u?.email) {
        const name = u.user_metadata?.full_name || u.email.split("@")[0];
        const link = nav.querySelector('a[href="/app"]');
        link.textContent = "👤 " + name;
        link.title = u.email;
      }
    }
  } catch { /* treat as signed out */ }
  document.body.prepend(nav);

  const navToggle = nav.querySelector(".nav-toggle");
  const navLinks = nav.querySelector(".nav-links");
  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", open);
    navToggle.textContent = open ? "✕" : "☰";
  });
  navLinks.addEventListener("click", () => { navLinks.classList.remove("open"); navToggle.textContent = "☰"; });

  // scroll edge effect: .nav shows its divider/shadow only once content
  // actually scrolls under the floating bar
  const navEdge = () => nav.classList.toggle("scrolled", window.scrollY > 4);
  window.addEventListener("scroll", navEdge, { passive: true });
  navEdge();

  const footer = document.createElement("footer");
  footer.className = "site";
  footer.innerHTML = `
    <div class="wrap">
      <div style="max-width:420px">
        <div class="brand" style="margin-bottom:10px"><span class="brand-mark">S</span> ${t.brand}</div>
        <p>${t.tagline}</p>
        <p style="margin-top:14px" class="faint">${t.copyright}</p>
      </div>
      <div style="display:flex;gap:48px;flex-wrap:wrap">
        <div>
          <div class="panel-title">${t.product}</div>
          <p><a href="${t.companiesHref}">${t.dirLink}</a></p>
          <p><a href="${t.graphHref}">${t.graphLink}</a></p>
          <p><a href="${t.dashHref}">${t.dashLink}</a></p>
          <p><a href="${t.investorsHref}">${t.investorLink}</a></p>
          <p><a href="${t.wizardHref}">${t.wizardLink}</a></p>
        </div>
        <div>
          <div class="panel-title">${t.companyCol}</div>
          <p><a href="${t.visionHref}">${t.visionLink}</a></p>
          <p><a href="${t.roadmapHref}">${t.roadmapLink}</a></p>
          <p><a href="${t.modelHref}">${t.modelLink}</a></p>
          <p><a href="${t.pricingHref}">${t.pricing}</a></p>
        </div>
      </div>
    </div>
    <div class="wrap" style="margin-top:28px">
      <div class="disclaimer" style="width:100%">
        <strong>${t.discTitle}</strong> ${t.disc}
      </div>
    </div>`;
  document.body.append(footer);

  /* ---- toast helper: smToast("Saved", { undo: fn }) ---- */
  const toastEl = document.createElement("div");
  toastEl.id = "sm-toast";
  toastEl.setAttribute("role", "status");
  document.body.append(toastEl);
  let toastTimer = null;
  window.smToast = function (msg, opts = {}) {
    clearTimeout(toastTimer);
    toastEl.innerHTML = `<span>${msg}</span>`;
    if (opts.undo) {
      const b = document.createElement("button");
      b.textContent = ar ? "تراجع" : "Undo";
      b.onclick = () => { toastEl.classList.remove("show"); opts.undo(); };
      toastEl.append(b);
    }
    toastEl.classList.add("show");
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), opts.undo ? 6000 : 3200);
  };

  /* ---- per-browser demo state (approve/dismiss decisions on demo pages) ---- */
  window.smState = {
    get() { try { return JSON.parse(localStorage.getItem("sm-actions") || "{}"); } catch { return {}; } },
    set(id, val) {
      try {
        const s = window.smState.get();
        if (val === null) delete s[id]; else s[id] = val;
        localStorage.setItem("sm-actions", JSON.stringify(s));
      } catch { /* storage unavailable — demo state just won't persist */ }
    }
  };
})();
