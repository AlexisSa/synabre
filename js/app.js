const FORM_ENDPOINT = "https://formsubmit.co/ajax/prints@synabre.art";

const FORMATS = {
  "30x40": { label: "30 × 40 cm", price: 45 },
  "50x70": { label: "50 × 70 cm", price: 85 },
  "70x100": { label: "70 × 100 cm", price: 140 },
};

const artworks = [
  {
    id: "pulsation",
    title: "Pulsation",
    category: "peinture",
    medium: "Acrylique sur toile",
    size: "100 × 130 cm",
    style: "blobs",
    original: "available",
    desc: "Formes organiques saturées — une respiration rouge/bleu sur fond crème.",
  },
  {
    id: "vortex",
    title: "Vortex",
    category: "peinture",
    medium: "Acrylique sur toile",
    size: "90 × 90 cm",
    style: "waves",
    original: "sold",
    desc: "Vagues primaires en mouvement perpétuel. Tirages toujours ouverts.",
  },
  {
    id: "trait-dunion",
    title: "Trait d'union",
    category: "peinture",
    medium: "Acrylique sur toile",
    size: "100 × 130 cm",
    style: "stroke",
    original: "available",
    desc: "Aplats tranchés par un geste noir — tension entre affiche et toile.",
  },
  {
    id: "eclat",
    title: "Éclat",
    category: "dessin",
    medium: "Encre sur papier",
    size: "50 × 70 cm",
    style: "dots",
    original: "available",
    desc: "Constellation de pastilles primaires, rythme léger pour petit mur.",
  },
  {
    id: "courbe",
    title: "Courbe vive",
    category: "dessin",
    medium: "Pastel gras",
    size: "40 × 50 cm",
    style: "curve",
    original: "sold",
    desc: "Une ligne bleue qui traverse la feuille — dessin d’atelier, édition limitée.",
  },
  {
    id: "primaire",
    title: "Primaire",
    category: "peinture",
    medium: "Acrylique sur toile",
    size: "80 × 100 cm",
    style: "blocks",
    original: "available",
    desc: "Blocs saturés découpés au noir. La pièce signature de la série.",
  },
];

const COLORS = {
  red: "#e31b23",
  yellow: "#f5d000",
  blue: "#1f4fd8",
  black: "#1a1a1a",
  cream: "#f7f3e8",
  white: "#fffdf7",
};

let activeFilter = "all";
let sheetArtworkId = "";

function artSvg(style) {
  const { red, yellow, blue, black, cream, white } = COLORS;

  const variants = {
    blobs: `
      <rect width="400" height="500" fill="${cream}"/>
      <ellipse cx="120" cy="160" rx="110" ry="95" fill="${blue}"/>
      <ellipse cx="280" cy="130" rx="95" ry="85" fill="${yellow}"/>
      <ellipse cx="200" cy="300" rx="130" ry="110" fill="${red}"/>
      <ellipse cx="300" cy="380" rx="90" ry="80" fill="${black}"/>
      <ellipse cx="90" cy="400" rx="70" ry="60" fill="${blue}"/>
    `,
    waves: `
      <rect width="400" height="500" fill="${cream}"/>
      <path fill="${blue}" d="M0,40 C60,100 100,0 160,70 C220,140 280,20 340,90 C370,120 390,80 400,100 L400,0 L0,0 Z"/>
      <path fill="${red}" d="M0,120 C80,60 140,180 210,110 C280,40 340,170 400,100 L400,0 L0,0 Z" opacity="0.95"/>
      <path fill="${yellow}" d="M0,220 C90,160 150,280 240,200 C320,130 360,260 400,210 L400,0 L0,0 Z"/>
      <path fill="${black}" d="M0,320 C100,380 180,260 270,340 C340,400 370,300 400,360 L400,500 L0,500 Z"/>
      <path fill="${blue}" d="M0,400 C120,340 200,460 300,390 C360,350 380,440 400,410 L400,500 L0,500 Z"/>
      <path fill="${red}" d="M0,460 C140,430 220,490 400,450 L400,500 L0,500 Z"/>
    `,
    stroke: `
      <rect width="400" height="500" fill="${blue}"/>
      <rect y="160" width="400" height="120" fill="${red}"/>
      <rect y="280" width="400" height="220" fill="${yellow}"/>
      <path fill="${black}" d="M-20,210 C80,160 140,280 220,200 C300,120 360,260 430,180 L420,250 C340,320 280,180 200,260 C120,340 40,240 -20,280 Z"/>
    `,
    dots: `
      <rect width="400" height="500" fill="${white}"/>
      <circle cx="90" cy="120" r="55" fill="${red}"/>
      <circle cx="220" cy="90" r="35" fill="${blue}"/>
      <circle cx="310" cy="170" r="70" fill="${yellow}"/>
      <circle cx="140" cy="260" r="45" fill="${black}"/>
      <circle cx="280" cy="300" r="60" fill="${blue}"/>
      <circle cx="100" cy="400" r="50" fill="${yellow}"/>
      <circle cx="300" cy="420" r="40" fill="${red}"/>
    `,
    curve: `
      <rect width="400" height="500" fill="${cream}"/>
      <path fill="none" stroke="${blue}" stroke-width="28" stroke-linecap="round"
        d="M40,420 C80,200 160,120 220,260 C280,400 340,80 370,160"/>
      <path fill="none" stroke="${red}" stroke-width="18" stroke-linecap="round"
        d="M60,100 C140,40 200,180 280,90 C340,30 360,140 380,110"/>
      <circle cx="120" cy="380" r="36" fill="${yellow}"/>
      <circle cx="300" cy="340" r="24" fill="${black}"/>
    `,
    blocks: `
      <rect width="400" height="500" fill="${black}"/>
      <rect x="0" y="0" width="200" height="250" fill="${red}"/>
      <rect x="200" y="0" width="200" height="160" fill="${yellow}"/>
      <rect x="200" y="160" width="200" height="180" fill="${blue}"/>
      <rect x="0" y="250" width="140" height="250" fill="${blue}"/>
      <rect x="140" y="250" width="260" height="120" fill="${yellow}"/>
      <path fill="${cream}" d="M140,370 C220,330 300,420 400,360 L400,500 L140,500 Z"/>
    `,
  };

  return `
    <svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      ${variants[style] || variants.blobs}
    </svg>
  `;
}

