import { loadRegions, Player } from './main.js';

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

async function renderRegion(id: RegionKey): Promise<void> {
  const regions = await regionDataPromise;
  const dataId = regionIdMap[id] ?? id;
  const region = regions.find((item) => item.id === dataId);
  if (!region) return;

  const grid = document.getElementById(`${id}-grid`);
  if (!grid) return;

  const playerHtml = (player: Player): string =>
    `<div class="player-row${player.status === 'benched' ? ' bench-row' : ''}">
            <div class="player-info">
              <div class="player-status status-${player.status}"></div>
              <span class="player-name">${player.name}</span>
              <span class="player-flag">${player.flag}</span>
            </div>
          </div>`;

  grid.innerHTML = region.teams
    .map((team) => {
      const starters = team.players.filter((player) => player.status !== 'benched');
      const bench = team.players.filter((player) => player.status === 'benched');

      const startersHtml = starters.map(playerHtml).join('');
      const benchHtml = bench.length
        ? bench.map(playerHtml).join('')
        : `<div class="empty-state">Sin movimientos regristrados</div>`;

      const rosterHtml = `
        <div class="team-roster-grid">
          <div class="roster-column">
            <div class="roster-column-title">ROOSTER</div>
            ${startersHtml}
          </div>
          <div class="roster-column">
            <div class="roster-column-title">SUBS</div>
            ${benchHtml}
          </div>
        </div>`;

      const staffHtml =
        Array.isArray(team.staff) && team.staff.length
          ? `<div class="team-staff">
              <div class="staff-title">Staff</div>
              ${team.staff
                .map(
                  (member) =>
                    `<div class="staff-row"><span class="staff-role">${member.role}</span><span class="staff-meta"><span class="staff-name">${member.name}</span>${member.flag ? `<span class="staff-flag">${member.flag}</span>` : ''}</span></div>`
                )
                .join('')}
            </div>`
          : '';

      const noteHtml = team.note
        ? `<div class="team-note">⬡ ${team.note}</div>`
        : '';

      return `<div class="team-card">
      <div class="team-card-header">
        <span class="team-flag">${team.flag}</span>
        <span class="team-name">${team.name}</span>
      </div>
      <div class="team-roster">${rosterHtml}</div>
      ${noteHtml}
      ${staffHtml}
    </div>`;
    })
    .join('');

  applyFilters();
}

function showPage(id: string): void {
  document.querySelectorAll('.page').forEach((p) => p.classList.remove('active'));
  const page = document.getElementById('page-' + id);
  if (page) page.classList.add('active');

  if (regionIds.includes(id as RegionKey)) {
    resetFilters();
    renderRegion(id as RegionKey);
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

function sendPrompt(message: string): void {
  console.warn('sendPrompt called with:', message);
  alert(message);
}

(window as any).showPage = showPage;
(window as any).setTabByName = setTabByName;
(window as any).filterPlayers = filterPlayers;
(window as any).filterStatus = filterStatus;
(window as any).sendPrompt = sendPrompt;

renderRegion('emea');
