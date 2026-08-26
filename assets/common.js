/* Smart Money — shared chrome (nav + footer) and UI helpers */
(function () {
  const page = document.body.dataset.page || "";

  const nav = document.createElement("header");
  nav.className = "nav";
  nav.innerHTML = `
    <div class="nav-inner">
      <a class="brand" href="/">
        <span class="brand-mark">S</span>
        <span>Smart&nbsp;Money</span>
      </a>
      <button class="nav-toggle" aria-label="Open menu" aria-expanded="false">☰</button>
      <nav class="nav-links">
        <a href="/companies" class="${page === "companies" ? "active" : ""}">Companies</a>
        <a href="/graph" class="${page === "graph" ? "active" : ""}">Economic Graph</a>
        <a href="/#vision">Vision</a>
        <a href="/get-started" class="${page === "get-started" ? "active" : ""}">Get Your Valuation</a>
        <a href="/dashboard" class="cta ${page === "dashboard" ? "active" : ""}">Live Demo ↗</a>
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
        <p>Organizing the world's private economy — starting with Kuwait and the GCC.</p>
        <p style="margin-top:14px" class="faint">© ${new Date().getFullYear()} Smart Money. Demonstration site — all companies and figures are fictional.</p>
      </div>
      <div style="display:flex;gap:48px;flex-wrap:wrap">
        <div>
          <div class="panel-title">Product</div>
          <p><a href="/get-started">Get Your Valuation</a></p>
          <p><a href="/companies">Company Directory</a></p>
          <p><a href="/graph">Economic Graph</a></p>
          <p><a href="/dashboard">Opportunity Dashboard</a></p>
        </div>
        <div>
          <div class="panel-title">Company</div>
          <p><a href="/#vision">Vision</a></p>
          <p><a href="/#phases">Roadmap</a></p>
          <p><a href="/#model">Business Model</a></p>
        </div>
      </div>
    </div>
    <div class="wrap" style="margin-top:28px">
      <div class="disclaimer" style="width:100%">
        <strong>Important:</strong> Smart Money valuations, scores, and synergy estimates are AI model outputs intended
        for decision support only. They are not certified appraisals, investment advice, or offers of securities.
        The platform does not facilitate the purchase or sale of equity; introductions to investors occur only through
        verified-access data rooms, and any future transaction facilitation would occur solely through licensed,
        regulated partners in compliance with applicable securities, AML, and KYC requirements.
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
      b.textContent = "Undo";
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