function formatPrice(euros) {
  return `${euros}\u00a0€`;
}

function statusLabel(original) {
  return original === "sold" ? "Original vendu" : "Original dispo";
}

function renderWorks(filter = activeFilter) {
  activeFilter = filter;
  const grid = document.getElementById("works-grid");

  grid.innerHTML = artworks
    .map((work) => {
      const hidden = filter !== "all" && work.category !== filter;
      const sold = work.original === "sold";
      return `
        <article
          class="work-card"
          data-id="${work.id}"
          data-category="${work.category}"
          ${hidden ? "hidden" : ""}
          data-open-work="${work.id}"
          tabindex="0"
          role="button"
          aria-label="Voir ${work.title}"
        >
          <div class="work-frame">${artSvg(work.style)}</div>
          <div class="work-body">
            <span class="work-badge ${sold ? "is-sold" : "is-available"}">
              ${statusLabel(work.original)}
            </span>
            <div class="work-title-row">
              <h3 class="work-title">${work.title}</h3>
              <span class="dot-avail ${sold ? "is-sold" : ""}" aria-hidden="true"></span>
            </div>
            <p class="work-info">${work.medium} · ${work.size}</p>
            <button type="button" class="btn btn-yellow btn-pill btn-sm" data-print="${work.id}">
              Demander ce print
            </button>
          </div>
        </article>
      `;
    })
    .join("");
}

function fillArtworkSelect(selectedId = "") {
  const select = document.getElementById("artwork-select");
  select.innerHTML =
    `<option value="">Choisir une œuvre…</option>` +
    artworks
      .map(
        (w) =>
          `<option value="${w.id}" ${w.id === selectedId ? "selected" : ""}>${w.title}${
            w.original === "sold" ? " (original vendu)" : ""
          }</option>`
      )
      .join("");
}

function updateFormPreview(artworkId) {
  const work = artworks.find((w) => w.id === artworkId);
  const title = document.getElementById("preview-title");
  const meta = document.getElementById("preview-meta");
  const art = document.getElementById("preview-art");

  if (!work) {
    title.textContent = "Œuvre au choix";
    meta.textContent = "Indiquez l’œuvre souhaitée";
    art.innerHTML = "";
    art.style.background = "linear-gradient(135deg, #1f4fd8, #e31b23, #f5d000)";
    return;
  }

  title.textContent = work.title;
  meta.textContent = `${work.medium} · ${statusLabel(work.original)}`;
  art.style.background = "transparent";
  art.innerHTML = artSvg(work.style);
}

function updateFormPrice() {
  const format = document.getElementById("format-select").value;
  document.getElementById("form-price").textContent = formatPrice(
    FORMATS[format]?.price ?? 0
  );
}

function openWorkSheet(artworkId) {
  const work = artworks.find((w) => w.id === artworkId);
  if (!work) return;

  sheetArtworkId = artworkId;
  const sold = work.original === "sold";
  const status = document.getElementById("work-status");

  document.getElementById("work-dialog-title").textContent = work.title;
  document.getElementById("work-dialog-meta").textContent =
    `${work.medium} · ${work.size}`;
  document.getElementById("work-dialog-desc").textContent = work.desc;
  status.textContent = statusLabel(work.original);
  status.className = `status-pill ${sold ? "is-sold" : "is-available"}`;

  document.getElementById("wall-art").innerHTML = artSvg(work.style);

  const checked =
    document.querySelector('input[name="sheet-format"]:checked')?.value ||
    "50x70";
  updateWallSize(checked);

  document.getElementById("work-dialog").showModal();
}

