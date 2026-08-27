/* Smart Money — shared chrome (nav + footer) and UI helpers */
(function () {
  const page = document.body.dataset.page || "";
  const isAr = document.documentElement.lang === "ar";

  const T = isAr ? {
    companies: "الشركات", graph: "الخريطة الاقتصادية", vision: "الرؤية",
    valuation: "قيّم شركتك", pricing: "الأسعار", demo: "جرّب المنصة ↗", langLink: '<a href="/" lang="en" dir="ltr">English</a>',
    home: "/ar", visionHref: "/ar#vision",
    tagline: "ننظّم الاقتصاد الخاص في العالم — بدءاً من الكويت والخليج.",
    demoNote: "موقع تجريبي — جميع الشركات والأرقام خيالية.",
    product: "المنتج", company: "الشركة",
    fLinks1: [["/pricing", "الأسعار"], ["/get-started", "قيّم شركتك"], ["/companies", "دليل الشركات"], ["/graph", "الخريطة الاقتصادية"], ["/dashboard", "لوحة الفرص"]],
    fLinks2: [["/ar#vision", "الرؤية"], ["/ar#phases", "خارطة الطريق"], ["/ar#model", "نموذج العمل"]],
    disclaimer: "<strong>تنويه مهم:</strong> تقييمات ودرجات وتقديرات سمارت موني هي مخرجات نماذج ذكاء اصطناعي لغرض دعم القرار فقط، وليست تقييمات معتمدة أو استشارات استثمارية أو عروضاً لأوراق مالية. المنصة لا تُسهّل بيع أو شراء الحصص؛ ويتم التعريف بالمستثمرين حصراً عبر غرف بيانات موثّقة الوصول، وأي تسهيل مستقبلي للمعاملات سيتم فقط عبر شركاء مرخّصين وخاضعين للرقابة وبما يتوافق مع أنظمة الأوراق المالية ومكافحة غسل الأموال والتحقق من الهوية."
  } : {
    companies: "Companies", graph: "Economic Graph", vision: "Vision",
    valuation: "Get Your Valuation", pricing: "Pricing", demo: "Live Demo ↗", langLink: '<a href="/ar" lang="ar" dir="rtl">عربي</a>',
    home: "/", visionHref: "/#vision",
    tagline: "Organizing the world's private economy — starting with Kuwait and the GCC.",
    demoNote: "Demonstration site — all companies and figures are fictional.",
    product: "Product", company: "Company",
    fLinks1: [["/pricing", "Pricing"], ["/get-started", "Get Your Valuation"], ["/companies", "Company Directory"], ["/graph", "Economic Graph"], ["/dashboard", "Opportunity Dashboard"]],
    fLinks2: [["/#vision", "Vision"], ["/#phases", "Roadmap"], ["/#model", "Business Model"]],
    disclaimer: "<strong>Important:</strong> Smart Money valuations, scores, and synergy estimates are AI model outputs intended for decision support only. They are not certified appraisals, investment advice, or offers of securities. The platform does not facilitate the purchase or sale of equity; introductions to investors occur only through verified-access data rooms, and any future transaction facilitation would occur solely through licensed, regulated partners in compliance with applicable securities, AML, and KYC requirements."
  };

  const nav = document.createElement("header");
  nav.className = "nav";
  nav.innerHTML = `
    <div class="nav-inner">
      <a class="brand" href="${T.home}">
        <span class="brand-mark">S</span>
        <span>Smart&nbsp;Money</span>
      </a>
      <button class="nav-toggle" aria-label="Menu" aria-expanded="false">☰</button>
      <nav class="nav-links">
        <a href="/companies" class="${page === "companies" ? "active" : ""}">${T.companies}</a>
        <a href="/graph" class="${page === "graph" ? "active" : ""}">${T.graph}</a>
        <a href="${T.visionHref}">${T.vision}</a>
        <a href="/get-started" class="${page === "get-started" ? "active" : ""}">${T.valuation}</a>
        <a href="/pricing" class="${page === "pricing" ? "active" : ""}">${T.pricing}</a>
        <span class="lang-link">${T.langLink}</span>
        <a href="/dashboard" class="cta ${page === "dashboard" ? "active" : ""}">${T.demo}</a>
      </nav>
    </div>`;
  document.body.prepend(nav);

  const toggle = nav.querySelector(".nav-toggle");
  const links = nav.querySelector(".nav-links");
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
    toggle.textContent = open ? "✕" : "☰";
  });
  links.addEventListener("click", () => { links.classList.remove("open"); toggle.textContent = "☰"; });

  const footer = document.createElement("footer");
  footer.className = "site";
  footer.innerHTML = `
    <div class="wrap">
      <div style="max-width:420px">
        <div class="brand" style="margin-bottom:10px"><span class="brand-mark">S</span> Smart Money</div>
        <p>${T.tagline}</p>
        <p style="margin-top:14px" class="faint">© ${new Date().getFullYear()} Smart Money. ${T.demoNote}</p>
      </div>
      <div style="display:flex;gap:48px;flex-wrap:wrap">
        <div>
          <div class="panel-title">${T.product}</div>
          ${T.fLinks1.map(([h, t]) => `<p><a href="${h}">${t}</a></p>`).join("")}
        </div>
        <div>
          <div class="panel-title">${T.company}</div>
          ${T.fLinks2.map(([h, t]) => `<p><a href="${h}">${t}</a></p>`).join("")}
        </div>
      </div>
    </div>
    <div class="wrap" style="margin-top:28px">
      <div class="disclaimer" style="width:100%">${T.disclaimer}</div>
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
      b.textContent = isAr ? "تراجع" : "Undo";
      b.onclick = () => { toastEl.classList.remove("show"); opts.undo(); };
      toastEl.append(b);
    }
    toastEl.classList.add("show");
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), opts.undo ? 6000 : 3200);
  };

  /* ---- per-browser demo state (approve/dismiss decisions) ---- */
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
