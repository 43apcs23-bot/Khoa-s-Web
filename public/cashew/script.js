console.log("SCRIPT VERSION A");

function makeArt(title, subtitle, accent = "#235b41", accent2 = "#bb8d3b") {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" role="img" aria-label="${title}">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${accent}"/>
          <stop offset="100%" stop-color="${accent2}"/>
        </linearGradient>
        <radialGradient id="r" cx="50%" cy="35%" r="70%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="1200" height="900" fill="url(#g)"/>
      <circle cx="930" cy="160" r="240" fill="url(#r)"/>
      <circle cx="290" cy="740" r="220" fill="#ffffff" opacity="0.08"/>
      <path d="M170 640c120-160 360-290 590-290 120 0 220 25 310 76-72 167-190 307-338 408-149 102-306 150-472 150-87 0-135-5-165-16 25-84 49-153 75-208Z" fill="#ffffff" opacity="0.18"/>
      <rect x="74" y="72" rx="44" ry="44" width="240" height="104" fill="#ffffff" opacity="0.16"/>
      <text x="194" y="138" text-anchor="middle" fill="#ffffff" font-family="DM Sans, Arial, sans-serif" font-size="54" font-weight="800">HNX</text>
      <text x="72" y="690" fill="#ffffff" font-family="Fraunces, Georgia, serif" font-size="72" font-weight="800">${title}</text>
      <text x="72" y="758" fill="#f6fbf8" font-family="DM Sans, Arial, sans-serif" font-size="30" font-weight="600">${subtitle}</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

// ---------------------------------------------------------------------------
// Internationalization (i18n)
// ---------------------------------------------------------------------------
const LANG_KEY = "cashew_lang";
const DEFAULT_LANG = "en";
const SUPPORTED_LANGS = ["en", "zh"];

const I18N = {
  en: {
    "meta.title": "Hạt Ngọc Xanh - Clean Foods",
    "meta.description": "Brand introduction website for Hạt Ngọc Xanh - clean, specialty foods.",
    "nav.menuAria": "Open navigation",
    "nav.about": "About",
    "nav.products": "Products",
    "nav.cashew": "Cashew Nuts",
    "nav.macadamia": "Macadamia Nuts",
    "nav.mixed": "Mixed Nuts & Snacks",
    "nav.why": "Why Choose Us",
    "nav.contact": "Contact",
    "hero.eyebrow": "Brand introduction",
    "hero.title": "Hạt Ngọc Xanh — Clean Foods",
    "hero.tagline": "🌿 Hạt Ngọc Xanh — Specialty nuts & clean foods.",
    "hero.text": "Carefully selected products with transparent origins, no additives, and a focus on safety and stable quality. We commit to trustworthiness and refinement. Nationwide delivery available.",
    "hero.exploreBtn": "Explore Products",
    "hero.contactBtn": "Contact Us",
    "hero.changeAvatar": "Change avatar",
    "marquee.1": "Carefully selected",
    "marquee.2": "Consistent quality",
    "marquee.3": "Nationwide delivery",
    "marquee.4": "Trustworthy · Refined · Safe",
    "about.eyebrow": "About us",
    "about.title": "Brand story",
    "about.storyTitle": "Brief introduction",
    "about.storyBody": "Born in the heart of Binh Phuoc – Vietnam's renowned cashew-growing region – Hat Ngoc Xanh was founded with a simple yet meaningful mission: to bring clean, nutritious, and high-quality products from our homeland to every family.\n\nAt Hat Ngoc Xanh, we believe that good nutrition is the foundation of a better life. That is why we carefully select our ingredients, prioritize food safety, and uphold strict quality standards throughout every stage of production. Every product we offer reflects our commitment to purity, honesty, and excellence.",
    "about.f1Title": "Careful selection",
    "about.f1Text": "Products are carefully selected.",
    "about.f2Title": "Transparent origins",
    "about.f2Text": "Clear product origins.",
    "about.f3Title": "Consistent quality",
    "about.f3Text": "No additives, safety and stable quality.",
    "products.eyebrow": "Product showcase",
    "products.title": "Product lines",
    "benefits.eyebrow": "Why choose us",
    "benefits.title": "Strengths",
    "contact.eyebrow": "Contact",
    "contact.title": "Contact & Inquiries",
    "contact.infoTitle": "Contact information",
    "contact.address": "Address",
    "contact.addressValue": "258 Phu Thanh, Phu Rieng, Dong Nai City, Vietnam",
    "contact.phone": "Phone",
    "contact.email": "Email",
    "contact.fbLink": "Hạt Ngọc Xanh - Clean Foods",
    "contact.hours": "Opening hours",
    "contact.hoursValue": "Always open",
    "contact.website": "Website",
    "contact.websiteValue": "TikTok / profile",
    "contact.callBtn": "Call Now",
    "contact.fbBtn": "Open Facebook",
    "footer.brand": "Hạt Ngọc Xanh - Clean Foods",
    "footer.tagline": "Specialty nuts & clean foods, carefully selected with transparent origins.",
    "lightbox.close": "Close image",
    "product.tooltip": "Click to change image",
  },
  zh: {
    "meta.title": "Hạt Ngọc Xanh - 净食品",
    "meta.description": "Hạt Ngọc Xanh 品牌介绍网站 —— 干净、优选的食品。",
    "nav.menuAria": "打开导航",
    "nav.about": "关于我们",
    "nav.products": "产品",
    "nav.cashew": "腰果",
    "nav.macadamia": "夏威夷果",
    "nav.mixed": "混合坚果与零食",
    "nav.why": "为何选择我们",
    "nav.contact": "联系我们",
    "hero.eyebrow": "品牌介绍",
    "hero.title": "Hạt Ngọc Xanh — 净食品",
    "hero.tagline": "🌿 Hạt Ngọc Xanh —— 优选坚果与净食品。",
    "hero.text": "精心挑选的产品，来源透明，不含添加剂，注重安全与稳定的品质。我们坚守诚信与匠心，并提供全国配送。",
    "hero.exploreBtn": "浏览产品",
    "hero.contactBtn": "联系我们",
    "hero.changeAvatar": "更换头像",
    "marquee.1": "精心挑选",
    "marquee.2": "品质如一",
    "marquee.3": "全国配送",
    "marquee.4": "可靠 · 精致 · 安全",
    "about.eyebrow": "关于我们",
    "about.title": "品牌故事",
    "about.storyTitle": "简要介绍",
    "about.storyBody": "Hạt Ngọc Xanh 诞生于越南著名的腰果产区平福省的中心地带，怀着一个简单却有意义的使命而创立：把家乡干净、营养、高品质的产品带给每一个家庭。\n\n在 Hạt Ngọc Xanh，我们相信良好的营养是美好生活的基础。因此，我们精心挑选原料，重视食品安全，并在每一个生产环节坚持严格的品质标准。我们提供的每一款产品，都体现着我们对纯净、诚信与卓越的承诺。",
    "about.f1Title": "精心挑选",
    "about.f1Text": "所有产品均经过精心挑选。",
    "about.f2Title": "来源透明",
    "about.f2Text": "产品来源清晰可溯。",
    "about.f3Title": "品质如一",
    "about.f3Text": "不含添加剂，安全且品质稳定。",
    "products.eyebrow": "产品展示",
    "products.title": "产品系列",
    "benefits.eyebrow": "为何选择我们",
    "benefits.title": "我们的优势",
    "contact.eyebrow": "联系方式",
    "contact.title": "联系与咨询",
    "contact.infoTitle": "联系信息",
    "contact.address": "地址",
    "contact.addressValue": "越南同奈市富铃富成258号",
    "contact.phone": "电话",
    "contact.email": "邮箱",
    "contact.fbLink": "Hạt Ngọc Xanh - 净食品",
    "contact.hours": "营业时间",
    "contact.hoursValue": "全天营业",
    "contact.website": "网站",
    "contact.websiteValue": "TikTok / 主页",
    "contact.callBtn": "立即致电",
    "contact.fbBtn": "打开 Facebook",
    "footer.brand": "Hạt Ngọc Xanh - 净食品",
    "footer.tagline": "优选坚果与净食品，精心挑选，来源透明。",
    "lightbox.close": "关闭图片",
    "product.tooltip": "点击更换图片",
  },
};

function getLang() {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved && SUPPORTED_LANGS.includes(saved)) return saved;
  } catch (err) {}
  return DEFAULT_LANG;
}

