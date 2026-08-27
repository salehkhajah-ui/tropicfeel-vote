/* Smart Money — Arabic overlay for the demo dataset.
   Load AFTER data.js on /ar/ pages: mutates window.SM in place so page
   scripts stay identical between languages. All data remains fictional. */

(function () {
  if (!window.SM) return;

  const industries = {
    "Construction": "الإنشاءات",
    "Logistics": "الخدمات اللوجستية",
    "Food Manufacturing": "تصنيع الأغذية",
    "Retail & Distribution": "التجزئة والتوزيع",
    "Warehousing": "التخزين",
    "Healthcare Distribution": "توزيع المستلزمات الصحية",
    "Manufacturing": "الصناعة",
    "Software & IT": "البرمجيات وتقنية المعلومات",
    "Food & Agriculture": "الأغذية والزراعة",
    "Automotive Distribution": "توزيع قطع السيارات",
    "Diversified Holding": "قابضة متنوعة"
  };
  const stages = { "Established": "راسخة", "Growth": "في مرحلة نمو", "Mature": "ناضجة" };
  const markets = {
    "Kuwait": "الكويت", "Saudi Arabia": "السعودية", "Qatar": "قطر",
    "Bahrain": "البحرين", "UAE": "الإمارات", "Iraq": "العراق"
  };
  const confidence = { "High": "عالية", "Medium": "متوسطة", "Low": "منخفضة" };
  const certs = {
    "Kuwait Municipality Grade A": "تصنيف بلدية الكويت — درجة أولى",
    "Kuwait Municipality Grade B": "تصنيف بلدية الكويت — درجة ثانية",
    "Halal certified": "معتمدة حلال",
    "SFDA licensed": "مرخّصة من هيئة الغذاء والدواء السعودية",
    "Civil Defense approved": "معتمدة من الدفاع المدني",
    "GDP compliant zone": "منطقة مطابقة لمعايير التوزيع الجيد (GDP)",
    "MOH import license": "ترخيص استيراد من وزارة الصحة",
    "CITRA registered": "مسجّلة لدى هيئة الاتصالات (CITRA)",
    "PAAFR licensed": "مرخّصة من الهيئة العامة لشؤون الزراعة والثروة السمكية"
  };

  const companies = {
    aldeera: {
      name: "شركة الديرة للإنشاءات",
      location: "مدينة الكويت، الكويت",
      ownership: "ملكية عائلية (مساهمان)",
      about: "مقاول عام متوسط الحجم متخصص في التشطيبات التجارية والمباني الصناعية الخفيفة، مع أعمال متكررة قوية لدى عميلين رئيسيين.",
      signals: ["منفتحة على المستثمرين", "تبحث عن شركاء مقاولات من الباطن"],
      idleAssets: ["أسطول السقالات معطّل نحو 40% من السنة", "ساحة في الشويخ غير مستغلة في عطلات نهاية الأسبوع"],
      method: "مضاعف EBITDA (مزيج 4.2x–6.1x لشركات إنشاءات خليجية مقارنة) مع تدقيق عبر التدفقات النقدية المخصومة"
    },
    gulfbridge: {
      name: "جسر الخليج للخدمات اللوجستية",
      location: "الشعيبة، الكويت",
      ownership: "مؤسسان + مستثمر ملاك (12%)",
      about: "نقل بري عابر للحدود وتوصيل الميل الأخير. أسطول من 54 شاحنة؛ تراجع معدل الاستغلال بعد خسارة عقد تجزئة.",
      signals: ["منفتحة على الشراكات", "تبيع حصة أقلية (15%)"],
      idleAssets: ["11 شاحنة متوقفة في أيام الأسبوع (نحو 20% من الأسطول)", "رحلات العودة من السعودية فارغة بنسبة 60%"],
      method: "مضاعف EBITDA (5.0x–8.0x لشركات لوجستية مقارنة) مع حد أدنى لقيمة أصول الأسطول"
    },
    sidra: {
      name: "سدرة للأغذية",
      location: "صبحان، الكويت",
      ownership: "قابضة عائلية (مجموعة السدرة)",
      about: "منتج أغذية مجمّدة وجافة يورّد للجمعيات التعاونية وقطاع الضيافة. تكاليف التوزيع في ارتفاع، وتبحث عن شريك لوجستي مخصص.",
      signals: ["تبحث عن موزعين", "منفتحة على المشاريع المشتركة"],
      idleAssets: ["خط الإنتاج الثاني يعمل بوردية واحدة فقط", "المخزن المبرّد بإشغال 55% في الصيف"],
      method: "مضاعف EBITDA (6.4x–9.9x لشركات أغذية ومشروبات مقارنة) مع علاوة للبيانات المالية الموثّقة"
    },
    marina: {
      name: "مجموعة مارينا للتجزئة",
      location: "الرياض، السعودية",
      ownership: "ملكية خاصة (3 شركاء)",
      about: "موزع سلع استهلاكية سريعة الدوران عبر 2,400 نقطة بيع في السعودية، يوقّع باستمرار مع علامات إقليمية تريد التواجد على الرفوف السعودية.",
      signals: ["تبحث عن علامات موردة", "منفتحة على الاستحواذ على موزعين متخصصين"],
      idleAssets: ["سعة متاحة في أسطول الشاحنات الصغيرة بالمنطقة الشرقية"],
      method: "مزيج مضاعفَي الإيرادات وEBITDA مع علاوة لشبكة التوزيع"
    },
    falcon: {
      name: "فالكون للتخزين",
      location: "أمغرة، الكويت",
      ownership: "مالك واحد",
      about: "18,000 م² من التخزين الجاف والمبرّد. خروج مستأجر ترك نحو ثلث السعة شاغرًا.",
      signals: ["تؤجّر سعة تخزينية", "منفتحة على مستثمري البيع وإعادة الاستئجار"],
      idleAssets: ["6,200 م² من التخزين الجاف شاغرة", "أرفف بسعة 4,000 موقع طبلية غير مستخدمة"],
      method: "رسملة الدخل على عوائد الإيجار مع حد أدنى بتقييم الأصول"
    },
    noor: {
      name: "نور للمستلزمات الطبية",
      location: "مدينة الكويت، الكويت",
      ownership: "المؤسس (70%) + مكتب عائلي (30%)",
      about: "مستورد مستهلكات وأجهزة للعيادات الخاصة. تنمو بسرعة وقد تجاوزت سعة مخازنها المستأجرة.",
      signals: ["تبحث عن مساحة تخزين", "تجمع رأسمال نمو"],
      idleAssets: [],
      method: "مضاعف EBITDA معدّل بالنمو، مع شركات توزيع رعاية صحية مقارنة"
    },
    qortuba: {
      name: "قرطبة للبلاستيك",
      location: "صبحان، الكويت",
      ownership: "ملكية عائلية، الجيل الثاني",
      about: "منتجات تغليف وبلاستيك إنشائي بالقولبة بالحقن. دفتر طلبات متين، لكن نقدًا كبيرًا عالق في مخزون المواد الخام.",
      signals: ["منفتحة على الاستحواذ", "تبحث عن موزعي تصدير"],
      idleAssets: ["3 ماكينات قولبة تعمل بوردية واحدة", "المخزون يغطي نحو 140 يومًا (وسيط القطاع: 85)"],
      method: "مضاعف EBITDA (5.9x–8.7x لشركات بلاستيك خليجية مقارنة)"
    },
    bayan: {
      name: "بيان للحلول التقنية",
      location: "مدينة الكويت، الكويت",
      ownership: "3 مؤسسين + مستثمرو جولة تأسيسية (18%)",
      about: "تنفيذ أنظمة ERP وبرمجيات مخصصة للشركات العائلية. عقود الدعم المتكررة تشكّل الآن 45% من الإيرادات.",
      signals: ["تبحث عن شركاء قنوات", "توظّف مهندسين أوائل"],
      idleAssets: ["سعة متاحة: 4 مطورين بين المشاريع"],
      method: "مضاعف إيرادات (1.6x–3.1x) مرجّح بالإيرادات المتكررة؛ أرقام مصرّح بها ذاتيًا"
    },
    alsahel: {
      name: "الساحل للأسماك",
      location: "ميناء الدوحة، الكويت",
      ownership: "ملكية عائلية",
      about: "أسطول صيد ومعالجة مأكولات بحرية. مولّد نقدي مستقر، ويستكشف المالك تخارجًا جزئيًا لأغراض تخطيط الخلافة.",
      signals: ["تبيع حصة 30%", "تخطيط للخلافة"],
      idleAssets: ["مصنع المعالجة يعمل بطاقة 60%", "سفينتان في الحوض الجاف"],
      method: "مضاعف EBITDA مع حد أدنى لقيمة الأسطول؛ بيانات مالية موثّقة"
    },
    desertrose: {
      name: "وردة الصحراء للتصميم الداخلي",
      location: "حولي، الكويت",
      ownership: "شريكان",
      about: "تشطيبات سكنية وفندقية راقية، ولديها مشاريع فنادق سعودية لا تستطيع خدمتها حاليًا دون حضور محلي.",
      signals: ["تتوسع إلى السعودية", "تبحث عن شريك محلي لمشروع مشترك"],
      idleAssets: [],
      method: "مضاعف EBITDA مخصوم نظرًا لأرقام مصرّح بها ذاتيًا وتركّز العملاء"
    },
    khaleej: {
      name: "الخليج لقطع غيار السيارات",
      location: "الشويخ، الكويت",
      ownership: "مالك واحد",
      about: "موزع جملة لقطع المركبات التجارية. تدخل سوق صيانة الأساطيل وتبحث عن ورش شريكة.",
      signals: ["تدخل مجال صيانة الأساطيل", "تبحث عن ورش شريكة"],
      idleAssets: ["مخزون قطع غيار متضخم في أصناف بطيئة الحركة (تقديريًا 310,000 د.ك)"],
      method: "مضاعف EBITDA معدّل برأس المال العامل"
    },
    dana: {
      name: "دانة القابضة العائلية",
      location: "مدينة الكويت، الكويت",
      ownership: "قابضة عائلية، الجيل الثالث",
      about: "شركة قابضة باستثمارات في العقار والتموين وإدارة المرافق. تريد العائلة بيع 30% من ذراع التموين.",
      signals: ["تبيع 30% من وحدة التموين", "منفتحة على مستثمرين استراتيجيين"],
      idleAssets: ["مبنى تجاري في السالمية شاغر بنسبة 35%", "الوردية الليلية للمطبخ المركزي غير مستخدمة"],
      method: "تقييم مجموع الأجزاء عبر ثلاث وحدات تشغيلية"
    }
  };

  const matches = {
    m1: { type: "مطابقة سعة", headline: "حاجة تخزين ↔ سعة شاغرة",
      detail: "نور للمستلزمات الطبية تجاوزت سعة مخازنها المستأجرة، بينما لدى فالكون للتخزين 6,200 م² من المساحات المطابقة لمعايير GDP شاغرة على بُعد 15 دقيقة.",
      valueLabel: "قيمة سنوية تقديرية" },
    m2: { type: "تكامل لوجستي", headline: "حاجة توزيع ↔ شاحنات متوقفة",
      detail: "ارتفاع تكاليف التوزيع لدى سدرة للأغذية يقابله 11 شاحنة متوقفة لدى جسر الخليج ورحلات عودة من السعودية فارغة بنسبة 60%.",
      valueLabel: "وفر سنوي تقديري" },
    m3: { type: "دخول سوق", headline: "توسع سعودي ↔ توزيع قائم",
      detail: "لدى وردة الصحراء مشاريع فنادق سعودية لا تستطيع خدمتها، ولدى مجموعة مارينا عمليات مرخّصة وعلاقات في أنحاء السعودية.",
      valueLabel: "قيمة مشاريع محتملة" },
    m4: { type: "مطابقة مناقصة", headline: "خبرة تشطيبات ↔ مناقصة تجديد",
      detail: "تجديد مبنى دانة القابضة في السالمية يطابق سجل الديرة في التشطيبات التجارية وتصنيفها من الدرجة الأولى.",
      valueLabel: "قيمة عقد تقديرية" },
    m5: { type: "تكامل رأسي", headline: "حصة 30% للبيع ↔ مشترٍ استراتيجي",
      detail: "التخارج الجزئي للساحل يؤمّن سلسلة إمداد المأكولات البحرية لسدرة ويملأ خط إنتاجها الثاني المعطّل.",
      valueLabel: "قيمة استرشادية للحصة" },
    m6: { type: "شراكة خدمات", headline: "صيانة أساطيل ↔ أسطول من 54 شاحنة",
      detail: "ذراع صيانة الأساطيل الجديدة لدى الخليج يمكنها خدمة أسطول جسر الخليج، مع تصريف مخزون بطيء الحركة بقيمة 310,000 د.ك في العملية.",
      valueLabel: "قيمة سنوية تقديرية" },
    m7: { type: "رقمنة", headline: "سعة تطوير متاحة ↔ مشكلة مخزون",
      detail: "مطورو بيان الأربعة المتاحون يمكنهم نشر حل لتحسين المخزون لدى قرطبة، حيث تتجاوز تغطية المخزون وسيط القطاع بـ 55 يومًا.",
      valueLabel: "رأسمال عامل محرَّر تقديريًا" }
  };

  const insights = [
    { title: "الذمم المدينة هي أرخص رأسمال لديك",
      body: "أيام التحصيل لديك (88) تتجاوز وسيط قطاع الإنشاءات الكويتي بـ 24 يومًا. خفضها 15 يومًا سيحرّر ما يقدَّر بـ 400,000 د.ك من رأس المال العامل.",
      impact: "+400,000 د.ك سيولة" },
    { title: "أسطول السقالات معطّل 40% من السنة",
      body: "ثلاثة مقاولين ضمن نطاق 20 كم يستأجرون سقالات مماثلة بأسعار السوق. إدراج أسطولك المعطّل قد يدرّ نحو 36,000 د.ك سنويًا.",
      impact: "+36,000 د.ك سنويًا" },
    { title: "مخاطر تركّز العملاء في ارتفاع",
      body: "عميلك الأكبر يشكّل 47% من الإيرادات، ارتفاعًا من 31% قبل سنتين. ثلاثة عملاء محتملون مطابقون في فئة تصنيفك يطرحون مناقصات هذا الربع.",
      impact: "3 فرص تنويع" },
    { title: "فرصة توحيد الموردين",
      body: "توحيد مشتريات البلاستيك والتجهيزات مع قرطبة للبلاستيك بحجمكما المجمّع يشير إلى خفض 6–9% في تكاليف المدخلات.",
      impact: "−6–9% من تكاليف المدخلات" }
  ];

  /* investor terminal — persona, portfolio, and the raises it screens */
  const investorAr = {
    name: "بيت المال كابيتال",
    type: "مكتب عائلي · ملكية خاصة في السوق المتوسط الأدنى",
    based: "مدينة الكويت، الكويت",
    hold: "4–7 سنوات",
    control: "حصص أقلية مع حقوق حوكمة؛ واستحواذات مسيطرة انتقائية"
  };

  const holdings = {
    "Arabian Cold Chain": "السلسلة الباردة العربية",
    "Gulf Dates Processing": "الخليج لتصنيع التمور",
    "Medina Diagnostics": "المدينة للتشخيص الطبي",
    "Shuwaikh Logistics Park": "مجمع الشويخ اللوجستي"
  };

  const raises = {
    sidra: { type: "مشروع مشترك", use: "أداة مشروع مشترك للتوسع الإقليمي في سلاسل التبريد نحو قطر والبحرين." },
    noor: { type: "رأسمال نمو", use: "امتلاك سعة تخزين خاصة وتوسيع محفظة الأجهزة إلى ما بعد المستهلكات." },
    gulfbridge: { type: "حصة أقلية", use: "إعادة تمويل الأسطول ورفع معدلات التشغيل بعد خسارة عقد التجزئة." },
    alsahel: { type: "تعاقب / تخارج جزئي", use: "سيولة للمؤسس وانتقال منظَّم إلى الجيل الثاني." },
    aldeera: { type: "حصة أقلية", use: "رأسمال عامل لتقصير دورة التحصيل، إضافة إلى توسعة أسطول السقالات." },
    falcon: { type: "بيع وإعادة استئجار", use: "تحرير رأس المال المرتبط بمنشأة أمغرة مع الاحتفاظ بالتشغيل." },
    qortuba: { type: "استحواذ كامل", use: "تخارج كامل — ملّاك الجيل الثاني يتقاعدون، مع بقاء فريق الإدارة." },
    dana: { type: "فصل وحدة", use: "بيع 30% من ذراع التموين لتمويل محفظة العقارات." }
  };

  /* ---- apply the overlay in place ---- */
  SM.companies.forEach((c) => {
    const a = companies[c.id];
    if (!a) return;
    c.name = a.name;
    c.location = a.location;
    c.ownership = a.ownership;
    c.about = a.about;
    c.signals = a.signals;
    c.idleAssets = a.idleAssets;
    c.industry = industries[c.industry] || c.industry;
    c.stage = stages[c.stage] || c.stage;
    c.markets = c.markets.map((m) => markets[m] || m);
    c.certifications = c.certifications.map((x) => certs[x] || x);
    c.valuation.method = a.method;
    c.valuation.confidenceAr = confidence[c.valuation.confidence] || c.valuation.confidence;
  });

  SM.matches.forEach((m) => {
    const a = matches[m.id];
    if (!a) return;
    m.type = a.type;
    m.headline = a.headline;
    m.detail = a.detail;
    m.valueLabel = a.valueLabel;
  });

  SM.insights.forEach((i, idx) => {
    const a = insights[idx];
    if (!a) return;
    i.title = a.title;
    i.body = a.body;
    i.impact = a.impact;
  });

  /* The investor's mandate is matched against company.industry and company.stage, both of
     which this overlay has just rewritten into Arabic. Translate the mandate and the portfolio
     with the same dictionaries so the comparisons in SM.fitScore and SM.sectorExposure keep
     matching — otherwise every company would score as an out-of-sector, wrong-stage deal. */
  const inv = SM.investor;
  inv.name = investorAr.name;
  inv.type = investorAr.type;
  inv.based = investorAr.based;
  inv.mandate.hold = investorAr.hold;
  inv.mandate.control = investorAr.control;
  inv.mandate.sectors = inv.mandate.sectors.map((s) => industries[s] || s);
  inv.mandate.adjacent = inv.mandate.adjacent.map((s) => industries[s] || s);
  inv.mandate.stages = inv.mandate.stages.map((s) => stages[s] || s);
  inv.mandate.stagesNear = inv.mandate.stagesNear.map((s) => stages[s] || s);
  inv.portfolio.forEach((h) => {
    h.name = holdings[h.name] || h.name;
    h.sector = industries[h.sector] || h.sector;
  });

  SM.raises.forEach((r) => {
    const a = raises[r.id];
    if (!a) return;
    r.type = a.type;
    r.use = a.use;
  });

  /* Arabic money formatting — Western digits, KD → د.ك */
  const unit = (n) => (n >= 1000000 ? " مليون د.ك" : n >= 1000 ? " ألف د.ك" : " د.ك");
  const mag = (n) => (n >= 1000000
    ? (n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1)
    : n >= 1000 ? String(Math.round(n / 1000)) : String(n));

  SM.fmtKD = (n) => mag(n) + unit(n);
  SM.fmtKDfull = (n) => n.toLocaleString("en-US") + " د.ك";
  /* "٤.٦ – ٧.١ مليون د.ك" — the unit is stated once when both ends share a
     magnitude, which keeps table cells and headlines on one line. */
  SM.fmtRange = (a, b) => (unit(a) === unit(b)
    ? mag(a) + " – " + mag(b) + unit(b)
    : SM.fmtKD(a) + " – " + SM.fmtKD(b));
})();
