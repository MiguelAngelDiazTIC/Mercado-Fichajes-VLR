export async function loadRegions() {
  const files = [
    '../data/teamsEmea.json',
    '../data/teamsAmer.json',
    '../data/teamsPACF.json',
    '../data/teamsCN.json',
  ];

  const responses = await Promise.all(files.map((f) => fetch(f)));
  const jsons = await Promise.all(responses.map((r) => r.json()));
  return [].concat(...jsons);
}