function t(key) {
  const lang = getLang();
  return (I18N[lang] && I18N[lang][key]) ?? (I18N[DEFAULT_LANG][key] ?? key);
}

const productData = [
  {
    image: "surce/prduct 1.jpg",
    fallback: makeArt("Snack cashew", "15-20 nuts a day", "#235b41", "#bb8d3b"),
    title: { en: "Roasted Salted Cashews", zh: "盐焗腰果" },
    description: {
      en: "Premium cashew nuts carefully selected and roasted to perfection with a light coating of salt. They offer a rich, buttery flavor and a satisfying crunch, making them an ideal snack for any time of the day.",
      zh: "优质腰果，精心挑选并烘焙至恰到好处，裹上一层薄盐。口感浓郁香醇、酥脆可口，是一天中任何时刻的理想零食。",
    },
  },
  {
    image: "surce/prduct 2.jpg",
    fallback: makeArt("Nutritious cashew", "Energy · Heart health · Satiety", "#173028", "#8bbd53"),
    title: { en: "Dried Macadamia Nuts", zh: "干夏威夷果" },
    description: {
      en: "High-quality macadamia nuts gently dried to preserve their natural sweetness, creamy texture, and nutritional value. Known as one of the world's most luxurious nuts.",
      zh: "高品质夏威夷果，经低温烘干，保留其天然的甘甜、绵密口感与营养价值。被誉为世界上最奢华的坚果之一。",
    },
  },
  {
    image: "surce/prduct 3.jpg",
    fallback: makeArt("HNX", "Open 24/7 · Highly recommended", "#2f7a58", "#bb8d3b"),
    title: { en: "Roasted Salted Cashews", zh: "盐焗腰果" },
    description: {
      en: "Premium cashew nuts carefully selected and roasted to perfection with a light coating of salt. They offer a rich, buttery flavor and a satisfying crunch, making them an ideal snack for any time of the day.",
      zh: "优质腰果，精心挑选并烘焙至恰到好处，裹上一层薄盐。口感浓郁香醇、酥脆可口，是一天中任何时刻的理想零食。",
    },
  },
];