function updateWallSize(formatKey) {
  const frame = document.querySelector(".wall-frame");
  const format = FORMATS[formatKey];
  if (!frame || !format) return;

  frame.dataset.size = formatKey;
  document.getElementById("wall-format-label").textContent = format.label.replace(
    " cm",
    ""
  );
  document.getElementById("quote-price").textContent = formatPrice(format.price);
}

function closeWorkSheet() {
  document.getElementById("work-dialog").close();
}

function openPrintDialog(artworkId = "", formatKey = "50x70") {
  fillArtworkSelect(artworkId);
  updateFormPreview(artworkId);

  const formatSelect = document.getElementById("format-select");
  if (FORMATS[formatKey]) formatSelect.value = formatKey;
  updateFormPrice();

  document.getElementById("print-dialog").showModal();
}

function closePrintDialog() {
  document.getElementById("print-dialog").close();
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.hidden = false;
  requestAnimationFrame(() => toast.classList.add("is-visible"));
  setTimeout(() => {
    toast.classList.remove("is-visible");
    setTimeout(() => {
      toast.hidden = true;
    }, 400);
  }, 3200);
}

async function submitPrintRequest(form) {
  const data = Object.fromEntries(new FormData(form));
  const work = artworks.find((w) => w.id === data.artworkId);
  const format = FORMATS[data.format];

  const payload = {
    ...data,
    artwork: work?.title ?? data.artworkId,
    formatLabel: format?.label ?? data.format,
    estimate: format ? formatPrice(format.price) : "",
    _template: "table",
    _captcha: "false",
  };

  const submitBtn = document.getElementById("submit-btn");
  submitBtn.disabled = true;
  submitBtn.textContent = "Envoi…";

  try {
    const res = await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    // Proto : si l’email FormSubmit n’est pas encore activé, on confirme quand même
    if (!res.ok) {
      console.warn("FormSubmit réponse", res.status, await res.text());
    } else {
      console.info("Demande envoyée", payload);
    }

    form.reset();
    closePrintDialog();
    showToast("Demande envoyée — réponse sous 48 h.");
  } catch (err) {
    console.info("Demande (fallback local)", payload, err);
    form.reset();
    closePrintDialog();
    showToast("Demande enregistrée (proto) — check console.");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Envoyer la demande";
  }
}

function initFilters() {
  document.querySelector(".filters").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-filter]");
    if (!btn) return;

    document.querySelectorAll(".filter").forEach((el) => {
      const active = el === btn;
      el.classList.toggle("is-active", active);
      el.setAttribute("aria-selected", String(active));
    });

    renderWorks(btn.dataset.filter);
  });
}

function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function init() {
  renderWorks();
  fillArtworkSelect();
  initFilters();
  initNav();
  updateFormPrice();

  document.querySelectorAll("[data-print-open]").forEach((btn) => {
    btn.addEventListener("click", () => openPrintDialog());
  });

  const worksGrid = document.getElementById("works-grid");

  worksGrid.addEventListener("click", (e) => {
    const printBtn = e.target.closest("[data-print]");
    if (printBtn) {
      e.stopPropagation();
      openPrintDialog(printBtn.dataset.print);
      return;
    }

    const card = e.target.closest("[data-open-work]");
    if (card) openWorkSheet(card.dataset.openWork);
  });

  worksGrid.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const card = e.target.closest("[data-open-work]");
    if (!card || e.target.closest("[data-print]")) return;
    e.preventDefault();
    openWorkSheet(card.dataset.openWork);
  });

  document.querySelectorAll("[data-close-work]").forEach((el) => {
    el.addEventListener("click", closeWorkSheet);
  });

  document.querySelectorAll('input[name="sheet-format"]').forEach((input) => {
    input.addEventListener("change", () => updateWallSize(input.value));
  });

  document.getElementById("sheet-print-btn").addEventListener("click", () => {
    const format =
      document.querySelector('input[name="sheet-format"]:checked')?.value ||
      "50x70";
    closeWorkSheet();
    openPrintDialog(sheetArtworkId, format);
  });

  document.getElementById("artwork-select").addEventListener("change", (e) => {
    updateFormPreview(e.target.value);
  });

  document.getElementById("format-select").addEventListener("change", updateFormPrice);

  document.querySelectorAll("[data-close]").forEach((el) => {
    el.addEventListener("click", closePrintDialog);
  });

  document.getElementById("print-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    submitPrintRequest(form);
  });
}

init();
