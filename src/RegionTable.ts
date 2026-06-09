import { loadRegions } from './main.ts';

type FilterStatus = '' | 'confirmed' | 'likely' | 'rumor';

const regionIds = ['emea', 'apac', 'amer', 'cn'];
let currentSearch = '';
let currentStatus: FilterStatus = '';
const regionDataPromise = loadRegions();

async function renderRegion(id: string): Promise<void> {
  const regions = await regionDataPromise;
  const region = regions.find((item) => item.id === id);
  if (!region) return;

  const grid = document.getElementById(`${id}-grid`);
  if (!grid) return;

  grid.innerHTML = region.teams
    .map((team) => {
      const noteHtml = team.note
        ? `<div style="padding:6px 14px;border-top:1px solid var(--border);font-size:10px;color:var(--muted);font-family:'Barlow Condensed',sans-serif;letter-spacing:0.5px">⬡ ${team.note}</div>`
        : '';
      const playersHtml = team.players
        .map(
          (player) =>
            `<div class="player-row"><div class="player-info"><div class="player-status status-${player.status}"></div><span class="player-name">${player.name}</span><span class="player-flag">${player.flag}</span></div><span class="player-role">${player.role || 'Jugador'}</span></div>`
        )
        .join('');

      return `<div class="team-card">
      <div class="team-card-header">
        <span class="team-flag">${team.flag}</span>
        <span class="team-name">${team.name}</span>
      </div>
      <div class="team-roster">${playersHtml}</div>
      ${noteHtml}
    </div>`;
    })
    .join('');

  applyFilters();
}

function showPage(id: string): void {
  document.querySelectorAll('.page').forEach((p) => p.classList.remove('active'));
  const page = document.getElementById('page-' + id);
  if (page) page.classList.add('active');

  if (regionIds.includes(id)) {
    resetFilters();
    renderRegion(id);
  }
}

function setTab(el: HTMLElement): void {
  document.querySelectorAll('.nav-tab').forEach((t) => t.classList.remove('active'));
  el.classList.add('active');
}

function setTabByName(name: string): void {
  document.querySelectorAll('.nav-tab').forEach((t) => {
    if (t.textContent?.trim() === name) {
      t.classList.add('active');
    } else {
      t.classList.remove('active');
    }
  });
}

function resetFilters(): void {
  currentSearch = '';
  currentStatus = '';
  document.querySelectorAll<HTMLInputElement>('.search-input').forEach((input) => (input.value = ''));
  document.querySelectorAll<HTMLButtonElement>('.filter-btn').forEach((btn) =>
    btn.classList.toggle('active', btn.textContent?.trim() === 'Todos')
  );
}

function applyFilters(): void {
  const query = currentSearch.toLowerCase();
  document.querySelectorAll<HTMLElement>('.player-row').forEach((row) => {
    const name = row.querySelector('.player-name')?.textContent?.toLowerCase() || '';
    const role = row.querySelector('.player-role')?.textContent?.toLowerCase() || '';
    const team = row.closest('.team-card')?.querySelector('.team-name')?.textContent?.toLowerCase() || '';
    const statusEl = row.querySelector('.player-status');
    const hasStatus = statusEl && currentStatus ? statusEl.classList.contains(`status-${currentStatus}`) : true;
    const matchesText = !query || name.includes(query) || role.includes(query) || team.includes(query);
    row.style.display = hasStatus && matchesText ? '' : 'none';
  });
}

function filterPlayers(q: string): void {
  currentSearch = q;
  applyFilters();
}

function filterStatus(status: FilterStatus): void {
  currentStatus = status;
  document.querySelectorAll<HTMLButtonElement>('.filter-btn').forEach((btn) =>
    btn.classList.toggle('active', btn.textContent?.trim() === (status ? buttonLabel(status) : 'Todos'))
  );
  applyFilters();
}

function buttonLabel(status: FilterStatus): string {
  switch (status) {
    case 'confirmed':
      return 'Confirmados';
    case 'likely':
      return 'Probables';
    case 'rumor':
      return 'Rumores';
    default:
      return 'Todos';
  }
}

(window as any).showPage = showPage;
(window as any).setTabByName = setTabByName;
(window as any).filterPlayers = filterPlayers;
(window as any).filterStatus = filterStatus;

renderRegion('emea');