const benefitData = [
  {
    badge: "01",
    title: { en: "Carefully Selected Ingredients", zh: "精选原料" },
    text: {
      en: "Every product is chosen through a strict selection process to ensure freshness, flavor, and consistent quality.",
      zh: "每一款产品都经过严格的挑选流程，确保新鲜、美味，品质如一。",
    },
  },
  {
    badge: "02",
    title: { en: "Transparent Product Origins", zh: "产品来源透明" },
    text: {
      en: "We prioritize products with clear sourcing and traceable origins, giving customers confidence in every purchase.",
      zh: "我们优先选择来源清晰、可追溯的产品，让顾客每次购买都安心放心。",
    },
  },
  {
    badge: "03",
    title: { en: "Natural & Nutritious", zh: "天然营养" },
    text: {
      en: "Our nuts are prepared with a focus on preserving their natural taste and nutritional value, without unnecessary additives.",
      zh: "我们用心保留坚果天然的风味与营养价值，不添加多余的成分。",
    },
  },
  {
    badge: "04",
    title: { en: "Commitment to Quality", zh: "对品质的承诺" },
    text: {
      en: "From sourcing to packaging, we maintain high standards to deliver products that are safe, reliable, and enjoyable.",
      zh: "从选材到包装，我们坚持高标准，为您带来安全、可靠、美味的产品。",
    },
  },
  {
    badge: "05",
    title: { en: "Nationwide Delivery", zh: "全国配送" },
    text: {
      en: "We make it easy for customers across Vietnam to enjoy premium nuts and healthy foods delivered to their doorstep.",
      zh: "我们让越南各地的顾客都能轻松享受优质坚果与健康食品，直接送货上门。",
    },
  },
  {
    badge: "06",
    title: { en: "Dedicated Customer Support", zh: "贴心客户服务" },
    text: {
      en: "Whether you have questions about products or orders, our team is always ready to assist and provide personalized recommendations.",
      zh: "无论您对产品或订单有任何疑问，我们的团队都随时为您提供帮助和个性化建议。",
    },
  },
];

const galleryData = [
  { image: "surce/bigAvatar.png", label: "Facebook cover" },
  { image: "surce/avatar.jpg", label: "Profile image" },
  { image: "surce/prduct 4.jpg", label: "Public post image" },
  { image: "surce/prduct 5.jpg", label: "Product / marketing" },
  { image: makeArt("Brand strip", "HNX", "#173028", "#8bbd53"), label: "Brand assets" },
  { image: makeArt("Community photo", "Open 24/7", "#173028", "#8bbd3b"), label: "Customers / community" },
];

