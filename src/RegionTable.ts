import 'flag-icons/css/flag-icons.min.css';
import { loadRegions, Player, Region } from './main.js';

type FilterStatus = '' | 'confirmed' | 'likely' | 'possible' | 'rumor';
type RegionKey = 'emea' | 'apac' | 'amer' | 'cn';

const regionIds: RegionKey[] = ['emea', 'apac', 'amer', 'cn'];
const regionIdMap: Record<RegionKey, string> = {
  emea: 'emea',
  apac: 'pacific',
  amer: 'americas',
  cn: 'china',
};

let currentSearch = '';
let currentStatus: FilterStatus = '';
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

function renderUpdated(): void {
  const el = document.getElementById('stat-updated');
  const date = new Date(__DATA_UPDATED__);
  if (!el || isNaN(date.getTime())) return;
  const pad = (n: number) => String(n).padStart(2, '0');
  el.textContent = `${pad(date.getDate())}/${pad(date.getMonth() + 1)}`;
  el.setAttribute('title', date.toLocaleDateString('es-ES', { dateStyle: 'long' }));
}

// ─── Stagger animation via IntersectionObserver ───────────

function animateCards(grid: HTMLElement): void {
  const cards = Array.from(grid.querySelectorAll<HTMLElement>('.team-card'));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target as HTMLElement;
        const i = cards.indexOf(card);
        setTimeout(() => card.classList.add('visible'), i * 40);
        observer.unobserve(card);
      }
    });
  }, { threshold: 0.05 });
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

  grid.innerHTML = region.teams.map((team, index) => {
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
      ? `<div class="team-note">${team.note}</div>`
      : '';

    // Solo se muestra logo cuando hay imagen real; si no, el número de orden
    const logoHtml = team.logoUrl
      ? `<div class="team-logo"><img src="${team.logoUrl}" alt=""></div>`
      : '';

    return `<div class="team-card">
      <div class="team-card-header">
        <span class="team-index">${String(index + 1).padStart(2, '0')}</span>
        ${logoHtml}
        <span class="team-name">${team.name}</span>
        ${flagHtml(team.flag, 'team-flag')}
      </div>
      <div class="team-roster">${rosterHtml}</div>
      ${noteHtml}
      ${staffHtml}
    </div>`;
  }).join('');

  animateCards(grid);
  applyFilters();
}

// ─── Navigation ───────────────────────────────────────────

function showPage(id: string): void {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById('page-' + id);
  if (page) page.classList.add('active');
  window.scrollTo(0, 0);
  if (regionIds.includes(id as RegionKey)) {
    resetFilters();
    renderRegion(id as RegionKey);
  }
}

function setTab(el: HTMLElement): void {
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}

function setTabByName(name: string): void {
  document.querySelectorAll('.nav-tab').forEach(t => {
    t.classList.toggle('active', t.textContent?.trim() === name);
  });
}

// ─── Filters ──────────────────────────────────────────────

function resetFilters(): void {
  currentSearch = '';
  currentStatus = '';
  document.querySelectorAll<HTMLInputElement>('.search-input').forEach(i => (i.value = ''));
  document.querySelectorAll<HTMLButtonElement>('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.textContent?.trim() === 'Todos');
  });
}

function applyFilters(): void {
  const query = currentSearch.toLowerCase();
  document.querySelectorAll<HTMLElement>('.player-row').forEach(row => {
    const name   = row.querySelector('.player-name')?.textContent?.toLowerCase() || '';
    const team   = row.closest('.team-card')?.querySelector('.team-name')?.textContent?.toLowerCase() || '';
    const statusEl = row.querySelector('.player-status');
    const hasStatus = statusEl && currentStatus
      ? statusEl.classList.contains(`status-${currentStatus}`)
      : true;
    const matchesText = !query || name.includes(query) || team.includes(query);
    row.style.display = hasStatus && matchesText ? '' : 'none';
  });
}

function filterPlayers(q: string): void {
  currentSearch = q;
  applyFilters();
}

function filterStatus(status: FilterStatus): void {
  currentStatus = status;
  applyFilters();
}

function setActiveFilter(btn: HTMLElement): void {
  btn.closest('.search-bar')?.querySelectorAll<HTMLElement>('.filter-btn').forEach(b => {
    b.classList.remove('active');
  });
  btn.classList.add('active');
}

function sendPrompt(message: string): void {
  console.warn('sendPrompt called with:', message);
  alert(message);
}

// ─── Expose globals ───────────────────────────────────────

(window as any).showPage       = showPage;
(window as any).setTab         = setTab;
(window as any).setTabByName   = setTabByName;
(window as any).filterPlayers  = filterPlayers;
(window as any).filterStatus   = filterStatus;
(window as any).setActiveFilter = setActiveFilter;
(window as any).sendPrompt     = sendPrompt;

renderUpdated();
regionDataPromise.then(renderHomeStats, () => {});
renderRegion('emea');