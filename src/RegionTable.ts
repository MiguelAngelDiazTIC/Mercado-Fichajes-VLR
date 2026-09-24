import 'flag-icons/css/flag-icons.min.css';
import { loadRegions, Player, Region, Team } from './main.js';

type RegionKey = 'emea' | 'apac' | 'amer' | 'cn';

const regionIds: RegionKey[] = ['emea', 'apac', 'amer', 'cn'];
const regionIdMap: Record<RegionKey, string> = {
  emea: 'emea',
  apac: 'pacific',
  amer: 'americas',
  cn: 'china',
};

const regionDataPromise = loadRegions();

const statusLabels: Record<string, string> = {
  confirmed: 'Confirmado',
  likely: 'Probable',
  possible: 'Posible',
  rumor: 'Rumor',
  benched: 'Benched / Sub',
  out: 'Fuera',
};

// ─── Banderas ─────────────────────────────────────────────
// Los JSON guardan emojis de bandera; Windows los pinta como letras,
// así que se convierten a código ISO y se dibujan con flag-icons (SVG).

const regionNames = new Intl.DisplayNames(['es'], { type: 'region' });
const subdivisionNames: Record<string, string> = {
  'gb-eng': 'Inglaterra',
  'gb-sct': 'Escocia',
  'gb-wls': 'Gales',
};

function flagCode(emoji: string): string | null {
  const cps = Array.from(emoji).map(c => c.codePointAt(0)!);
  // Par de indicadores regionales: 🇪🇸 → "es"
  if (cps.length === 2 && cps.every(c => c >= 0x1F1E6 && c <= 0x1F1FF)) {
    return String.fromCharCode(...cps.map(c => c - 0x1F1E6 + 97));
  }
  // Secuencia de etiquetas: 🏴 + "gbsct" + cancelar → "gb-sct"
  if (cps[0] === 0x1F3F4 && cps.length > 2) {
    const tag = cps.slice(1, -1).map(c => String.fromCharCode(c - 0xE0000)).join('');
    return `${tag.slice(0, 2)}-${tag.slice(2)}`;
  }
  return null;
}

function flagName(code: string): string {
  if (subdivisionNames[code]) return subdivisionNames[code];
  try {
    return regionNames.of(code.toUpperCase()) ?? code.toUpperCase();
  } catch {
    return code.toUpperCase();
  }
}

function flagHtml(emoji: string | undefined, cls: string): string {
  if (!emoji) return '';
  const code = flagCode(emoji);
  if (!code) return `<span class="${cls}">${emoji}</span>`;
  const name = flagName(code);
  return `<span class="fi fi-${code} ${cls}" role="img" aria-label="${name}" title="${name}"></span>`;
}

// ─── Datos de portada ─────────────────────────────────────

function renderHomeStats(regions: Region[]): void {
  const setText = (id: string, text: string) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };
  const total = regions.reduce((sum, r) => sum + r.teams.length, 0);
  setText('stat-teams', String(total));
  setText('stat-regions', String(regions.length));

  (Object.keys(regionIdMap) as RegionKey[]).forEach(key => {
    const region = regions.find(r => r.id === regionIdMap[key]);
    if (region) setText(`strip-count-${key}`, String(region.teams.length));
  });
}

const dataUpdated = new Date(__DATA_UPDATED__);