// Global references for dynamic item upload interaction
let productFileInput = null;
let currentProductIndex = null;

function renderProducts() {
  const productGrid = document.querySelector("#productGrid");
  if (!productGrid) return;

  const lang = getLang();
  productGrid.innerHTML = productData
    .map((item, i) => {
      const title = item.title[lang] ?? item.title[DEFAULT_LANG];
      const description = item.description[lang] ?? item.description[DEFAULT_LANG];
      return `
        <article class="product-card reveal">
          <div class="product-card__media">
            <img data-index="${i}" src="${item.image}" alt="${title}" loading="lazy" onerror="this.onerror=null;this.src='${item.fallback || ""}'" />
          </div>
          <h3>${title}</h3>
          <p>${description}</p>
        </article>
      `;
    })
    .join("");
}

function renderBenefits() {
  const benefitGrid = document.querySelector("#benefitGrid");
  if (!benefitGrid) return;

  const lang = getLang();
  benefitGrid.innerHTML = benefitData
    .map((item) => {
      const title = item.title[lang] ?? item.title[DEFAULT_LANG];
      const text = item.text[lang] ?? item.text[DEFAULT_LANG];
      return `
        <article class="benefit-card reveal">
          <div class="benefit-card__icon">${item.badge}</div>
          <h3>${title}</h3>
          <p>${text}</p>
        </article>
      `;
    })
    .join("");
}

function renderGallery() {
  const galleryGrid = document.querySelector("#galleryGrid");
  if (!galleryGrid) return;

  galleryGrid.innerHTML = galleryData
    .map(
      (item, i) => `
        <figure class="gallery-tile reveal" tabindex="0">
          <img data-index="${i}" src="${item.image}" alt="${item.label}" loading="lazy" onerror="this.onerror=null;this.src=''" />
          <figcaption class="gallery-tile__label">${item.label}</figcaption>
        </figure>
      `,
    )
    .join("");
}

function setupReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 },
  );

  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
}

function setupMenu() {
  const navBurger = document.querySelector(".nav-burger");
  const navPanel  = document.querySelector(".nav-panel");
  if (!navBurger || !navPanel) return;

  let closeTimer = null;

  const open = () => {
    clearTimeout(closeTimer);
    navPanel.classList.add("is-open");
    navBurger.classList.add("is-open");
    navBurger.setAttribute("aria-expanded", "true");
  };

  const scheduleClose = () => {
    closeTimer = setTimeout(() => {
      navPanel.classList.remove("is-open");
      navBurger.classList.remove("is-open");
      navBurger.setAttribute("aria-expanded", "false");
    }, 200);
  };

  navBurger.addEventListener("mouseenter", open);
  navBurger.addEventListener("mouseleave", scheduleClose);
  navPanel.addEventListener("mouseenter", () => clearTimeout(closeTimer));
  navPanel.addEventListener("mouseleave", scheduleClose);

  navBurger.addEventListener("click", (e) => {
    e.stopPropagation();
    navPanel.classList.contains("is-open") ? scheduleClose() : open();
  });

  navPanel.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navPanel.classList.remove("is-open");
      navBurger.classList.remove("is-open");
      navBurger.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("click", (e) => {
    if (!navBurger.contains(e.target) && !navPanel.contains(e.target)) {
      navPanel.classList.remove("is-open");
      navBurger.classList.remove("is-open");
      navBurger.setAttribute("aria-expanded", "false");
    }
  });
}

function setupLightbox() {
  const lightbox = document.querySelector(".lightbox");
  const lightboxImage = document.querySelector(".lightbox__image");
  const lightboxClose = document.querySelector(".lightbox__close");

  if (!lightbox || !lightboxImage || !lightboxClose) return;

  const openLightbox = (source) => {
    lightboxImage.src = source;
    lightbox.hidden = false;
    lightbox.setAttribute("aria-hidden", "false");
  };

  // Delegate listener to capture gallery clicks safely
  document.querySelector("#galleryGrid")?.addEventListener("click", (event) => {
    if (event.target.tagName === "IMG") {
      openLightbox(event.target.src);
    }
  });

  const closeLightbox = () => {
    lightbox.hidden = true;
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImage.removeAttribute("src");
  };

  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.hidden) closeLightbox();
  });
}


