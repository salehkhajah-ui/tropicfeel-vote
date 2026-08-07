/* Smart Money — shared chrome (nav + footer) */
(function () {
  const page = document.body.dataset.page || "";

  const nav = document.createElement("header");
  nav.className = "nav";
  nav.innerHTML = `
    <div class="nav-inner">
      <a class="brand" href="/smart-money">
        <span class="brand-mark">S</span>
        <span>Smart&nbsp;Money</span>
      </a>
      <nav class="nav-links">
        <a href="/companies" class="${page === "companies" ? "active" : ""}">Companies</a>
        <a href="/graph" class="${page === "graph" ? "active" : ""}">Economic Graph</a>
        <a href="/smart-money#vision" class="">Vision</a>
        <a href="/smart-money#model" class="">Business Model</a>
        <a href="/dashboard" class="cta ${page === "dashboard" ? "active" : ""}">Live Demo ↗</a>
      </nav>
    </div>`;
  document.body.prepend(nav);

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
          <p><a href="/companies">Company Directory</a></p>
          <p><a href="/graph">Economic Graph</a></p>
          <p><a href="/dashboard">Opportunity Dashboard</a></p>
        </div>
        <div>
          <div class="panel-title">Company</div>
          <p><a href="/smart-money#vision">Vision</a></p>
          <p><a href="/smart-money#phases">Roadmap</a></p>
          <p><a href="/smart-money#model">Business Model</a></p>
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
})();