// "13/06"; cadena vacía si la fecha no es válida
function updatedLabel(): string {
  if (isNaN(dataUpdated.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(dataUpdated.getDate())}/${pad(dataUpdated.getMonth() + 1)}`;
}

function renderUpdated(): void {
  const el = document.getElementById('stat-updated');
  const label = updatedLabel();
  if (!el || !label) return;
  el.textContent = label;
  el.setAttribute('title', dataUpdated.toLocaleDateString('es-ES', { dateStyle: 'long' }));
}

// ─── Entrada de tarjetas ──────────────────────────────────
// Cada tanda que entra en pantalla se escalona por su orden dentro de la
// tanda (no por su índice global), con un retraso máximo acotado.

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function animateCards(grid: HTMLElement): void {
  const cards = Array.from(grid.querySelectorAll<HTMLElement>('.team-card'));
  const observer = new IntersectionObserver((entries) => {
    const entering = entries.filter(e => e.isIntersecting);
    entering.forEach((entry, i) => {
      const card = entry.target as HTMLElement;
      card.style.setProperty('--d', `${Math.min(i, 5) * 0.06}s`);
      card.classList.add('visible');
      observer.unobserve(card);
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });
  cards.forEach(card => observer.observe(card));
}

// ─── Render ───────────────────────────────────────────────

async function renderRegion(id: RegionKey): Promise<void> {
  const grid = document.getElementById(`${id}-grid`);
  if (!grid) return;

  let regions: Awaited<typeof regionDataPromise>;
  try {
    regions = await regionDataPromise;
  } catch (err) {
    console.error('No se pudieron cargar los equipos:', err);
    grid.innerHTML = `<div class="empty-state">No se pudieron cargar los equipos. Inténtalo más tarde.</div>`;
    return;
  }
  const dataId = regionIdMap[id] ?? id;
  const region = regions.find(item => item.id === dataId);
  if (!region) return;

  const playerHtml = (player: Player): string => {
    // Solo se muestra avatar cuando hay foto real
    const avatarHtml = player.photoUrl
      ? `<div class="player-avatar"><img src="${player.photoUrl}" alt=""></div>`
      : '';

    const iglBadge = player.igl ? `<span class="player-igl">IGL</span>` : '';
    const statusLabel = statusLabels[player.status] ?? player.status;

    return `<div class="player-row">
      <span class="mark player-status status-${player.status}" role="img" aria-label="${statusLabel}" title="${statusLabel}"></span>
      ${avatarHtml}
      <div class="player-info">
        <span class="player-name">${player.name}</span>
        ${flagHtml(player.flag, 'player-flag')}
        ${iglBadge}
      </div>
    </div>`;
  };

  const count = document.getElementById(`${id}-count`);
  if (count) count.textContent = `${region.teams.length} equipos`;

  grid.innerHTML = region.teams.map(team => {
    const starters = team.players.filter(p => p.status !== 'benched' && p.status !== 'rumor');
    const bench    = team.players.filter(p => p.status === 'benched' || p.status === 'rumor');

    const benchHtml = bench.length
      ? bench.map(playerHtml).join('')
      : `<div class="empty-state">Sin movimientos registrados</div>`;

    const rosterHtml = `
      <div class="team-roster-grid">
        <div class="roster-column">
          <div class="roster-column-title">Roster /</div>
          ${starters.map(playerHtml).join('')}
        </div>
        <div class="roster-column">
          <div class="roster-column-title">Subs · Rumores /</div>
          ${benchHtml}
        </div>
      </div>`;

    const staffHtml = Array.isArray(team.staff) && team.staff.length
      ? `<div class="team-staff">
          <div class="staff-title">Staff /</div>
          ${team.staff.map(m =>
            `<div class="staff-row">
              <span class="staff-role">${m.role}</span>
              <span class="staff-meta">
                <span class="staff-name">${m.name}</span>
                ${flagHtml(m.flag, 'staff-flag')}
              </span>
            </div>`
          ).join('')}
        </div>`
      : '';

    const noteHtml = team.note
      ? `<p class="team-note"><span class="team-note-label">Nota /</span>${team.note}</p>`
      : '';

    // Solo se muestra logo cuando hay imagen real
    const logoHtml = team.logoUrl
      ? `<div class="team-logo"><img src="${team.logoUrl}" alt=""></div>`
      : '';

    return `<article class="team-card">
      <div class="team-card-header">
        ${logoHtml}
        <h2 class="team-name">${team.name}</h2>
        ${flagHtml(team.flag, 'team-flag')}
      </div>
      <div class="team-roster">${rosterHtml}</div>
      ${noteHtml}
      ${staffHtml}
    </article>`;
  }).join('');

  animateCards(grid);
}

// ─── Navigation ───────────────────────────────────────────

let currentPage = 'home';

function inViewport(el: Element | null): el is HTMLElement {
  if (!el) return false;
  const r = el.getBoundingClientRect();
  return r.bottom > 0 && r.top < window.innerHeight;
}

// Elemento que hace de "título" de una página para la transición compartida:
// en portada, el código del panel de esa región; en una región, su titular.
function titleFor(page: string, region: string): Element | null {
  return page === 'home'
    ? document.querySelector(`.strip-panel.${region} .sp-code`)
    : document.querySelector(`#page-${page} .rh-title`);
}

function swapPage(id: string): void {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById('page-' + id);
  if (page) page.classList.add('active');
  window.scrollTo(0, 0);
  if (regionIds.includes(id as RegionKey)) {
    renderRegion(id as RegionKey);
  }

  // Título de la pestaña y foco en el titular (lectores de pantalla y teclado)
  const heading = page?.querySelector<HTMLElement>('h1');
  const name = heading?.getAttribute('aria-label') ?? heading?.textContent?.trim();
  document.title = id === 'home' || !name ? 'VCT Mercato' : `${name} · VCT Mercato`;
  heading?.focus({ preventScroll: true });
}

function showPage(id: string): void {
  if (id === currentPage) {
    window.scrollTo({ top: 0, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    return;
  }
  const previous = currentPage;
  currentPage = id;
  // La entrada de portada solo se ve una vez
  document.documentElement.classList.add('intro-done');

  if (!document.startViewTransition) {
    swapPage(id);
    return;
  }

  // Al entrar en una región, su código viaja hasta el titular gigante
  const from = id !== 'home' && !reduceMotion.matches ? titleFor(previous, id) : null;
  const to = titleFor(id, previous) as HTMLElement | null;
  const shared = inViewport(from) ? from : null;
  if (shared) shared.style.viewTransitionName = 'region-title';

  const transition = document.startViewTransition(() => {
    if (shared) shared.style.viewTransitionName = '';
    swapPage(id);
    if (shared && to) to.style.viewTransitionName = 'region-title';
  });
  transition.finished.finally(() => {
    if (to) to.style.viewTransitionName = '';
  });
}

// ─── Subrayado de pestañas ────────────────────────────────

const TAB_INSET = 10; // padding horizontal de .nav-tab

function moveIndicator(): void {
  const indicator = document.querySelector<HTMLElement>('.nav-indicator');
  const active = document.querySelector<HTMLElement>('.nav-tab.active');
  if (!indicator || !active) return;
  indicator.style.setProperty('--x', `${active.offsetLeft + TAB_INSET}px`);
  // .nav-indicator mide 100px de base; se escala al ancho del texto
  indicator.style.setProperty('--w', String((active.offsetWidth - TAB_INSET * 2) / 100));

  // En móvil la fila de pestañas se desplaza: mantener visible la activa
  const tabs = active.parentElement;
  if (tabs && tabs.scrollWidth > tabs.clientWidth) {
    const left = active.offsetLeft - tabs.scrollLeft;
    if (left < 0 || left + active.offsetWidth > tabs.clientWidth) {
      tabs.scrollTo({ left: active.offsetLeft - 16, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    }
  }
}

function initIndicator(): void {
  const indicator = document.querySelector<HTMLElement>('.nav-indicator');
  if (!indicator) return;
  // Medir cuando la fuente ya está cargada (cambia el ancho de las pestañas)
  // y activar la transición en el frame siguiente, para que no se deslice al cargar
  const place = () => {
    moveIndicator();
    requestAnimationFrame(() => indicator.classList.add('ready'));
  };
  if (document.fonts) document.fonts.ready.then(place);
  else place();
  window.addEventListener('resize', moveIndicator);
}

function markActiveTab(isActive: (tab: Element) => boolean): void {
  document.querySelectorAll('.nav-tab').forEach(t => {
    const active = isActive(t);
    t.classList.toggle('active', active);
    if (active) t.setAttribute('aria-current', 'page');
    else t.removeAttribute('aria-current');
  });
  moveIndicator();
}

function setTab(el: HTMLElement): void {
  markActiveTab(t => t === el);
}

function setTabByName(name: string): void {
  markActiveTab(t => t.textContent?.trim() === name);
}

// ─── Modo captura ─────────────────────────────────────────
// Vista general de una región pensada para hacer captura de pantalla:
// se maqueta en un lienzo de tamaño fijo y se escala para que quepa entero.

const regionSubtitles: Record<RegionKey, string> = {
  emea: 'Europe · Middle East · Africa',
  apac: 'Asia-Pacific',
  amer: 'Americas',
  cn: 'China',
};

let captureEl: HTMLElement | null = null;
let captureTrigger: HTMLElement | null = null;
let idleTimer = 0;

function captureCardHtml(team: Team): string {
  const row = (p: Player) => {
    const label = statusLabels[p.status] ?? p.status;
    return `<div class="cap-row">
      <span class="mark status-${p.status}" role="img" aria-label="${label}"></span>
      <span class="cap-row-name">${p.name}</span>
      ${flagHtml(p.flag, 'player-flag')}
      ${p.igl ? '<span class="player-igl">IGL</span>' : ''}
    </div>`;
  };
  const starters = team.players.filter(p => p.status !== 'benched' && p.status !== 'rumor');
  const bench = team.players.filter(p => p.status === 'benched' || p.status === 'rumor');
  const coach = team.staff?.find(m => /head coach/i.test(m.role));

  return `<article class="cap-card">
    <h3 class="cap-name"><span>${team.name}</span>${flagHtml(team.flag, 'team-flag')}</h3>
    ${starters.map(row).join('')}
    ${bench.length ? `<div class="cap-sub">Subs · Rumores /</div>${bench.map(row).join('')}` : ''}
    ${coach ? `<div class="cap-coach"><span>Head coach</span><span>${coach.name}${flagHtml(coach.flag, 'staff-flag')}</span></div>` : ''}
  </article>`;
}

// Prueba varias columnas y se queda con la que permite la escala más grande
// (texto más legible); después escala el lienzo para que quepa con un margen
function fitCapture(): void {
  if (!captureEl) return;
  const canvas = captureEl.querySelector<HTMLElement>('.capture-canvas');
  if (!canvas) return;
  const pad = window.innerWidth < 700 ? 12 : 40;
  const availW = window.innerWidth - pad * 2;
  const availH = window.innerHeight - pad * 2;
  const portrait = window.innerHeight > window.innerWidth;

  canvas.style.setProperty('--cw', portrait ? '900px' : '1600px');
  let best = { cols: 4, s: 0 };
  for (const cols of portrait ? [2, 3] : [4, 5, 6]) {
    canvas.style.setProperty('--cols', String(cols));
    const s = Math.min(availW / canvas.offsetWidth, availH / canvas.offsetHeight);
    if (s > best.s) best = { cols, s };
  }
  canvas.style.setProperty('--cols', String(best.cols));
  canvas.style.setProperty('--s', String(Math.max(best.s, 0.1)));
}

// Los controles se esconden con el ratón quieto para que no salgan en la captura
function wakeCaptureControls(): void {
  if (!captureEl) return;
  captureEl.classList.remove('is-idle');
  window.clearTimeout(idleTimer);
  idleTimer = window.setTimeout(() => captureEl?.classList.add('is-idle'), 1800);
}

function onCaptureKey(e: KeyboardEvent): void {
  if (e.key === 'Escape') {
    e.preventDefault();
    closeCapture();
  } else if (e.key === 'Tab') {
    // Único control del diálogo: el foco no sale de él
    e.preventDefault();
    captureEl?.querySelector<HTMLElement>('.capture-close')?.focus();
  }
  wakeCaptureControls();
}

async function openCapture(id: RegionKey): Promise<void> {
  if (captureEl) return;
  let regions: Region[];
  try {
    regions = await regionDataPromise;
  } catch {
    return;
  }
  const region = regions.find(r => r.id === regionIdMap[id]);
  if (!region) return;

  captureTrigger = document.activeElement as HTMLElement | null;
  const n = region.teams.length;
  const title = id.toUpperCase();
  const updated = updatedLabel();

  const el = document.createElement('div');
  el.className = 'capture';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  el.setAttribute('aria-labelledby', 'cap-title');
  el.innerHTML = `
    <div class="capture-bar">
      <span class="capture-hint">Esc para salir</span>
      <button class="capture-close" type="button">
        <svg class="icon" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3l10 10M13 3 3 13" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>
        Salir
      </button>
    </div>
    <div class="capture-canvas">
      <header class="cap-head">
        <h2 class="cap-title" id="cap-title">${title}</h2>
        <div class="cap-meta">
          <strong>VCT Transfers</strong>
          <span>${regionSubtitles[id]} · VCT 2026</span>
          <span>${n} equipos${updated ? ` · Actualizado ${updated}` : ''}</span>
        </div>
      </header>
      <div class="cap-legend" aria-hidden="true">
        <span><span class="mark status-confirmed"></span>Confirmado</span>
        <span><span class="mark status-likely"></span>Probable</span>
        <span><span class="mark status-possible"></span>Posible</span>
        <span><span class="mark status-rumor"></span>Rumor</span>
        <span><span class="mark status-benched"></span>Benched / Sub</span>
      </div>
      <div class="cap-grid">${region.teams.map(captureCardHtml).join('')}</div>
      <footer class="cap-foot">
        <span>Mercado de fichajes 2025/26 · Datos no oficiales</span>
        <span>@MiikaElVAL</span>
      </footer>
    </div>`;

  document.body.appendChild(el);
  captureEl = el;
  document.documentElement.style.overflow = 'hidden';

  el.querySelector('.capture-close')?.addEventListener('click', closeCapture);
  el.addEventListener('pointermove', wakeCaptureControls);
  document.addEventListener('keydown', onCaptureKey);
  window.addEventListener('resize', fitCapture);

  // Medir con la fuente ya cargada y arrancar la transición en el frame siguiente
  await document.fonts?.ready;
  fitCapture();
  requestAnimationFrame(() => {
    el.classList.add('is-open');
    el.querySelector<HTMLElement>('.capture-close')?.focus({ preventScroll: true });
    wakeCaptureControls();
  });
}

function closeCapture(): void {
  const el = captureEl;
  if (!el || el.classList.contains('is-closing')) return;
  el.classList.add('is-closing');
  el.classList.remove('is-open');
  document.removeEventListener('keydown', onCaptureKey);
  window.removeEventListener('resize', fitCapture);
  window.clearTimeout(idleTimer);

  let finished = false;
  const done = () => {
    if (finished) return;
    finished = true;
    el.remove();
    captureEl = null;
    document.documentElement.style.overflow = '';
    captureTrigger?.focus({ preventScroll: true });
  };
  // Fallback por si transitionend no llega (pestaña oculta, movimiento reducido)
  const fallback = window.setTimeout(done, 400);
  el.addEventListener('transitionend', (e) => {
    if (e.target !== el) return;
    window.clearTimeout(fallback);
    done();
  });
}

// ─── Expose globals ───────────────────────────────────────

(window as any).showPage       = showPage;
(window as any).setTab         = setTab;
(window as any).setTabByName   = setTabByName;
(window as any).openCapture    = openCapture;

initIndicator();
renderUpdated();
regionDataPromise.then(renderHomeStats, () => {});
renderRegion('emea');