function setupHeroImages() {
  const heroMainImage = document.querySelector('[data-art="hero-main"]');
  const heroAvatarImage = document.querySelector('[data-art="hero-avatar"]');

  if (heroMainImage) {
    heroMainImage.src = "surce/bigAvatar.png";
    heroMainImage.onerror = () => {
      heroMainImage.onerror = null;
      heroMainImage.src = makeArt("Hạt Ngọc Xanh", "Specialty nuts & clean foods");
    };
  }

  if (heroAvatarImage) {
    heroAvatarImage.src = "surce/avatar.jpg";
    heroAvatarImage.onerror = () => {
      heroAvatarImage.onerror = null;
      heroAvatarImage.src = makeArt("HNX", "Open 24/7 · Highly recommended", "#173028", "#8bbd53");
    };
  }
}

function setupAvatarUpload() {
  const heroAvatarImage = document.querySelector('[data-art="hero-avatar"]');
  const avatarUpload = document.getElementById("avatarUpload");
  const avatarChangeBtn = document.getElementById('avatarChangeBtn');

  if (avatarUpload && heroAvatarImage) {
    avatarUpload.addEventListener("change", (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        heroAvatarImage.src = reader.result;
        try { localStorage.setItem('cashew_avatar', reader.result); } catch (err) {}
      };
      reader.readAsDataURL(file);
    });

    try {
      const saved = localStorage.getItem('cashew_avatar');
      if (saved) heroAvatarImage.src = saved;
    } catch (err) {}
  }

  if (avatarChangeBtn && avatarUpload) {
    avatarChangeBtn.addEventListener('click', () => avatarUpload.click());
  }
}

function setupProductInputLinker() {
  if (!productFileInput) {
    productFileInput = document.createElement('input');
    productFileInput.type = 'file';
    productFileInput.accept = 'image/*';
    productFileInput.style.display = 'none';
    document.body.appendChild(productFileInput);

    productFileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file || currentProductIndex === null) return;
      const reader = new FileReader();
      reader.onload = () => {
        productData[currentProductIndex].image = reader.result;
        productData[currentProductIndex].fallback = reader.result;
        renderProducts();
        setupReveal();
        attachProductImageClickers();
      };
      reader.readAsDataURL(file);
      e.target.value = ''; // Crucial reset fix
    });
  }
}

function attachProductImageClickers() {
  document.querySelectorAll('.product-card__media img').forEach(img => {
    img.style.cursor = 'pointer';
    img.title = t('product.tooltip');
    img.onclick = (ev) => {
      const idx = Number(ev.currentTarget.dataset.index);
      if (Number.isFinite(idx)) {
        currentProductIndex = idx;
        productFileInput.click();
      }
    };
  });
}

function applyLanguage(lang) {
  if (!SUPPORTED_LANGS.includes(lang)) lang = DEFAULT_LANG;

  try { localStorage.setItem(LANG_KEY, lang); } catch (err) {}

  const dict = I18N[lang] || I18N[DEFAULT_LANG];
  document.documentElement.lang = lang;

  // Element text content
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const value = dict[key] ?? I18N[DEFAULT_LANG][key];
    if (value != null) el.textContent = value;
  });

  // Attribute text, e.g. data-i18n-attr="aria-label:lightbox.close"
  document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
    el.getAttribute("data-i18n-attr").split(",").forEach((pair) => {
      const [attr, key] = pair.split(":").map((s) => s.trim());
      if (!attr || !key) return;
      const value = dict[key] ?? I18N[DEFAULT_LANG][key];
      if (value != null) el.setAttribute(attr, value);
    });
  });

  // Document title (mirrors the meta.title key)
  if (dict["meta.title"]) document.title = dict["meta.title"];

  // Re-render the JS-driven content in the new language
  renderProducts();
  renderBenefits();
  setupReveal();
  attachProductImageClickers();

  // Reflect active state on the toggle
  document.querySelectorAll(".lang-toggle__btn").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.lang === lang);
    btn.setAttribute("aria-pressed", btn.dataset.lang === lang ? "true" : "false");
  });
}

function setupLanguageToggle() {
  document.querySelectorAll(".lang-toggle__btn").forEach((btn) => {
    btn.addEventListener("click", () => applyLanguage(btn.dataset.lang));
  });
}

function init() {
  setupHeroImages();
  renderProducts();
  renderBenefits();
  renderGallery();
  setupReveal();
  setupMenu();
  setupLightbox();
  setupAvatarUpload();
  setupProductInputLinker();
  attachProductImageClickers();
  setupLanguageToggle();
  applyLanguage(getLang());
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', init);
} else {
  init();
}