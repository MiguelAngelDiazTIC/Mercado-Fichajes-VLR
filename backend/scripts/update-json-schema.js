const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));

files.forEach(file => {
  const filePath = path.join(dataDir, file);
  const raw = fs.readFileSync(filePath, 'utf8');
  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    console.error('Failed parse', filePath, e.message);
    return;
  }

  if (!Array.isArray(data)) return;

  data.forEach(region => {
    if (!region.teams) return;
    region.teams.forEach(team => {
      if (team.logoUrl === undefined) team.logoUrl = null;
      if (team.players && Array.isArray(team.players)) {
        team.players = team.players.map(p => {
          if (p.photoUrl === undefined) p.photoUrl = null;
          if (p.igl === undefined) p.igl = false;
          return p;
        });
      }
      if (team.staff && Array.isArray(team.staff)) {
        team.staff = team.staff.map(s => {
          if (s.photoUrl === undefined) s.photoUrl = null;
          return s;
        });
      }
    });
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log('Updated', filePath);
});
