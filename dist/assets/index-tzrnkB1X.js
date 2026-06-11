(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();async function e(){let e=await Promise.all([`/teamsEmea.json`,`/teamsAmer.json`,`/teamsPACF.json`,`/teamsCN.json`].map(e=>fetch(e))),t=await Promise.all(e.map(e=>e.json()));return[].concat(...t)}var t=[`emea`,`apac`,`amer`,`cn`],n={emea:`emea`,apac:`pacific`,amer:`americas`,cn:`china`},r=``,i=``,a=e();async function o(e){let t=await a,r=n[e]??e,i=t.find(e=>e.id===r);if(!i)return;let o=document.getElementById(`${e}-grid`);if(!o)return;let s=e=>`<div class="player-row${e.status===`benched`?` bench-row`:``}">
            <div class="player-info">
              <div class="player-status status-${e.status}"></div>
              <span class="player-name">${e.name}</span>
              <span class="player-flag">${e.flag}</span>
            </div>
          </div>`;o.innerHTML=i.teams.map(e=>{let t=e.players.filter(e=>e.status!==`benched`&&e.status!==`rumor`),n=e.players.filter(e=>e.status===`benched`||e.status===`rumor`),r=`
        <div class="team-roster-grid">
          <div class="roster-column">
            <div class="roster-column-title">ROOSTER</div>
            ${t.map(s).join(``)}
          </div>
          <div class="roster-column">
            <div class="roster-column-title">SUBS</div>
            ${n.length?n.map(s).join(``):`<div class="empty-state">Sin movimientos regristrados</div>`}
          </div>
        </div>`,i=Array.isArray(e.staff)&&e.staff.length?`<div class="team-staff">
              <div class="staff-title">Staff</div>
              ${e.staff.map(e=>`<div class="staff-row"><span class="staff-role">${e.role}</span><span class="staff-meta"><span class="staff-name">${e.name}</span>${e.flag?`<span class="staff-flag">${e.flag}</span>`:``}</span></div>`).join(``)}
            </div>`:``,a=e.note?`<div class="team-note">⬡ ${e.note}</div>`:``;return`<div class="team-card">
      <div class="team-card-header">
        <span class="team-flag">${e.flag}</span>
        <span class="team-name">${e.name}</span>
      </div>
      <div class="team-roster">${r}</div>
      ${a}
      ${i}
    </div>`}).join(``),u()}function s(e){document.querySelectorAll(`.page`).forEach(e=>e.classList.remove(`active`));let n=document.getElementById(`page-`+e);n&&n.classList.add(`active`),t.includes(e)&&(l(),o(e))}function c(e){document.querySelectorAll(`.nav-tab`).forEach(t=>{t.textContent?.trim()===e?t.classList.add(`active`):t.classList.remove(`active`)})}function l(){r=``,i=``,document.querySelectorAll(`.search-input`).forEach(e=>e.value=``),document.querySelectorAll(`.filter-btn`).forEach(e=>e.classList.toggle(`active`,e.textContent?.trim()===`Todos`))}function u(){let e=r.toLowerCase();document.querySelectorAll(`.player-row`).forEach(t=>{let n=t.querySelector(`.player-name`)?.textContent?.toLowerCase()||``,r=t.querySelector(`.player-role`)?.textContent?.toLowerCase()||``,a=t.closest(`.team-card`)?.querySelector(`.team-name`)?.textContent?.toLowerCase()||``,o=t.querySelector(`.player-status`),s=o&&i?o.classList.contains(`status-${i}`):!0,c=!e||n.includes(e)||r.includes(e)||a.includes(e);t.style.display=s&&c?``:`none`})}function d(e){r=e,u()}function f(e){i=e,document.querySelectorAll(`.filter-btn`).forEach(t=>t.classList.toggle(`active`,t.textContent?.trim()===(e?p(e):`Todos`))),u()}function p(e){switch(e){case`confirmed`:return`Confirmados`;case`likely`:return`Probables`;case`rumor`:return`Rumores`;default:return`Todos`}}function m(e){console.warn(`sendPrompt called with:`,e),alert(e)}window.showPage=s,window.setTabByName=c,window.filterPlayers=d,window.filterStatus=f,window.sendPrompt=m,o(`emea`);